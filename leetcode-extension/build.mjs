import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadPyodide} from 'pyodide';
import {createRequire} from 'node:module';

const root=path.dirname(fileURLToPath(import.meta.url)),appRoot=path.dirname(root),out=path.join(root,'dist');
async function copy(source,target) {
  const dest=path.join(out,target);
  await mkdir(path.dirname(dest),{recursive:true});
  await copyFile(source,dest);
}
const entries=['manifest.json','panel.html','panel.css','panel.js','execution.js','node-adapters.js','native-editor.js','background.js','launcher.js','sandbox.html','sandbox.js','local-worker.js','javascript-trace.js'];
for(const name of entries)await copy(path.join(root,name),name);
const files=new Set();
async function shared(name) {
  if(files.has(name))return;
  files.add(name);
  if(['app/ruby-catalog.js','app/python-catalog.js'].includes(name))return;
  const from=path.join(appRoot,name);
  await copy(from,name);
  if(!name.endsWith('.js'))return;
  const source=await readFile(from,'utf8');
  for(const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*|new URL\(\s*)['"](\.[^'"]+)['"]/g)){
    const target=path.posix.normalize(path.posix.join(path.posix.dirname(name),match[1]));
    await shared(target);
  }
}
for(const name of ['app/workspace-editor.js','app/languages.js','app/problems.js','app/judge.js','app/multilang-judge.js','app/trace.js','app/problem-starter.js','src/editor.css','app/vendor/prism/LICENSE.md'])await shared(name);
const npm=path.join(root,'node_modules');
await copy(path.join(npm,'acorn/dist/acorn.mjs'),'vendor/acorn.mjs');
await copy(path.join(npm,'acorn/LICENSE'),'vendor/acorn-LICENSE');
await copy(path.join(root,'pyodide-LICENSE.txt'),'vendor/pyodide-LICENSE.txt');
for(const name of ['pyodide.js','pyodide.asm.js','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json'])
  await copy(path.join(npm,'pyodide',name),'vendor/'+name);
const rubyDir=path.join(npm,'@ruby/4.0-wasm-wasi/dist');
for(const [from,to] of [['browser.umd.js','ruby.js'],['ruby+stdlib.wasm','ruby.wasm'],['NOTICE','ruby-NOTICE'],['LICENSE','ruby-LICENSE']])
  await copy(path.join(rubyDir,from),'vendor/'+to);

// Generate the same read-only method data the site queries from its live VMs.
// The extension can then autocomplete offline without executing any learner code.
const require=createRequire(import.meta.url);
const {DefaultRubyVM}=require('@ruby/wasm-wasi/dist/browser');
const {vm}=await DefaultRubyVM(await WebAssembly.compile(await readFile(path.join(rubyDir,'ruby+stdlib.wasm'))));
const ruby=vm.eval("require 'json'\nrequire 'set'\n[String,Array,Hash,Integer,Float,Set,Range,Enumerator,Regexp,Symbol,Time,NilClass,TrueClass,FalseClass].to_h { |k| [k.name,k.public_instance_methods.map(&:to_s).sort] }.to_json").toString();
const py=await loadPyodide();
const python=py.runPython("import json\njson.dumps({key:{n:(getattr(cls,n).__doc__ or '') for n in dir(cls) if not n.startswith('_')} for key,cls in dict(String=str,Array=list,Hash=dict,Set=set,Integer=int,Float=float).items()})");
for(const [lang,fn,data,empty] of [['ruby','rubyMethods',ruby,'[]'],['python','pythonDocs',python,'{}']])
  await writeFile(path.join(out,'app',lang+'-catalog.js'),'const catalog='+data+';\nexport async function '+fn+'(type){return catalog[type] || '+empty+';}\n');
await copy(path.join(root,'README.md'),'README.md');
console.log('Load unpacked from '+out);

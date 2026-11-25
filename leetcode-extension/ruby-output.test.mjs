import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {interpretedExample} from '../app/interpreted-examples.js';

test('Ruby preserves p output in each_cons, each_index and for loops',async()=>{
  const require=createRequire(import.meta.url);
  const {DefaultRubyVM}=require('@ruby/wasm-wasi/dist/browser');
  const wasm=await readFile(new URL('./node_modules/@ruby/4.0-wasm-wasi/dist/ruby+stdlib.wasm',import.meta.url));
  const {vm}=await DefaultRubyVM(await WebAssembly.compile(wasm));
  const records=[];
  globalThis.traceRecord=value=>records.push(JSON.parse(String(value)));
  try {
    vm.eval("require 'js'; require 'json'; require 'set'; require 'stringio'; $stdout = StringIO.new");
    const source='def solve(nums)\n nums.each_cons(2) do |x|\n  p x.sum\n end\n nums.each_index do |i|\n  p i\n end\n for n in nums\n  p n\n end\n nums\nend';
    const plan={functionName:'solve',params:[{name:'nums',type:'integer[]'}],returns:{type:'integer[]'},tests:[{args:[[3,6,9,1]]}]};
    const moduleSource=(await readFile(new URL('./structured-trace.js',import.meta.url),'utf8')).replace('./app/trace.js',new URL('../app/trace.js',import.meta.url).href);
    const {instrumentStructured}=await import('data:text/javascript;base64,'+Buffer.from(moduleSource).toString('base64'));
    vm.eval(interpretedExample('ruby',source,plan,{instrument:instrumentStructured}));
    assert.equal(vm.eval('$stdout.string').toString(),'9\n15\n10\n0\n1\n2\n3\n3\n6\n9\n1\n\n__CODEFIELD_CASE__[3,6,9,1]\n');
    assert.ok(records.some(step=>step.line===3));
  } finally { delete globalThis.traceRecord; }
});

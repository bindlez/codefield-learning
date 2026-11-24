import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {compiledScript} from '../app/compiled-practice.js';
const plan={functionName:'plusOne',params:[{name:'n',type:'integer'}],returns:{type:'integer'},tests:[{args:[4]}]};
const fixtures={
  rust:'impl Solution {pub fn plus_one(n:i32)->i32 {\nlet total = n+1;\ntotal\n}}',
  cpp:'class Solution {public: int plusOne(int n){\nint total = n+1;\nreturn total;\n}};',
  csharp:'public class Solution {public int PlusOne(int n){\nint total = n+1;\nreturn total;\n}}'
};
for(const [lang,solution] of Object.entries(fixtures)){
  test(lang+' records observed source locations and invokes the example',()=>{
    const code=compiledScript(lang,solution,plan,true);
    assert.match(code,/L2 total/);
    if(!process.env.CODEFIELD_TEST_COMPILERS) return;
    const cwd=mkdtempSync(join(tmpdir(),'cf-compiler-'));
    const file={rust:'solution.rs',cpp:'solution.cpp',csharp:'solution.cs'}[lang];
    writeFileSync(join(cwd,file),code);
    const run=(cmd,args)=>{
      const result=spawnSync(cmd,args,{cwd,encoding:'utf8',timeout:90000,windowsHide:true});
      assert.equal(result.status,0,result.error?.message || result.stderr || result.stdout);
      return result.stdout;
    };
    let output;
    if(lang==='csharp') output=run('dotnet',['run','--file',file]);
    else {
      run(lang==='rust'?'rustc':'g++',[file,'-o','solution.exe']);
      output=run(join(cwd,'solution.exe'),[]);
    }
    assert.match(output,/\[step\] L2 total/);
    assert.match(output,/__CODEFIELD_CASE__5/);
  });
}

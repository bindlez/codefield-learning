import assert from 'node:assert/strict';
import {compiledScript} from '../app/compiled-practice.js';
import {runProgram} from '../app/languages.js';

const snippets={
  rust:'impl Solution { pub fn plus_one(n: i32) -> i32 {\nlet total: i32 = n+1;\ntotal\n}}',
  cpp:'class Solution {public: int plusOne(int n){\nint total = n+1;\nreturn total;\n}};',
  java:'class Solution {public int plusOne(int n){\nint total = n+1;\nreturn total;\n}}',
  csharp:'public class Solution {public int PlusOne(int n){\nint total = n+1;\nreturn total;\n}}',
  go:'func plusOne(n int) int {\ntotal := n+1\nreturn total\n}',
  crystal:'def plus_one(n : Int32) : Int32\n  total = n+1\n  total\nend'
};
const plan={functionName:'plusOne',params:[{name:'n',type:'integer'}],returns:{type:'integer'},tests:[{args:[4],expected:5}]};
for(const [language,source] of Object.entries(snippets)){
  const code=compiledScript(language,source,plan,true);
  const result=await runProgram(language,code);
  try{
    assert.ok(result.ok,result.error);
    assert.match(result.output,/\[step\] L2 total = 5/);
    assert.match(result.output,/__CODEFIELD_CASE__5/);
    console.log(language,'returned 5 and recorded its initializer at line 2.');
  }catch(error){console.error(language,error.message);process.exitCode=1;}
}

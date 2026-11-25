import test from 'node:test';
import assert from 'node:assert/strict';
import {runProgram} from '../app/languages.js';
test('a successful compile without execution is not reported as a successful run',async()=>{
 const old=globalThis.fetch;
 try{
  globalThis.fetch=async()=>({ok:true,json:async()=>({code:0,stdout:[]})});
  const missing=await runProgram('go','package main');
  assert.equal(missing.ok,false);assert.match(missing.error,/execution result/);
  globalThis.fetch=async()=>({ok:true,json:async()=>({code:0,execResult:{code:0,stdout:[{text:'42'}]}})});
  const ran=await runProgram('go','package main');assert.equal(ran.ok,true);assert.equal(ran.output,'42');
 }finally{globalThis.fetch=old;}
});

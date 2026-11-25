import test from 'node:test';
import assert from 'node:assert/strict';
import {parse} from '../src/vendor/acorn.js';
import {traceJavaScript} from '../src/javascript-trace.js';
function traced(source,...args) {
  const {code,probe}=traceJavaScript(source,parse);
  const steps=[];
  function take(line,event,reads) {
    steps.push({line,event,locals:Object.fromEntries(reads.flatMap(([name,read])=>{try{return [[name,read()]];}catch{return []}}))});
  }
  take.result=(line,reads,value)=>{take(line,'return',reads);return value;};
  take.test=(line,reads,value)=>{take(line,'condition',reads);return value;};
  return {value:new Function(probe,code+'\nreturn solve')(take)(...args),steps};
}
test('replays repeated source lines, conditions and early returns without reevaluating expressions',()=>{
  const {value,steps}=traced('function solve(a){\n let i=0;\n while(i<a.length){\n if(a[i++]===9)return i;\n }\n}',[1,9,3]);
  assert.equal(value,2);
  assert.equal(steps.filter(s=>s.line===4 && s.event==='condition').length,2);
  assert.equal(steps.at(-1).locals.i,2);
});
test('preserves unbraced bodies, destructuring, concise arrow returns and branch association',()=>{
  const source='const solve = ({n}) => {\n let sum=0;\n for(let i=0;i<n;i++) if(i%2) sum+=i; else sum--;\n return [sum,[1,2].map(x=>x+sum)];\n}';
  assert.deepEqual(traced(source,{n:5}).value,[1,[2,3]]);
});
test('preserves directive prologues and supports colliding helper names',()=>{
  assert.deepEqual(traced('function solve(){ "use strict"; let __cfObserve=2; return [this,__cfObserve]; }').value,[undefined,2]);
});

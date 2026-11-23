import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildScript} from '../app/multilang-judge.js';
import {runProgram} from '../app/languages.js';

test('Python and Ruby examples call the expected solution function', () => {
  const plan = {functionName:'twoSum',params:[{type:'integer[]'},{type:'integer'}],returns:{type:'integer[]'},tests:[{args:[[2,7],9],expected:[0,1]}]};
  const python=buildScript('python','class Solution: pass',plan);
  const ruby=buildScript('ruby','def two_sum(a,b); end',plan);
  assert.match(python,/getattr\(Solution\(\), "twoSum"\)/);
  assert.match(ruby,/method\(:two_sum\)/);
  assert.equal(buildScript('python','', {...plan,params:[{type:'ListNode'}]}),null);
});

test('browser worker runs only after runtime is ready and cleans up', async t => {
  let instance;
  class WorkerStub {
    constructor() { instance=this; queueMicrotask(() => this.onmessage({data:{type:'ready'}})); }
    postMessage(message) { assert.equal(message.code,'print(1)'); queueMicrotask(() => this.onmessage({data:{type:'result',result:{ok:true,output:'1'}}})); }
    terminate() { this.terminated=true; }
  }
  globalThis.Worker = WorkerStub;
  t.after(() => { delete globalThis.Worker; });
  assert.deepEqual(await runProgram('python','print(1)'),{ok:true,output:'1'});
  assert.equal(instance.terminated,true);
});

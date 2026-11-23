import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runProgram } from '../app/languages.js';

test('cancelling a pending run terminates its worker and ignores later messages', async t => {
  let worker;
  class MockWorker {
    constructor() { worker = this; }
    postMessage() {}
    terminate() { this.stopped = true; }
  }
  globalThis.Worker = MockWorker;
  t.after(() => { delete globalThis.Worker; });
  const controller = new AbortController();
  const pending = runProgram('javascript', 'while(true) {}', {signal:controller.signal});
  controller.abort();
  assert.deepEqual(await pending, {ok:false,error:'Cancelled.',output:''});
  assert.equal(worker.stopped,true);
});

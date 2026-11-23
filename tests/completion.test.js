import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../app/javascript-worker.js', import.meta.url), 'utf8');
function worker() {
  const messages=[];
  const self={postMessage: message=>messages.push(message)};
  const context={self,console:{log(){}}};
  runInNewContext(source,context);
  return {self,messages};
}
test('method discovery reflects the receiver type without executing getters', () => {
  const {self,messages}=worker();
  let read=false;
  Object.defineProperty(self,'danger',{get(){read=true;return []}});
  self.onmessage({data:{type:'complete',id:1,receiver:'danger'}});
  assert.equal(read,false);
  assert.deepEqual(Array.from(messages.at(-1).methods),[]);
  self.onmessage({data:{type:'complete',id:2,receiver:'[]'}});
  assert.ok(messages.at(-1).methods.includes('map'));
  self.onmessage({data:{type:'complete',id:3,receiver:'"hi"'}});
  assert.ok(messages.at(-1).methods.includes('toUpperCase'));
  assert.equal(messages.at(-1).methods.includes('map'),false);
});

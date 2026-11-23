import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../app/runner.js', import.meta.url), 'utf8');
function run(code) {
  let result;
  const sandbox = { self: { postMessage: value => {result=value;} }, console: {log() {}} };
  runInNewContext(source, sandbox);
  sandbox.self.onmessage({data:code});
  return result;
}
test('worker captures output and evaluated result', () => {
  const result=run('console.log("hello"); 1 + 2');
  assert.equal(result.ok,true); assert.equal(result.text,'hello\n=> 3');
});
test('worker reports errors as text', () => {
  const result=run('throw new Error("oops")');
  assert.equal(result.ok,false); assert.match(result.text,/Error: oops/);
});

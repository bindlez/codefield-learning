import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {instrumentJavaScript} from '../app/trace.js';

test('trace preserves simple assignments and records their values', () => {
  const source = 'function solve(x) {\n  let total = x + 1;\n  total = total * 2;\n  return total;\n}';
  const trace=instrumentJavaScript(source);
  const logs=[];
  const value=runInNewContext(trace.code + '\nsolve(3)',{console:{log:message=>logs.push(message)}});
  assert.equal(value,8);
  assert.deepEqual(logs,['[step 2] total = 4','[step 3] total = 8']);
});

test('trace leaves multiline template and comment contents untouched', () => {
  const code='const value = `hello\nconst x = 1;\nworld`;';
  assert.deepEqual(instrumentJavaScript(code),{code,count:0});
});

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {instrumentJavaScript,instrumentPracticeJavaScript} from '../app/trace.js';

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

test('practice traces loops, conditions, updates and returns without repeating side effects', () => {
  const source='function solve(items) {\n let i = 0;\n while (i < items.length) {\n  if (items[i++] === 9) return i;\n }\n}';
  const logs=[];
  const value=runInNewContext(instrumentPracticeJavaScript(source).code+'\nsolve([1,9])',{console:{log:message=>logs.push(message)}});
  assert.equal(value,2);
  assert.equal(logs.filter(line=>line.startsWith('[step 4] condition')).length,2);
  assert.ok(logs.some(line=>line.startsWith('[step 4] return') && line.includes('→ 2')));
});

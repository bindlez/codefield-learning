import { test } from 'node:test';
import assert from 'node:assert/strict';
import { problems } from '../app/problems.js';

const load = problem => {
  const scope = {};
  new Function('scope', `${problem.starter}\n${problem.solution}\nscope.fn = typeof ${problem.functionName} === 'function' ? ${problem.functionName} : null;`)(scope);
  return scope.fn;
};

test('problem set has the expected shape', () => {
  assert.ok(problems.length >= 10);
  const ids = new Set();
  for (const problem of problems) {
    assert.ok(!ids.has(problem.id), `duplicate id ${problem.id}`);
    ids.add(problem.id);
    assert.ok(problem.title && problem.statement, `${problem.id} needs a statement`);
    assert.ok(problem.tests.length >= 3, `${problem.id} needs at least three tests`);
    assert.ok(problem.params.length >= 1, `${problem.id} needs params`);
    assert.ok(problem.starter.includes(problem.functionName), `${problem.id} starter must define ${problem.functionName}`);
    assert.ok(problem.statement.length < 900, `${problem.id} statement is too long`);
  }
});

test('every reference solution passes every test', () => {
  for (const problem of problems) {
    const fn = load(problem);
    assert.equal(typeof fn, 'function', `${problem.id} did not define ${problem.functionName}`);
    problem.tests.forEach((test, index) => {
      const actual = fn(...JSON.parse(JSON.stringify(test.args)));
      assert.deepEqual(actual, test.expected, `${problem.id} test ${index + 1} failed`);
    });
  }
});

test('starters leave the function body unfinished', () => {
  for (const problem of problems) {
    const body = problem.starter.split('\n').filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join('\n');
    assert.ok(!/return\s+[^;\s]/.test(body), `${problem.id} starter already returns a value`);
  }
});

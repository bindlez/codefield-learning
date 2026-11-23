import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildJudgeSource,
  compareValues,
  parseExampleTestcases,
  parseMeta,
  parseValue,
  testsFromProblem
} from '../app/judge.js';

test('parses LeetCode scalar and array values', () => {
  assert.equal(parseValue('9', 'integer'), 9);
  assert.equal(parseValue('2.5', 'double'), 2.5);
  assert.equal(parseValue('true', 'boolean'), true);
  assert.equal(parseValue('"abc"', 'string'), 'abc');
  assert.equal(parseValue('"a"', 'character'), 'a');
  assert.deepEqual(parseValue('[2,7,11,15]', 'integer[]'), [2, 7, 11, 15]);
  assert.deepEqual(parseValue('[[1,2],[3,4]]', 'integer[][]'), [[1, 2], [3, 4]]);
  assert.deepEqual(parseValue('[1,null,2]', 'TreeNode'), [1, null, 2]);
});

test('splits exampleTestcases into argument groups by signature', () => {
  const params = [{ name: 'nums', type: 'integer[]' }, { name: 'target', type: 'integer' }];
  const groups = parseExampleTestcases('[2,7,11,15]\n9\n[3,3]\n6\n', params);
  assert.deepEqual(groups, [[[2, 7, 11, 15], 9], [[3, 3], 6]]);
});

test('reads the published signature and examples', () => {
  const meta = parseMeta(JSON.stringify({
    name: 'twoSum',
    params: [{ name: 'nums', type: 'integer[]' }, { name: 'target', type: 'integer' }],
    return: { type: 'integer[]' }
  }));
  assert.equal(meta.name, 'twoSum');
  const problem = {
    meta: JSON.stringify(meta),
    exampleTestcases: '[2,7,11,15]\n9\n[3,2,4]\n6',
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }, { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }]
  };
  const plan = testsFromProblem(problem);
  assert.equal(plan.functionName, 'twoSum');
  assert.equal(plan.tests.length, 2);
  assert.deepEqual(plan.tests[0], { args: [[2, 7, 11, 15], 9], expected: [0, 1], known: true, printed: '[0,1]' });
});

test('keeps tests without a published output as self-check rows', () => {
  const problem = {
    meta: JSON.stringify({ name: 'f', params: [{ name: 'n', type: 'integer' }], return: { type: 'integer' } }),
    exampleTestcases: '1\n2',
    examples: [{ input: 'n = 1', output: '1' }]
  };
  const plan = testsFromProblem(problem);
  assert.equal(plan.tests.length, 2);
  assert.equal(plan.tests[1].known, false);
  assert.equal(plan.tests[1].expected, undefined);
});

test('compares nested arrays and tolerates floating point noise', () => {
  assert.equal(compareValues([[1, 2], [3]], [[1, 2], [3]], 'integer[][]'), true);
  assert.equal(compareValues([1, 2], [2, 1], 'integer[]'), false);
  assert.equal(compareValues(0.30000000000000004, 0.3, 'double'), true);
});

const runHarness = source => {
  let message = null;
  new Function('self', source)({ postMessage: value => { message = value; } });
  return message;
};

test('runs a two-sum solution against typed tests', () => {
  const source = buildJudgeSource({
    id: 3,
    code: 'var twoSum = function(nums, target) { const seen = new Map(); for (let i = 0; i < nums.length; i++) { const need = target - nums[i]; if (seen.has(need)) return [seen.get(need), i]; seen.set(nums[i], i); } return []; };',
    functionName: 'twoSum',
    params: [{ name: 'nums', type: 'integer[]' }, { name: 'target', type: 'integer' }],
    returns: { type: 'integer[]' },
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[1, 2], 9], expected: [0, 1] }
    ]
  });
  const message = runHarness(source);
  assert.equal(message.id, 3);
  assert.equal(message.report.total, 3);
  assert.equal(message.report.passed, 2);
  assert.deepEqual(message.results[0].actual, [0, 1]);
  assert.equal(message.results[2].passed, false);
});

test('converts linked-list arguments and reports arrays', () => {
  const source = buildJudgeSource({
    id: 9,
    code: 'var addTwo = function(l1, l2) { return l1; };',
    functionName: 'addTwo',
    params: [{ name: 'l1', type: 'ListNode' }, { name: 'l2', type: 'ListNode' }],
    returns: { type: 'ListNode' },
    tests: [{ args: [[2, 4, 3], [5, 6, 4]], expected: [2, 4, 3] }]
  });
  const message = runHarness(source);
  assert.equal(message.report.ok, true);
  assert.deepEqual(message.results[0].actual, [2, 4, 3]);
});

test('reports a missing function instead of throwing', () => {
  const source = buildJudgeSource({
    code: 'var other = function() {};',
    functionName: 'twoSum',
    params: [],
    returns: { type: 'integer' },
    tests: [{ args: [], expected: 1 }]
  });
  const message = runHarness(source);
  assert.equal(message.report.ok, false);
  assert.match(message.report.loadError, /twoSum/);
});

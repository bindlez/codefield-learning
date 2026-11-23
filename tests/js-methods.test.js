import { test } from 'node:test';
import assert from 'node:assert/strict';
import { javascriptCompletion, guideFor, typeForParam, jsMethods } from '../app/js-methods.js';

const names = items => items.map(item => item.label);

test('infers arrays and strings from local declarations', () => {
  const source = 'const nums = [1, 2, 3];\nnums.';
  assert.ok(names(javascriptCompletion({ source, caret: source.length, receiver: 'nums', chain: [], prefix: '' })).includes('map'));
  const text = 'const word = "hello";\nword.';
  const items = javascriptCompletion({ source: text, caret: text.length, receiver: 'word', chain: [], prefix: 'sl' });
  assert.deepEqual(names(items), ['slice']);
  assert.equal(items[0].insert, 'slice()');
  assert.equal(items[0].cursorOffset, 'slice'.length + 1);
});

test('keeps chains typed through map, filter and join', () => {
  const source = 'const nums = [1, 2];\nnums.filter(n => n).map(n => n * 2).';
  const items = javascriptCompletion({ source, caret: source.length, receiver: 'nums', chain: ['filter(n => n)', 'map(n => n * 2)'], prefix: '' });
  assert.ok(names(items).includes('reduce'));
  const joined = 'const nums = [1];\nnums.join("-").';
  const stringItems = javascriptCompletion({ source: joined, caret: joined.length, receiver: 'nums', chain: ['join("-")'], prefix: 'toU' });
  assert.deepEqual(names(stringItems), ['toUpperCase']);
});

test('falls back to problem parameter bindings', () => {
  const source = 'var twoSum = function(nums, target) {\n  nums.';
  const items = javascriptCompletion({
    source,
    caret: source.length,
    receiver: 'nums',
    chain: [],
    prefix: '',
    bindings: { nums: 'Array', target: 'Number' }
  });
  assert.ok(names(items).includes('map'));
});

test('offers static methods for global receivers', () => {
  const source = 'Math.';
  assert.ok(names(javascriptCompletion({ source, caret: source.length, receiver: 'Math', chain: [], prefix: 'fl' })).includes('floor'));
  const object = 'Object.';
  assert.ok(names(javascriptCompletion({ source: object, caret: object.length, receiver: 'Object', chain: [], prefix: 'ent' })).includes('entries'));
});

test('maps LeetCode parameter types', () => {
  assert.equal(typeForParam('integer[]'), 'Array');
  assert.equal(typeForParam('string'), 'String');
  assert.equal(typeForParam('boolean'), 'Boolean');
  assert.equal(typeForParam('ListNode'), 'ListNode');
  assert.equal(typeForParam('integer[][]'), 'Array');
});

test('guides are typed and unique names still resolve', () => {
  const slice = guideFor('slice', 'Array');
  assert.equal(slice.owner, 'Array');
  assert.match(slice.signature, /array\.slice/);
  const map = guideFor('map');
  assert.equal(map.owner, 'Array');
  const ambiguous = guideFor('length');
  assert.equal(ambiguous, null);
  assert.equal(guideFor(''), null);
});

test('every catalogue entry has a usable preview', () => {
  for (const [owner, entries] of Object.entries(jsMethods)) {
    for (const entry of entries) {
      assert.ok(entry.description.length > 20, `${owner}.${entry.name} needs a description`);
      assert.ok(entry.example.length > 3, `${owner}.${entry.name} needs an example`);
      assert.ok(entry.signature.startsWith(entry.name) || entry.signature.includes(entry.name), `${owner}.${entry.name} signature`);
    }
  }
});

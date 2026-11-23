import { test } from 'node:test';
import assert from 'node:assert/strict';
import { libraryCatalogue } from '../app/library.js';
import { relatedLessons, lessonForTag } from '../app/lesson-map.js';

test('library keeps instance and static methods from the same owner', () => {
  const has = (owner, name) => libraryCatalogue.some(entry => entry.owner === owner && entry.name === name);
  assert.ok(has('Array', 'map'), 'instance Array.map');
  assert.ok(has('Array', 'isArray'), 'static Array.isArray');
  assert.ok(has('Object', 'keys'), 'static Object.keys');
  assert.ok(has('Object', 'hasOwnProperty'), 'instance Object.hasOwnProperty');
  assert.ok(has('String', 'slice'));
  const keys = libraryCatalogue.map(entry => `${entry.owner}.${entry.name}`);
  assert.equal(new Set(keys).size, keys.length, 'no duplicate guide rows');
});

test('every library entry has searchable teaching text', () => {
  for (const entry of libraryCatalogue) {
    assert.ok(entry.description.length > 20, `${entry.owner}.${entry.name} description`);
    assert.ok(entry.example.length > 3, `${entry.owner}.${entry.name} example`);
    assert.ok(entry.signature.length > 0, `${entry.owner}.${entry.name} signature`);
  }
});

test('practice topics map to existing lesson ids', () => {
  assert.deepEqual(relatedLessons(['array', 'hash-table']), ['arrays-loops', 'hash-maps']);
  assert.deepEqual(relatedLessons(['dynamic-programming']), ['dynamic-programming']);
  assert.deepEqual(relatedLessons(['unknown-topic']), []);
  assert.deepEqual(relatedLessons(['two pointers']), ['two-pointers']);
  for (const id of Object.values(lessonForTag)) {
    assert.match(id, /^[a-z0-9-]+$/);
  }
});

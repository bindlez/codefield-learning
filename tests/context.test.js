import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { completionContext, selectionContext } from '../src/completion.js';
test('extracts receivers and Ruby chains without executing code',()=>{
 assert.deepEqual(completionContext('word.chars.ta'),{receiver:'word',chain:['chars'],prefix:'ta'});
 assert.deepEqual(completionContext('"a.b".chars.t'),{receiver:'"a.b"',chain:['chars'],prefix:'t'});
 assert.deepEqual(completionContext('"jo hn a".split(\' \').la'),{receiver:'"jo hn a"',chain:['split'],prefix:'la'});
 assert.deepEqual(completionContext('p longword.split(\' \')[0].char'),{receiver:'longword',chain:['split','[0]'],prefix:'char'});
 assert.deepEqual(completionContext('String::from("abc").le'),{receiver:'String::from("abc")',chain:[],prefix:'le'});
 assert.deepEqual(completionContext('vec![1, 2].it'),{receiver:'vec![1, 2]',chain:[],prefix:'it'});
 assert.deepEqual(selectionContext('longword.split(\' \')[0]'),{receiver:'longword',chain:['split','[0]'],prefix:''});
 assert.deepEqual(completionContext('values.'),{receiver:'values',chain:[],prefix:''});
 assert.equal(completionContext('danger().'),null);
});
test('selected expressions must be complete, single expressions',()=>{
 assert.deepEqual(selectionContext(' PARENT '),{receiver:'PARENT',chain:[],prefix:''});
 assert.deepEqual(selectionContext('word.chars'),{receiver:'word',chain:['chars'],prefix:''});
 assert.deepEqual(selectionContext('"a b".split(" ")'),{receiver:'"a b"',chain:['split'],prefix:''});
 assert.equal(selectionContext('word + word'),null);
 assert.equal(selectionContext('word\nother'),null);
});

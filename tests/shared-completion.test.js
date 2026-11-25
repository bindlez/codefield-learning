import test from 'node:test';
import assert from 'node:assert/strict';
import {sharedCompletion} from '../app/shared-completion.js';

test('suggests methods for known Rust and C++ values',()=>{
  for (const [language,source,receiver,method] of [
    ['rust','let word = String::from("hi");\nword.le','word','len'],
    ['cpp','std::string word = "hi";\nword.si','word','size']
  ]) {
    const items=sharedCompletion(language,source,source.length,{receiver,chain:[],prefix:method.slice(0,2)});
    assert.ok(items.some(item=>item.label===method),language);
  }
});

test('uses problem parameter types for a one-letter Ruby method prefix',()=>{
  const source='def merge_alternately(word1, word2)\n  word1.s';
  const methods=sharedCompletion('ruby',source,source.length,{receiver:'word1',chain:[],prefix:'s'},{word1:'String',word2:'String'});
  assert.ok(methods.some(item=>item.label==='split'));
  const chained=sharedCompletion('ruby',source,source.length,{receiver:'word1',chain:['chars'],prefix:'t'},{word1:'String'});
  assert.ok(chained.some(item=>item.label==='tally'));
  const assigned='def merge(word1)\n  letters = word1.chars\n  letters.t';
  const methodsForAssignment=sharedCompletion('ruby',assigned,assigned.length,{receiver:'letters',chain:[],prefix:'t'},{word1:'String'});
  assert.ok(methodsForAssignment.some(item=>item.label==='tally'));
});

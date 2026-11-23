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

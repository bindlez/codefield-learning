import test from 'node:test';
import assert from 'node:assert/strict';
import {methodPreview} from '../src/method-preview.js';
const preview=(source,language,method,chain=[])=>methodPreview({source,language,receiver:'word',chain,method});
test('Ruby chars and tally previews preserve original code and values',()=>{
  const result=preview('word = "hello"\nword.chars.ta','ruby','tally',['chars']);
  assert.equal(result.available,true);
  assert.deepEqual(result.before,['h','e','l','l','o']);
  assert.equal(result.after.l,2);
});
test('language-specific pure transformations have previews',()=>{
  for(const [language,method] of [['ruby','upcase'],['python','upper'],['javascript','toUpperCase'],['rust','to_uppercase'],['java','toUpperCase'],['csharp','ToUpperInvariant'],['crystal','upcase']]){
    assert.equal(preview('word = "hello"\nword.',language,method).after,'HELLO');
  }
  assert.equal(preview('string word = "hello";\nword.','cpp','size').after,5);
});
test('refuses mutations, unknown calls, scopes, arguments, and interpolation',()=>{
  for(const source of ['word = "hello"\nword.clear()\nword.','word = user_input()\nword.','if ready:\nword = "hello"\nword.','word = "hello"\nword.split("x").','word = "#{danger()}"\nword.'])assert.equal(preview(source,'ruby','upcase').available,false,source);
  assert.equal(preview('word = "hello"\nword.','ruby','delete').available,false);
});

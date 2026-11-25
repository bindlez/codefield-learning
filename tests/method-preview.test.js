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
test('previews join from an observed example without running the method',()=>{
  const source="def merge(word1)\n  a = word1.split('')\n  a.joi\nend";
  const result=methodPreview({source,caret:source.indexOf('a.joi')+5,language:'ruby',receiver:'a',method:'join',
    observed:{label:'Example 1 · step 4',values:{a:['a','b','c']}}});
  assert.equal(result.after,'abc');
  assert.match(result.label,/Example 1/);
  assert.equal(methodPreview({source,language:'ruby',receiver:'a',method:'join',
    observed:{label:'Example',values:{a:[{},'b']}}}).available,false);
});
test('refuses mutations, unknown calls, scopes, arguments, and interpolation',()=>{
  for(const source of ['word = "hello"\nword.clear()\nword.','word = user_input()\nword.','if ready:\nword = "hello"\nword.','word = "hello"\nword.split("x").','word = "#{danger()}"\nword.'])assert.equal(preview(source,'ruby','upcase').available,false,source);
  assert.equal(preview('word = "hello"\nword.','ruby','delete').available,false);
});

 test('predicts a complete standalone expression without executing code',async()=>{
  const {expressionPreview}=await import('../src/method-preview.js');
  const source='word = "hello"\nword.chars';
  assert.deepEqual(expressionPreview(source,source.length,'ruby').after,['h','e','l','l','o']);
  assert.equal(expressionPreview('word = "hello"\nword.chars(1)',27,'ruby'),null);
});

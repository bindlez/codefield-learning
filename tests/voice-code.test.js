import test from 'node:test';
import assert from 'node:assert/strict';
import {voiceCode,voiceExpression} from '../src/voice-code.js';
test('voice templates insert loops and Ruby debug output',()=>{
  assert.equal(voiceCode('for each n in nums','ruby').code,'nums.each do |n|\n  \nend');
  assert.equal(voiceCode('for each index i in nums','ruby').code,'nums.each_index do |i|\n  \nend');
  assert.equal(voiceCode('inspect expression n','ruby').code,'p n');
  assert.equal(voiceCode('for each n in nums','python').code,'for n in nums:\n  ');
});
test('declarations and comparisons adapt to every supported language',()=>{
  for(const lang of ['javascript','ruby','python','rust','cpp','csharp','java','crystal','go','elixir']){
    assert.match(voiceCode('variable count equals 3',lang).code,/count = 3/);
    const block=voiceCode('if condition count greater than 2',lang);
    assert.match(block.code,/count > 2/);
    assert.equal(block.code.slice(0,block.caret).endsWith('\n  '),true);
    assert.match(voiceCode('print expression count',lang).code,/count/);
  }
  assert.equal(voiceCode('variable ready equals true','python').code,'ready = True');
  assert.equal(voiceCode('variable count equals 3','rust').code,'let mut count = 3;');
  assert.equal(voiceCode('while condition count less than 3','go').code,'for count < 3 {\n  \n}');
  assert.equal(voiceCode('if condition count greater than 2','elixir').code,'if count > 2 do\n  \nend');
});
test('literal strings and unknown commands are preserved',()=>{
  assert.equal(voiceExpression('"true plus false"','python'),'"true plus false"');
  assert.equal(voiceCode('delete everything','ruby'),null);
  assert.equal(voiceCode('variable x equals 1','unknown'),null);
});

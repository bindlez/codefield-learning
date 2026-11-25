import test from 'node:test';
import assert from 'node:assert/strict';
import {voiceCode,voiceExpression} from '../src/voice-code.js';
test('declarations and comparisons adapt to every supported language',()=>{
  for(const lang of ['javascript','ruby','python','rust','cpp','csharp','java','crystal']){
    assert.match(voiceCode('variable count equals 3',lang).code,/count = 3/);
    const block=voiceCode('if condition count greater than 2',lang);
    assert.match(block.code,/count > 2/);
    assert.equal(block.code.slice(0,block.caret).endsWith('\n  '),true);
    assert.match(voiceCode('print expression count',lang).code,/count/);
  }
  assert.equal(voiceCode('variable ready equals true','python').code,'ready = True');
  assert.equal(voiceCode('variable count equals 3','rust').code,'let mut count = 3;');
});
test('literal strings and unknown commands are preserved',()=>{
  assert.equal(voiceExpression('"true plus false"','python'),'"true plus false"');
  assert.equal(voiceCode('delete everything','ruby'),null);
  assert.equal(voiceCode('variable x equals 1','unknown'),null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {parseExploreValue,exploreOperations} from '../app/value-explorer.js';

test('value explorer treats input as data and validates its bounds',()=>{
  assert.equal(parseExploreValue('"String"'),'String');
  assert.equal(parseExploreValue('12'),12);
  assert.deepEqual(parseExploreValue('[1, 2, 3]'),[1,2,3]);
  assert.throws(()=>parseExploreValue('process.exit()'));
  assert.throws(()=>parseExploreValue('[{"x":1}]'));
});
test('previews describe the actual value without changing it',()=>{
  const original=[1,2,1];
  const ruby=exploreOperations(original,'ruby');
  assert.deepEqual(ruby.find(op=>op.key==='unique').after,[1,2]);
  assert.deepEqual(ruby.find(op=>op.key==='arrReverse').after,[1,2,1]);
  assert.deepEqual(original,[1,2,1]);
  assert.equal(exploreOperations(original,'javascript').find(op=>op.key==='arrReverse').mutates,true);
  assert.equal(exploreOperations(12,'ruby').find(op=>op.key==='even').after,true);
  assert.deepEqual(exploreOperations([1,2,3],'ruby').find(op=>op.key==='double').after,[2,4,6]);
  assert.deepEqual(exploreOperations([1,2,3],'python').find(op=>op.key==='keepEven').after,[2]);
});
test('string previews respect Ruby split trailing empty fields and omit unsafe Unicode predictions',()=>{
  const ruby=exploreOperations('a,,','ruby').find(op=>op.key==='split');
  assert.deepEqual(ruby.after,['a']);
  assert.deepEqual(exploreOperations('a,,','python').find(op=>op.key==='split').after,['a','','']);
  assert.deepEqual(exploreOperations('é','ruby'),[]);
});

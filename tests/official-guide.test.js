import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {documentationUrl} from '../app/documentation.js';
import {problemStarter} from '../app/problem-starter.js';
const docs=JSON.parse(await readFile(new URL('../app/ruby-official-docs.json',import.meta.url)));
test('official Ruby index preserves operator and assignment method names',()=>{
  assert.ok(docs['Set#add']?.description);
  assert.ok(docs['Hash#default_proc=']?.signature);
  assert.ok(docs['Array#[]']?.description);
});
test('method reference targets official Python built-in documentation',()=>{
  assert.equal(documentationUrl('python','Array','append'),'https://docs.python.org/3/library/stdtypes.html#list.append');
});
test('practice supplies function starters in the selected language',()=>{
  const plan={functionName:'twoSum',params:[{name:'nums'},{name:'target'}],returns:{type:'integer[]'}};
  assert.match(problemStarter({},plan,'ruby'),/^def two_sum\(nums, target\)/);
  assert.match(problemStarter({},plan,'python'),/def twoSum\(self, nums, target\)/);
  assert.equal(problemStarter({snippets:{ruby:'custom starter'}},plan,'ruby'),'custom starter');
});

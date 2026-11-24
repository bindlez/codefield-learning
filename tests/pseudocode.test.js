import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {parseAlgorithm,generateAlgorithm,sample} from '../app/pseudocode.js';
import {twoSumPlan} from '../app/algorithm-examples.js';
import {roadmaps} from '../app/roadmaps.js';
import {readFileSync} from 'node:fs';
test('positive sum and PRD map example generate executable, mapped implementations',()=>{
  for(const [source,call,expected] of [[sample,'total([-3,4,2])','6'],[twoSumPlan,'two_sum([2,7,4],9)','[0,1]']]){
    const ast=parseAlgorithm(source);assert.deepEqual(ast.errors,[]);
    for(const lang of ['ruby','javascript','rust','cpp','csharp','crystal','python','java']){
      const {lines,mapping}=generateAlgorithm(ast,lang);assert.equal(lines.length,mapping.length);
      assert.ok(lines.every(line=>!line.includes('undefined')));
      if(lang==='javascript') assert.equal(runInNewContext(lines.join('\n')+'\nJSON.stringify('+call+')'),expected);
    }
  }
});
test('all curated roadmap steps point to available catalog entries',()=>{
  const catalog=JSON.parse(readFileSync(new URL('../app/catalog.json',import.meta.url)));
  const eligible=new Set(catalog.questions.filter(q=>!q.paidOnly).map(q=>q.slug));
  for(const route of Object.values(roadmaps))for(const slug of route)assert.ok(eligible.has(slug),slug);
});

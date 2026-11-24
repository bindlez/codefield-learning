import test from 'node:test';
import assert from 'node:assert/strict';
import {inferVariables,inferContext} from '../src/inference.js';
import {sharedCompletion} from '../app/shared-completion.js';
import {describeExampleTrace} from '../app/multilang-judge.js';

test('Ruby Set constructors and conversions expose add before execution',()=>{
  const source='require "set"\nseen = Set.new\nother = [1, 2].to_set\nseen.ad';
  const vars=inferVariables(source,source.length,'ruby');
  assert.equal(vars.get('seen'),'Set'); assert.equal(vars.get('other'),'Set');
  assert.equal(inferContext(source,source.length,'ruby','seen',[]).type,'Set');
  const items=sharedCompletion('ruby',source,source.length,{receiver:'seen',chain:[],prefix:'ad'});
  assert.ok(items.some(item=>item.label==='add'));
  assert.ok(!sharedCompletion('ruby',source,source.length,{receiver:'seen',chain:[],prefix:'ins'}).some(item=>item.label==='insert'));
});

test('Rust HashSet exposes insert',()=>{
  const source='let mut seen = HashSet::new();\nseen.ins';
  assert.equal(inferVariables(source,source.length,'rust').get('seen'),'HashSet');
  assert.ok(sharedCompletion('rust',source,source.length,{receiver:'seen',chain:[],prefix:'ins'}).some(item=>item.label==='insert'));
});

test('JavaScript Set exposes add',()=>{
  const source='const seen = new Set();\nseen.ad';
  assert.equal(inferVariables(source,source.length,'javascript').get('seen'),'Set');
  assert.ok(sharedCompletion('javascript',source,source.length,{receiver:'seen',chain:[],prefix:'ad'}).some(item=>item.label==='add'));
});

test('live example verdict distinguishes pass, failure and self-check',()=>{
  const result={ok:true,output:'[line 2] n=1\n__CODEFIELD_CASE__3\n'};
  assert.match(describeExampleTrace(result,{args:[1],expected:3,known:true},'integer').verdict,/passes/);
  assert.match(describeExampleTrace(result,{args:[1],expected:2,known:true},'integer').verdict,/does not pass/);
  assert.match(describeExampleTrace(result,{args:[1],known:false},'integer').verdict,/Self-check/);
});

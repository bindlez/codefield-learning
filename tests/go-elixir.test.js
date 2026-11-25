import test from 'node:test';
import assert from 'node:assert/strict';
import {tokenizeGo,tokenizeElixir} from '../src/languages/go-elixir.js';
import {sharedCompletion} from '../app/shared-completion.js';
import {problemStarter} from '../app/problem-starter.js';
import {goScript} from '../app/go-practice.js';
test('new tokenizers preserve the complete source',()=>{for(const [fn,src] of [[tokenizeGo,'package main\n// hello\nfunc main() { println("hi") }'],[tokenizeElixir,'# hello\nEnum.map([1, 2], fn n -> n * 2 end)']])assert.equal(fn(src).map(t=>t.text).join(''),src);});
test('module completion follows Go and Elixir conventions',()=>{
  assert.ok(sharedCompletion('go','',0,{receiver:'strings',prefix:'To',chain:[]}).some(x=>x.label==='ToUpper'));
  assert.ok(sharedCompletion('elixir','',0,{receiver:'Enum',prefix:'freq',chain:[]}).some(x=>x.label==='frequencies'));
});
test('Go problem starter and example harness use typed parameters',()=>{
  const plan={functionName:'sum',params:[{name:'nums',type:'integer[]'}],returns:{type:'integer'},tests:[{args:[[1,2]],expected:3}]};
  assert.match(problemStarter({},plan,'go'),/nums \[\]int/);
  const script=goScript('func sum(nums []int) int { return 3 }',plan);
  assert.match(script,/json.Unmarshal/);assert.match(script,/__CODEFIELD_CASE__/);
  assert.equal(goScript('package main',plan),null);
});

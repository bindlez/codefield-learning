import test from 'node:test';
import assert from 'node:assert/strict';
import {variants} from '../app/variants.js';

test('first occurrence cases distinguish a normal binary search', () => {
  const first=(nums,target)=>nums.indexOf(target);
  const any=(nums,target)=>{let l=0,r=nums.length-1;while(l<=r){const m=(l+r)>>1;if(nums[m]===target)return m;if(nums[m]<target)l=m+1;else r=m-1}return -1};
  const cases=variants['binary-search'].tests;
  assert.ok(cases.every(({args,expected})=>first(...args)===expected));
  assert.ok(cases.some(({args,expected})=>any(...args)!==expected));
});
test('unicode variant rejects a lowercase-only counter', () => {
  const oracle=(a,b)=>[...a].sort().join('') === [...b].sort().join('');
  const bad=(a,b)=>{const count=Array(26).fill(0);for(const c of a)count[c.charCodeAt(0)-97]++;for(const c of b)count[c.charCodeAt(0)-97]--;return count.every(x=>x===0)};
  const cases=variants['valid-anagram'].tests;
  assert.ok(cases.every(({args,expected})=>oracle(...args)===expected));
  assert.ok(cases.some(({args,expected})=>bad(...args)!==expected));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {lessons,docs,review} from '../app/ruby-trail-content.js';

test('Ruby Trail lessons and documentation guide have complete learning material',()=>{
  assert.equal(lessons.length,12);assert.equal(review.length,lessons.length);assert.equal(docs.length,6);
  for(const row of [...lessons,...docs,...review]) for(const key of ['title','explain','visual','code','question','answer','url'])assert.ok(row[key],key);
});
test('all Ruby Trail examples execute in bundled Ruby',async()=>{
  const require=createRequire(new URL('../leetcode-extension/package.json',import.meta.url));
  const {DefaultRubyVM}=require('@ruby/wasm-wasi/dist/browser');
  const bytes=await readFile(new URL('../leetcode-extension/node_modules/@ruby/4.0-wasm-wasi/dist/ruby+stdlib.wasm',import.meta.url));
  const {vm}=await DefaultRubyVM(await WebAssembly.compile(bytes));
  for(const row of [...lessons,...docs])assert.doesNotThrow(()=>vm.eval(row.code),row.title);
});

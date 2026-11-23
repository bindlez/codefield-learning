import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { tokenizeRuby } from '../src/languages/ruby.js';
import { completionContext } from '../src/completion.js';

test('preserves source and identifies basic Ruby tokens', () => {
  const code = 'if word == "hello" # note\n  :ok\nend';
  const tokens = tokenizeRuby(code);
  assert.equal(tokens.map(token => token.text).join(''), code);
  assert.deepEqual(tokens.filter(token => token.type).map(token => token.type), ['keyword', 'string', 'comment', 'symbol', 'keyword']);
});
test('classifies method colors by inferred receiver and finds completion after a map block',()=>{
 const source='word = "hello".chars\nword.each_cons(2).map do |w|\n  w\nend.joi';
 const ctx=completionContext(source);
 assert.equal(ctx.receiver,'word');assert.deepEqual(ctx.chain,['each_cons','map']);assert.equal(ctx.prefix,'joi');assert.equal(ctx.blockResult,true);
 const tokens=tokenizeRuby(source);assert.ok(tokens.some(t=>t.text==='chars'&&t.type==='method-string'));assert.ok(tokens.some(t=>t.text==='each_cons'&&t.type==='method-array'));assert.ok(tokens.some(t=>t.text==='joi'&&t.type==='method-array'));
 assert.equal(tokens.map(t=>t.text).join(''),source);
});
test('keeps markup as text and handles an empty input', () => {
  assert.equal(tokenizeRuby('<script>alert(1)</script>').map(token => token.text).join(''), '<script>alert(1)</script>');
  assert.deepEqual(tokenizeRuby(''), []);
});

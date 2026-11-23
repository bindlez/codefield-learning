import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { tokenizeJavaScript } from '../src/languages/javascript.js';
test('JavaScript highlighting preserves source and distinguishes comments and strings',()=>{
 const code='const text = "// hello"; // note\n42';
 const tokens=tokenizeJavaScript(code);
 assert.equal(tokens.map(t=>t.text).join(''),code);
 assert.deepEqual(tokens.filter(t=>t.type).map(t=>t.type),['keyword','string','comment','number']);
});

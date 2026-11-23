import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {codeInsights} from '../app/code-insights.js';
import {aiEndpoint} from '../app/ai-client.js';

test('insights find likely names while avoiding division by zero',()=>{
 const result=codeInsights('word = "hello"\nword.chars.tally');
 assert.ok(result.variables.includes('word'));assert.deepEqual(result.methods,['chars','tally']);assert.ok(result.total>0);
 assert.equal(codeInsights('').total,0);
});
test('model endpoints permit loopback HTTP or configured HTTPS and reject URL credentials',()=>{
 assert.equal(aiEndpoint('http://127.0.0.1:11434','ollama'),'http://127.0.0.1:11434/api/chat');
 assert.equal(aiEndpoint('https://example.test/v1/','openai'),'https://example.test/v1/chat/completions');
 assert.throws(()=>aiEndpoint('http://example.test/v1','openai'));
 assert.throws(()=>aiEndpoint('https://user:secret@example.test/v1','openai'));
});

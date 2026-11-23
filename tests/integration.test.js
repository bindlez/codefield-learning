import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {filterCatalog} from '../app/catalog.js';
import {resolveProblem} from '../server/leetcode.js';
import {askConnected, discover} from '../app/connection.js';

test('the bundled index includes every unique entry across pages and access levels', async () => {
  const {questions, total} = JSON.parse(await readFile(new URL('../app/catalog.json', import.meta.url)));
  assert.equal(new Set(questions.map(item => item.slug)).size, total);
  assert.ok(total > 4000 && questions.some(item => item.paidOnly));
  assert.deepEqual(filterCatalog(questions, {skip:60,limit:60}).questions, questions.slice(60,120));
  assert.equal(filterCatalog(questions, {query:'1',tag:'array',difficulty:'Easy'}).questions[0].slug,'two-sum');
  assert.equal((await resolveProblem('1')).slug,'two-sum');
});

test('studio requests use the same backend connection as discovery', async t => {
  const settings = {backend:true, provider:'lmstudio', baseUrl:'http://localhost:1234/v1'};
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    calls.push([url, JSON.parse(init.body)]);
    return Response.json(url.endsWith('models') ? {models:['local']} : {text:'hint'});
  });
  const {models} = await discover(settings);
  assert.equal(await askConnected({...settings, model:models[0], messages:[{role:'user',content:'help'}]}),'hint');
  assert.deepEqual(calls.map(([url]) => url), ['/api/ai/models','/api/ai/chat']);
  assert.ok(calls.every(([,body]) => body.baseUrl === settings.baseUrl && body.provider === settings.provider));
  assert.equal(calls[1][1].stream,false);
});

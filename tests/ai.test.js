import {test} from 'node:test';
import assert from 'node:assert/strict';
import {askModel,listModels,aiEndpoint} from '../app/ai-client.js';
import {readProblemSource,parseProblems} from '../app/problem-set.js';

test('second-PC Strata discovers the served ID and authenticates both requests',async t=>{
  const calls=[];
  t.mock.method(globalThis,'fetch',async(url,init)=>{
    calls.push({url,init});
    return Response.json(calls.length===1?{data:[{id:'iq2_xs'}]}:{choices:[{message:{content:'ready'}}]});
  });
  const result=await askModel({provider:'remote',base:'http://192.168.1.20:47832/v1',key:'test-only',messages:[{role:'user',content:'hello'}]});
  assert.equal(result,'ready');
  assert.match(calls[0].url,/\/v1\/models$/);
  assert.equal(JSON.parse(calls[1].init.body).model,'iq2_xs');
  assert.ok(calls.every(c=>c.init.headers.Authorization==='Bearer test-only'));
  assert.throws(()=>aiEndpoint('http://example.org/v1','remote'));
});
test('Gemini discovers a chat model and sends its key only to Google',async t=>{
  const calls=[];
  t.mock.method(globalThis,'fetch',async(url,init)=>{
    calls.push({url,init});
    return Response.json(calls.length===1?{models:[{name:'models/gemini-flash',supportedGenerationMethods:['generateContent']}]}:{candidates:[{content:{parts:[{text:'answer'}]}}]});
  });
  assert.equal(await askModel({provider:'gemini',base:'https://example.org',key:'test-only',messages:[{role:'system',content:'Teach'},{role:'user',content:'Hello'}]}),'answer');
  assert.ok(calls.every(c=>new URL(c.url).hostname==='generativelanguage.googleapis.com' && c.init.headers['x-goog-api-key']==='test-only'));
  assert.equal(JSON.parse(calls[1].init.body).contents[0].parts[0].text,'Hello');
});
test('denied credentials produce a sign-in error',async t=>{
  t.mock.method(globalThis,'fetch',async()=>new Response(null,{status:401}));
  await assert.rejects(listModels({provider:'openai',base:'http://localhost:47831/v1'}),/API key/);
});
test('reads a Codewars kata and validates a complete practice set before saving',async t=>{
  t.mock.method(globalThis,'fetch',async url=>{
    assert.equal(url,'https://www.codewars.com/api/v1/code-challenges/example');
    return Response.json({name:'Example',description:'Compute a sum.'});
  });
  assert.equal(await readProblemSource('https://www.codewars.com/kata/example/train/ruby'),'Example\nCompute a sum.');
  const item={title:'Sum',description:'Sum these values.',hint:'Iterate',starter:'a = [2,3]',expected:'5'};
  const raw=JSON.stringify({problems:[item]});
  assert.deepEqual(parseProblems(raw,1,'ruby'),[{...item,language:'ruby'}]);
  assert.throws(()=>parseProblems(raw,3,'ruby'));
  assert.throws(()=>parseProblems('{"problems":[{}]}',1,'ruby'));
});

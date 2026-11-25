import {spawn} from 'node:child_process';
import {mkdtemp,readFile,writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const dist=fileURLToPath(new URL(process.argv.includes('--source')?'./':'./dist',import.meta.url));
const panelPath=process.argv.includes('--source')?'dist/panel.html':'panel.html';
const profile=await mkdtemp(path.join(os.tmpdir(),'cf-extension-test-'));
const browser=spawn(process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ['--headless=new','--disable-gpu','--no-first-run','--disable-features=msEdgeSidebarV2','--remote-debugging-port=0','--load-extension='+dist,'--disable-extensions-except='+dist,'--user-data-dir='+profile,'about:blank'],{stdio:'ignore',windowsHide:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,ms=15000) {
  const start=Date.now();let last;
  while(Date.now()-start<ms){try{const out=await fn();if(out)return out;}catch(e){last=e;}await sleep(80);}
  throw Error('Timed out waiting for '+fn.toString().slice(0,170)+(last?' · '+last.message:''));
}
function client(url) {
  const ws=new WebSocket(url),jobs=new Map(),listeners=new Map();
  const ready=new Promise(resolve=>ws.onopen=resolve);
  let seq=0;
  ws.onmessage=({data})=>{
    const m=JSON.parse(data);
    if(m.id) {const job=jobs.get(m.id);jobs.delete(m.id);m.error?job.reject(Error(m.error.message)):job.resolve(m.result);}
    else listeners.get(m.method)?.(m.params);
  };
  return {on:(event,fn)=>listeners.set(event,fn),async send(method,params={}){
    await ready;const id=++seq;
    return new Promise((resolve,reject)=>{jobs.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
  },close:()=>ws.close()};
}
let root,page,panel;
try{
  const portInfo=await until(()=>readFile(path.join(profile,'DevToolsActivePort'),'utf8'));
  const [port,endpoint]=portInfo.trim().split(/\r?\n/);
  const targets=async()=>await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();
  root=client('ws://127.0.0.1:'+port+endpoint);
  const worker=await until(async()=>{
    for(const t of (await targets()).filter(t=>t.type==='service_worker' && t.url.endsWith('/background.js'))){
      const c=client(t.webSocketDebuggerUrl);
      try {if((await c.send('Runtime.evaluate',{expression:'chrome.runtime.getManifest().name'})).result.value==='Codefield for LeetCode')return t;}
      finally{c.close();}
    }
  });
  const prefix=worker.url.replace(/background.js$/,'');
  const pageTarget=(await targets()).find(t=>t.type==='page');
  page=client(pageTarget.webSocketDebuggerUrl);
  const live=process.argv.includes('--live');
  if(!live){
    await page.send('Fetch.enable',{patterns:[{urlPattern:'https://leetcode.com/*'}]});
    page.on('Fetch.requestPaused',async({requestId,request})=>{
      const graphql=request.url.includes('graphql');
      const merge=request.postData?.includes('merge-strings-alternately');
      const q=merge?{title:'Merge Strings Alternately',titleSlug:'merge-strings-alternately',metaData:JSON.stringify({name:'mergeAlternately',params:[{name:'word1',type:'string'},{name:'word2',type:'string'}],return:{type:'string'}}),exampleTestcases:'"abc"\n"pqr"\n"ab"\n"pqrs"\n"abcd"\n"pq"',content:'<pre>Input: word1 = "abc", word2 = "pqr"\nOutput: "apbqcr"</pre><pre>Input: word1 = "ab", word2 = "pqrs"\nOutput: "apbqrs"</pre><pre>Input: word1 = "abcd", word2 = "pq"\nOutput: "apbqcd"</pre>',codeSnippets:[]}:
        {title:'Two Sum',titleSlug:'two-sum',metaData:JSON.stringify({name:'twoSum',params:[{name:'nums',type:'integer[]'},{name:'target',type:'integer'}],return:{type:'integer[]'}}),exampleTestcases:'[2,7,11,15]\n9\n[3,2,4]\n6',content:'<pre>Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]</pre><pre>Output: [1,2]</pre>',codeSnippets:[]};
      const fixture='<title>Two Sum</title><h1>Two Sum</h1><script>let code="function twoSum(nums,target) {}";window.monaco={editor:{getModels:()=>[{isDisposed:()=>false,getLanguageId:()=>"javascript",getValue:()=>code,getFullModelRange:()=>({}),pushStackElement(){},pushEditOperations(a,b){code=b[0].text}}]}}</script>';
      await page.send('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:graphql?'application/json':'text/html'}],body:Buffer.from(graphql?JSON.stringify({data:{question:q}}):fixture).toString('base64')});
    });
  }
  const ev=async(c,expression)=>{
    const r=await c.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});
    if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  await page.send('Page.navigate',{url:'https://leetcode.com/problems/two-sum/'});
  const rect=await until(()=>ev(page,"(()=>{const host=[...document.documentElement.children].find(n=>n.tagName==='DIV' && n.getBoundingClientRect().width>0);if(!host)return;const r=host.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()"));
  for(const type of ['mousePressed','mouseReleased'])await page.send('Input.dispatchMouseEvent',{type,...rect,button:'left',clickCount:1});
  // Some headless browser builds omit native side-panel chrome; exercise its
  // actual extension page in a background tab with the problem still active.
  let target;
  for(let i=0;i<12&&!target;i++){target=(await targets()).find(t=>t.url===prefix+panelPath);await sleep(120);}
  if(!target){
    console.log('Headless browser omits native side panel; opening the same extension document.');
    const t=await root.send('Target.createTarget',{url:prefix+panelPath,background:true});
    await root.send('Target.activateTarget',{targetId:pageTarget.id});
    target=await until(async()=>(await targets()).find(v=>v.id===t.targetId));
  }else console.log('On-page launcher opened browser side panel.');
  panel=client(target.webSocketDebuggerUrl);
  panel.on('Runtime.exceptionThrown',m=>console.error('Panel error',m.exceptionDetails.exception?.description || m.exceptionDetails.text));
  panel.on('Log.entryAdded',m=>console.error('Panel log',m.entry.text));
  await panel.send('Runtime.enable');await panel.send('Log.enable');
  const run=expr=>ev(panel,expr);
  await until(()=>run("document.querySelector('#editor textarea') && document.querySelector('#title').textContent==='Two Sum'")).catch(async error=>{
    console.error(await run("location.href+' '+document.body.innerText"),await run("chrome.tabs?.query({active:true,currentWindow:true}).then(t=>t.map(v=>v.url))"));throw error;
  });
  console.log('Problem:',await run("document.querySelector('#notice').textContent || 'loaded from LeetCode'"));
  if(live)console.log('Native editor connection:',await ev(page,"JSON.stringify({monaco:!!window.monaco,visibleEditors:window.monaco?.editor?.getEditors?.().filter(e=>e.getDomNode()?.getClientRects().length).length,models:window.monaco?.editor?.getModels?.().map(m=>m.getLanguageId()),visibleInputs:document.querySelectorAll('.monaco-editor').length})"));
  async function type(language,source) {
    await run("(()=>{const s=document.querySelector('#language');s.value="+JSON.stringify(language)+";s.dispatchEvent(new Event('change'));const t=document.querySelector('#editor textarea');t.value="+JSON.stringify(source)+";t.dispatchEvent(new Event('input',{bubbles:true}))})()");
  }
  async function checkTrace(language,source){
    await type(language,source);
    await until(()=>run("!['Waiting for a pause…','Tracing example…',''].includes(document.querySelector('#verdict').textContent)"),22000);
    const verdict=await run("document.querySelector('#verdict').textContent");assert.match(verdict,/Matches example/,language+': '+verdict);
    assert.ok(await run("Number(document.querySelector('#step').max)>=2"),language+' trace count');
    assert.ok(await run("document.querySelectorAll('#variables .variable').length>0"),language+' live variable cards');
    assert.ok(await run("[...document.querySelectorAll('#variables .variable strong')].some(node=>node.textContent==='nums')"),language+' parameter in live variables');
    console.log(language,verdict,'· steps',await run("document.querySelector('#step').max"));
  }
  const js='function twoSum(nums,target) {\n const seen=new Map();\n for(let i=0;i<nums.length;i++){\n  if(seen.has(target-nums[i])) return [seen.get(target-nums[i]),i];\n  seen.set(nums[i],i);\n }\n}';
  await checkTrace('javascript',js);
  await run("document.querySelector('#next').click();document.querySelector('#line').click()");
  assert.ok(await run("document.querySelector('#editor textarea').selectionEnd>document.querySelector('#editor textarea').selectionStart"));
  if(!live){
    await run("window.confirm=()=>true;document.querySelector('#push').click()");
    await until(()=>ev(page,'window.monaco.editor.getModels()[0].getValue()') .then(v=>v===js));
    await run("document.querySelector('#example').value='1';document.querySelector('#example').dispatchEvent(new Event('change'))");
    await until(()=>run("document.querySelector('#verdict').textContent.includes('[1,2]')"));
    await run("document.querySelector('#example').value='0';document.querySelector('#example').dispatchEvent(new Event('change'))");
  }
  await checkTrace('python','class Solution:\n    def twoSum(self, nums: List[int], target: int):\n        seen = {}\n        for i, n in enumerate(nums):\n            if target-n in seen:\n                return [seen[target-n],i]\n            seen[n]=i');
  await checkTrace('ruby','def two_sum(nums,target)\n  seen = {}\n  nums.each_with_index do |n,i|\n    return [seen[target-n],i] if seen.key?(target-n)\n    seen[n] = i\n  end\nend');
  await type('ruby','def two_sum(nums,target)\n  nums.each_cons(2) do |pair|\n    p pair.sum\n  end\n  for n in nums\n    p n\n  end\n  [0,1]\nend');
  await until(()=>run("document.querySelector('#verdict').textContent.includes('Matches example')"),22000);
  assert.equal(await run("document.querySelector('#console pre').textContent"),'9\n18\n26\n2\n7\n11\n15');
  assert.equal(await run("document.querySelector('#console').open"),true);
  console.log('Ruby block and for-loop output captured');
  if(process.argv.includes('--screenshot'))console.log('Ruby return display:',await run("document.querySelector('#live-return').textContent"));
  if(process.argv.includes('--screenshot')){
    const shot=await panel.send('Page.captureScreenshot',{format:'png'});
    await writeFile(new URL('../.cache/extension-panel.png',import.meta.url),Buffer.from(shot.data,'base64'));
    await panel.send('Emulation.setDeviceMetricsOverride',{width:1000,height:900,deviceScaleFactor:1,mobile:false});
    const wide=await panel.send('Page.captureScreenshot',{format:'png'});
    await writeFile(new URL('../.cache/extension-wide.png',import.meta.url),Buffer.from(wide.data,'base64'));
    await panel.send('Emulation.clearDeviceMetricsOverride');
  }
  for(const [language,source,method] of [
    ['ruby','def two_sum(nums,target)\n  nums.e\nend','each'],
    ['python','class Solution:\n    def twoSum(self, nums, target):\n        nums.a\n','append'],
    ['javascript','function twoSum(nums,target) {\n  nums.m\n}','map']
  ]){
    await type(language,source);
    await run("(()=>{const t=document.querySelector('#editor textarea');t.focus();const p=t.value.indexOf('nums.')+6;t.setSelectionRange(p,p);t.dispatchEvent(new Event('input',{bubbles:true}))})()");
    await until(()=>run("[...document.querySelectorAll('.code-completion')].some(item=>item.textContent.includes("+JSON.stringify(method)+"))"));
    assert.equal(await run("getComputedStyle(document.querySelector('.code-completions')).position"),'absolute',language+' caret popup');
    if(language==='ruby' && process.argv.includes('--screenshot')){
      await run("document.querySelector('#editor').scrollIntoView({block:'center'})");
      const shot=await panel.send('Page.captureScreenshot',{format:'png'});
      await writeFile(new URL('../.cache/extension-completion.png',import.meta.url),Buffer.from(shot.data,'base64'));
    }
    await until(()=>run("[...document.querySelectorAll('#method-list button')].some(item=>item.textContent==="+JSON.stringify(method)+")"));
    await run("[...document.querySelectorAll('#method-list button')].find(item=>item.textContent==="+JSON.stringify(method)+").click()");
    assert.ok(await run("document.querySelector('#method-name').textContent.includes("+JSON.stringify(method)+")"),language+' method explorer');
    console.log(language,'parameter autocomplete and method explorer passed');
  }
  await type('javascript',js);
  await run("document.querySelector('#language').value='javascript';document.querySelector('#language').dispatchEvent(new Event('change'))");
  assert.equal(await run("document.querySelector('#editor textarea').value"),js);
  if(!live){
    const replay=await run(`(async()=>{
      const {runExample,sandboxRunner}=await import('./execution.js');
      const {interpretedExample}=await import('./app/interpreted-examples.js');
      const frame=document.createElement('iframe');frame.hidden=true;document.body.append(frame);
      const execute=sandboxRunner(frame), rows=[];
      for(const language of ['ruby','python']){
        for(const type of ['ListNode','TreeNode']){
          const sample=type==='ListNode'?[1,2,3]:[1,null,3,2];
          const source=language==='ruby'?'def identity(node)\\n  result = node\\n  result\\nend':'class Solution:\\n    def identity(self, node):\\n        result = node\\n        return result';
          const result=await runExample({language,source,plan:{functionName:'identity',params:[{name:'node',type}],returns:{type},tests:[{args:[sample],expected:sample,known:true}]},signal:new AbortController().signal,execute});
          rows.push({actual:result.actual,sample,error:result.error,steps:result.steps.length});
        }
        const source=language==='ruby'?'def identity(value)\\n  value\\nend':'class Solution:\\n    def identity(self, value):\\n        return value';
        const samples=['hello', '#{raise "not code"}'];
        const plan={functionName:'identity',params:[{name:'value',type:'string'}],returns:{type:'string'},tests:samples.map(value=>({args:[value]}))};
        const code=interpretedExample(language,source,plan,{trace:false});
        const result=await execute(language,code,null,new AbortController().signal);
        const returned=result.output?.split(/\\r?\\n/).filter(line=>line.startsWith('__CODEFIELD_CASE__')).map(line=>JSON.parse(line.slice(18)));
        rows.push({actual:returned,sample:samples,error:result.error,steps:1});
        const setSource=language==='ruby'?'def count_items()\\n  seen = Set.new([1,2])\\n  seen.size\\nend':'class Solution:\\n    def count_items(self):\\n        seen = set([1,2])\\n        return len(seen)';
        const setPlan={functionName:'count_items',params:[],returns:{type:'integer'},tests:[{args:[],expected:2,known:true}]};
        const setResult=await runExample({language,source:setSource,plan:setPlan,signal:new AbortController().signal,execute});
        rows.push({actual:setResult.actual,sample:2,error:setResult.error,steps:setResult.steps.length});
        if(!setResult.steps.some(step=>step.detail.toLowerCase().includes('set[') || step.detail.toLowerCase().includes('set(')))throw Error(language+' set values missing from trace');
        if(language==='python' && !setResult.steps.some(step=>step.detail.includes('→ 2')))throw Error(language+' return value missing from trace');
      }
      frame.remove();return rows;
    })()`);
    for(const row of replay){assert.ok(!row.error,row.error);assert.deepEqual(row.actual,row.sample);assert.ok(row.steps>0);}
    await run("document.querySelector('#auto').click()");
    assert.equal(await run("document.querySelector('#verdict').textContent"),'Auto-run paused.');
    await run("document.querySelector('#auto').click()");
    await until(()=>run("!document.querySelector('#replay').hidden"));
    await run("document.querySelector('#play').click()");
    await until(()=>run("Number(document.querySelector('#step').value)>1"));
    console.log('Checked linked lists, sparse trees, auto-run pause and replay playback.');
    await page.send('Page.navigate',{url:'https://leetcode.com/problems/merge-strings-alternately/'});
    await until(()=>run("document.querySelector('#title').textContent==='Merge Strings Alternately'"));
    await type('ruby','def merge_alternately(word1,word2)\n  word1.s\nend');
    await run("(()=>{const t=document.querySelector('#editor textarea');t.focus();const p=t.value.indexOf('word1.s')+7;t.setSelectionRange(p,p);t.dispatchEvent(new Event('input',{bubbles:true}))})()");
    await until(()=>run("[...document.querySelectorAll('.code-completion')].some(item=>item.textContent.includes('split'))"));
    await until(()=>run("[...document.querySelectorAll('#method-list button')].some(item=>item.textContent==='split')"));
    console.log('Merge Strings word1.s autocomplete and reference passed.');
    await type('ruby',"def merge_alternately(word1,word2)\n  a = word1.split('')\n  a.joi\nend");
    await run("(()=>{const t=document.querySelector('#editor textarea');t.focus();const p=t.value.indexOf('a.joi')+5;t.setSelectionRange(p,p);t.dispatchEvent(new Event('input',{bubbles:true}))})()");
    await until(()=>run("[...document.querySelectorAll('.code-completion')].some(item=>item.textContent.includes('join'))"));
    await until(()=>run("document.querySelector('#method-preview').textContent.includes('abc')"),15000).catch(async e=>{console.log('DIAGNOSTIC',await run("JSON.stringify({preview:document.querySelector('#method-preview').textContent,method:document.querySelector('#method-name').textContent,values:document.querySelector('#variables').textContent,map:document.querySelector('.semantic-panel').textContent,verdict:document.querySelector('#verdict').textContent,steps:document.querySelector('#step').max})"));throw e;});
    assert.ok(await run("document.querySelector('.semantic-panel').textContent.includes('abc')"),'Code Map contains observed values');
    await run("document.querySelector('#example').value='1';document.querySelector('#example').dispatchEvent(new Event('change'))");
    await until(()=>run("document.querySelector('#method-preview').textContent.includes('ab') && document.querySelector('#method-preview').textContent.includes('Example 2')"),30000);
    const solution='def merge_alternately(word1,word2)\n  result = ""\n  [word1.length,word2.length].max.times do |i|\n    result << word1[i].to_s\n    result << word2[i].to_s\n  end\n  result\nend';
    await type('ruby',solution);
    await until(()=>run("!document.querySelector('#results-summary').hidden && document.querySelector('#results-summary').dataset.state==='pass' && document.querySelector('#results-summary').textContent.includes('3 published examples')"),30000);
    assert.ok((await run("document.querySelector('#results-summary').textContent")).includes('3 published examples'));
    await run("document.querySelector('#save-file').click();document.querySelector('#open-files').click()");
    assert.ok(await run("!!document.querySelector('dialog.file-manager[open]')"),'file explorer opens');
    console.log('Observed Code Map, example switching, join preview, solved status and files passed.');
  }
  if(live)console.log('Loaded website editor:',await ev(page,"JSON.stringify({monaco:!!window.monaco,monacoViews:document.querySelectorAll('.monaco-editor').length,codeMirror:document.querySelectorAll('.cm-editor').length,otherEditors:[...document.querySelectorAll('textarea,[contenteditable=true]')].map(e=>e.className).slice(0,5)})"));
  console.log('Trace navigation, source selection and per-language drafts passed.');
}finally{
  if(root)await root.send('Browser.close').catch(()=>{});
  page?.close();panel?.close();root?.close();browser.kill();
}

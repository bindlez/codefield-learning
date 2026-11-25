import {createEditor} from './app/workspace-editor.js';
import {languages} from './app/languages.js';
import {testsFromProblem} from './app/judge.js';
import {problemStarter} from './app/problem-starter.js';
import {problems} from './app/problems.js';
import {localLanguages,compilerOrigin,runExample,outcome,sandboxRunner} from './execution.js';
import {nativeEditor} from './native-editor.js';

const $=id=>document.getElementById(id);
const execute=sandboxRunner($('runner'));
const notice=text=>{$('notice').textContent=text;};
let context,editor,problem,plan,language,routeVersion=0,runVersion=0,timer,controller,playback,steps=[];
const enabledRemote=new Set();
const draftKey=()=>['codefield',context.slug,language].join('.');
const read=key=>localStorage.getItem(key);
function save(key,value) {
  try {localStorage.setItem(key,value);} catch {notice('Browser storage is full. Save a copy with Download.');}
}
function cancel() {
  clearTimeout(timer);controller?.abort();runVersion++;
  stopPlayback();$('editor').style.removeProperty('--trace-top');
  steps=[];$('replay').hidden=true;$('console').hidden=true;
}
function stopPlayback(){
  clearInterval(playback);playback=null;$('play').textContent='▶';$('play').setAttribute('aria-label','Play trace');
}
function highlightLine(){
  const item=steps[Number($('step').value)-1],input=$('editor').querySelector('textarea');
  if(!item || !input)return;
  const style=getComputedStyle(input);
  const y=parseFloat(style.paddingTop)+(item.line-1)*parseFloat(style.lineHeight)-input.scrollTop;
  $('editor').style.setProperty('--trace-top',y+'px');
}
$('editor').addEventListener('scroll',highlightLine,true);
async function native(op='read',expected='') {
  const [result]=await chrome.scripting.executeScript({target:{tabId:context.tabId},world:'MAIN',func:nativeEditor,
    args:[context.slug,op,language || '',editor?.getValue() || '',expected]});
  return result?.result || {error:'LeetCode’s editor is unavailable.'};
}
function mount(value) {
  editor?.destroy();
  editor=createEditor($('editor'),{language,label:'LeetCode solution',value,autoIndent:true,modelOpen:true,onChange:changed,onSetValue:changed});
  document.querySelector('.semantic-panel summary').textContent='Code Map';
  function changed(source) {save(draftKey(),source);schedule();}
  schedule();
}
function switchLanguage(id,nativeCode) {
  language=id;$('language').value=id;save('codefield.language.'+context.slug,id);
  mount(read(draftKey()) ?? nativeCode ?? problemStarter(problem,plan,id));
}
function fillExample() {
  const index=$('example').value;
  const custom=index==='custom';
  const test=custom?null:plan.tests[Number(index)];
  $('args').value=test?JSON.stringify(test.args):read('args.'+context.slug) || '[]';
  $('fn').value=custom?(read('fn.'+context.slug) ?? plan.functionName):plan.functionName;
  $('custom').open=custom;
  schedule();
}
function activePlan() {
  const args=JSON.parse($('args').value);
  if(!Array.isArray(args))throw Error('Enter arguments as a JSON array, for example [[2,7,11,15],9].');
  const functionName=$('fn').value.trim();
  if(!/^[A-Za-z_]\w*$/.test(functionName))throw Error('Enter the callable function name under Example inputs.');
  const test=plan.tests[Number($('example').value)];
  const unchanged=test && functionName===plan.functionName && JSON.stringify(args)===JSON.stringify(test.args);
  return {...plan,functionName,tests:[unchanged?test:{args,known:false}]};
}
function drawStep(index,jump=false) {
  const item=steps[index];if(!item)return;
  $('step').value=index+1;$('prev').disabled=index===0;$('next').disabled=index===steps.length-1;
  const lines=editor.getValue().split('\n'),line=lines[item.line-1] || '';
  $('line').textContent=(index+1)+'/'+steps.length+' · Line '+item.line+' · '+item.event+'  '+line.trim().slice(0,100);
  $('locals').textContent=item.detail || 'No local values at this point.';
  highlightLine();
  if(jump) {const start=lines.slice(0,item.line-1).reduce((n,s)=>n+s.length+1,0);editor.selectRange(start,start+line.length);}
}
function schedule() {
  cancel();
  if(!editor || !context)return;
  const version=runVersion,origin=compilerOrigin(language);
  const remoteAllowed=enabledRemote.has(origin);
  $('remote').hidden=!origin || remoteAllowed;
  if(!$('auto').checked){$('verdict').textContent='Auto-run paused.';return;}
  if(!localLanguages.has(language) && !remoteAllowed){
    $('verdict').textContent=origin?'Enable '+new URL(origin).hostname+' to send this solution and example for online execution.':'Editing and Code Map available. This language has no extension runner.';return;
  }
  $('verdict').textContent='Waiting for a pause…';
  timer=setTimeout(async()=>{
    controller=new AbortController();
    try {
      const current=activePlan(),source=editor.getValue();
      if(source.length>100000)throw Error('Live trace supports solutions up to 100,000 characters.');
      $('verdict').textContent='Tracing example…';
      const result=await runExample({language,source,plan:current,execute,signal:controller.signal});
      if(version!==runVersion)return;
      steps=result.steps || [];
      $('verdict').textContent=outcome(result,current.tests[0],current.returns?.type,context.slug)+(steps.length===120?' · First 120 steps':'');
      $('replay').hidden=!steps.length;$('step').max=steps.length || 1;drawStep(0);
      $('console').hidden=!result.logs?.length;
      $('console').querySelector('pre').textContent=(result.logs || []).join('\n').slice(0,10000);
    } catch(error) {if(version===runVersion)$('verdict').textContent=error.message;}
  },origin?1350:650);
}
async function openProblem(tabId,slug) {
  const version=++routeVersion;
  const sameTabNavigation=context?.tabId===tabId && context.slug!==slug;
  cancel();editor?.destroy();editor=null;context=slug?{tabId,slug}:null;
  $('workspace').hidden=true;$('title').textContent=slug?'Opening '+slug.replaceAll('-',' '):'Open a LeetCode problem';
  notice(slug?'Loading the problem and current draft…':'Visit a problem on leetcode.com to start tracing.');
  if(!slug)return;
  const [live,initial]=await Promise.all([
    chrome.tabs.sendMessage(tabId,{type:'question',slug}).catch(()=>null),
    sameTabNavigation?null:native().catch(()=>null)
  ]);
  if(version!==routeVersion)return;
  const seed=problems.find(item=>item.id===slug);
  problem=live || seed || {title:slug.replaceAll('-',' ')};
  plan=testsFromProblem(problem);
  // Some questions publish a starter without a runnable signature. Keep editing available.
  $('title').textContent=problem.title;
  const guidance='Write in the Codefield editor below to see the live trace.';
  notice([guidance,live?'':seed?'Using bundled examples.':'Enter a function name and arguments to trace a custom example.'].filter(Boolean).join(' '));
  $('example').replaceChildren(...plan.tests.map((_,i)=>new Option('Example '+(i+1),i)),new Option('Custom example','custom'));
  $('language').replaceChildren(...Object.entries(languages).map(([id,name])=>new Option(name,id)));
  const preferred=read('codefield.language.'+slug);
  const selected=Object.hasOwn(languages,preferred)?preferred:initial?.language || live?.visibleLanguage || 'javascript';
  $('workspace').hidden=false;fillExample();
  switchLanguage(selected,initial?.language===selected?initial.code:undefined);
}
let syncVersion=0;
async function syncTab() {
  const version=++syncVersion;
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  if(version!==syncVersion)return;
  const slug=/^https:\/\/leetcode\.com\/problems\/([\w-]+)(?:[/?#]|$)/.exec(tab?.url || '')?.[1];
  if(!slug && !context){notice('Visit a problem on leetcode.com to start tracing.');return;}
  if(context?.tabId===tab?.id && context?.slug===slug)return;
  await openProblem(tab?.id,slug);
}
chrome.tabs.onActivated.addListener(syncTab);
chrome.tabs.onUpdated.addListener((id,info,tab)=>{if(tab.active && (info.url || info.status==='complete'))syncTab();});
$('language').onchange=()=>switchLanguage($('language').value);
$('example').onchange=fillExample;
for(const id of ['args','fn']) $(id).oninput=()=>{if($('example').value==='custom')save(id+'.'+context.slug,$(id).value);schedule();};
$('auto').onchange=schedule;
$('remote').onclick=async()=>{
  const origin=compilerOrigin(language);
  if(origin && await chrome.permissions.request({origins:[origin]})){enabledRemote.add(origin);schedule();}
};
$('play').onclick=()=>{
  if(playback){stopPlayback();return;}
  if(Number($('step').value)>=steps.length)drawStep(0);
  $('play').textContent='Ⅱ';$('play').setAttribute('aria-label','Pause trace');
  playback=setInterval(()=>{
    const next=Number($('step').value);
    if(next<steps.length)drawStep(next);
    if(next+1>=steps.length)stopPlayback();
  },650);
};
$('prev').onclick=()=>{stopPlayback();drawStep(Number($('step').value)-2);};
$('next').onclick=()=>{stopPlayback();drawStep(Number($('step').value));};
$('step').oninput=()=>{stopPlayback();drawStep(Number($('step').value)-1);};
$('line').onclick=()=>drawStep(Number($('step').value)-1,true);
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(editor.getValue());notice('Copied. Paste into LeetCode when ready.');}catch{editor.selectRange(0,editor.getValue().length);notice('Code selected. Press Ctrl+C or ⌘C.');}};
async function transfer(op) {
  const version=routeVersion,activeEditor=editor;
  try {
    const original=await native();
    if(version!==routeVersion || editor!==activeEditor)return;
    if(original.error)throw Error(original.error);
    if(op==='pull'){
      if(original.language!==language || original.code!==editor.getValue()){
        if(!confirm('Replace the Codefield '+languages[original.language]+' draft with the current LeetCode code?'))return;
        switchLanguage(original.language,original.code);editor.setValue(original.code);
      }
      notice('Imported from the LeetCode editor.');
    }else{
      if(original.language!==language)throw Error('Select '+languages[language]+' on LeetCode first.');
      if(original.code!==editor.getValue()){
        if(!confirm('Replace the code in LeetCode with this draft? You can undo it in LeetCode.'))return;
        const written=await native('write',original.code);
        if(version!==routeVersion)return;
        if(written.error)throw Error(written.error);
      }
      notice('Draft is in LeetCode. Use its Submit button when ready.');
    }
  }catch(error){if(version===routeVersion)notice(error.message);}
}
$('pull').onclick=()=>transfer('pull');$('push').onclick=()=>transfer('push');
syncTab().catch(error=>notice(error.message));

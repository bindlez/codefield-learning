import {createEditor} from './app/workspace-editor.js';
import {languages} from './app/languages.js';
import {testsFromProblem} from './app/judge.js';
import {problemStarter} from './app/problem-starter.js';
import {problems} from './app/problems.js';
import {localLanguages,compilerOrigin,runExample,outcome,sandboxRunner} from './execution.js';
import {nativeEditor} from './native-editor.js';
import {completionContext} from './src/completion.js';
import {completeWithRuntime} from './app/shared-completion.js';
import {inferContext} from './src/inference.js';
import {loadQuestion} from './question-bridge.js';

const $=id=>document.getElementById(id);
const execute=sandboxRunner($('runner'));
const notice=text=>{$('notice').textContent=text;};
let context,editor,problem,plan,language,routeVersion=0,runVersion=0,timer,controller,playback,steps=[];
let observedBindings={},methodItems=[],methodRevision=0,methodTimer,selectedMethod='',latestReturn=null;
const enabledRemote=new Set();
const draftKey=()=>['codefield',context.slug,language].join('.');
const read=key=>localStorage.getItem(key);
function save(key,value) {
  try {localStorage.setItem(key,value);} catch {notice('Browser storage is full. Save a copy with Download.');}
}
function cancel() {
  clearTimeout(timer);controller?.abort();runVersion++;
  stopPlayback();$('editor').style.removeProperty('--trace-top');
  observedBindings={};
  if($('variables').querySelector('.variable'))$('values-caption').textContent='Previous run · updating';
  steps=[];$('replay').hidden=true;$('console').hidden=true;
}
function typeName(type) {
  const key=String(type || '').toLowerCase();
  if(key.endsWith('[]') || ['array','list','tuple','vec'].includes(key))return 'Array';
  return {str:'String',string:'String',dict:'Hash',hash:'Hash',set:'Set',frozenset:'Set',int:'Integer',integer:'Integer',number:'Integer',float:'Float',double:'Float',map:'Map',bool:'Boolean',boolean:'Boolean'}[key] || type;
}
function bindings() {
  const result={};
  for(const param of plan?.params || [])if(param.name && param.type)result[param.name]=typeName(param.type);
  if(language==='ruby' && editor){
    for(const match of editor.getValue().matchAll(/^\s*#\s*@param\s+\{([^}]+)\}\s+([A-Za-z_]\w*)/gm)){
      if(!result[match[2]])result[match[2]]=typeName(match[1]);
    }
  }
  return {...result,...observedBindings};
}
function clearValues() {
  observedBindings={};latestReturn=null;$('values-caption').textContent='Waiting for a run';
  $('variables').replaceChildren();
  const message=document.createElement('p');message.textContent='Values appear as your example runs.';$('variables').append(message);
  $('live-return').hidden=true;$('live-return').textContent='';
}
function renderVariables(item,index) {
  const previous=new Map((steps[index-1]?.variables || []).map(value=>[value.name,value.value]));
  const variables=$('variables');variables.replaceChildren();
  observedBindings={};
  for(const value of item.variables || []) {
    if(typeof value.name!=='string')continue;
    observedBindings[value.name]=typeName(value.type);
    const card=document.createElement('div');card.className='variable';
    if(previous.has(value.name) && previous.get(value.name)!==value.value)card.classList.add('changed');
    const name=document.createElement('strong');name.textContent=value.name;
    const type=document.createElement('small');type.textContent=value.type || 'Value';
    const content=document.createElement('code');content.textContent=String(value.value ?? 'null');
    card.append(name,type,content);variables.append(card);
  }
  if(!variables.childElementCount){const message=document.createElement('p');message.textContent=item.detail || 'No local variables observed at this step.';variables.append(message);}
  const eventLabel=item.event==='return'?'Return':item.event==='exit'?'Method exit':item.event==='line'?'Before line '+item.line:item.event;
  $('values-caption').textContent=eventLabel+' · '+(index+1)+' / '+steps.length;
  const returned=item.event==='return' && item.result!==null && item.result!==undefined;
  $('live-return').hidden=latestReturn===null && !returned;
  $('live-return').textContent=[latestReturn===null?'':'Example returned '+latestReturn,returned?'This step returned '+item.result:''].filter(Boolean).join(' · ');
}
function renderMethods() {
  const list=$('method-list'),query=$('method-search').value.toLowerCase();
  list.replaceChildren();
  for(const item of methodItems.filter(entry=>!entry.label.startsWith('_') && entry.label.toLowerCase().includes(query))){
    const button=document.createElement('button');button.type='button';button.textContent=item.label;
    button.setAttribute('aria-pressed',String(item.label===selectedMethod));
    button.onclick=()=>{selectedMethod=item.label;editor.inspectMethod(item.label,item.receiverType || item.preview?.owner,item);renderMethods();};
    list.append(button);
  }
  if(!list.childElementCount){const message=document.createElement('small');message.textContent=methodItems.length?'No matching methods.':'Type a value followed by a dot.';list.append(message);}
}
function refreshMethods() {
  clearTimeout(methodTimer);
  const revision=++methodRevision;
  if(!editor)return;
  const code=editor.getValue(),caret=editor.getCaret(),current=completionContext(code,caret);
  if(!current){methodItems=[];$('method-context').textContent='Type a dot to explore';$('method-path').replaceChildren();renderMethods();return;}
  $('method-context').textContent=current.receiver+' methods';
  $('method-path').replaceChildren(...[current.receiver,...current.chain].map((part,index)=>{
    const chip=document.createElement('span');
    const inferred=inferContext(code,caret,language,current.receiver,current.chain.slice(0,index),bindings());
    chip.textContent=part+(inferred && !inferred.unknown?' · '+inferred.type:'');
    return chip;
  }));
  methodTimer=setTimeout(async()=>{
    const methods=await completeWithRuntime(language,code,caret,{...current,prefix:''},bindings()).catch(()=>[]);
    if(revision!==methodRevision || !editor || editor.getValue()!==code || editor.getCaret()!==caret)return;
    methodItems=methods;renderMethods();
  },120);
}
function showReference(reference) {
  selectedMethod=reference.method;
  $('method-name').textContent=reference.signature || (reference.type?reference.type+' · ':'')+reference.method;
  $('method-description').textContent=reference.description;
  $('method-example').textContent=reference.example || '';$('method-example-card').hidden=!reference.example;
  $('method-preview').textContent=reference.preview || '';
  $('method-reference').href=reference.url;$('method-reference').hidden=!reference.url;
  renderMethods();
}
$('method-search').oninput=renderMethods;
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
  clearTimeout(methodTimer);methodRevision++;methodItems=[];selectedMethod='';clearValues();renderMethods();
  editor?.destroy();
  editor=createEditor($('editor'),{language,label:'LeetCode solution',value,autoIndent:true,completionOverlay:true,modelOpen:true,compactModel:true,getBindings:bindings,
    onReferenceUpdate:showReference,onReferenceMethods:(items,reference)=>{methodItems=items;$('method-context').textContent=reference.receiver+' methods';renderMethods();},
    onCompletionHighlight:()=>refreshMethods(),onChange:changed,onSetValue:changed});
  document.querySelector('.semantic-panel summary').textContent='Code Map';
  function changed(source) {save(draftKey(),source);schedule();refreshMethods();}
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
  renderVariables(item,index);
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
      latestReturn=result.error?null:(JSON.stringify(result.actual) ?? 'undefined');
      $('verdict').textContent=outcome(result,current.tests[0],current.returns?.type,context.slug)+(steps.length===120?' · First 120 steps':'');
      $('replay').hidden=!steps.length;$('step').max=steps.length || 1;
      if(steps.length){drawStep(steps.length-1);refreshMethods();}
      else {$('values-caption').textContent=result.error?($('variables').querySelector('.variable')?'Previous run · latest failed':'Run failed'):'No variable checkpoints';$('live-return').hidden=!!result.error;$('live-return').textContent=result.error || 'Example returned '+latestReturn;}
      $('console').hidden=!result.logs?.length;
      $('console').querySelector('pre').textContent=(result.logs || []).join('\n').slice(0,10000);
    } catch(error) {if(version===runVersion){$('verdict').textContent=error.message;$('values-caption').textContent=$('variables').querySelector('.variable')?'Previous run · latest failed':'Run failed';$('live-return').hidden=true;}}
  },origin?1350:650);
}
async function openProblem(tabId,slug) {
  const version=++routeVersion;
  const sameTabNavigation=context?.tabId===tabId && context.slug!==slug;
  cancel();editor?.destroy();editor=null;context=slug?{tabId,slug}:null;
  $('reconnect').hidden=true;
  $('workspace').hidden=true;$('title').textContent=slug?'Opening '+slug.replaceAll('-',' '):'Open a LeetCode problem';
  notice(slug?'Loading the problem and current draft…':'Visit a problem on leetcode.com to start tracing.');
  if(!slug)return;
  const [live,initial]=await Promise.all([
    loadQuestion(chrome,tabId,slug).catch(()=>null),
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
  $('reconnect').hidden=!!live;
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
$('reconnect').onclick=()=>{if(context)openProblem(context.tabId,context.slug).catch(error=>notice(error.message));};
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

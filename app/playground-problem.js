import {practiceData} from './practice-data.js';
import {testsFromProblem,createJudgeRunner} from './judge.js';
import {describeExamplesTrace} from './multilang-judge.js';
import {instrumentPracticeJavaScript} from './trace.js';
import {interpretedExample} from './interpreted-examples.js';
import {compiledScript} from './compiled-practice.js';
import {runProgram} from './languages.js';
import {textOf} from './sanitize.js';
import {variants} from './variants.js';
import {problemStarter} from './problem-starter.js';

const key='codefield.practice.v1';
function draftKey(slug,language,variant=false){return slug+(language==='javascript'?'':':'+language)+(variant?':harder':'');}
function readStore(){try{return JSON.parse(localStorage.getItem(key) || '{}');}catch{return {};}}

export function initPlaygroundProblem({editor,language,changeLanguage,backup}) {
  let active=null, runner=null, controller=null, revision=0, checkTimer=null;
  const remoteConsent=new Set();
  const isRemote=lang=>['rust','cpp','csharp','java','crystal','go','elixir'].includes(lang);
  const bar=document.createElement('section');
  bar.className='playground-problem panel';bar.hidden=true;
  bar.innerHTML='<div><strong></strong><p></p></div><div class="problem-handoff-actions"><button type="button" data-check>Check examples</button><button type="button" data-remote hidden>Enable remote auto-check</button><a data-return>Continue in practice →</a><button type="button" data-close>Close problem</button></div><pre role="status"></pre><details data-trace hidden><summary>Live trace</summary><div class="trace-navigation"><button type="button" data-prev aria-label="Previous trace step">←</button><span role="status"></span><button type="button" data-next aria-label="Next trace step">→</button></div><pre></pre></details>';
  document.querySelector('.learning-shortcuts').after(bar);
  const title=bar.querySelector('strong'), statement=bar.querySelector('p'), output=bar.querySelector('pre'), link=bar.querySelector('[data-return]');
  const trace=bar.querySelector('[data-trace]'),traceOutput=trace.querySelector('pre'),stepStatus=trace.querySelector('span');
  let steps=[],stepIndex=0;
  function clearTrace(){steps=[];stepIndex=0;trace.hidden=true;traceOutput.textContent='';}
  function setTrace(text){
    traceOutput.textContent=text;
    steps=text.split('\n').flatMap(line=>{
      const match=/^\[(?:line (\d+)|step (\d+)\]|step\] L(\d+))/.exec(line);
      return match?[{line:Number(match[1] || match[2] || match[3]),text:line}]:[];
    });
    stepIndex=0;trace.hidden=!text.trim();
    stepStatus.textContent=steps.length?steps.length+' observed steps':'Program output';
  }
  function showStep(){
    const step=steps[stepIndex];if(!step)return;
    stepStatus.textContent=(stepIndex+1)+' / '+steps.length+' · '+step.text;
    const current=editor(),lines=current.getValue().split('\n');
    if(step.line<1 || step.line>lines.length)return;
    const start=lines.slice(0,step.line-1).reduce((sum,line)=>sum+line.length+1,0);
    current.selectRange(start,start+lines[step.line-1].length);
  }
  trace.querySelector('[data-prev]').onclick=()=>{stepIndex=Math.max(0,stepIndex-1);showStep();};
  trace.querySelector('[data-next]').onclick=()=>{stepIndex=Math.min(steps.length-1,stepIndex+1);showStep();};
  function saveDraft(){
    if(!active || language()!==active.language)return false;
    try{const store=readStore();store.drafts??={};store.drafts[draftKey(active.problem.slug,active.language,active.variant)]=editor().getValue();localStorage.setItem(key,JSON.stringify(store));return true;}
    catch{output.textContent='Could not save this draft. Copy it before leaving.';return false;}
  }
  function close(){
    revision++;clearTimeout(checkTimer);runner?.dispose();runner=null;controller?.abort();controller=null;active=null;bar.hidden=true;
    const url=new URL(location.href);url.searchParams.delete('problem');url.searchParams.delete('language');url.searchParams.delete('variant');history.replaceState(null,'',url);
  }
  async function open(slug,lang,variant){
    const current=++revision;
    clearTimeout(checkTimer);
    runner?.dispose();runner=null;controller?.abort();controller=null;
    clearTrace();
    bar.querySelector('[data-check]').disabled=false;
    try{
      const problem=await practiceData('problem',{slug});if(current!==revision)return;
      const plan=testsFromProblem(problem), store=readStore();
      variant=variant && !!variants[problem.slug];
      if(variant)plan.tests=variants[problem.slug].tests.map(test=>({...test,known:true}));
      const draft=store.drafts?.[draftKey(problem.slug,lang,variant)];
      const code=draft ?? problemStarter(problem,plan,lang);
      backup('Before opening '+problem.title);
      active=null;
      if(language()!==lang)changeLanguage(lang);
      editor().setValue(code);active={problem,plan,language:lang,variant};
      title.textContent=problem.title+(variant?' · '+variants[problem.slug].title:'');statement.textContent=variant?variants[problem.slug].description:textOf(problem.content || '').slice(0,1800);
      link.href='./practice.html?mode=problem&p='+encodeURIComponent(problem.slug)+'&language='+encodeURIComponent(lang)+(variant?'&variant=harder':'');
      bar.querySelector('[data-check]').textContent=isRemote(lang)?'Check examples remotely':'Check examples';
      bar.querySelector('[data-remote]').hidden=!isRemote(lang)||remoteConsent.has(lang);
      output.textContent=!plan.tests.length?'Open the problem in practice to load supported examples.':isRemote(lang)&&!remoteConsent.has(lang)?'Enable remote auto-check to send your code to the compiler as you pause.':'Checking published examples after you pause…';
      const url=new URL(location.href);url.searchParams.set('problem',problem.slug);url.searchParams.set('language',lang);if(variant)url.searchParams.set('variant','harder');else url.searchParams.delete('variant');history.replaceState(null,'',url);
      bar.hidden=false;editor().focus();
      scheduleCheck();
    }catch(error){bar.hidden=false;title.textContent='Could not open problem';output.textContent=error.message;}
  }
  function scheduleCheck(){
    clearTimeout(checkTimer);
    if(!active?.plan.tests.length)return;
    const remote=isRemote(active.language);
    if(remote&&!remoteConsent.has(active.language))return;
    checkTimer=setTimeout(check,remote?3500:1500);
  }
  async function check(){
    if(!active)return;
    runner?.dispose();runner=null;controller?.abort();controller=null;
    const task=active, code=editor().getValue(), current=++revision;
    if(!task.plan.tests.length){output.textContent='No runnable published examples are available for this problem.';return;}
    output.textContent='Checking published examples…';bar.querySelector('[data-check]').disabled=true;
    try{
      let results,error,traceText='';
      if(task.language==='javascript'){
        runner?.dispose();runner=createJudgeRunner();
        const checked=await runner.run({code:instrumentPracticeJavaScript(code).code,functionName:task.plan.functionName,params:task.plan.params,returns:task.plan.returns,tests:task.plan.tests.map(t=>({args:t.args,expected:t.known===false?undefined:t.expected}))});
        error=checked.report.loadError;results=checked.results;
        traceText=results.flatMap((row,i)=>['Example '+(i+1),...(row.logs || [])]).join('\n');
      }else{
        controller=new AbortController();
        const source=isRemote(task.language)?compiledScript(task.language,code,task.plan,true):interpretedExample(task.language,code,task.plan);
        if(!source){output.textContent='This signature needs a custom test call. Continue in practice for more options.';return;}
        const checked=await runProgram(task.language,source,{signal:controller.signal});
        if(current!==revision || active!==task || code!==editor().getValue())return;
        if(!checked.ok){output.textContent=checked.error || 'Execution failed.';return;}
        const preview=describeExamplesTrace(checked,task.plan.tests,task.plan.returns?.type);
        error=preview.results?null:preview.verdict;results=preview.results;
        traceText=preview.text;
      }
      if(current!==revision || active!==task || code!==editor().getValue())return;
      if(error){output.textContent=error;return;}
      setTrace(traceText);
      const known=results.filter(row=>row.passed!==null),passes=known.filter(row=>row.passed).length;
      output.textContent=passes+'/'+known.length+' published examples pass\n'+results.map((row,i)=>'Example '+(i+1)+' · '+(row.passed===null?'self-check':row.passed?'passes':'needs work')+' · returned '+JSON.stringify(row.actual)+(row.passed===false?' · expected '+JSON.stringify(row.expected):'')).join('\n');
    }catch(error){if(current===revision)output.textContent=error.message;}
    finally{if(current===revision)bar.querySelector('[data-check]').disabled=false;}
  }
  bar.querySelector('[data-check]').onclick=()=>{clearTimeout(checkTimer);check();};
  bar.querySelector('[data-remote]').onclick=()=>{if(!active)return;remoteConsent.add(active.language);bar.querySelector('[data-remote]').hidden=true;output.textContent='Remote auto-check enabled for '+active.language+'.';scheduleCheck();};
  bar.querySelector('[data-close]').onclick=close;
  link.onclick=event=>{if(!saveDraft()){event.preventDefault();return;} };
  const params=new URLSearchParams(location.search),slug=params.get('problem'),lang=params.get('language');
  if(slug && ['javascript','ruby','python','rust','cpp','csharp','java','crystal','go','elixir'].includes(lang))open(slug,lang,params.get('variant')==='harder');
  return {onEdit(){if(active){revision++;runner?.dispose();runner=null;controller?.abort();controller=null;clearTrace();bar.querySelector('[data-check]').disabled=false;saveDraft();output.textContent=isRemote(active.language)&&!remoteConsent.has(active.language)?'Draft saved. Enable remote auto-check to send code to the compiler as you pause.':'Draft saved. Checking examples after you pause…';scheduleCheck();}},onLanguageChange(){if(active && language()!==active.language){const {problem,variant}=active,lang=language();active=null;revision++;clearTimeout(checkTimer);runner?.dispose();runner=null;controller?.abort();controller=null;queueMicrotask(()=>open(problem.slug,lang,variant));}}};
}

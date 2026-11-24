import {practiceData} from './practice-data.js';
import {testsFromProblem,createJudgeRunner} from './judge.js';
import {runExamples} from './multilang-judge.js';
import {textOf} from './sanitize.js';
import {variants} from './variants.js';

const key='codefield.practice.v1';
function draftKey(slug,language,variant=false){return slug+(language==='javascript'?'':':'+language)+(variant?':harder':'');}
function readStore(){try{return JSON.parse(localStorage.getItem(key) || '{}');}catch{return {};}}

export function initPlaygroundProblem({editor,language,changeLanguage,backup}) {
  let active=null, runner=null, revision=0;
  const bar=document.createElement('section');
  bar.className='playground-problem panel';bar.hidden=true;
  bar.innerHTML='<div><strong></strong><p></p></div><div class="problem-handoff-actions"><button type="button" data-check>Check examples</button><a data-return>Continue in practice →</a><button type="button" data-close>Close problem</button></div><pre role="status"></pre>';
  document.querySelector('.learning-shortcuts').after(bar);
  const title=bar.querySelector('strong'), statement=bar.querySelector('p'), output=bar.querySelector('pre'), link=bar.querySelector('[data-return]');
  function saveDraft(){
    if(!active || language()!==active.language)return false;
    try{const store=readStore();store.drafts??={};store.drafts[draftKey(active.problem.slug,active.language,active.variant)]=editor().getValue();localStorage.setItem(key,JSON.stringify(store));return true;}
    catch{output.textContent='Could not save this draft. Copy it before leaving.';return false;}
  }
  function close(){
    revision++;runner?.dispose();runner=null;active=null;bar.hidden=true;
    const url=new URL(location.href);url.searchParams.delete('problem');url.searchParams.delete('language');url.searchParams.delete('variant');history.replaceState(null,'',url);
  }
  async function open(slug,lang,variant){
    const current=++revision;
    try{
      const problem=await practiceData('problem',{slug});if(current!==revision)return;
      const plan=testsFromProblem(problem), store=readStore();
      variant=variant && !!variants[problem.slug];
      if(variant)plan.tests=variants[problem.slug].tests.map(test=>({...test,known:true}));
      const snippets={javascript:'javascript',ruby:'ruby',python:'python3',rust:'rust',cpp:'cpp',csharp:'csharp',java:'java',crystal:'crystal'};
      const draft=store.drafts?.[draftKey(problem.slug,lang,variant)];
      const code=draft ?? problem.snippets?.[snippets[lang]] ?? (lang==='javascript'?problem.starter:'') ?? '';
      backup('Before opening '+problem.title);
      if(language()!==lang)changeLanguage(lang);
      editor().setValue(code);active={problem,plan,language:lang,variant};
      title.textContent=problem.title+(variant?' · '+variants[problem.slug].title:'');statement.textContent=variant?variants[problem.slug].description:textOf(problem.content || '').slice(0,1800);
      link.href='./practice.html?mode=problem&p='+encodeURIComponent(problem.slug)+'&language='+encodeURIComponent(lang)+(variant?'&variant=harder':'');
      output.textContent=plan.tests.length?'Published examples are ready to check.':'Open the problem in practice to load supported examples.';
      bar.hidden=false;editor().focus();
    }catch(error){bar.hidden=false;title.textContent='Could not open problem';output.textContent=error.message;}
  }
  async function check(){
    if(!active)return;
    const task=active, code=editor().getValue(), current=++revision;
    if(!task.plan.tests.length){output.textContent='No runnable published examples are available for this problem.';return;}
    output.textContent='Checking published examples…';bar.querySelector('[data-check]').disabled=true;
    try{
      let results,error;
      if(task.language==='javascript'){
        runner?.dispose();runner=createJudgeRunner();
        const checked=await runner.run({code,functionName:task.plan.functionName,params:task.plan.params,returns:task.plan.returns,tests:task.plan.tests.map(t=>({args:t.args,expected:t.known===false?undefined:t.expected}))});
        error=checked.report.loadError;results=checked.results;
      }else{
        const checked=await runExamples(task.language,code,task.plan);
        if(!checked){output.textContent='This signature needs a custom test call. Continue in practice for more options.';return;}
        error=checked.error;results=checked.results;
      }
      if(current!==revision || active!==task || code!==editor().getValue())return;
      if(error){output.textContent=error;return;}
      const known=results.filter(row=>row.passed!==null),passes=known.filter(row=>row.passed).length;
      output.textContent=passes+'/'+known.length+' published examples pass\n'+results.map((row,i)=>'Example '+(i+1)+' · '+(row.passed===null?'self-check':row.passed?'passes':'needs work')+' · returned '+JSON.stringify(row.actual)+(row.passed===false?' · expected '+JSON.stringify(row.expected):'')).join('\n');
    }catch(error){if(current===revision)output.textContent=error.message;}
    finally{if(current===revision)bar.querySelector('[data-check]').disabled=false;}
  }
  bar.querySelector('[data-check]').onclick=check;
  bar.querySelector('[data-close]').onclick=close;
  link.onclick=event=>{if(!saveDraft()){event.preventDefault();return;} };
  const params=new URLSearchParams(location.search),slug=params.get('problem'),lang=params.get('language');
  if(slug && ['javascript','ruby','python','rust','cpp','csharp','java','crystal'].includes(lang))open(slug,lang,params.get('variant')==='harder');
  return {onEdit(){if(active){revision++;runner?.dispose();runner=null;bar.querySelector('[data-check]').disabled=false;saveDraft();output.textContent='Draft saved. Check examples when ready.';}},onLanguageChange(){if(active && language()!==active.language)close();}};
}

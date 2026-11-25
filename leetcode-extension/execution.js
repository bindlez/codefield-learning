import {buildJudgeSource,compareValues} from './app/judge.js';
import {interpretedExample} from './app/interpreted-examples.js';
import {compiledScript} from './app/compiled-practice.js';
import {runProgram} from './app/languages.js';
import {parse} from './src/vendor/acorn.js';
import {traceJavaScript} from './src/javascript-trace.js';
import {instrumentStructured} from './structured-trace.js';

export const localLanguages = new Set(['javascript','ruby','python']);
export function compilerOrigin(language) {
  if (language === 'rust') return 'https://play.rust-lang.org/*';
  if (['cpp','csharp','java','go','crystal'].includes(language)) return 'https://godbolt.org/*';
  return null;
}
const assets = new Map();
function asset(file, text=false) {
  if (!assets.has(file)) assets.set(file,fetch(file).then(response => {
    if (!response.ok) throw Error('Missing bundled runtime file '+file);
    return text ? response.text() : response.arrayBuffer();
  }).catch(error => {assets.delete(file);throw error;}));
  return assets.get(file);
}
export function sandboxRunner(frame) {
  let resolveReady;
  const ready = new Promise(resolve => {resolveReady=resolve;});
  let pending, sequence=0;
  window.addEventListener('message',event => {
    if (event.source !== frame.contentWindow || event.origin !== 'null') return;
    if (event.data?.ready) resolveReady();
    else if (pending && event.data?.id===pending.id) pending.finish(event.data);
  });
  frame.src='sandbox.html';
  return async function execute(language,code,probe,signal) {
    const scripts=language==='ruby'?['vendor/ruby.js']:language==='python'?['vendor/pyodide.js','vendor/pyodide.asm.js']:[];
    const resources=language==='ruby'?['ruby.wasm']:language==='python'?['pyodide-lock.json','pyodide.asm.wasm','python_stdlib.zip']:[];
    let startupTimer;
    const startup=new Promise((_,reject)=>{startupTimer=setTimeout(()=>reject(Error('Could not load the bundled runner. Reload the extension and reopen the panel.')),15000);});
    const [parts,files] = await Promise.race([startup,Promise.all([
      Promise.all([...scripts,'local-worker.js'].map(path=>asset(path,true))),
      Promise.all(resources.map(async name=>[name,await asset('vendor/'+name)])),ready
    ])]).finally(()=>clearTimeout(startupTimer));
    signal.throwIfAborted();
    return new Promise((resolve,reject) => {
      const id=++sequence;
      const abort=()=>{ frame.contentWindow.postMessage({id},'*'); finish(null); };
      function finish(data) {
        clearTimeout(timer);signal.removeEventListener('abort',abort);pending=null;
        if(data)resolve(data);else reject(Error('Run cancelled.'));
      }
      const timer=setTimeout(()=>{frame.contentWindow.postMessage({id},'*');finish({error:'The runner did not answer.'});},12000);
      pending={id,finish};signal.addEventListener('abort',abort,{once:true});
      frame.contentWindow.postMessage({id,script:parts.join('\n;\n'),payload:{language,code,probe,files:Object.fromEntries(files)}},'*');
    });
  };
}

export async function runExample({language,source,plan,signal,execute}) {
  const test=plan.tests[0];
  if(language==='javascript') {
    const {code,probe}=traceJavaScript(source,parse);
    const raw=await execute(language,buildJudgeSource({...plan,code,boundedLogs:true}),probe,signal);
    const row=raw.report?.results?.[0];
    return {steps:raw.steps || [],omitted:raw.omitted,actual:row?.actual,logs:row?.logs || [],error:raw.error || raw.report?.report?.loadError || row?.error};
  }
  let result;
  if(localLanguages.has(language)) {
    const code=interpretedExample(language,source,plan,{instrument:instrumentStructured});
    if (!code) throw Error('Live tracing for this problem needs a supported function signature. Try a custom example with plain values.');
    result=await execute(language,code,null,signal);
  } else {
    const code=compiledScript(language,source,plan,true);
    if (!code) throw Error('This compiler harness supports functions with scalar and array examples.');
    result=await runProgram(language,code,{signal});
  }
  const steps=[],logs=[];let actual,returned=false;
  for (const line of (result.output || '').split(/\r?\n/)) {
    if (line.startsWith('__CODEFIELD_TRACE__')) {
      try {
        const step=JSON.parse(line.slice('__CODEFIELD_TRACE__'.length));
        if(Number.isInteger(step.line) && Array.isArray(step.variables)) {
          step.detail=step.variables.map(item=>item.name+' = '+item.value).join('\n')+(step.event==='return'?'\n→ '+step.result:'');
          steps.push(step);
        }
      } catch { logs.push('A trace step could not be read.'); }
    } else if (line.startsWith('__CODEFIELD_CASE__')) {
      try { actual=JSON.parse(line.slice('__CODEFIELD_CASE__'.length));returned=true; } catch {}
    } else {
      const m=/^\[(?:line |step )(\d+)\]\s*(.*)$|^\[step\]\s*L(\d+)\s*(.*)$/.exec(line);
      if (m) steps.push({line:Number(m[1] || m[3]),event:m[1]?'before':'step',detail:m[2] || m[4] || ''});
      else if (line) logs.push(line);
    }
  }
  const error=(result.error || (!returned?'The example did not return a readable result.':'')).replace(/\x1b\[[0-9;]*[A-Za-z]/g,'');
  return {actual,steps,logs,error};
}

export function outcome(result,test,type,slug) {
  if(result.error)return result.error;
  const text=JSON.stringify(result.actual) ?? 'undefined';
  if(!test.known)return 'Returned '+text;
  const unordered=slug==='two-sum' && Array.isArray(result.actual) && Array.isArray(test.expected);
  const ordered=v=>unordered?[...v].sort((a,b)=>a-b):v;
  return compareValues(ordered(result.actual),ordered(test.expected),type)
    ? 'Matches example · '+text : 'Returned '+text+' · Example expects '+JSON.stringify(test.expected);
}

import {tokenizeJavaScript} from '../src/languages/javascript.js';
import {tokenizeRuby} from '../src/languages/ruby.js';
import {tokenizePython} from '../src/languages/python.js';
import {tokenizeRust} from '../src/languages/rust.js';
import {tokenizeCpp} from '../src/languages/cpp.js';
import {rustProgram} from './rust-snippet.js';
import {cppProgram} from './cpp-snippet.js';
import {tokenizeGo,tokenizeElixir} from '../src/languages/go-elixir.js';

export const languages = {javascript:'JavaScript', ruby:'Ruby', python:'Python', rust:'Rust', cpp:'C++', csharp:'C#',java:'Java',crystal:'Crystal',go:'Go',elixir:'Elixir'};
export const tokenizers = {javascript:tokenizeJavaScript, ruby:tokenizeRuby, python:tokenizePython, rust:tokenizeRust, cpp:tokenizeCpp, csharp:tokenizeCpp,java:tokenizeCpp,crystal:tokenizeRuby,go:tokenizeGo,elixir:tokenizeElixir};
export function languageOptions(select, selected = 'javascript') {
  for (const [id, name] of Object.entries(languages)) select.add(new Option(name, id));
  select.value = selected;
}

export async function runProgram(language, code, {signal} = {}) {
  if (signal?.aborted) return {ok:false,error:'Cancelled.',output:''};
  if (['javascript','ruby','python'].includes(language)) {
    return new Promise(resolve => {
      let worker;
      try { worker = new Worker('./' + ({javascript:'javascript',ruby:'ruby',python:'python'}[language]) + '-worker.js', {type:'module'}); }
      catch (error) { resolve({ok:false,error:error.message,output:''}); return; }
      let settled = false;
      let timer = setTimeout(() => finish({ok:false,error:'Runtime did not start in time.',output:''}), 60000);
      const abort = () => finish({ok:false,error:'Cancelled.',output:''});
      function finish(result) { if (settled) return; settled = true; clearTimeout(timer); signal?.removeEventListener('abort', abort); worker.terminate(); resolve(result); }
      signal?.addEventListener('abort', abort, {once:true});
      if (signal?.aborted) { abort(); return; }
      worker.onerror = event => finish({ok:false,error:event.message || 'Runtime failed to load.',output:''});
      worker.onmessage = ({data}) => {
        if (data.type === 'ready') {
          clearTimeout(timer);
          timer = setTimeout(() => finish({ok:false,error:'Execution timed out.',output:''}), 10000);
          worker.postMessage({type:'run',code});
        } else if (data.type === 'result') finish(data.result);
        else if (data.type === 'failure') finish({ok:false,error:data.error,output:''});
      };
      if (language === 'ruby') worker.postMessage({type:'init'});
    });
  }
  if (language === 'elixir') return {ok:false, output:'', error:'Elixir execution is unavailable. Export your .exs file to run locally.'};
  if (!['rust','cpp','csharp','java','crystal','go'].includes(language)) return {ok:false,error:'Unsupported language.',output:''};
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, {once:true});
  if (signal?.aborted) controller.abort();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    let response;
    if (language === 'rust') response = await fetch('https://play.rust-lang.org/execute', {
      method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,
      body:JSON.stringify({channel:'stable',mode:'debug',edition:'2021',crateType:'bin',tests:false,code:rustProgram(code).code,backtrace:false})
    });
    else response = await fetch('https://godbolt.org/api/compiler/' + ({csharp:'dotnet100csharpcoreclr',cpp:'g132',java:'java26021',crystal:'crystal192',go:'gl1260'}[language]) + '/compile', {
      method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal:controller.signal,
      body:JSON.stringify({source:language === 'cpp' ? cppProgram(code).code : code,options:{userArguments:language === 'cpp' ? '-std=c++20' : '',compilerOptions:{executorRequest:true},filters:{execute:true},tools:[],libraries:[]},lang:language === 'cpp' ? 'c++' : language,allowStoreCodeDebug:false})
    });
    if (!response.ok) throw Error('Execution service returned HTTP ' + response.status);
    const result = await response.json();
    if (language === 'rust') return {ok:result.success === true,output:result.stdout || '',error:result.success ? '' : result.stderr || 'Execution failed.'};
    const lines = entries => (entries || []).map(item => item.text || '').join('\n').replace(/\x1b\[[0-9;]*[A-Za-z]/g,'');
    const output = lines(result.execResult?.stdout || result.stdout);
    const errors = [lines(result.buildResult?.stderr),lines(result.execResult?.stderr),lines(result.stderr)].filter(Boolean).join('\n');
    const exitCode = result.execResult?.code ?? (result.didExecute === true ? result.code : undefined);
    if(typeof exitCode !== 'number')return {ok:false,output,error:errors || 'The compiler did not return an execution result.'};
    return {ok:exitCode === 0,output,error:exitCode === 0 ? '' : errors || 'Compilation or execution failed.'};
  } catch(error) {
    return {ok:false,output:'',error:error.name === 'AbortError' ? 'Execution timed out.' : error.message};
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}

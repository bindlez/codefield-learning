import {compareValues} from './judge.js';
import {runProgram} from './languages.js';
import {compiledScript} from './compiled-practice.js';
import {interpretedExample} from './interpreted-examples.js';

export function describeExampleTrace(result, test, returnType) {
  const lines=(result.output || '').split(/\r?\n/);
  const marker=lines.findIndex(line=>line.startsWith('__CODEFIELD_CASE__'));
  let verdict=result.ok?'Example ran':'Execution failed';
  let summary='';
  if(marker>=0){
    try {
      const actual=JSON.parse(lines[marker].slice('__CODEFIELD_CASE__'.length));
      const passed=test.known===false ? null : compareValues(actual,test.expected,returnType);
      verdict=passed===null?'Self-check':passed?'Example passes ✓':'Example does not pass';
      summary='Returned  '+JSON.stringify(actual)+(passed===null?'':'\nExpected  '+JSON.stringify(test.expected));
      lines.splice(marker,1);
    } catch { verdict='Could not read the returned value'; }
  }
  return {verdict,text:['Input  '+JSON.stringify(test.args),lines.join('\n').trim(),summary,result.error].filter(Boolean).join('\n\n').slice(0,16000)};
}

export function describeExamplesTrace(result, tests, returnType) {
  const lines=(result.output || '').split(/\r?\n/), results=[], trace=[];
  for(const line of lines){
    if(!line.startsWith('__CODEFIELD_CASE__')) { if(line)trace.push(line); continue; }
    const test=tests[results.length];
    if(!test)continue;
    try {
      const actual=JSON.parse(line.slice('__CODEFIELD_CASE__'.length));
      const passed=test.known===false?null:compareValues(actual,test.expected,returnType);
      results.push({actual,passed,expected:test.expected,input:test.args});
    } catch { return {verdict:'Could not read example output',text:trace.join('\n')}; }
  }
  const known=results.filter(row=>row.passed!==null), passed=known.filter(row=>row.passed).length;
  const verdict=result.ok ? `${passed}/${known.length} known examples pass${results.length<tests.length?' · incomplete':''}` : 'Execution failed';
  const cases=results.map((row,i)=>`Example ${i+1} · ${row.passed===null?'self-check':row.passed?'passes':'needs work'}\nInput ${JSON.stringify(row.input)}\nReturned ${JSON.stringify(row.actual)}${row.passed===null?'':'\nExpected '+JSON.stringify(row.expected)}`).join('\n\n');
  return {verdict,text:[cases,trace.join('\n'),result.error].filter(Boolean).join('\n\n').slice(0,24000),results};
}

export function buildScript(language, code, plan) {
  if (['rust','cpp','csharp','java','crystal','go','elixir'].includes(language)) return compiledScript(language,code,plan);
  return interpretedExample(language,code,plan,{trace:false});
}

export async function runExamples(language, code, plan, {signal} = {}) {
  const source = buildScript(language, code, plan);
  if (!source) return null;
  const result = await runProgram(language, source, {signal});
  if (!result.ok) return {error:result.error || result.stderr || 'Execution failed.', results:[]};
  const lines = (result.output || '').split(/\r?\n/).filter(line => line.startsWith('__CODEFIELD_CASE__'));
  if (lines.length !== plan.tests.length) return {error:'The program did not return all example results.',results:[]};
  try {
    return {results:lines.map((line,index) => {
      const actual = JSON.parse(line.slice('__CODEFIELD_CASE__'.length));
      const test = plan.tests[index];
      return {index,input:JSON.stringify(test.args),actual,expected:test.expected,passed:test.known === false ? null : compareValues(actual,test.expected,plan.returns?.type)};
    })};
  } catch(error) { return {error:'Could not read example results: ' + error.message,results:[]}; }
}

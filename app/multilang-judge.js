import {compareValues} from './judge.js';
import {runProgram} from './languages.js';
import {compiledScript} from './compiled-practice.js';

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
  if (['rust','cpp','csharp','java','crystal'].includes(language)) return compiledScript(language,code,plan);
  if (!['python','ruby'].includes(language)) return null;
  if (!plan.functionName || !plan.tests.length || !/^[A-Za-z_][\w]*$/.test(plan.functionName)) return null;
  if ([...(plan.params || []),plan.returns].some(item => /TreeNode|ListNode|Node|NestedInteger/i.test(item?.type || ''))) return null;
  const args = JSON.stringify(plan.tests.map(test => test.args));
  const escaped = JSON.stringify(args);
  if (language === 'python') return code + `
import json as __cf_json
__cf_args = __cf_json.loads(${escaped})
__cf_fn = getattr(Solution(), ${JSON.stringify(plan.functionName)}) if 'Solution' in globals() else globals()[${JSON.stringify(plan.functionName)}]
for __cf_case in __cf_args:
    print('__CODEFIELD_CASE__' + __cf_json.dumps(__cf_fn(*__cf_case)))
`;
  const rubyName = plan.functionName.replace(/([A-Z])/g, '_$1').toLowerCase();
  return code + `
require 'json'
JSON.parse(${escaped}).each do |__cf_case|
  puts '__CODEFIELD_CASE__' + JSON.generate(method(:${rubyName}).call(*__cf_case))
end
`;
}

export async function runExamples(language, code, plan) {
  const source = buildScript(language, code, plan);
  if (!source) return null;
  const result = await runProgram(language, source);
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

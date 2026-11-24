import {compareValues} from './judge.js';
import {runProgram} from './languages.js';
import {compiledScript} from './compiled-practice.js';

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

import {compiledStarter} from './compiled-starter.js';

const snippetKeys={javascript:'javascript',ruby:'ruby',python:'python3',rust:'rust',cpp:'cpp',csharp:'csharp',java:'java',crystal:'crystal',go:'golang',elixir:'elixir'};
export function problemStarter(problem,plan,language){
  const existing=(language==='javascript' && problem.starter) || problem.snippets?.[snippetKeys[language]];
  if(existing)return existing;
  if(!plan?.functionName || !/^[A-Za-z_]\w*$/.test(plan.functionName))return '';
  const params=(plan.params || []).map(p=>p.name);
  if(params.some(name=>!/^[A-Za-z_]\w*$/.test(name)))return '';
  if(language==='elixir')return 'defmodule Solution do\n  def '+plan.functionName.replace(/[A-Z]/g,c=>'_'+c.toLowerCase())+'('+params.join(', ')+') do\n    raise "Implement solution"\n  end\nend';
  if(language==='go'){
    const type=t=>t.endsWith('[]')?'[]'+type(t.slice(0,-2)):({integer:'int',double:'float64',boolean:'bool',string:'string'}[t]||'');
    if([...plan.params,plan.returns].some(p=>!type(p.type)||type(p.type).endsWith('[]')))return '';
    return 'func '+plan.functionName+'('+plan.params.map(p=>p.name+' '+type(p.type)).join(', ')+') '+type(plan.returns.type)+' {\n    panic("Implement solution")\n}';
  }
  if(language==='ruby')return 'def '+plan.functionName.replace(/[A-Z]/g,c=>'_'+c.toLowerCase())+'('+params.join(', ')+')\n  # Write your solution here\nend';
  if(language==='python')return 'class Solution:\n    def '+plan.functionName+'(self'+(params.length?', '+params.join(', '):'')+'):\n        # Write your solution here\n        pass';
  return compiledStarter(language,plan);
}

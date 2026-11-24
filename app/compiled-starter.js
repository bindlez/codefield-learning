import {starter} from './java-crystal.js';
export function compiledStarter(language,plan) {
  if(language==='java'||language==='crystal')return starter(language,plan);
  if(!['rust','cpp','csharp'].includes(language) || !plan?.functionName) return '';
  const basic={integer:['i32','int','int'],string:['String','string','string'],boolean:['bool','bool','bool'],double:['f64','double','double']};
  const index=['rust','cpp','csharp'].indexOf(language);
  function type(value) {
    if(value.endsWith('[]')) {
      const inner=type(value.slice(0,-2));
      return inner && ['Vec<'+inner+'>','vector<'+inner+'>',inner+'[]'][index];
    }
    return basic[value]?.[index];
  }
  if([...plan.params,plan.returns].some(p=>!type(p.type))) return '';
  const ret=type(plan.returns.type), name=plan.functionName;
  const params=plan.params.map(p=>index===0?p.name+': '+type(p.type):type(p.type)+' '+p.name).join(', ');
  if(index===0) return 'impl Solution {\n    pub fn '+name.replace(/[A-Z]/g,c=>'_'+c.toLowerCase())+'('+params+') -> '+ret+' {\n        todo!()\n    }\n}';
  if(index===1) return 'class Solution {\npublic:\n    '+ret+' '+name+'('+params+') {\n        return {};\n    }\n};';
  return 'public class Solution {\n    public '+ret+' '+name[0].toUpperCase()+name.slice(1)+'('+params+') {\n        throw new NotImplementedException();\n    }\n}';
}

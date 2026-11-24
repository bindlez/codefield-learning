const types={integer:['int','Int32'],double:['double','Float64'],string:['String','String'],boolean:['boolean','Bool']};
function type(lang,s){
  if(!s)return '';
  if(s.endsWith('[]')){
    const inner=type(lang,s.slice(0,-2));
    return inner && (lang==='java'?inner+'[]':'Array('+inner+')');
  }
  return types[s]?.[lang==='java'?0:1]||'';
}
const snake=s=>s.replace(/[A-Z]/g,c=>'_'+c.toLowerCase());
export function starter(lang,plan){
  if(!plan?.functionName || !/^\w+$/.test(plan.functionName) || [...plan.params,plan.returns].some(p=>!type(lang,p.type)))return '';
  const args=plan.params.map(p=>lang==='java'?type(lang,p.type)+' '+p.name:snake(p.name)+' : '+type(lang,p.type)).join(', ');
  return lang==='java'?'class Solution {\n    public '+type(lang,plan.returns.type)+' '+plan.functionName+'('+args+') {\n        throw new UnsupportedOperationException();\n    }\n}':'def '+snake(plan.functionName)+'('+args+') : '+type(lang,plan.returns.type)+'\n  raise "Implement solution"\nend';
}
function value(lang,t,v){
  if(t.endsWith('[]') && Array.isArray(v)){
    const inner=t.slice(0,-2),items=v.map(x=>value(lang,inner,x)).join(',');
    return lang==='java'?'new '+type(lang,t)+'{'+items+'}':'['+items+'] of '+type(lang,inner);
  }
  if(t==='string' && typeof v==='string'){
    const bytes=[...new TextEncoder().encode(v)];
    return lang==='java'?'new String(new byte[]{'+bytes.map(n=>'(byte)'+n).join(',')+'},java.nio.charset.StandardCharsets.UTF_8)':'String.new(Bytes['+bytes.map(n=>n+'_u8').join(',')+'])';
  }
  if(t==='boolean'&&typeof v==='boolean'||t==='integer'&&Number.isInteger(v)||t==='double'&&Number.isFinite(v))return String(v);
  throw Error('Unsupported value');
}
export function script(lang,source,plan,trace){
  if(!starter(lang,plan)||!plan.tests?.length)return null;
  const java=lang==='java',method=java?plan.functionName:snake(plan.functionName);
  if(!new RegExp('\\b'+method+'\\b').test(source))return null;
  let code=source;
  if(trace && !/\/\*|"""|<<-/.test(code)){
    code=code.split('\n').map((line,i)=>{
      if(java)return line.replace(/^(\s*(?:int|double|boolean) (\w+) = )([^;{}"']+);$/,(_,lhs,n,e)=>lhs+'CfTrace.value("L'+(i+1)+' '+n+'",'+e+');');
      return line.replace(/^(\s*)(\w+) = ([^;{}"'#]+)$/,(_,ws,n,e)=>ws+n+' = ('+e+').tap { |cf_v| cf_step("L'+(i+1)+' '+n+'",cf_v) }');
    }).join('\n');
  }
  const rows=[];
  try{for(const test of plan.tests){
    const args=plan.params.map((p,i)=>value(lang,p.type,test.args[i])).join(',');
    rows.push(java?'System.out.println("__CODEFIELD_CASE__"+CfTrace.json(new Solution().'+method+'('+args+')));':'puts "__CODEFIELD_CASE__" + '+method+'('+args+').to_json');
  }}catch{return null;}
  if(!java)return 'require "json"\nmodule CfCounter\n class_property count = 0\nend\ndef cf_step(label,value)\n if CfCounter.count < 120\n  puts "[step] #{label} = #{value}"\n  CfCounter.count += 1\n end\nend\n'+code+'\n'+rows.join('\n');
  const imports=(code.match(/^\s*import [^;]+;/gm)||[]).join('\n');
  code=code.replace(/^\s*import [^;]+;/gm,'').replace(/public\s+class\s+Solution\b/,'class Solution');
  const helper='class CfTrace {static int count;static <T>T value(String name,T v){if(count++<120)System.out.println("[step] "+name+" = "+v);return v;} static String json(Object v){if(v==null)return "null";if(v.getClass().isArray()){StringJoiner s=new StringJoiner(",","[","]");for(int i=0;i<java.lang.reflect.Array.getLength(v);i++)s.add(json(java.lang.reflect.Array.get(v,i)));return s.toString();}if(v instanceof String s){StringBuilder b=new StringBuilder().append((char)34);for(char c:s.toCharArray()){if(c<32)b.append(String.format("\\\\u%04x",(int)c));else{if(c==34||c==92)b.append((char)92);b.append(c);}}return b.append((char)34).toString();}return v.toString();}}';
  return 'import java.util.*;\n'+imports+'\nclass Main {public static void main(String[] args){'+rows.join('\n')+'}}\n'+code+'\n'+helper;
}

import {script} from './java-crystal.js';
import {goScript} from './go-practice.js';
import {elixirScript} from './elixir-practice.js';
const dialects = {
  rust: {integer:'i32',boolean:'bool',string:'String',double:'f64'},
  cpp: {integer:'int',boolean:'bool',string:'std::string',double:'double'},
  csharp: {integer:'int',boolean:'bool',string:'string',double:'double'}
};

function typeName(lang,type) {
  if (type.endsWith('[]')) {
    const nested=typeName(lang,type.slice(0,-2));
    return lang==='rust' ? 'Vec<'+nested+'>' : lang==='cpp' ? 'std::vector<'+nested+'>' : nested+'[]';
  }
  return dialects[lang][type];
}
function literal(lang,type,value) {
  if(type.endsWith('[]') && Array.isArray(value)) {
    const items=value.map(item=>literal(lang,type.slice(0,-2),item)).join(',');
    if(lang==='rust') return 'vec!['+items+']';
    return (lang==='cpp'?'':'new ')+typeName(lang,type)+'{'+items+'}';
  }
  if(type==='boolean' && typeof value==='boolean') return String(value);
  if(type==='integer' && Number.isInteger(value) && Math.abs(value)<=2147483647) return String(value);
  if(type==='double' && Number.isFinite(value)) return Number.isInteger(value)? value+'.0':String(value);
  if(type==='string' && typeof value==='string') {
    const bytes=[...new TextEncoder().encode(value)].join(',');
    if(lang==='rust') return 'String::from_utf8(vec!['+bytes+']).unwrap()';
    if(lang==='csharp') return 'System.Text.Encoding.UTF8.GetString(new byte[]{'+bytes+'})';
    const escaped=[...new TextEncoder().encode(value)].map(n=>'\\'+n.toString(8).padStart(3,'0')).join('');
    return 'std::string("'+escaped+'",'+new TextEncoder().encode(value).length+')';
  }
  throw new TypeError('Unsupported example value');
}

const cppPrelude = [
  '#include <bits/stdc++.h>', 'using namespace std;',
  'template<class T> void cf_emit(const T& v){std::cout<<std::boolalpha<<std::setprecision(17)<<v;}',
  'void cf_emit(const string& s){cout<<char(34);for(unsigned char c:s){if(c<32) cout<<"\\\\u00"<<hex<<setw(2)<<setfill(char(48))<<int(c)<<dec;else {if(c==34 || c==92)cout<<char(92);cout<<c;}}cout<<char(34);}',
  'template<class T> void cf_emit(const vector<T>& a){cout<<"[";bool first=true;for(const T& x:a){if(!first)cout<<",";cf_emit(x);first=false;}cout<<"]";}'
].join('\n');
const rustPrelude = [
  'struct Solution;',
  'trait CfJson {fn cf_json(&self)->String;}',
  'macro_rules! cf_scalar {($t:ty)=>{impl CfJson for $t {fn cf_json(&self)->String {self.to_string()}}};}',
  'cf_scalar!(i32); cf_scalar!(bool); cf_scalar!(f64);',
  'impl CfJson for String {fn cf_json(&self)->String {let mut s=String::from("\\\""); for c in self.chars(){match c {\'"\'|\'\\\\\'=>{s.push(\'\\\\\');s.push(c)}, c if (c as u32)<32=>s.push_str(&format!("\\\\u{:04x}",c as u32)), _=>s.push(c)}} s.push(\'"\');s}}',
  'impl<T:CfJson> CfJson for Vec<T>{fn cf_json(&self)->String {format!("[{}]",self.iter().map(|x|x.cf_json()).collect::<Vec<_>>().join(","))}}'
].join('\n');

function probes(lang,code) {
  // Instrument complete local initializers only. Skip multiline lexical constructs.
  if(/\/\*|\\\r?\n|R"|@"|"""|r#*"/.test(code)) return code;
  const pattern=lang==='rust'? /^(\s*let\s+(?:mut\s+)?)(\w+)(\s*(?::\s*(?:i32|usize|bool|f64))?\s*=\s*)([^;{}"']+);(\s*)$/ :
    /^(\s*(?:int|double|bool)\s+)(\w+)(\s*=\s*)([^;{}"']+);(\s*)$/;
  return code.split('\n').map((line,i)=>line.replace(pattern,(_,start,name,eq,expr,end)=>{
    const label='L'+(i+1)+' '+name;
    // Rust's generic initializer need not implement Debug. Log execution, preserve its type.
    if(lang==='rust') {
      const value=eq.includes(':')?' = {}", cf_value':'"';
      return start+name+eq+'{ let cf_value = '+expr+'; if cf_tick() { println!("[step] '+label+value+'); } cf_value };'+end;
    }
    if(lang==='csharp') return start+name+eq+'CfTrace.Value("'+label+'", '+expr+');'+end;
    return start+name+eq+'cf_value("'+label+'", ('+expr+'));'+end;
  })).join('\n');
}

export function compiledScript(lang,source,plan,trace=false) {
  if(lang==='go')return goScript(source,plan,trace);
  if(lang==='elixir')return elixirScript(source,plan);
  if(lang==='java'||lang==='crystal')return script(lang,source,plan,trace);
  if(!Object.hasOwn(dialects,lang) || !/^[A-Za-z_]\w*$/.test(plan?.functionName||'') || !plan.tests?.length) return null;
  const params=plan.params||[];
  if([...params,plan.returns].some(p=>!p || !/^(integer|string|double|boolean)(\[\])*$/.test(p.type))) return null;
  const camel=plan.functionName;
  const method=lang==='rust'?camel.replace(/[A-Z]/g,c=>'_'+c.toLowerCase()):lang==='csharp'?camel[0].toUpperCase()+camel.slice(1):camel;
  if (!new RegExp('\\b'+method+'\\s*\\(').test(source)) return null;
  const cases=[];
  for(const test of plan.tests) {
    if(test.args?.length!==params.length) return null;
    let values;
    try {values=params.map((p,i)=>literal(lang,p.type,test.args[i]));} catch {return null;}
    const declarations=values.map((value,i)=>(lang==='rust'?'let ':lang==='cpp'?'auto ':'var ')+'arg'+i+' = '+value+';').join('\n');
    const args=params.map((_,i)=>'arg'+i).join(',');
    const call=(lang==='rust'?'Solution::':lang==='cpp'?'Solution().':'new Solution().')+method+'('+args+')';
    const print=lang==='rust'?'let result='+call+'; println!("__CODEFIELD_CASE__{}",result.cf_json());':
      lang==='cpp'?'auto result='+call+'; cout<<"__CODEFIELD_CASE__"; cf_emit(result);cout<<endl;':
      'var result='+call+';System.Console.WriteLine("__CODEFIELD_CASE__"+CfOutput.Json(result));';
    cases.push('{\n'+declarations+'\n'+print+'\n}');
  }
  const code=trace?probes(lang,source):source;
  if(lang==='cpp') return cppPrelude+'\nstatic int cf_count=0; template<class T> T cf_value(const char* label,T v){if(cf_count++<120)cout<<"[step] "<<label<<" = "<<v<<endl;return v;}\n'+code+'\nint main(){'+cases.join('\n')+'}';
  if(lang==='rust') return rustPrelude+'\nfn cf_tick()->bool{use std::sync::atomic::{AtomicUsize,Ordering}; static N:AtomicUsize=AtomicUsize::new(0); N.fetch_add(1,Ordering::Relaxed)<120}\n'+code+'\nfn main(){'+cases.join('\n')+'}';
  return 'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n'+code+'\nstatic class CfTrace {static int count;public static T Value<T>(string label,T value){if(count++<120)Console.WriteLine("[step] "+label+" = "+value);return value;}}\nstatic class CfOutput {public static string Json(object v){if(v is string s)return ((char)34)+System.Text.Json.JsonEncodedText.Encode(s).ToString()+((char)34);if(v is System.Collections.IEnumerable seq)return "["+string.Join(",",seq.Cast<object>().Select(Json))+"]";if(v is bool b)return b?"true":"false";return System.Convert.ToString(v,System.Globalization.CultureInfo.InvariantCulture);}}\nclass CfProgram {static void Main(){'+cases.join('\n')+'}}';
}

// Structured integer-array algorithms. Each instruction retains its source row.
export const sample='FUNCTION total(nums)\nSET sum = 0\nFOR EACH number IN nums\n  IF number > 0\n    SET sum = sum + number\n  END IF\nEND FOR\nRETURN sum\nEND FUNCTION';
const id='[A-Za-z_][A-Za-z_0-9]*';
const rules=[
  ['map',new RegExp('^CREATE (?:an? )?empty map called ('+id+')$','i')],
  ['indexed',new RegExp('^FOR EACH ('+id+') AND ('+id+') IN ('+id+')$','i')],
  ['contains',new RegExp('^IF ('+id+') contains ('+id+')$','i')],
  ['store',new RegExp('^STORE ('+id+') and ('+id+') IN ('+id+')$','i')],
  ['pair',/^RETURN matching index, current index$/i],['empty',/^RETURN empty result$/i],
  ['function',new RegExp('^FUNCTION ('+id+')\\(('+id+')(?:,\\s*('+id+'))?\\)$','i')],
  ['each',new RegExp('^FOR EACH ('+id+') IN ('+id+')$','i')],
  ['set',new RegExp('^SET ('+id+') = (.+)$','i')],
  ['if',/^IF (.+)$/i],['return',/^RETURN (.+)$/i],['end',/^END (IF|FOR|FUNCTION)$/i]
];
function expression(text,scope){
  const tokens=text.match(/[a-z_]\w*|\d+|==|!=|>=|<=|[+*%><()-]/gi)||[];
  if(tokens.join('')!==text.replace(/\s/g,''))throw Error('Use integers, variables, parentheses and arithmetic or comparison operators.');
  for(const t of tokens)if(/^[a-z_]/i.test(t)&&!scope.has(t))throw Error('Unknown variable '+t);
  return tokens.join(' ');
}
export function parseAlgorithm(text){
  const rows=[], stack=[],scopes=[new Set()], errors=[];
  for(const [i,s] of text.split('\n').entries()){
    if(!s.trim())continue;
    try{
      const rule=rules.find(([,rx])=>rx.test(s.trim())); if(!rule)throw Error('Unknown instruction');
      const [kind,rx]=rule; const [,a,b,c]=rx.exec(s.trim());const scope=new Set(scopes.flatMap(set=>[...set]));
      if(!stack.length && (kind!=='function'||rows.length))throw Error('Start with one FUNCTION name(nums)');
      if(kind==='function' && stack.length)throw Error('Nested function');
      if(kind==='end'){
        if(stack.pop()!==a.toLowerCase())throw Error('Mismatched END '+a);
        scopes.pop();
      }
      const row={kind,line:i+1,depth:stack.length,a,b,c};
      if(kind==='function'){stack.push('function');scopes.push(new Set(c?[b,c]:[b]));}
      if(kind==='each'){if(!scope.has(b))throw Error('Unknown collection '+b);stack.push('for');scopes.push(new Set([a]));}
      if(kind==='map')scopes.at(-1).add(a);
      if(kind==='indexed'){if(!scope.has(c))throw Error('Unknown collection '+c);stack.push('for');scopes.push(new Set([a,b]));}
      if(kind==='contains'){if(!scope.has(a)||!scope.has(b))throw Error('Unknown map or key');stack.push('if');scopes.push(new Set());}
      if(kind==='store' && ![a,b,c].every(n=>scope.has(n)))throw Error('Unknown name in STORE');
      if(kind==='pair'){
        const seen=rows.findLast(r=>r.kind==='contains'&&scope.has(r.a)&&scope.has(r.b)),loop=rows.findLast(r=>r.kind==='indexed'&&scope.has(r.b));
        if(!seen||!loop)throw Error('Return this pair inside an indexed loop and map lookup');
        Object.assign(row,{a:seen.a,b:seen.b,c:loop.b});
      }
      if(kind==='set'){row.b=expression(b,scope);row.declare=!scope.has(a);scopes.at(-1).add(a);}
      if(kind==='if'||kind==='return'){row.a=expression(a,scope);if(kind==='if'){stack.push('if');scopes.push(new Set());}}
      rows.push(row);
    }catch(e){errors.push('Line '+(i+1)+' · '+e.message);break;}
  }
  if(!errors.length && (stack.length || !rows.some(r=>['pair','empty','return'].includes(r.kind))))errors.push('Complete the function with RETURN and matching END instructions.');
  return {rows,errors};
}
export function generateAlgorithm(ast,lang){
  if(ast.errors.length)return {lines:[],mapping:[]};
  const lines=[],mapping=[];
  const ruby=lang==='ruby'||lang==='crystal',py=lang==='python',rs=lang==='rust',js=lang==='javascript';
  const semi=!ruby&&!py;
  for(const r of ast.rows){
    let s='';
    if(r.kind==='function') s={
      ruby:'def '+r.a+'('+r.b+')',crystal:'def '+r.a+'('+r.b+' : Array(Int32)) : Int32',
      python:'def '+r.a+'('+r.b+'):',javascript:'function '+r.a+'('+r.b+') {',
      rust:'fn '+r.a+'('+r.b+': Vec<i32>) -> i32 {',cpp:'int '+r.a+'(const std::vector<int>& '+r.b+') {',
      csharp:'static int '+r.a+'(int[] '+r.b+') {',java:'static int '+r.a+'(int[] '+r.b+') {'
    }[lang];
    if(r.kind==='function' && r.c){
      const arg=rs?r.c+': i32':lang==='crystal'?r.c+' : Int32':(['cpp','java','csharp'].includes(lang)?'int ':'')+r.c;
      const end=lang==='crystal'?s.indexOf(') : Int32'):s.indexOf(')');
      s=s.slice(0,end)+', '+arg+s.slice(end);
    }
    if(r.kind==='set') s=(r.declare && semi?(rs?'let mut ':js?'let ':'int '):'')+r.a+' = '+r.b+(semi?';':'');
    if(r.kind==='each')s=ruby?r.b+'.each do |'+r.a+'|':py?'for '+r.a+' in '+r.b+':':rs?'for &'+r.a+' in &'+r.b+' {':js?'for (const '+r.a+' of '+r.b+') {':lang==='csharp'?'foreach (int '+r.a+' in '+r.b+') {':'for (int '+r.a+' : '+r.b+') {';
    if(r.kind==='if')s=ruby?'if '+r.a:py?'if '+r.a+':':rs?'if '+r.a+' {':'if ('+r.a+') {';
    if(r.kind==='return')s='return '+r.a+(semi?';':'');
    if(r.kind==='end')s=ruby?'end':py?'':'}';
    const indexed=ast.rows.some(row=>row.kind==='pair'||row.kind==='empty');
    if(indexed && r.kind==='function')s=s.replace('-> i32','-> Vec<i32>').replace(') : Int32',') : Array(Int32)').replace(/^int /,'std::vector<int> ').replace(/^static int /,'static int[] ');
    if(r.kind==='map')s=({ruby:r.a+' = {}',crystal:r.a+' = {} of Int32 => Int32',python:r.a+' = {}',javascript:'const '+r.a+' = new Map();',rust:'let mut '+r.a+' = std::collections::HashMap::new();',cpp:'std::unordered_map<int,int> '+r.a+';',csharp:'var '+r.a+' = new System.Collections.Generic.Dictionary<int,int>();',java:'var '+r.a+' = new java.util.HashMap<Integer,Integer>();'})[lang];
    if(r.kind==='indexed'){
      if(ruby)s=r.c+'.each_with_index do |'+r.a+', '+r.b+'|';
      else if(py)s='for '+r.b+', '+r.a+' in enumerate('+r.c+'):';
      else if(rs)s='for ('+r.b+', &'+r.a+') in '+r.c+'.iter().enumerate() {';
      else if(js)s='for (const ['+r.b+', '+r.a+'] of '+r.c+'.entries()) {';
      else s='for (int '+r.b+' = 0; '+r.b+' < '+r.c+({java:'.length',cpp:'.size()',csharp:'.Length'})[lang]+'; ++'+r.b+') { int '+r.a+' = '+r.c+'['+r.b+'];';
    }
    if(r.kind==='contains')s=ruby?'if '+r.a+'.has_key?('+r.b+')':py?'if '+r.b+' in '+r.a+':':rs?'if '+r.a+'.contains_key(&'+r.b+') {':'if ('+r.a+'.'+({cpp:'count',java:'containsKey',csharp:'ContainsKey',javascript:'has'})[lang]+'('+r.b+')) {';
    if(r.kind==='store')s=rs?r.c+'.insert('+r.a+', '+r.b+' as i32);':js||lang==='java'?r.c+'.'+(js?'set':'put')+'('+r.a+', '+r.b+');':r.c+'['+r.a+'] = '+r.b+(semi?';':'');
    if(r.kind==='pair'||r.kind==='empty'){
      const pair=r.kind==='empty'?'':(js||lang==='java'?r.a+'.get('+r.b+')':r.a+'['+(rs?'&':'')+r.b+']')+', '+r.c+(rs?' as i32':'');
      s='return '+(rs?'vec!['+pair+']':lang==='cpp'?'{'+pair+'}':['csharp','java'].includes(lang)?'new int[]{'+pair+'}':lang==='crystal'&&!pair?'[] of Int32':'['+pair+']')+(semi?';':'');
    }
    if(s){lines.push('    '.repeat(r.depth)+s);mapping.push(r.line);}
  }
  return {lines,mapping};
}

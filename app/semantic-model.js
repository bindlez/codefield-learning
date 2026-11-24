import {parsePrism} from './vendor/prism/parsePrism.js';
import {inferVariables} from '../src/inference.js';

export async function createRubyParser(bytes) {
  let instance;
  const closed=()=>8;
  const imports={fd_close:closed,fd_prestat_get:closed,fd_prestat_dir_name:closed,fd_seek:closed,fd_write:closed,
    proc_exit:code=>{throw Error('Parser stopped ('+code+')');},
    random_get:(offset,length)=>{crypto.getRandomValues(new Uint8Array(instance.exports.memory.buffer,offset,length));return 0;}};
  ({instance}=await WebAssembly.instantiate(bytes,{wasi_snapshot_preview1:imports}));
  instance.exports._initialize?.();
  return source=>parsePrism(instance.exports,new TextEncoder().encode(source));
}

export function analyzeRuby(result) {
  const nodes=[],edges=[],env=new Map();
  const unknown={type:'Unknown',confidence:'Unknown'};
  function visit(ast,scope='top level',bindings=env) {
    if(!ast) return null;
    const kind=ast.constructor.name, name=ast.name, source=ast.location.slice();
    let fact={...unknown}, inputs=[];
    const child=node=>visit(node,scope,bindings);
    if(kind==='StringNode') fact={type:'String',value:ast.unescaped.value,confidence:'Known'};
    else if(kind==='IntegerNode') fact={type:'Integer',value:Number(ast.value),confidence:'Known'};
    else if(kind==='ArrayNode') {
      inputs=ast.elements.map(child);
      fact={type:'Array',confidence:'Known'};
      if(inputs.every(n=>n && n.value!==undefined)) fact.value=inputs.map(n=>n.value);
    } else if(kind==='LocalVariableReadNode') {
      const origin=bindings.get(name); if(origin){inputs=[origin];fact={type:origin.type,value:origin.value,confidence:origin.confidence};}
    } else if(kind==='LocalVariableWriteNode') {
      const rhs=child(ast.value); inputs=[rhs];fact={type:rhs.type,value:rhs.value,confidence:rhs.confidence};
    } else if(kind==='CallNode'){
      const receiver=child(ast.receiver); if(receiver)inputs.push(receiver);
      inputs.push(...(ast.arguments_?.arguments_ || []).map(child));
      if(ast.block)inputs.push(visit(ast.block,scope+' / block',new Map(bindings)));
      if(receiver && !ast.block && !ast.arguments_ && !ast.arguments){
        if(name==='new' && ast.receiver?.constructor.name==='ConstantReadNode' && ast.receiver.name==='Set')fact={type:'Set',confidence:'Inferred'};
        if(name==='chars' && receiver.type==='String')fact={type:'Array',confidence:'Inferred',value:typeof receiver.value==='string'?[...receiver.value]:undefined};
        if(name==='tally' && receiver.type==='Array'){
          fact={type:'Hash',confidence:'Inferred'};
          if(receiver.value?.every(v=>typeof v==='string')){fact.value=Object.create(null);for(const item of receiver.value)fact.value[item]=(fact.value[item]||0)+1;}
        }
      }
      if(fact.confidence==='Unknown')bindings.clear();
    } else if(kind==='HashNode'){
      inputs=ast.elements.map(child);fact={type:'Hash',confidence:'Known'};
      if(inputs.every(n=>n.value!==undefined))fact.value=inputs.map(n=>n.value);
    } else if(kind==='AssocNode'){
      inputs=[child(ast.key),child(ast.value)];
      if(inputs.every(n=>n.value!==undefined))fact={type:'Entry',confidence:'Known',value:{key:inputs[0].value,value:inputs[1].value}};
    } else if(kind==='SymbolNode')fact={type:'Symbol',confidence:'Known',value:ast.unescaped.value};
    else {
      const isolated=/DefNode|ClassNode|ModuleNode|BlockNode/.test(kind);
      const nested=isolated?new Map():new Map(bindings);
      const place=isolated?scope+' / '+(name||kind.replace('Node','')):scope;
      inputs=ast.compactChildNodes().map(n=>visit(n,place,nested));
      if(!isolated)bindings.clear();
    }
    const node={id:ast.nodeID,kind:kind.replace(/Node$/,''),name:name||'',scope,source,line:ast.location.startLine(),...fact};
    for(const input of inputs.filter(Boolean))edges.push({from:input.id,to:node.id});
    nodes.push(node);
    if(kind==='LocalVariableWriteNode')bindings.set(name,node);
    return node;
  }
  for(const statement of result.value.statements?.body || []) {
    visit(statement);
    if(statement.constructor.name!=='LocalVariableWriteNode')env.clear();
  }
  return {nodes,edges,diagnostics:result.errors.map(e=>'Line '+e.location.startLine()+' · '+e.message)};
}

export function analyzeBasic(language,source) {
  const nodes=[...inferVariables(source,source.length,language)].map(([name,type],i)=>({id:i,kind:'Variable',name,type,confidence:'Inferred',source:name}));
  return {nodes,edges:[],diagnostics:[]};
}

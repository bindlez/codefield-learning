import {createEditor} from './workspace-editor.js';
import {parseAlgorithm,generateAlgorithm,sample} from './pseudocode.js';
import {twoSumPlan} from './algorithm-examples.js';
const $=s=>document.querySelector(s);
const key='codefield.algorithm.v1';
let state;
try{state=JSON.parse(localStorage.getItem(key)) || {};}catch{state={};}
state.outputs??=[{lang:'ruby'},{lang:'rust'}];
const save=()=>localStorage.setItem(key,JSON.stringify(state));
let ast,source; const panels=[];
function analyze(){
  ast=parseAlgorithm(source.getValue());
  $('#diagnostic').textContent=ast.errors.join('\n') || ast.rows.length+' instructions · '+ast.rows.filter(r=>r.kind==='each').length+' loops';
  for(const refresh of panels)refresh();
}
source=createEditor('#pseudo',{language:'pseudocode',minimal:true,label:'Structured pseudocode',value:state.source??sample,autoIndent:true,onChange:v=>{state.source=v;save();analyze();}});
for(const data of state.outputs){
  const panel=document.createElement('section');
  panel.innerHTML='<label>Implementation <select></select></label><button class="restore" hidden>Replace edits with generated code</button><p role="status"></p><div class="generated"></div>';
  $('#outputs').append(panel);
  const select=panel.querySelector('select'),restore=panel.querySelector('button'),note=panel.querySelector('p'),host=panel.querySelector('.generated');
  for(const lang of ['ruby','rust','cpp','csharp','crystal','javascript','python','java'])select.add(new Option(({cpp:'C++',csharp:'C#',javascript:'JavaScript'})[lang] || lang,lang));
  select.value=data.lang;
  let editor,generated;
  function mount(){
    editor?.destroy();editor=createEditor(host,{language:data.lang,label:data.lang+' implementation',autoIndent:true,value:data.edits??'',onChange:v=>{data.edits=v;save();refresh();}});
  }
  function refresh(){
    generated=generateAlgorithm(ast,data.lang);
    const manual=data.edits!==undefined;
    note.textContent=manual?'Manual edits retained. Source mapping paused.':ast.errors.length?'Correct the pseudocode to generate code.':'Linked to pseudocode';
    restore.hidden=!manual;
    if(!manual)editor.setValue(generated.lines.join('\n'));
  }
  select.onchange=()=>{if(data.edits!==undefined&&!confirm('Discard manual edits in this comparison pane?')){select.value=data.lang;return;}data.lang=select.value;delete data.edits;mount();refresh();save();};
  restore.onclick=()=>{delete data.edits;save();refresh();};
  function highlight(){
    if(data.edits!==undefined||!generated)return;
    const row=source.getValue().slice(0,source.getCaret()).split('\n').length;
    const ix=generated.mapping.indexOf(row),input=host.querySelector('textarea');
    if(ix<0){input.setSelectionRange(0,0);return;}
    const start=generated.lines.slice(0,ix).reduce((a,b)=>a+b.length+1,0);
    input.setSelectionRange(start,start+generated.lines[ix].length);
    note.textContent='Pseudocode line '+row+' → '+data.lang+' line '+(ix+1)+' · '+generated.lines[ix].trim();
  }
  for(const event of ['click','keyup','select'])$('#pseudo textarea').addEventListener(event,highlight);
  mount();panels.push(refresh);
}
analyze();
$('#interpret').onclick=()=>{
  const idea=$('#idea').value.toLowerCase();
  const suggestion=/two sum|pair.*target/.test(idea)?twoSumPlan:/sum|add|total/.test(idea)?(/positive/.test(idea)?sample:sample.replace('  IF number > 0\n','').replace('  END IF\n','')):'';
  $('#suggestion').textContent=suggestion||'Try describing a sum, or write the steps in the structured editor.';
  $('#approve').hidden=!suggestion;
};
$('#approve').onclick=()=>{source.setValue($('#suggestion').textContent);state.source=source.getValue();save();analyze();$('#approve').hidden=true;};

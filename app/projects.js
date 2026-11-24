import {createEditor} from './workspace-editor.js';
const $=s=>document.querySelector(s);
const key='codefield.projects.v1', extensions={rb:'ruby',rs:'rust',cpp:'cpp',cs:'csharp',cr:'crystal',js:'javascript',py:'python',java:'java'};
let project,editor;
try {project=JSON.parse(localStorage.getItem(key));}catch{}
project??={active:'hello.rb',files:[{path:'hello.rb',code:'word = "hello"\nchars = word.chars\ncounts = chars.tally'}]};
function save(){try{localStorage.setItem(key,JSON.stringify(project));$('#status').textContent='Saved in this browser';}catch{$('#status').textContent='Browser storage is full. Export your project.';}}
function open(path){
  const file=project.files.find(f=>f.path===path);
  if(!file)return;
  project.active=path;
  $('#files').replaceChildren(...project.files.map(f=>new Option(f.path,f.path)));
  $('#files').value=path;
  editor?.destroy();
  editor=createEditor('#editor',{language:extensions[path.split('.').at(-1)]||'text',modelOpen:true,autoIndent:true,label:path,value:file.code,onChange:v=>{file.code=v;save();}});
  save();
}
function add(path,code){
  if(!path || path.split('/').some(piece=>!piece||piece==='..') || project.files.some(f=>f.path===path)){ $('#status').textContent='Choose a unique file path.';return; }
  project.files.push({path,code});open(path);
}
$('#files').onchange=e=>open(e.target.value);
$('#add').onclick=()=>add($('#filename').value.trim(),'');
$('#import').onchange=async e=>{for(const file of e.target.files){const text=await file.text();if(file.name.endsWith('.codefield.json')){
  try{const restored=JSON.parse(text);if(!Array.isArray(restored.files)||!restored.files.length||restored.files.some(f=>typeof f.path!=='string'||typeof f.code!=='string'))throw Error();
    if(confirm('Replace the current project with the imported files?')){project=restored;open(project.files[0].path);}
  }catch{$('#status').textContent='Invalid project file.';}
}else add(file.name,text);}};
$('#export').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(project,null,2)],{type:'application/json'}));a.download='project.codefield.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
open(project.active);

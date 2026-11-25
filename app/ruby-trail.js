import {createEditor} from './workspace-editor.js';
import {runProgram} from './languages.js';

import {lessons,docs,review} from './ruby-trail-content.js';
const tracks={learn:{title:'Learn Ruby',items:lessons},review:{title:'Review challenge',items:review},docs:{title:'Documentation guide',items:docs}};
const $=id=>document.getElementById(id);let track='learn',index=0,editor,controller;const key='codefield.ruby-trail.v1';
let saved={done:{},notes:''};try{saved={...saved,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{};
function save(){try{localStorage.setItem(key,JSON.stringify(saved));}catch{$('status').textContent='Could not save progress in this browser.';}}
$('notes').value=saved.notes || ''; $('notes').oninput=()=>{saved.notes=$('notes').value;save();};
function render(){
  controller?.abort();const items=tracks[track].items;index=Math.max(0,Math.min(index,items.length-1));const item=items[index];
  $('track-title').textContent=tracks[track].title;$('kicker').textContent=tracks[track].title.toUpperCase()+' · '+(index+1)+' / '+items.length;
  $('title').textContent=item.title;$('explain').textContent=item.explain;$('visual').textContent=item.visual;$('prompt').textContent='Change the example, then run it to see what happens.';$('question').textContent=item.question;$('answer').textContent=item.answer;$('reference').href=item.url;$('output').textContent='Output appears here.';$('status').textContent='';document.querySelector('.reflection details').open=false;
  editor?.destroy();editor=createEditor($('editor'),{language:'ruby',value:item.code,label:'Ruby lesson code',autoIndent:true,modelOpen:true});
  const completed=items.filter((_,i)=>saved.done[track+':'+i]).length;$('progress').textContent=completed+' of '+items.length+' marked complete';$('lessons').replaceChildren();
  items.forEach((row,i)=>{const b=document.createElement('button');b.textContent=(saved.done[track+':'+i]?'✓  ':'')+row.title;b.setAttribute('aria-current',String(i===index));b.onclick=()=>{index=i;render();};$('lessons').append(b);});
  document.querySelectorAll('[data-track]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.track===track)));
}
document.querySelectorAll('[data-track]').forEach(b=>b.onclick=()=>{track=b.dataset.track;index=0;render();});
$('run').onclick=async()=>{controller?.abort();const current=controller=new AbortController();$('status').textContent='Starting Ruby…';const result=await runProgram('ruby',editor.getValue(),{signal:current.signal});if(current!==controller||current.signal.aborted)return;$('status').textContent=result.ok?'Finished.':'Could not run this example.';$('output').textContent=[result.output,result.stderr,result.error].filter(Boolean).join('\n') || '(no printed output)';};
$('reset').onclick=()=>{editor.setValue(tracks[track].items[index].code);};$('complete').onclick=()=>{saved.done[track+':'+index]=true;save();render();};$('next').onclick=()=>{index++;render();};$('prev').onclick=()=>{index--;render();};render();

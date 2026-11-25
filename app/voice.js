import {createEditor} from './workspace-editor.js';
import {languages, languageOptions, tokenizers, runProgram} from './languages.js';
import {parseVoiceCommand, resolveVoiceSelection, findVoiceMatches} from '../src/voice-commands.js';
import {practiceData, catalogIndex} from './practice-data.js';
import {testsFromProblem} from './judge.js';
import {buildScript, describeExampleTrace, describeExamplesTrace} from './multilang-judge.js';
import {instrumentPracticeJavaScript} from './trace.js';
import {interpretedExample} from './interpreted-examples.js';
import {createJudgeRunner} from './judge.js';
import {textOf} from './sanitize.js';
import {completionContext} from '../src/completion.js';
import {completeWithRuntime} from './shared-completion.js';
import {content} from './content.js';
import {methodGuide} from './method-guides.js';
import {problemStarter} from './problem-starter.js';
import {voiceCode} from '../src/voice-code.js';
import {findSavedFile,saveNamedFile} from './file-manager.js';
const $ = selector => document.querySelector(selector);
const language = $('#language'), status = $('#status'), output = $('#output');
const initialQuery=new URLSearchParams(location.search);
languageOptions(language, initialQuery.get('language') || localStorage.getItem('codefield.voice.language') || 'javascript');
let editor, recognition, listening = false, wantsListening = false, restartTimer, controller, pendingAction = null, pendingSnapshot = null;
let pendingMatches = null;
let suggestions=null;
let problem=null, plan=null, previewTimer, previewController, previewRunner, previewRevision=0, problemRevision=0;
const problemBox=document.createElement('section');
problemBox.className='voice-problem';
problemBox.hidden=true;
problemBox.innerHTML='<h2 id="voice-problem-title"></h2><p id="voice-problem-statement"></p><p id="voice-example"></p><a id="voice-return" href="./practice.html">Open problem workspace</a>';
document.querySelector('.voice-grid aside').prepend(problemBox);
const practiceKey='codefield.practice.v1';
function problemDraftKey() { return language.value==='javascript'?problem.slug:problem.slug+':'+language.value; }
function practiceStore() { try{return JSON.parse(localStorage.getItem(practiceKey) || '{}');}catch{return {};} }
function saveDraft(value) {
  try {
    if(!problem) localStorage.setItem('codefield.voice.draft.'+language.value,value);
    else { const store=practiceStore(); store.drafts??={}; store.drafts[problemDraftKey()]=value;localStorage.setItem(practiceKey,JSON.stringify(store)); }
  } catch {status.textContent='Could not save the draft in this browser.';}
}
function cancelPreview() { clearTimeout(previewTimer); previewRevision++; previewController?.abort(); previewController=null; previewRunner?.dispose(); previewRunner=null; }
async function loadProblem(slug) {
  cancelPreview();
  const revision=++problemRevision;
  status.textContent='Loading problem…';
  try {
    const loaded=await practiceData('problem',{slug});
    if(revision!==problemRevision)return;
    problem=loaded;plan=testsFromProblem(problem);
    $('#voice-problem-title').textContent=problem.title;
    $('#voice-problem-statement').textContent=textOf(problem.content || '').slice(0,6000);
    const example=problem.examples?.[0];
    $('#voice-example').textContent=example?'Example: '+example.input+' → '+example.output:'No published example available.';
    $('#voice-return').href='./practice.html?mode=problem&p='+encodeURIComponent(problem.slug);
    problemBox.hidden=false;
    const url=new URL(location.href);url.searchParams.set('problem',problem.slug);url.searchParams.set('language',language.value);history.replaceState(null,'',url);
    mount();updateKeyboardMode();status.textContent='Problem loaded. Say read problem or start coding.';
  } catch(error){if(revision===problemRevision)status.textContent='Could not load the problem: '+error.message;}
}
const remoteConsent = new Set();
const confirmBox=document.createElement('div'); confirmBox.hidden=true;
confirmBox.innerHTML='<button type="button" id="voice-confirm">Confirm</button> <button type="button" id="voice-cancel">Cancel</button>';
status.after(confirmBox);
function askConfirmation(action,message) { pendingAction=action; pendingSnapshot={language:language.value,code:editor.getValue(),caret:editor.getCaret(),selection:editor.getSelection()}; confirmBox.hidden=false; status.textContent=message; }
function cancelConfirmation() { pendingAction=null; pendingSnapshot=null; confirmBox.hidden=true; status.textContent='Cancelled.'; }
function confirmAction() {
  const action=pendingAction, snapshot=pendingSnapshot; pendingAction=null; pendingSnapshot=null; confirmBox.hidden=true;
  if(!snapshot || snapshot.language!==language.value || snapshot.code!==editor.getValue() || ((action==='delete' || action?.type==='replace') && (snapshot.caret!==editor.getCaret() || snapshot.selection!==editor.getSelection()))) { status.textContent='The code or selection changed; please request the action again.'; return; }
  if(action==='delete') { editor.insert(''); status.textContent='Selection deleted. Say undo to restore it.'; }
  if(action?.type==='replace') { editor.insert(action.text); status.textContent='Selection replaced. Say undo to restore it.'; }
  if(action==='run-remote') { remoteConsent.add(language.value); run(); }
}
$('#voice-confirm').onclick=confirmAction; $('#voice-cancel').onclick=cancelConfirmation;
function mount() { cancelPreview();controller?.abort(); controller=null; pendingAction=null; pendingMatches=null; confirmBox.hidden=true;
  editor?.destroy();
  const initial=problem ? (practiceStore().drafts?.[problemDraftKey()] ?? problemStarter(problem,plan,language.value)) : (localStorage.getItem('codefield.voice.draft.'+language.value) || '');
  editor = createEditor('#editor', {language:language.value,value:initial, label:'Voice workspace code', tokenize:tokenizers[language.value], autoIndent:true, onChange:value=>{controller?.abort();controller=null;saveDraft(value);queuePreview();}});
  localStorage.setItem('codefield.voice.language',language.value);
  queuePreview();
}
mount(); language.onchange = mount;
function updateKeyboardMode() {
  const input = $('#editor textarea');
  if (input) input.setAttribute('inputmode', wantsListening ? 'none' : 'text');
}
function queuePreview() {
  cancelPreview();
  const lang=language.value;
  if(!['ruby','python','javascript'].includes(lang) || !editor?.getValue().trim()) return;
  if(problem && !plan?.tests?.length){output.textContent='This problem has no runnable published examples.';return;}
  const revision=previewRevision, code=editor.getValue();
  const source=problem && lang!=='javascript'?interpretedExample(lang,code,plan):code;
  if(!source){output.textContent='This problem shape needs a custom test call.';return;}
  output.textContent='Waiting for you to pause…';
  previewTimer=setTimeout(async()=>{
    output.textContent=problem?'Checking examples…':'Running preview…';
    if(problem && lang==='javascript'){
      const runner=createJudgeRunner({timeoutMs:5000});previewRunner=runner;
      const {report,results}=await runner.run({code:instrumentPracticeJavaScript(code).code,functionName:plan.functionName,params:plan.params,returns:plan.returns,tests:plan.tests.map(test=>({args:test.args,expected:test.known===false?undefined:test.expected}))});
      if(revision!==previewRevision)return;
      runner.dispose();previewRunner=null;
      const known=results.filter(row=>row.passed!==null),passed=known.filter(row=>row.passed).length;
      output.textContent=report.loadError || passed+'/'+known.length+' known examples pass\n\n'+results.map((row,i)=>'Example '+(i+1)+' · '+(row.passed===null?'self-check':row.passed?'passes':'needs work')+'\nInput '+row.input+'\n'+(row.logs||[]).join('\n')+'\n'+(row.error?'Error '+row.error:'Returned '+JSON.stringify(row.actual)+(row.passed===null?'':'\nExpected '+JSON.stringify(row.expected)))).join('\n\n');
      return;
    }
    previewController=new AbortController();
    const result=await runProgram(lang,source,{signal:previewController.signal});
    if(revision!==previewRevision)return;
    if(problem){const preview=describeExamplesTrace(result,plan.tests,plan.returns?.type);output.textContent=preview.verdict+'\n\n'+preview.text;}
    else output.textContent=[result.output,result.stderr,result.ok?result.value:result.error].filter(Boolean).join('\n') || '(no output)';
  },1600);
}
language.addEventListener('change', updateKeyboardMode);
const spokenFeedback = $('#spoken-feedback');
spokenFeedback.disabled = !window.speechSynthesis;
function announce(message) {
  status.textContent = message;
  if (spokenFeedback.checked && window.speechSynthesis) {
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(message));
  }
}
function speak(text) {
  if(window.speechSynthesis){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text.slice(0,3000)));}
  else status.textContent='Speech playback is unavailable in this browser.';
}
async function suggestMethods() {
  const source=editor.getValue(),caret=editor.getCaret(),context=completionContext(source,caret);
  if(!context){status.textContent='Say dot after a receiver to explore its methods.';return;}
  status.textContent='Finding methods…';
  const items=await completeWithRuntime(language.value,source,caret,context);
  if(source!==editor.getValue() || caret!==editor.getCaret())return;
  suggestions={source,caret,prefix:context.prefix,items:items.slice(0,10)};
  const message=suggestions.items.length ? suggestions.items.map((item,i)=>(i+1)+' '+item.label).join(' · ') : 'No methods found for this expression.';
  status.textContent=message;
  if(spokenFeedback.checked) speak(message);
}
async function run() {
  if (['rust','cpp','csharp','java','crystal','go','elixir'].includes(language.value) && !remoteConsent.has(language.value)) { askConfirmation('run-remote','This sends your code to '+(language.value==='rust'?'Rust Playground':'Compiler Explorer')+'. Say “confirm” to run or “cancel”.'); return; }
  cancelPreview();controller?.abort(); controller = new AbortController();
  const current = controller;
  output.textContent = 'Running…';
  if(problem && plan?.tests?.length && language.value==='javascript'){
    const runner=createJudgeRunner({timeoutMs:5000});
    previewRunner=runner;
    const {report,results}=await runner.run({code:instrumentPracticeJavaScript(editor.getValue()).code,functionName:plan.functionName,params:plan.params,returns:plan.returns,tests:plan.tests.map(test=>({args:test.args,expected:test.known===false?undefined:test.expected}))});
    if(controller!==current){runner.dispose();return;}
    runner.dispose();previewRunner=null;
    output.textContent=report.loadError || results.map(row=>'Input '+row.input+'\n'+(row.error?'Error '+row.error:'Returned '+JSON.stringify(row.actual)+(row.passed===null?' · self-check':row.passed?' · passes':' · expected '+JSON.stringify(row.expected)))).join('\n\n');
    return;
  }
  const source=problem && plan?.tests?.length ? buildScript(language.value,editor.getValue(),plan) : null;
  const result = await runProgram(language.value, source || editor.getValue(), {signal:current.signal});
  if (controller !== current) return;
  if(source && result.ok){
    const rows=(result.output || '').split(/\r?\n/).filter(line=>line.startsWith('__CODEFIELD_CASE__'));
    if(rows.length===plan.tests.length){
      const printed=(result.output || '').split(/\r?\n/).filter(line=>!line.startsWith('__CODEFIELD_CASE__')).join('\n').trim();
      output.textContent=[printed && 'Console output:\n'+printed,rows.map((line,i)=>describeExampleTrace({ok:true,output:line},plan.tests[i],plan.returns?.type)).map(p=>p.verdict+'\n'+p.text).join('\n\n')].filter(Boolean).join('\n\n');
      return;
    }
  }
  output.textContent = [result.output, result.stderr, result.ok ? result.value : result.error].filter(value=>value && value !== 'undefined').join('\n') || '(no output)';
}
$('#run').onclick=run;
if(initialQuery.get('problem')) loadProblem(initialQuery.get('problem'));
const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!Speech) { $('#microphone').disabled=true; status.textContent='Speech recognition is unavailable in this browser. You can still use the editor and run code.'; }
else {
  recognition = new Speech(); recognition.continuous=true; recognition.interimResults=true;
  recognition.onresult = event => {
    for (let i=event.resultIndex;i<event.results.length;i++) {
      if (!event.results[i].isFinal) { $('#transcript').textContent=event.results[i][0].transcript; continue; }
      const text=event.results[i][0].transcript.trim(); $('#transcript').textContent=text;
      const template=voiceCode(text,language.value);
      if(template){const start=editor.getCaret();editor.insert(template.code);if(template.caret!==undefined)editor.selectRange(start+template.caret,start+template.caret);status.textContent='Inserted '+languages[language.value]+' code. Say undo to reverse.';continue;}
      if(/^read (problem|statement)[.!]?$/i.test(text)){if(problem)speak(problem.title+'. '+textOf(problem.content || ''));else status.textContent='Open a practice problem first.';continue;}
      if(/^read example[.!]?$/i.test(text)){if(problem)speak($('#voice-example').textContent);else status.textContent='Open a practice problem first.';continue;}
      if(/^read (code|current code)[.!]?$/i.test(text)){speak(editor.getValue());continue;}
      if(/^read (current )?line[.!]?$/i.test(text)){const source=editor.getValue(),at=editor.getCaret(),start=source.lastIndexOf('\n',at-1)+1,end=source.indexOf('\n',at);speak(source.slice(start,end<0?source.length:end)||'Empty line');continue;}
      if(/^go to (line start|start of line|line end|end of line)[.!]?$/i.test(text)){const source=editor.getValue(),at=editor.getCaret(),start=source.lastIndexOf('\n',at-1)+1,end=source.indexOf('\n',at),pos=/start/i.test(text)?start:end<0?source.length:end;editor.selectRange(pos,pos);status.textContent='Cursor moved to '+(/start/i.test(text)?'start':'end')+' of line.';continue;}
      if(/^next problem[.!]?$/i.test(text)){
        const current=problem?.slug;
        catalogIndex().then(items=>{const candidates=items.filter(item=>!item.paidOnly && item.slug!==current && !practiceStore().attempts?.[item.slug]?.passed);if(candidates.length)loadProblem(candidates[0].slug);else status.textContent='No further problem found.';}).catch(error=>{status.textContent=error.message;});
        continue;
      }
      if(/^(suggest|show) methods[.!]?$/i.test(text)){suggestMethods();continue;}
      const useSuggestion=/^(?:use|insert) (?:suggestion )?(\d+|first|second|third|fourth|fifth)[.!]?$/i.exec(text);
      if(useSuggestion && suggestions){
        const n=({first:1,second:2,third:3,fourth:4,fifth:5}[useSuggestion[1].toLowerCase()] || Number(useSuggestion[1]))-1;
        const selected=suggestions.items[n];
        if(suggestions.source!==editor.getValue() || suggestions.caret!==editor.getCaret())status.textContent='Code or cursor changed. Ask for suggestions again.';
        else if(!selected)status.textContent='Choose a listed suggestion.';
        else {editor.selectRange(suggestions.caret-suggestions.prefix.length,suggestions.caret);editor.insert(selected.insert || selected.label);status.textContent='Inserted '+selected.label;}
        suggestions=null;continue;
      }
      const explain=/^(?:explain|describe) (?:method )?([\w!?]+)[.!]?$/i.exec(text);
      if(explain){
        const method=explain[1],doc=(content[language.value]?.docs || []).find(d=>d.name.split(/[.#]/).at(-1)===method);
        const guide=methodGuide(language.value,method,doc);const message=method+'. '+guide.description+(guide.example?' Example: '+guide.example:'');
        status.textContent=message;if(spokenFeedback.checked)speak(message);continue;
      }
      const choice=/^(?:choose|select) (\d+|first|second|third|fourth|fifth)[.!]?$/i.exec(text);
      if(choice && pendingMatches){
        const index=({first:1,second:2,third:3,fourth:4,fifth:5}[choice[1].toLowerCase()] || Number(choice[1]))-1;
        if(editor.getValue()!==pendingMatches.source){status.textContent='Code changed. Ask to highlight the name again.';pendingMatches=null;continue;}
        const match=pendingMatches.matches[index];
        if(match){editor.selectRange(match.start,match.end);status.textContent='Selected match '+(index+1)+'.';pendingMatches=null;}
        else status.textContent='Choose a number from 1 to '+pendingMatches.matches.length+'.';
        continue;
      }
      const fileCommand=/^(save|open) file ([\w -]{1,64})[.!]?$/i.exec(text);
      if(fileCommand){
        const name=fileCommand[2].trim();
        try {
          if(fileCommand[1].toLowerCase()==='save'){
            saveNamedFile(name,language.value,editor.getValue());
            status.textContent='Saved '+name+'.';
          } else {
            const file=findSavedFile(name,language.value);
            const legacy=localStorage.getItem('codefield.voice.file.'+language.value+'.'+name.toLowerCase());
            const value=file?.code ?? legacy;
            if(value===null)status.textContent='No file named '+name+'.';
            else{editor.selectRange(0,editor.getValue().length);editor.insert(value);status.textContent='Opened '+name+'. Say undo to return.';}
          }
        } catch {status.textContent='Could not access saved files in this browser.';}
        continue;
      }
      const lineCommand=/^go to line (\d+)[.!]?$/i.exec(text);
      if(lineCommand){
        const lines=editor.getValue().split('\n'),n=Number(lineCommand[1]);
        if(n>0&&n<=lines.length){const at=lines.slice(0,n-1).reduce((a,l)=>a+l.length+1,0);editor.selectRange(at,at);status.textContent='Line '+n;}
        else status.textContent='Line outside this file.';
        continue;
      }
      const occurrence=/^(?:next|find) ([\w$]+)[.!]?$/i.exec(text);
      if(occurrence){status.textContent=editor.find(occurrence[1])?'Selected '+occurrence[1]:'No matching text.';continue;}
      if(/^new file[.!]?$/i.test(text)){editor.selectRange(0,editor.getValue().length);askConfirmation('delete','Start a blank file? Say confirm or cancel.');continue;}
      if (/^cancel[.!]?$/i.test(text) && pendingAction) { cancelConfirmation(); continue; }
      if (/^confirm[.!]?$/i.test(text) && pendingAction) { confirmAction(); continue; }
      const replacement=/^replace selection with (.+)$/i.exec(text);
      if(replacement){
        if(!editor.getSelection())status.textContent='Select code before replacing it.';
        else askConfirmation({type:'replace',text:replacement[1]},'Replace the selection? Say confirm or cancel.');
        continue;
      }
      const command=parseVoiceCommand(text), selection=resolveVoiceSelection(editor.getValue(),editor.getCaret(),command);
      if(selection) { editor.selectRange(selection.start,selection.end); status.textContent='Selected: '+editor.getSelection(); }
      else if(command.type === 'insert-method') { editor.insert('.'+command.name); status.textContent='Inserted method: '+command.name; }
      else if(command.type === 'insert-symbol') { editor.insert(command.text); status.textContent='Inserted '+text+'.'; }
      else if(command.type === 'highlight-name') {
        const matches=findVoiceMatches(editor.getValue(),command.name);
        if(matches.length>1){pendingMatches={matches,source:editor.getValue()};status.textContent=matches.length+' matches. Say “choose first” or “choose 2”, in file order.';}
        else status.textContent='No matching name found.';
      }
      else if(command.type !== 'unknown') status.textContent='Not enough previous words.';
      else if(/^run code[.!]?$/i.test(text)) run();
      else if(/^select all[.!]?$/i.test(text)) { editor.selectRange(0,editor.getValue().length); status.textContent='Selected all code.'; }
      else if(/^delete selection[.!]?$/i.test(text)) { if(!editor.getSelection()) status.textContent='Nothing is selected.'; else askConfirmation('delete','Say confirm to delete the selected text, or cancel.'); }
      else if(/^undo[.!]?$/i.test(text)) { editor.undo(); status.textContent='Undo requested.'; }
      else if(/^redo[.!]?$/i.test(text)) { editor.redo(); status.textContent='Redo requested.'; }
      else if(/^go to (start|end)[.!]?$/i.test(text)) { const at=/start/i.test(text)?0:editor.getValue().length; editor.selectRange(at,at); status.textContent='Cursor moved.'; }
      else if(/^read output[.!]?$/i.test(text) && window.speechSynthesis) { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(output.textContent.slice(0,2000))); status.textContent='Reading output.'; }
      else if(/^stop (listening|microphone)[.!]?$/i.test(text)) { wantsListening=false; clearTimeout(restartTimer); recognition.stop(); updateKeyboardMode(); announce('Microphone stopped.'); }
      else if(/^new line[.!]?$/i.test(text)) { editor.insert('\n'); status.textContent='Inserted a new line.'; }
      else if(/^tab[.!]?$/i.test(text)) { editor.insert('  '); status.textContent='Inserted indentation.'; }
      else if(/^language (javascript|ruby|python|rust|c plus plus|c sharp|java|crystal|go|elixir)[.!]?$/i.test(text)) {
        const spoken = text.toLowerCase().replace(/[.!?]+$/,'').replace(/^language /,'');
        language.value = {'c plus plus':'cpp','c sharp':'csharp'}[spoken] || spoken;
        mount(); updateKeyboardMode(); announce('Language changed to '+languages[language.value]+'.');
      }
      else if(/^dot[.!]?$/i.test(text)) { editor.insert('.'); suggestMethods(); }
      else if(/^insert\s+/i.test(text)) { editor.insert(text.replace(/^insert\s+/i,'')); status.textContent='Inserted dictated text.'; }
      else status.textContent='Command not recognized. Say “insert” before literal text.';
    }
  };
  recognition.onerror=event=>{
    if (['not-allowed','service-not-allowed','audio-capture','network'].includes(event.error)) wantsListening=false;
    status.textContent='Microphone error: '+event.error;
    if(!wantsListening) updateKeyboardMode();
  };
  recognition.onend=()=>{
    listening=false;
    if(wantsListening){
      status.textContent='Reconnecting microphone…';
      restartTimer=setTimeout(()=>{try{recognition.start();listening=true;status.textContent='Listening.';}catch(error){wantsListening=false;updateKeyboardMode();status.textContent=error.message;$('#microphone').textContent='Start microphone';$('#microphone').setAttribute('aria-pressed','false');}},500);
      return;
    }
    $('#microphone').textContent='Start microphone';$('#microphone').setAttribute('aria-pressed','false');updateKeyboardMode();
  };
  $('#microphone').onclick=()=>{
    if(wantsListening){wantsListening=false;clearTimeout(restartTimer);if(listening)recognition.stop();else recognition.onend();return;}
    try{recognition.start();listening=true;wantsListening=true;updateKeyboardMode();$('#microphone').textContent='Stop microphone';$('#microphone').setAttribute('aria-pressed','true');status.textContent='Listening. Your browser handles speech recognition.'}catch(error){wantsListening=false;updateKeyboardMode();status.textContent=error.message}
  };
}

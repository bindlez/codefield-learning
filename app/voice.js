import {createEditor} from './workspace-editor.js';
import {languages, languageOptions, tokenizers, runProgram} from './languages.js';
import {parseVoiceCommand, resolveVoiceSelection, findVoiceMatches} from '../src/voice-commands.js';
const $ = selector => document.querySelector(selector);
const language = $('#language'), status = $('#status'), output = $('#output');
languageOptions(language, localStorage.getItem('codefield.voice.language') || 'javascript');
let editor, recognition, listening = false, wantsListening = false, restartTimer, controller, pendingAction = null, pendingSnapshot = null;
let pendingMatches = null;
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
function mount() { controller?.abort(); controller=null; pendingAction=null; pendingMatches=null; confirmBox.hidden=true;
  editor?.destroy();
  const key = 'codefield.voice.draft.' + language.value;
  editor = createEditor('#editor', {language:language.value,value:localStorage.getItem(key) || '', label:'Voice workspace code', tokenize:tokenizers[language.value], autoIndent:true, onChange:value=>localStorage.setItem(key,value)});
  localStorage.setItem('codefield.voice.language',language.value);
}
mount(); language.onchange = mount;
function updateKeyboardMode() {
  const input = $('#editor textarea');
  if (input) input.setAttribute('inputmode', wantsListening ? 'none' : 'text');
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
async function run() {
  if (['rust','cpp','csharp','java','crystal'].includes(language.value) && !remoteConsent.has(language.value)) { askConfirmation('run-remote','This sends your code to '+(language.value==='rust'?'Rust Playground':'Compiler Explorer')+'. Say “confirm” to run or “cancel”.'); return; }
  controller?.abort(); controller = new AbortController();
  const current = controller;
  output.textContent = 'Running…';
  const result = await runProgram(language.value, editor.getValue(), {signal:current.signal});
  if (controller !== current) return;
  output.textContent = [result.output, result.stderr, result.ok ? result.value : result.error].filter(value=>value && value !== 'undefined').join('\n') || '(no output)';
}
$('#run').onclick=run;
const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!Speech) { $('#microphone').disabled=true; status.textContent='Speech recognition is unavailable in this browser. You can still use the editor and run code.'; }
else {
  recognition = new Speech(); recognition.continuous=true; recognition.interimResults=true;
  recognition.onresult = event => {
    for (let i=event.resultIndex;i<event.results.length;i++) {
      if (!event.results[i].isFinal) { $('#transcript').textContent=event.results[i][0].transcript; continue; }
      const text=event.results[i][0].transcript.trim(); $('#transcript').textContent=text;
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
        const name=fileCommand[2].trim().toLowerCase(),key='codefield.voice.file.'+language.value+'.'+name;
        if(fileCommand[1].toLowerCase()==='save'){localStorage.setItem(key,editor.getValue());status.textContent='Saved '+name;}
        else {const value=localStorage.getItem(key);if(value===null)status.textContent='No file named '+name;else{editor.selectRange(0,editor.getValue().length);editor.insert(value);status.textContent='Opened '+name+'. Say undo to return.';}}
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
      else if(/^language (javascript|ruby|python|rust|c plus plus|c sharp|java|crystal)[.!]?$/i.test(text)) {
        const spoken = text.toLowerCase().replace(/[.!?]+$/,'').replace(/^language /,'');
        language.value = {'c plus plus':'cpp','c sharp':'csharp'}[spoken] || spoken;
        mount(); updateKeyboardMode(); announce('Language changed to '+languages[language.value]+'.');
      }
      else if(/^dot[.!]?$/i.test(text)) { editor.insert('.'); status.textContent='Inserted dot. Say insert followed by a method name.'; }
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

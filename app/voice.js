import {createEditor} from '../src/editor.js';
import {languages, languageOptions, tokenizers, runProgram} from './languages.js';
import {parseVoiceCommand, resolveVoiceSelection} from '../src/voice-commands.js';
const $ = selector => document.querySelector(selector);
const language = $('#language'), status = $('#status'), output = $('#output');
languageOptions(language, localStorage.getItem('codefield.voice.language') || 'javascript');
let editor, recognition, listening = false, controller;
function mount() {
  editor?.destroy();
  const key = 'codefield.voice.draft.' + language.value;
  editor = createEditor('#editor', {value:localStorage.getItem(key) || '', label:'Voice workspace code', tokenize:tokenizers[language.value], autoIndent:true, onChange:value=>localStorage.setItem(key,value)});
  localStorage.setItem('codefield.voice.language',language.value);
}
mount(); language.onchange = mount;
async function run() {
  if (['rust','cpp','csharp'].includes(language.value) && !window.confirm('Run sends your code to an external compiler service. Continue?')) return;
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
  recognition = new Speech(); recognition.continuous=true; recognition.interimResults=false;
  recognition.onresult = event => {
    for (let i=event.resultIndex;i<event.results.length;i++) {
      if (!event.results[i].isFinal) continue;
      const text=event.results[i][0].transcript.trim(); $('#transcript').textContent=text;
      const command=parseVoiceCommand(text), selection=resolveVoiceSelection(editor.getValue(),editor.getCaret(),command);
      if(selection) { editor.selectRange(selection.start,selection.end); status.textContent='Selected: '+editor.getSelection(); }
      else if(command.type !== 'unknown') status.textContent='No unique match or not enough previous words.';
      else if(/^run code[.!]?$/i.test(text)) run();
      else if(/^select all[.!]?$/i.test(text)) { editor.selectRange(0,editor.getValue().length); status.textContent='Selected all code.'; }
      else if(/^undo[.!]?$/i.test(text)) { editor.undo(); status.textContent='Undo requested.'; }
      else if(/^redo[.!]?$/i.test(text)) { editor.redo(); status.textContent='Redo requested.'; }
      else if(/^go to (start|end)[.!]?$/i.test(text)) { const at=/start/i.test(text)?0:editor.getValue().length; editor.selectRange(at,at); status.textContent='Cursor moved.'; }
      else if(/^read output[.!]?$/i.test(text) && window.speechSynthesis) { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(output.textContent.slice(0,2000))); status.textContent='Reading output.'; }
      else if(/^dot[.!]?$/i.test(text)) { editor.insert('.'); status.textContent='Inserted dot. Say insert followed by a method name.'; }
      else if(/^insert\s+/i.test(text)) { editor.insert(text.replace(/^insert\s+/i,'')); status.textContent='Inserted dictated text.'; }
      else status.textContent='Command not recognized. Say “insert” before literal text.';
    }
  };
  recognition.onerror=event=>{status.textContent='Microphone error: '+event.error;};
  recognition.onend=()=>{listening=false;$('#microphone').textContent='Start microphone';};
  $('#microphone').onclick=()=>{if(listening){recognition.stop();return} try{recognition.start();listening=true;$('#microphone').textContent='Stop microphone';status.textContent='Listening. Your browser handles speech recognition.'}catch(error){status.textContent=error.message}};
}

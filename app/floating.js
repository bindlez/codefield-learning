import {createEditor} from './workspace-editor.js';
import {inferVariables} from '../src/inference.js';
import {runProgram, tokenizers} from './languages.js';

const token = location.hash.slice(1);
document.title = 'Codefield floating editor ' + token;
const result = document.querySelector('#result');
const variables = document.querySelector('#variables');
let editor, language = 'javascript', timer, controller, sequence = 0;


function sendEdit(code) {
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({type:'codefield-edit',token,language,code},location.origin);
  }
}
function renderMap() {
  variables.replaceChildren();
  if (!editor) return;
  const code = editor.getValue();
  for (const [name, type] of inferVariables(code, editor.getCaret(), language)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = name + ' · ' + type;
    button.title = 'Select assignment';
    button.onclick = () => {
      const match = new RegExp('\\b' + name + '\\b(?=\\s*(?::[^=]+)?=)').exec(editor.getValue());
      if (!match) return;
      const input = document.querySelector('#editor textarea');
      editor.focus();
      input.setSelectionRange(match.index, match.index + name.length);
    };
    variables.append(button);
  }
}
function queueRun() {
  clearTimeout(timer);
  controller?.abort();
  const version = ++sequence;
  const code = editor.getValue();
  if (!code.trim()) { result.textContent = 'Write some code to see a result.'; return; }
  result.textContent = ['rust','cpp','csharp','java','crystal'].includes(language)
    ? 'Waiting… Run will send this code to the language service.'
    : 'Waiting for you to pause…';
  timer = setTimeout(async () => {
    controller = new AbortController();
    result.textContent = 'Running…';
    const output = await runProgram(language, code, {signal:controller.signal});
    if (version !== sequence) return;
    result.textContent = [output.output,output.stderr,output.ok ? output.value : output.error].filter(value => value && value !== 'undefined').join('\n') || '(no output)';
  }, 1500);
}
function mount(nextLanguage, code) {
  if (!tokenizers[nextLanguage]) return;
  language = nextLanguage;
  if (editor) editor.destroy();
  editor = createEditor('#editor', {language,minimal:true,
    value:code, label: language + ' floating code editor', tokenize:tokenizers[language], autoIndent:true,
    onChange(value) {
      try { localStorage.setItem('codefield.floating.draft', JSON.stringify({language,code:value})); } catch {}
      sendEdit(value); renderMap(); queueRun();
    },
    onSelection:renderMap
  });
  renderMap(); queueRun();
}
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== window.opener || event.data?.token !== token || event.data.type !== 'codefield-state') return;
  const {language:nextLanguage,code} = event.data;
  if (!tokenizers[nextLanguage] || typeof code !== 'string') return;
  if (!editor || language !== nextLanguage) mount(nextLanguage,code);
  else if (editor.getValue() !== code) { editor.setValue(code); renderMap(); queueRun(); }
});
const handle = document.querySelector('.result span');
handle.title = 'Drag to move · Escape to close';
let drag = null;
handle.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  drag = {x:event.screenX,y:event.screenY};
  handle.setPointerCapture(event.pointerId);
  event.preventDefault();
});
handle.addEventListener('pointerup', event => {
  if (!drag) return;
  const dx = Math.round(event.screenX - drag.x), dy = Math.round(event.screenY - drag.y);
  drag = null;
  if (Math.abs(dx) + Math.abs(dy) < 3) return;
  fetch('/api/floating-window',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'move',token,dx,dy})}).catch(()=>{});
});
handle.addEventListener('pointercancel', () => { drag = null; });
document.addEventListener('keydown', event => { if (event.key === 'Escape') window.close(); });
if (/^[0-9a-f-]{36}$/.test(token)) {
  fetch('/api/floating-window',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'attach',token})}).then(response=>{
    if (!response.ok) result.title = 'Use your browser window controls to move or close this window.';
  }).catch(()=>{});
}
if (window.opener && !window.opener.closed) window.opener.postMessage({type:'codefield-ready',token},location.origin);
else {
  try { const draft=JSON.parse(localStorage.getItem('codefield.floating.draft')); if (draft && tokenizers[draft.language]) mount(draft.language,draft.code); } catch {}
  if (!editor) mount('javascript','');
}
window.addEventListener('beforeunload', () => { clearTimeout(timer); controller?.abort(); });

import {languages,tokenizers,languageOptions,runProgram} from './languages.js';
import { createEditor } from './workspace-editor.js';
import {completeWithRuntime} from './shared-completion.js';
import { javascriptCompletion, guideFor } from './js-methods.js';
import { inferContext } from '../src/inference.js';
import { createMethodCard } from './method-card.js';

const storageKey = 'codefield.notebook.v1';

function readDrafts() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
}

/** A slide-over editor for lesson examples. It shares autocomplete with the rest of the app. */
export function createNotebook({ onAsk } = {}) {
  const drafts = readDrafts();
  let editor = null;
  let methodCard = null;
  let currentKey = '';
  let original = '';
  let language = 'javascript';
  let notebookTitle = '';
  const draftId = () => language === 'javascript' ? notebookTitle : notebookTitle + ':' + language;
  let saveTimer = 0;

  const backdrop = document.createElement('div');
  backdrop.className = 'notebook-backdrop';
  backdrop.hidden = true;
  const panel = document.createElement('aside');
  panel.className = 'notebook';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Code notebook');
  panel.innerHTML = `
    <header class="notebook-head">
      <div class="notebook-heading"><p class="eyebrow">CODE NOTEBOOK</p><strong id="notebook-title">Example</strong></div>
      <button type="button" class="coach-icon" id="notebook-close" aria-label="Close notebook">✕</button>
    </header>
    <div class="notebook-body">
      <label>Language <select id="notebook-language" aria-label="Notebook language"></select></label><div id="notebook-editor"></div>
      <div id="notebook-method-card" class="method-card-host"></div>
      <div class="notebook-actions">
        <button type="button" class="run" id="notebook-run">▶ &nbsp;Run</button>
        <button type="button" class="outline" id="notebook-ask">Ask coach</button>
        <button type="button" class="text-button" id="notebook-reset">Reset example</button>
        <span class="run-hint" id="notebook-status" role="status"></span>
      </div>
      <pre class="notebook-output" id="notebook-output" role="log" hidden></pre>
    </div>`;
  document.body.append(backdrop, panel);

  const $ = selector => panel.querySelector(selector);
  const titleNode = $('#notebook-title');
  const output = $('#notebook-output');
  const status = $('#notebook-status');

  const saveDraft = () => {
    if (!editor || !currentKey) return;
    drafts[draftId()] = editor.getValue();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(drafts));
      } catch {}
    }, 250);
  };

  const hide = () => {
    saveDraft();
    panel.hidden = true;
    backdrop.hidden = true;
    panel.classList.remove('open');
    document.body.classList.remove('notebook-open');
  };

  const show = () => {
    panel.hidden = false;
    backdrop.hidden = false;
    panel.classList.add('open');
    document.body.classList.add('notebook-open');
  };

  const open = (code, title = 'Example') => {
    if (editor) {
      saveDraft();
      editor.destroy();
      editor = null;
    }
    currentKey = title;
    notebookTitle = title;
    original = String(code ?? '');
    language = 'javascript';
    $('#notebook-language').value = language;
    titleNode.textContent = title;
    $('#notebook-method-card').replaceChildren();
    methodCard = createMethodCard($('#notebook-method-card'));
    output.hidden = true;
    output.textContent = '';
    status.textContent = 'Fresh worker · autocomplete on';
    show();
    mountEditor();
    editor.focus();
  };

  function mountEditor() {
    editor?.destroy();
    editor = createEditor('#notebook-editor', {language,
      value: drafts[draftId()] ?? (language === 'javascript' ? original : ''),
      label: `${notebookTitle} notebook editor`,
      tokenize: tokenizers[language],
      autoIndent: true,
      complete: context => completeWithRuntime(language,editor?.getValue() || '',editor?.getCaret() || 0,context),
      onSelection: (value, parent) => {
        if (!editor || language !== 'javascript') return;
        const inferred = parent
          ? inferContext(editor.getValue(), editor.getCaret(), 'javascript', parent.receiver, parent.chain)
          : null;
        methodCard.show(guideFor(value, inferred?.type || ''));
      },
      onChange: () => {
        methodCard.hide();
        saveDraft();
      }
    });
  }
  languageOptions($('#notebook-language'));
  $('#notebook-language').onchange = event => {
    saveDraft();
    language = event.target.value;
    mountEditor();
    status.textContent = languages[language];
    output.hidden = true;
  };

  $('#notebook-run').onclick = async () => {
    if (!editor) return;
    const button = $('#notebook-run');
    button.disabled = true;
    output.hidden = false;
    output.classList.remove('error');
    output.textContent = 'Running…';
    const result = await runProgram(language, editor.getValue());
    output.textContent = result.ok
      ? [result.output, result.value && result.value !== 'undefined' ? `⇒ ${result.value}` : ''].filter(Boolean).join('\n') || '(no output)'
      : `${result.error || 'The example failed.'}${result.output ? `\n${result.output}` : ''}`;
    output.classList.toggle('error', !result.ok);
    status.textContent = result.ok ? 'Ran in a fresh worker' : 'Read the error, then edit';
    button.disabled = false;
  };

  $('#notebook-ask').onclick = () => {
    if (!editor) return;
    onAsk?.({ code: editor.getValue(), title: currentKey });
  };

  $('#notebook-reset').onclick = () => {
    if (!editor) return;
    editor.setValue(language === 'javascript' ? original : '');
    delete drafts[draftId()];
    saveDraft();
    output.hidden = true;
    output.textContent = '';
    status.textContent = 'Example restored';
  };

  $('#notebook-close').onclick = hide;
  backdrop.onclick = hide;
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) hide();
  });

  return {
    open,
    close: hide,
    isOpen: () => !panel.hidden,
    getLanguage: () => language,
    getValue: () => (editor ? editor.getValue() : ''),
    getTitle: () => currentKey,
    getEditor: () => editor
  };
}

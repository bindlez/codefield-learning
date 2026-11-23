import {browserProviders, chatResponse, discover} from './connection.js';
import { drills } from './ai-drills.js';
import { renderMarkdown } from './markdown.js';
import { apiBase, modelCandidates, STRATA_DESKTOP, STRATA_TERMINAL } from './provider-utils.js';

const settingsKey = 'codefield.ai.settings.v1';
const fallbackProviders = [
  { id: 'ollama', label: 'Ollama', kind: 'ollama', baseUrl: 'http://127.0.0.1:11434', note: 'Native Ollama API.' },
  { id: 'strata', label: 'Strata', kind: 'openai', baseUrl: 'http://127.0.0.1:47831/v1', note: 'Strata Desktop; terminal port detected too.' },
  { id: 'lmstudio', label: 'LM Studio', kind: 'openai', baseUrl: 'http://127.0.0.1:1234/v1', note: 'LM Studio local server.' },
  { id: 'llamacpp', label: 'llama.cpp', kind: 'openai', baseUrl: 'http://127.0.0.1:8080/v1', note: 'llama-server.' },
  { id: 'custom', label: 'Custom', kind: 'openai', baseUrl: 'http://127.0.0.1:8000/v1', note: 'Any OpenAI-compatible server.' }
];

const levelBrief = {
  guided: 'Teach Socratically. Ask one focused question before giving code, and reveal at most one hint at a time. Never paste a complete solution unless the learner explicitly asks for it twice.',
  balanced: 'Explain the idea first, then give a short example. Offer a complete solution only when the learner asks for one.',
  expert: 'Be direct and assume fluency. Skip beginner explanations unless the learner asks for them.'
};

const quickActions = {
  practice: [
    ['Hint, not the answer', 'Give me a hint for this problem that does not reveal the full solution. Point at the next thing I should try.'],
    ['Review my code', 'Review my current solution. Say what works, what breaks, and the smallest next fix. Do not rewrite it unless I ask.'],
    ['Why is it failing?', 'My tests are failing. Use the test results in the context to explain the most likely cause, then ask me one question that helps me find it.'],
    ['Complexity', 'What are the time and space complexity of my current solution? Show the reasoning briefly.'],
    ['Edge cases', 'List the edge cases I should test next, ordered by how likely they are to break my code.']
  ],
  lesson: [
    ['Unstick me', 'I am working on the checkpoint. Give me one small next step, not the solution.'],
    ['Explain simpler', 'Explain the main idea of this lesson in plain language, with one tiny example.'],
    ['Check my attempt', 'Look at my checkpoint attempt. Tell me what is right, what is missing, and one question to consider. Do not give the answer.'],
    ['Quiz me', 'Ask me three short questions that test whether I understood this lesson. Wait for my answers.'],
    ['Go deeper', 'What is one subtle thing about this topic that beginners usually get wrong?']
  ],
  playground: [
    ['Explain this code', 'Explain what my current code does, line by line, in plain language.'],
    ['Find a bug', 'Look for likely bugs in my current code. Ask me what I expected before you reveal a fix.'],
    ['Make it clearer', 'Suggest three small readability improvements to my code. Show the smallest diff that helps.'],
    ['Add tests', 'Write a few small test cases for my code, including one edge case I probably missed.'],
    ['Teach this code', 'Teach the main concept with a worked example and a short exercise.'],
    ['Debug last run', 'Use the latest result to diagnose the problem and suggest a minimal check.'],
    ['Challenge hint', 'Give a hint for the current challenge.'],
    ['What next?', 'Given where I am, what is one concrete thing I should learn or try next?']
  ]
};

function savedSettings() {
  const current = JSON.parse(localStorage.getItem(settingsKey) || 'null');
  if (current) {
    if (current.apiKey) {
      sessionStorage.setItem('codefield.tabKey.' + current.provider + '.' + (current.baseUrl || ''), current.apiKey);
      delete current.apiKey;
      localStorage.setItem(settingsKey, JSON.stringify(current));
    }
    return current;
  }
  const old = JSON.parse(localStorage.getItem('codefield.ai.connection') || 'null');
  if (!old) return {};
  const provider = ['openai','remote'].includes(old.provider)
    ? (/^https:/.test(old.base) ? 'hosted' : 'strata') : old.provider;
  return {provider, baseUrl:old.base, model:old.model};
}

function readSettings() {
  try {
    return { ...{ provider: 'ollama', model: '', baseUrl: '', apiKey: '', level: 'guided', includeCode: true, think: false }, ...savedSettings() };
  } catch {
    return { provider: 'ollama', model: '', baseUrl: '', apiKey: '', level: 'guided', includeCode: true, think: false };
  }
}

function readChat(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(saved) ? saved.filter(message => message && message.content).slice(-16) : [];
  } catch {
    return [];
  }
}

const escapeHtml = text => String(text).replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character]));

export function initCoach({ context = () => ({}), insert = null } = {}) {
  if (document.querySelector('#coach')) return null;
  const pageMode = location.pathname.endsWith('learn.html') ? 'lesson' : location.pathname.endsWith('practice.html') ? 'practice' : 'playground';
  const chatKey = `codefield.ai.chat.v1.${pageMode}`;
  const settings = readSettings();
  settings.messages = readChat(chatKey);
  let providers = [...fallbackProviders, ...browserProviders];
  let backend = false;
  let models = [];
  let streaming = false;
  let controller = null;
  let lastAssistant = null;
  let renderTimer = 0;
  let modelRequest = 0;

  const aside = document.createElement('aside');
  aside.className = 'coach';
  aside.id = 'coach';
  aside.setAttribute('aria-label', 'AI coach');
  aside.setAttribute('aria-hidden', 'true');
  aside.innerHTML = `
    <header class="coach-head">
      <div class="coach-heading"><span class="coach-spark" aria-hidden="true">✦</span><div><strong>AI coach</strong><small id="coach-status">Checking for a local model…</small></div></div>
      <div class="coach-head-actions"><button type="button" class="coach-icon" id="coach-new" title="Start a new conversation">＋</button><button type="button" class="coach-icon" id="coach-close" title="Close coach" aria-label="Close coach">✕</button></div>
    </header>
    <div class="coach-config">
      <button type="button" class="pill-button" id="coach-detect">Detect local model</button>
      <div class="coach-field-row">
        <label class="coach-field">Provider<select id="coach-provider"></select></label>
        <label class="coach-field">Teaching style<select id="coach-level">
          <option value="guided">Guided</option>
          <option value="balanced">Balanced</option>
          <option value="expert">Expert</option>
        </select></label>
      </div>
      <label class="coach-field">Model<input id="coach-model" list="coach-models" placeholder="Choose or type a model" autocomplete="off"><datalist id="coach-models"></datalist></label>
      <label class="coach-field" id="coach-key-field" hidden>API key<input id="coach-key" type="password" placeholder="Provider key, if required" autocomplete="off"></label>
      <div class="coach-config-foot">
        <label class="coach-check"><input type="checkbox" id="coach-include"> Include my current code</label>
        <details class="coach-details">
          <summary>Connection</summary>
          <label class="coach-field">Address<input id="coach-base" placeholder="Provider default" autocomplete="off"></label>
          <label class="coach-check"><input type="checkbox" id="coach-think"> Deep reasoning (slower)</label>
          <div class="coach-detail-actions"><button type="button" class="text-button" id="coach-recheck">Find models</button><span class="coach-note">Local servers use the workspace connection. Hosted models receive requests directly.</span></div>
        </details>
      </div>
    </div>
    <div class="coach-quick" id="coach-quick" aria-label="Quick prompts"></div>
    <div class="coach-log" id="coach-log" role="log" aria-live="polite"></div>
    <form class="coach-form" id="coach-form">
      <label class="sr-only" for="coach-input">Ask the coach</label>
      <textarea id="coach-input" rows="2" placeholder="Ask about your code, a bug, or the next step…"></textarea>
      <div class="coach-send-row">
        <span class="coach-key">Ctrl + Enter to send</span>
        <button type="button" class="coach-stop" id="coach-stop" hidden>Stop</button>
        <button type="submit" class="coach-send" id="coach-send">Send</button>
      </div>
    </form>`;
  document.body.append(aside);
  const backdrop = document.createElement('div');
  backdrop.className = 'coach-backdrop';
  backdrop.hidden = true;
  document.body.append(backdrop);

  const $ = selector => aside.querySelector(selector);
  const status = $('#coach-status');
  const log = $('#coach-log');
  const input = $('#coach-input');
  const send = $('#coach-send');
  const stop = $('#coach-stop');
  const providerSelect = $('#coach-provider');
  const modelInput = $('#coach-model');
  const modelList = $('#coach-models');
  const baseInput = $('#coach-base');
  const keyInput = $('#coach-key');
  const keyField = $('#coach-key-field');
  const includeCode = $('#coach-include');
  const levelSelect = $('#coach-level');

  providerSelect.innerHTML = providers.map(provider => `<option value="${provider.id}">${escapeHtml(provider.label)}</option>`).join('');
  providerSelect.value = settings.provider;
  modelInput.value = settings.model;
  baseInput.value = settings.baseUrl;
  const keySlot = () => 'codefield.tabKey.' + providerSelect.value + '.' + baseInput.value.trim();
  try { keyInput.value = sessionStorage.getItem(keySlot()) || ''; } catch {}
  includeCode.checked = settings.includeCode;
  levelSelect.value = settings.level;
  $('#coach-think').checked = settings.think === true;

  const persist = () => {
    try {
      sessionStorage.setItem(keySlot(), keyInput.value.trim());
      localStorage.setItem(settingsKey, JSON.stringify({
        provider: providerSelect.value,
        model: modelInput.value.trim(),
        baseUrl: baseInput.value.trim(),
        level: levelSelect.value,
        includeCode: includeCode.checked,
        think: $('#coach-think').checked
      }));
    } catch {}
    try {
      localStorage.setItem(chatKey, JSON.stringify(settings.messages.slice(-16)));
    } catch {}
  };

  const setStatus = (text, tone = '') => {
    status.textContent = text;
    status.dataset.tone = tone;
  };

  const updateKeyVisibility = () => {
    const provider = providers.find(item => item.id === providerSelect.value);
    keyField.hidden = !provider || provider.kind === 'ollama';
    baseInput.disabled = provider?.id === 'gemini';
  };

  function renderQuick() {
    let mode = 'playground';
    try {
      mode = context().mode || 'playground';
    } catch {}
    const actions = [...(quickActions[mode] || quickActions.playground)];
    if (mode !== 'playground') actions.push(...drills);
    $('#coach-quick').innerHTML = '';
    for (const [label, prompt] of actions) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'coach-quick-button';
      button.textContent = label;
      button.onclick = () => ask(prompt, label);
      $('#coach-quick').append(button);
    }
  }

  function addMessage(role, text, { pending = false } = {}) {
    const article = document.createElement('article');
    article.className = `coach-message coach-message--${role}`;
    const meta = document.createElement('div');
    meta.className = 'coach-message-meta';
    meta.innerHTML = `<span>${role === 'assistant' ? 'Coach' : 'You'}</span>`;
    const body = document.createElement('div');
    body.className = 'coach-message-body';
    article.append(meta, body);
    if (role === 'assistant' && !pending) {
      const actions = document.createElement('div');
      actions.className = 'coach-message-actions';
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'text-button';
      copy.textContent = 'Copy';
      copy.onclick = async () => {
        try {
          await navigator.clipboard.writeText(body.dataset.raw || body.textContent || '');
          copy.textContent = 'Copied';
          setTimeout(() => { copy.textContent = 'Copy'; }, 1500);
        } catch {
          copy.textContent = 'Copy failed';
        }
      };
      actions.append(copy);
      article.append(actions);
    }
    if (pending) {
      body.innerHTML = '<span class="coach-thinking"><i></i><i></i><i></i></span>';
    } else if (role === 'assistant') {
      body.dataset.raw = text;
      body.innerHTML = renderMarkdown(text);
      decorateCodeBlocks(body);
    } else {
      body.textContent = text;
    }
    log.append(article);
    log.scrollTop = log.scrollHeight;
    return { article, body };
  }

  function decorateCodeBlocks(root) {
    for (const pre of root.querySelectorAll('pre.md-code')) {
      if (pre.dataset.ready) continue;
      pre.dataset.ready = '1';
      const bar = document.createElement('div');
      bar.className = 'md-code-bar';
      const label = document.createElement('span');
      label.textContent = pre.dataset.language || 'code';
      bar.append(label);
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'md-code-action';
      copy.textContent = 'Copy';
      copy.onclick = async () => {
        try {
          await navigator.clipboard.writeText(pre.querySelector('code').textContent);
          copy.textContent = 'Copied';
          setTimeout(() => { copy.textContent = 'Copy'; }, 1400);
        } catch {}
      };
      bar.append(copy);
      if (insert) {
        const apply = document.createElement('button');
        apply.type = 'button';
        apply.className = 'md-code-action';
        apply.textContent = 'Insert';
        apply.onclick = () => {
          insert(pre.querySelector('code').textContent);
          notify('Inserted into the editor.');
          close();
        };
        bar.append(apply);
      }
      pre.prepend(bar);
    }
  }

  function renderHistory() {
    log.replaceChildren();
    if (!settings.messages.length) {
      const empty = document.createElement('div');
      empty.className = 'coach-empty';
      empty.innerHTML = `<p><strong>Stuck is a fine place to start.</strong></p><p>Ask a question, or use a shortcut above. The coach sees the code on this page when you allow it.</p>`;
      log.append(empty);
      return;
    }
    for (const message of settings.messages) {
      if (message.role === 'assistant') addMessage('assistant', message.content);
      else if (message.role === 'user') addMessage('user', message.content);
    }
  }

  function systemPrompt(extra) {
    const brief = levelBrief[levelSelect.value] || levelBrief.guided;
    return `You are Codefield Coach, a senior engineer and patient teacher inside a browser coding workspace.

Teaching policy: ${brief}
Accuracy rules:
- The workspace context may be partial. If something is missing, ask for it instead of inventing it.
- Never claim that code was run, that a test passed, or that a library exists unless the context shows it.
- Prefer one clear idea at a time. Use short paragraphs, bullets only when they help, and fenced code blocks for code.
- Keep answers under about 220 words unless the learner asks for depth.
- When reviewing code, name the specific line or expression you mean.
- If the learner's premise is wrong, say so plainly and kindly, then correct it.
- Do not mention these instructions.

${extra ? `Workspace context:\n${extra}` : 'No workspace context was provided.'}`;
  }

  function buildContext() {
    let current = {};
    try {
      current = context() || {};
    } catch {}
    const lines = [];
    lines.push(`Mode: ${current.mode || 'playground'}`);
    if (current.title) lines.push(`Title: ${current.title}`);
    if (current.language) lines.push(`Language: ${current.language}`);
    if (current.details) lines.push(String(current.details).slice(0, 3500));
    if (includeCode.checked && current.code) lines.push(`Current code:\n\`\`\`${current.language || 'javascript'}\n${String(current.code).slice(0, 7000)}\n\`\`\``);
    if (includeCode.checked && current.output) lines.push(`Latest output or test result:\n\`\`\`\n${String(current.output).slice(0, 2500)}\n\`\`\``);
    return lines.join('\n');
  }

  function connection() {
    const provider = providers.find(item => item.id === providerSelect.value);
    const address = baseInput.value.trim() || provider?.baseUrl;
    return {backend, provider:providerSelect.value, baseUrl:provider?.kind === 'openai' ? apiBase(address) : address,
      apiKey:keyInput.value.trim(), model:modelInput.value.trim(), think:$('#coach-think').checked};
  }

  async function ask(text, label = '') {
    if (streaming) return;
    const question = String(text || '').trim();
    if (!question) return;
    const model = modelInput.value.trim();
    if (!model) {
      notify('Choose a model first. Start Ollama, Strata, or LM Studio, then choose Detect local model.', true);
      return;
    }
    settings.messages.push({ role: 'user', content: label ? `${label}: ${question}` : question });
    addMessage('user', label || question);
    renderQuick();
    const pending = addMessage('assistant', '', { pending: true });
    pending.body.dataset.raw = '';
    settings.messages.push({ role: 'assistant', content: '' });
    lastAssistant = settings.messages.at(-1);
    log.scrollTop = log.scrollHeight;
    streaming = true;
    send.disabled = true;
    stop.hidden = false;
    controller = new AbortController();
    let answer = '';
    const paint = () => {
      pending.body.dataset.raw = answer;
      pending.body.innerHTML = renderMarkdown(answer);
      decorateCodeBlocks(pending.body);
      log.scrollTop = log.scrollHeight;
    };
    try {
      const response = await chatResponse({ ...connection(), signal:controller.signal, stream:true,
          messages: [
            { role: 'system', content: systemPrompt(buildContext()) },
            ...settings.messages.slice(-12).filter(message => message.content).map(message => ({ role: message.role, content: message.content }))
          ]
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || `The model server returned HTTP ${response.status}.`);
      }
      if (!response.body || !(response.headers.get('content-type') || '').includes('text/event-stream')) {
        const data = await response.json();
        answer = data.text || '';
        paint();
      } else {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let index;
          while ((index = buffer.indexOf('\n\n')) >= 0) {
            const frame = buffer.slice(0, index);
            buffer = buffer.slice(index + 2);
            const line = frame.split('\n').find(item => item.startsWith('data:'));
            if (!line) continue;
            let event;
            try {
              event = JSON.parse(line.slice(5).trim());
            } catch {
              continue;
            }
            if (event.error) throw new Error(event.error);
            if (event.delta) {
              answer += event.delta;
              if (!renderTimer) {
                renderTimer = setTimeout(() => {
                  renderTimer = 0;
                  paint();
                }, 70);
              }
            }
            if (event.done) break;
          }
        }
        clearTimeout(renderTimer);
        renderTimer = 0;
        paint();
      }
      if (!answer.trim()) answer = 'The model finished without sending text. Try a different model or a shorter question.';
      pending.body.dataset.raw = answer;
      pending.body.innerHTML = renderMarkdown(answer);
      decorateCodeBlocks(pending.body);
      lastAssistant.content = answer;
      persist();
      const finished = addMessage('assistant', answer);
      pending.article.remove();
      finished.article.dataset.final = '1';
    } catch (error) {
      const aborted = error.name === 'AbortError';
      const message = aborted
        ? 'Stopped.'
        : /HTTP 40[13]/.test(error.message)
          ? 'The model server rejected the API key. Paste it in the API key field above, then send again.'
          : error.message;
      pending.body.innerHTML = `<div class="coach-error">${escapeHtml(message)}</div>`;
      if (lastAssistant) lastAssistant.content = message;
      persist();
    } finally {
      streaming = false;
      send.disabled = false;
      stop.hidden = true;
      controller = null;
      log.scrollTop = log.scrollHeight;
      input.focus();
    }
  }

  async function loadProviders() {
    try {
      const response = await fetch('/api/ai/providers');
      if (!response.ok) throw new Error('offline');
      const data = await response.json();
      backend = Array.isArray(data.providers);
      providers = [...(backend ? data.providers : fallbackProviders), ...browserProviders];
      const current = providerSelect.value;
      providerSelect.innerHTML = providers.map(provider => `<option value="${provider.id}">${escapeHtml(provider.label)}</option>`).join('');
      providerSelect.value = providers.some(provider => provider.id === current) ? current : providers[0].id;
      updateKeyVisibility();
    } catch {
      providers = [...fallbackProviders, ...browserProviders];
      providerSelect.innerHTML = providers.map(provider => `<option value="${provider.id}">${escapeHtml(provider.label)}</option>`).join('');
      providerSelect.value = providers.some(item => item.id === settings.provider) ? settings.provider : 'ollama';
      updateKeyVisibility();

    }
    await loadModels();
  }

  async function loadModels() {
    const request = ++modelRequest;
    setStatus('Looking for a local model…');
    const provider = providers.find(item => item.id === providerSelect.value);
    const typed = baseInput.value.trim();
    const remembered = !keyInput.value.trim() && providerSelect.value === 'strata' && [STRATA_DESKTOP, STRATA_TERMINAL].includes(typed.replace(/\/+$/, ''));
    const candidates = remembered
      ? [...new Set([provider?.baseUrl, STRATA_DESKTOP, STRATA_TERMINAL].filter(Boolean))]
      : modelCandidates({ providerId: providerSelect.value, kind: provider?.kind, typed, preferred: provider?.baseUrl });
    try {
      let data = null;
      let usedBase = '';
      for (const candidate of candidates) {
        let payload;
        try { payload = await discover({...connection(), baseUrl:candidate || provider?.baseUrl}); }
        catch (error) { if (candidates.length === 1) throw error; continue; }
        if (request !== modelRequest) return;
        const reachable = payload.ok || /returned HTTP/i.test(payload.error || '');
        if (!reachable) continue;
        if (payload.ok && payload.models?.length) {
          data = payload;
          usedBase = payload.baseUrl || candidate || '';
          break;
        }
        if (!data) {
          data = payload;
          usedBase = payload.baseUrl || candidate || '';
        }
      }
      if (!data) throw new Error('No local model server answered.');
      if (usedBase && (!typed || remembered)) {
        baseInput.value = usedBase;
        settings.baseUrl = usedBase;
        persist();
      }
      if (!data.ok && /HTTP 40[13]/.test(data.error || '')) {
        setStatus(`${data.label} needs an API key. Paste it in the API key field above, then choose Find models.`, 'error');
        return;
      }
      models = [...new Set(data.models || [])].filter(name => !/embed/i.test(name));
      modelList.innerHTML = '';
      for (const model of models) {
        const option = document.createElement('option');
        option.value = model;
        modelList.append(option);
      }
      if (models.length && (!modelInput.value || !models.includes(modelInput.value))) {
        modelInput.value = data.suggested && models.includes(data.suggested) ? data.suggested : models[0];
      }
      persist();
      if (models.length) setStatus(`${data.label} · ${models.length} model${models.length === 1 ? '' : 's'} ready`, 'ok');
      else if (data.ok) setStatus(`${data.label} is running, but no model is loaded.`, 'warn');
      else setStatus(`${data.label} is reachable at ${usedBase || stateFallback()} · type the model name.`, 'warn');
    } catch (error) {
      if (request !== modelRequest) return;
      setStatus(error.message || 'No model server answered.', 'warn');
    }
  }

  const stateFallback = () => providerSelect.value === 'strata' ? '47831' : 'the default port';


  function notify(text, bad = false) {
    let toast = document.querySelector('.coach-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'coach-toast';
      toast.setAttribute('role', 'status');
      document.body.append(toast);
    }
    toast.textContent = text;
    toast.dataset.bad = bad ? '1' : '';
    toast.classList.add('visible');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('visible'), 3600);
  }

  function open() {
    updateKeyVisibility();
    aside.classList.add('open');
    document.body.classList.add('coach-open');
    aside.removeAttribute('aria-hidden');
    backdrop.hidden = window.innerWidth > 1100;
    renderQuick();
    if (!settings.messages.length) renderHistory();
    setTimeout(() => input.focus(), 120);
  }

  function close() {
    aside.classList.remove('open');
    document.body.classList.remove('coach-open');
    aside.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
  }

  aside.querySelector('#coach-close').onclick = close;
  backdrop.onclick = close;
  $('#coach-new').onclick = () => {
    if (streaming) return;
    settings.messages = [];
    persist();
    renderHistory();
    input.focus();
  };
  $('#coach-recheck').onclick = () => loadModels();
  providerSelect.onchange = () => {
    settings.provider = providerSelect.value;
    modelInput.value = '';
    baseInput.value = '';
    keyInput.value = '';
    settings.baseUrl = '';
    settings.apiKey = '';
    updateKeyVisibility();
    persist();
    loadModels();
  };
  modelInput.onchange = () => {
    settings.model = modelInput.value.trim();
    persist();
  };
  levelSelect.onchange = () => {
    settings.level = levelSelect.value;
    persist();
  };
  includeCode.onchange = () => {
    settings.includeCode = includeCode.checked;
    persist();
  };
  $('#coach-think').onchange = () => persist();
  baseInput.oninput = () => {
    ++modelRequest;
    keyInput.value = '';
    modelInput.value = '';
    modelList.replaceChildren();
  };
  baseInput.onchange = () => { persist(); loadModels(); };
  keyInput.onchange = () => { persist(); loadModels(); };
  $('#coach-detect').onclick = async () => {
    const request = ++modelRequest;
    setStatus('Checking local model servers…');
    const candidates = providers.filter(item => ['ollama','strata','lmstudio','llamacpp'].includes(item.id));
    for (const provider of candidates) {
      const addresses = modelCandidates({providerId:provider.id, kind:provider.kind, preferred:provider.baseUrl});
      for (const address of addresses) {
        let result;
        try { result = await discover({backend, provider:provider.id, baseUrl:address || provider.baseUrl}); } catch {}
        if (request !== modelRequest) return;
        const model = result?.models?.find(id => !/embed/i.test(id));
        if (!model) continue;
        providerSelect.value = provider.id;
        baseInput.value = result.baseUrl || address || provider.baseUrl;
        keyInput.value = '';
        modelInput.value = model;
        updateKeyVisibility();
        persist();
        await loadModels();
        return;
      }
    }
    setStatus('No loaded local model found. Start a model server or select a hosted provider.', 'warn');
  };
  $('#coach-form').onsubmit = event => {
    event.preventDefault();
    const text = input.value;
    input.value = '';
    ask(text);
  };
  input.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      $('#coach-form').requestSubmit();
    }
  });
  stop.onclick = () => controller?.abort();

  const toggle = document.querySelector('#coach-toggle');
  toggle?.addEventListener('click', () => {
    if (aside.classList.contains('open')) close();
    else open();
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'j') {
      event.preventDefault();
      if (aside.classList.contains('open')) close();
      else open();
    }
    if (event.key === 'Escape' && aside.classList.contains('open')) close();
  });

  settings.messages = Array.isArray(settings.messages) ? settings.messages.slice(-16) : [];
  renderHistory();
  renderQuick();
  loadProviders();
  const api = { connection, open, close, isOpen: () => aside.classList.contains('open'), notify, ask };
  window.codefieldCoach = api;
  return api;
}

import { jsMethods, jsGlobals } from './js-methods.js';
import { curriculum } from './curriculum.js';

const catalogue = [];
const merged = { ...jsMethods };
for (const [owner, entries] of Object.entries(jsGlobals)) {
  merged[owner] = [...(merged[owner] || []), ...entries];
}
for (const [owner, entries] of Object.entries(merged)) {
  for (const entry of entries) {
    if (catalogue.some(item => item.owner === owner && item.name === entry.name)) continue;
    catalogue.push({ ...entry, owner });
  }
}

export const libraryCatalogue = catalogue;

/** A drawer that keeps method guides and the lesson map reachable from every page. */
export function initLibrary({ getEditor = () => null } = {}) {
  if (document.querySelector('#library')) return null;
  const panel = document.createElement('aside');
  panel.className = 'library';
  panel.id = 'library';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Learning library');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <header class="library-head">
      <div><p class="eyebrow">LEARNING LIBRARY</p><strong>Methods and lessons</strong></div>
      <button type="button" class="coach-icon" id="library-close" aria-label="Close library">✕</button>
    </header>
    <div class="library-tabs" role="tablist" aria-label="Library sections">
      <button type="button" role="tab" data-tab="methods" aria-selected="true">Methods</button>
      <button type="button" role="tab" data-tab="lessons" aria-selected="false">Lessons</button>
    </div>
    <label class="library-search"><span class="sr-only">Search the library</span><input id="library-search" type="search" placeholder="Search methods, examples, lessons…" autocomplete="off"></label>
    <div class="library-scroll">
      <div class="library-list" id="library-list"></div>
      <div class="library-detail" id="library-detail" hidden></div>
    </div>`;
  const backdrop = document.createElement('div');
  backdrop.className = 'library-backdrop';
  backdrop.hidden = true;
  document.body.append(backdrop, panel);

  const $ = selector => panel.querySelector(selector);
  const list = $('#library-list');
  const detail = $('#library-detail');
  const search = $('#library-search');
  let tab = 'methods';

  function showList() {
    list.hidden = false;
    detail.hidden = true;
    detail.replaceChildren();
  }

  function openEntry(entry) {
    list.hidden = true;
    detail.hidden = false;
    detail.replaceChildren();
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'text-button';
    back.textContent = '← All methods';
    back.onclick = showList;
    const title = document.createElement('h3');
    title.textContent = `${entry.owner}.${entry.name}`;
    const signature = document.createElement('code');
    signature.className = 'library-signature';
    signature.textContent = entry.signature;
    const description = document.createElement('p');
    description.textContent = entry.description;
    const example = document.createElement('pre');
    example.textContent = entry.example;
    const returns = document.createElement('small');
    returns.textContent = entry.returns ? `Returns ${entry.returns}` : '';
    const actions = document.createElement('div');
    actions.className = 'library-actions';
    const insert = document.createElement('button');
    insert.type = 'button';
    insert.className = 'pill-button';
    insert.textContent = 'Insert into editor';
    insert.onclick = () => {
      const editor = getEditor();
      if (!editor) {
        insert.textContent = 'No editor on this page';
        return;
      }
      editor.insert(entry.kind === 'property' ? entry.name : `${entry.name}()`);
      editor.focus();
      insert.textContent = 'Inserted';
    };
    const ask = document.createElement('button');
    ask.type = 'button';
    ask.className = 'text-button';
    ask.textContent = 'Ask coach';
    ask.onclick = () => {
      const coach = window.codefieldCoach;
      if (!coach) return;
      coach.open();
      coach.ask(`Explain ${entry.owner}.${entry.name} in one short paragraph with a tiny example, then ask me one question.`);
    };
    actions.append(insert, ask);
    detail.append(back, title, signature, description, example, returns, actions);
    detail.scrollIntoView({ block: 'nearest' });
  }

  function renderMethods() {
    const query = search.value.trim().toLowerCase();
    list.replaceChildren();
    const matches = catalogue.filter(entry => !query || `${entry.owner} ${entry.name} ${entry.description} ${entry.example}`.toLowerCase().includes(query));
    if (!matches.length) {
      list.innerHTML = '<p class="library-empty">No method matches that search.</p>';
      return;
    }
    let owner = '';
    for (const entry of matches) {
      if (entry.owner !== owner) {
        owner = entry.owner;
        const heading = document.createElement('h4');
        heading.className = 'library-group';
        heading.textContent = owner;
        list.append(heading);
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'library-item';
      const name = document.createElement('strong');
      name.textContent = entry.name;
      const hint = document.createElement('small');
      hint.textContent = entry.description;
      button.append(name, hint);
      button.onclick = () => openEntry(entry);
      list.append(button);
    }
  }

  function renderLessons() {
    const query = search.value.trim().toLowerCase();
    list.replaceChildren();
    for (const track of curriculum.tracks) {
      const lessons = track.lessonIds.map(id => curriculum.lessons.find(lesson => lesson.id === id)).filter(Boolean);
      const visible = lessons.filter(lesson => !query || `${lesson.title} ${lesson.summary} ${(lesson.objectives || []).join(' ')}`.toLowerCase().includes(query));
      if (!visible.length) continue;
      const heading = document.createElement('h4');
      heading.className = 'library-group';
      heading.textContent = track.title;
      list.append(heading);
      for (const lesson of visible) {
        const link = document.createElement('a');
        link.className = 'library-item library-lesson';
        link.href = `./learn.html?lesson=${encodeURIComponent(lesson.id)}`;
        const name = document.createElement('strong');
        name.textContent = lesson.title;
        const hint = document.createElement('small');
        hint.textContent = `${lesson.level} · ${lesson.minutes} min · ${lesson.summary}`;
        link.append(name, hint);
        list.append(link);
      }
    }
    if (!list.children.length) list.innerHTML = '<p class="library-empty">No lesson matches that search.</p>';
  }

  function render() {
    showList();
    if (tab === 'methods') renderMethods();
    else renderLessons();
  }

  function open() {
    panel.hidden = false;
    backdrop.hidden = false;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    render();
    setTimeout(() => search.focus(), 80);
  }

  function close() {
    panel.classList.remove('open');
    panel.hidden = true;
    backdrop.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
  }

  $('#library-close').onclick = close;
  backdrop.onclick = close;
  search.oninput = render;
  for (const button of panel.querySelectorAll('.library-tabs button')) {
    button.onclick = () => {
      tab = button.dataset.tab;
      for (const other of panel.querySelectorAll('.library-tabs button')) other.setAttribute('aria-selected', String(other === button));
      search.value = '';
      render();
    };
  }
  document.querySelector('#library-toggle')?.addEventListener('click', open);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) close();
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (panel.hidden) open();
      else close();
    }
  });

  return { open, close, isOpen: () => !panel.hidden };
}

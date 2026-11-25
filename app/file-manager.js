const storageKey = 'codefield.editor.files.v1';

function readFiles() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(saved) ? saved.filter(item => item && typeof item.code === 'string') : [];
  } catch {
    return [];
  }
}

function readLegacyFiles() {
  try {
    const studio = JSON.parse(localStorage.getItem('codefield.studio.v1') || '{}');
    return ['files', 'snippets'].flatMap(key => (Array.isArray(studio[key]) ? studio[key] : [])
      .filter(item => item && typeof item.name === 'string' && typeof item.code === 'string')
      .map(item => ({...item, kind:key === 'files' ? 'file' : 'snippet', legacy:true})));
  } catch {
    return [];
  }
}

export function mountFileManager(host, language, getEditor) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'file-manager-trigger';
  button.textContent = 'Files';
  button.title = 'Save and open files and snippets';
  const dialog = document.createElement('dialog');
  dialog.className = 'file-manager';
  dialog.setAttribute('aria-label', 'Files and snippets');
  dialog.innerHTML = `
    <header><div><strong>Files & snippets</strong><small>Saved in this browser</small></div><button type="button" data-close aria-label="Close">✕</button></header>
    <div class="file-manager-save"><input data-name maxlength="100" placeholder="Name your work" aria-label="Name your work">
      <button type="button" data-save>Save file</button><button type="button" data-snippet>Save selection</button>
      <label class="file-manager-import">Import<input type="file" data-import></label></div>
    <input type="search" data-search placeholder="Search this language" aria-label="Search saved work">
    <p data-status role="status"></p><div data-list class="file-manager-list"></div>`;
  host.before(button, dialog);
  const list = dialog.querySelector('[data-list]');
  const nameInput = dialog.querySelector('[data-name]');
  const status = dialog.querySelector('[data-status]');
  const search = dialog.querySelector('[data-search]');
  const persist = files => {
    try { localStorage.setItem(storageKey, JSON.stringify(files)); return true; }
    catch { status.textContent = 'Could not save. Browser storage may be full or unavailable.'; return false; }
  };
  function render() {
    list.replaceChildren();
    const query = search.value.trim().toLowerCase();
    const files = [...readFiles(), ...readLegacyFiles()].filter(item => item.language === language && typeof item.name === 'string' && item.name.toLowerCase().includes(query));
    if (!files.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No saved work for this language yet.';
      list.append(empty);
      return;
    }
    for (const item of files) {
      const row = document.createElement('div');
      row.className = 'file-manager-row';
      const label = document.createElement('span');
      const title = document.createElement('strong');
      title.textContent = item.name;
      const meta = document.createElement('small');
      meta.textContent = (item.kind === 'snippet' ? 'Snippet' : 'File') + (item.legacy ? ' · Studio' : '');
      label.append(title, meta);
      const open = document.createElement('button');
      open.type = 'button';
      open.textContent = item.kind === 'snippet' ? 'Insert' : 'Open';
      open.onclick = () => {
        const editor = getEditor();
        if (item.kind === 'snippet') editor.insert(item.code);
        else {
          if (editor.getValue() !== item.code && editor.getValue().trim() && !confirm('Replace the current editor contents with “'+item.name+'”?')) return;
          editor.selectRange(0, editor.getValue().length);
          editor.insert(item.code);
        }
        dialog.close();
        editor.focus();
      };
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '✕';
      remove.setAttribute('aria-label', 'Delete '+item.name);
      remove.onclick = () => {
        if (!confirm('Delete “'+item.name+'” from saved work?')) return;
        if (persist(readFiles().filter(file => file.id !== item.id))) render();
      };
      row.append(label, open);
      if (!item.legacy) row.append(remove);
      list.append(row);
    }
  }
  function save(kind) {
    const name = nameInput.value.trim();
    const editor = getEditor();
    const code = kind === 'snippet' ? editor.getSelection() : editor.getValue();
    if (!name) { status.textContent = 'Enter a name.'; nameInput.focus(); return; }
    if (kind === 'snippet' && !code) { status.textContent = 'Select code in the editor first.'; return; }
    const files = readFiles();
    files.unshift({id:crypto.randomUUID(), name, language, kind, code, updatedAt:Date.now()});
    if (persist(files)) { nameInput.value = ''; status.textContent = 'Saved.'; render(); }
  }
  button.onclick = () => { status.textContent = ''; search.value = ''; render(); dialog.showModal(); };
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  dialog.querySelector('[data-save]').onclick = () => save('file');
  dialog.querySelector('[data-snippet]').onclick = () => save('snippet');
  search.oninput = render;
  dialog.querySelector('[data-import]').onchange = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const code = await file.text();
      const editor = getEditor();
      if (editor.getValue().trim() && !confirm('Replace the current editor contents with “'+file.name+'”?')) return;
      editor.selectRange(0, editor.getValue().length);
      editor.insert(code);
      nameInput.value = file.name;
      status.textContent = 'Imported into the editor. Save it to keep it here.';
      dialog.close();
      editor.focus();
    } catch { status.textContent = 'Could not read this file.'; }
    finally { event.target.value = ''; }
  };
  return () => { button.remove(); dialog.remove(); };
}

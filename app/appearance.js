const button = document.createElement('button');
button.type = 'button';
button.className = 'offline-link';
button.textContent = 'Text size';
button.setAttribute('aria-label', 'Change editor text size');
let size = 14;
try { size = Math.min(22, Math.max(12, Number(localStorage.getItem('codefield.editor.size')) || 14)); } catch {}
function apply() {
  document.documentElement.style.setProperty('--editor-size', size + 'px');
  button.title = 'Editor text size ' + size + 'px. Click to change.';
}
button.onclick = () => {
  size = size >= 22 ? 12 : size + 2;
  try { localStorage.setItem('codefield.editor.size', String(size)); } catch {}
  apply();
};
document.querySelector('.top')?.append(button);
apply();

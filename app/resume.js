const link = document.querySelector('#resume-practice');
try {
  const last = JSON.parse(localStorage.getItem('codefield.practice.last.v1') || 'null');
  if (link && last?.slug && /^[a-z0-9-]+$/i.test(last.slug)) {
    link.href = './practice.html?p=' + encodeURIComponent(last.slug) + (last.stage === 'code' ? '&mode=problem' : '');
    link.textContent = 'Resume ' + (last.title || 'last problem') + ' →';
    link.hidden = false;
  }
} catch {}

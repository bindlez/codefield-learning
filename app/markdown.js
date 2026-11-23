// A deliberately small Markdown renderer. Model output and lesson prose are untrusted:
// escape first, then add only the inline and block forms this product needs.
const escapeHtml = text => String(text)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function inline(text) {
  const codes = [];
  let value = String(text).replace(/`([^`]+)`/g, (_, code) => {
    codes.push(code);
    return `\u0000${codes.length - 1}\u0000`;
  });
  value = value
    .replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\u0000(\d+)\u0000/g, (_, index) => `<code>${codes[Number(index)]}</code>`);
  return value;
}

/** Render a Markdown subset to HTML. Never returns raw model HTML. */
export function renderMarkdown(source = '') {
  const text = String(source).replace(/\r\n/g, '\n');
  const parts = text.split(/```/);
  const output = [];
  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      const lines = part.replace(/^\n/, '').split('\n');
      const language = /^[a-z0-9+#-]{1,20}$/i.test(lines[0]?.trim() || '') ? lines.shift().trim() : '';
      output.push(`<pre class="md-code"${language ? ` data-language="${escapeHtml(language)}"` : ''}><code>${escapeHtml(lines.join('\n').replace(/\n$/, ''))}</code></pre>`);
      return;
    }
    const escaped = escapeHtml(part);
    const blocks = escaped.split(/\n{2,}/);
    for (const block of blocks) {
      const trimmed = block.trim();
      if (!trimmed) continue;
      if (/^#{1,4}\s/.test(trimmed)) {
        const level = Math.min(trimmed.match(/^#+/)[0].length + 1, 5);
        output.push(`<h${level}>${inline(trimmed.replace(/^#{1,4}\s+/, ''))}</h${level}>`);
        continue;
      }
      if (/^([-*+])\s/m.test(trimmed) && trimmed.split('\n').every(line => /^([-*+])\s/.test(line.trim()))) {
        const items = trimmed.split('\n').map(line => `<li>${inline(line.trim().replace(/^([-*+])\s+/, ''))}</li>`).join('');
        output.push(`<ul>${items}</ul>`);
        continue;
      }
      if (/^\d+[.)]\s/.test(trimmed) && trimmed.split('\n').every(line => /^\d+[.)]\s/.test(line.trim()))) {
        const items = trimmed.split('\n').map(line => `<li>${inline(line.trim().replace(/^\d+[.)]\s+/, ''))}</li>`).join('');
        output.push(`<ol>${items}</ol>`);
        continue;
      }
      if (trimmed.startsWith('&gt;')) {
        output.push(`<blockquote>${inline(trimmed.replace(/^&gt;\s?/gm, ''))}</blockquote>`);
        continue;
      }
      if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
        output.push('<hr>');
        continue;
      }
      output.push(`<p>${inline(trimmed).replace(/\n/g, '<br>')}</p>`);
    }
  });
  return output.join('');
}

/** Strip Markdown to readable text, used for titles and log summaries. */
export function markdownToText(source = '') {
  return String(source)
    .replace(/```[\s\S]*?```/g, 'code')
    .replace(/[#>*`_]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

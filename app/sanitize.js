// Browser-side defence in depth. The server already sanitises scraped HTML, but lesson
// content and cached responses are still treated as untrusted before innerHTML.
const allowed = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'code', 'pre', 'ul', 'ol', 'li', 'blockquote', 'sup', 'sub', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'hr', 'a', 'h3', 'h4']);

export function sanitizeHtml(html = '') {
  return String(html)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\s*\/?\s*([a-zA-Z0-9]+)([^>]*)>/g, (tag, name, rest) => {
      const lower = name.toLowerCase();
      if (!allowed.has(lower)) return '';
      if (tag.startsWith('</')) return `</${lower}>`;
      if (lower === 'a') {
        const href = /href\s*=\s*["']([^"']+)["']/i.exec(rest)?.[1] || '';
        if (!/^https:\/\//i.test(href)) return '<a>';
        return `<a href="${href.replace(/"/g, '&quot;')}" target="_blank" rel="noopener noreferrer">`;
      }
      if (lower === 'br' || lower === 'hr') return `<${lower}>`;
      return tag.startsWith('</') ? `</${lower}>` : `<${lower}>`;
    })
    .replace(/<(?!\/?(?:p|br|strong|b|em|i|code|pre|ul|ol|li|blockquote|sup|sub|span|div|table|thead|tbody|tr|td|th|hr|a|h3|h4)(?:\s|>|\/))/g, '&lt;');
}

export function textOf(html = '') {
  const frame = document.createElement('template');
  frame.innerHTML = sanitizeHtml(html);
  return (frame.content.textContent || '').replace(/\s+/g, ' ').trim();
}

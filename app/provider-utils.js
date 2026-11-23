// Small, testable helpers for deciding which local endpoint to probe.
export const STRATA_DESKTOP = 'http://127.0.0.1:47831/v1';
export const STRATA_TERMINAL = 'http://127.0.0.1:8080/v1';

/** OpenAI-compatible servers expect an API root; add /v1 when the learner omits it. */
export function apiBase(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  try {
    const url = new URL(text);
    if (!/\/v\d+\/?$/.test(url.pathname.replace(/\/+$/, ''))) {
      url.pathname = `${url.pathname.replace(/\/+$/, '')}/v1`;
    }
    return url.toString().replace(/\/+$/, '');
  } catch {
    return text;
  }
}

/**
 * A typed address wins. Otherwise Strata Desktop is tried first, then the terminal
 * build. Native providers use their server-side default and need no candidate.
 */
export function modelCandidates({ providerId, kind, typed, preferred }) {
  const text = String(typed || '').trim();
  if (text) return [kind === 'openai' ? apiBase(text) : text];
  if (providerId === 'strata') return [...new Set([preferred, STRATA_DESKTOP, STRATA_TERMINAL].filter(Boolean))];
  return [undefined];
}

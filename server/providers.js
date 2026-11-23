// Provider registry for local and self-hosted model servers. Nothing here talks to a
// cloud service: every endpoint is loopback, private-network, or explicitly configured below.
import { localConfig } from './config.js';

const loopbackHosts = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);

/** Accept loopback and RFC 1918 addresses; public hosts stay blocked. */
export function isLocalModelHost(hostname) {
  if (loopbackHosts.has(hostname)) return true;
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(hostname);
  if (!match) return false;
  const octets = match.slice(1).map(Number);
  if (octets.some(value => value > 255)) return false;
  const [a, b] = octets;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

export const providerDefs = [
  {
    id: 'ollama',
    label: 'Ollama',
    kind: 'ollama',
    defaultBase: 'http://127.0.0.1:11434',
    env: { base: 'OLLAMA_BASE_URL', key: 'OLLAMA_API_KEY', model: 'OLLAMA_MODEL' },
    note: 'Native Ollama API. Models you have pulled appear automatically.'
  },
  {
    id: 'strata',
    label: 'Strata',
    kind: 'openai',
    defaultBase: localConfig.strataBaseUrl || 'http://127.0.0.1:47831/v1',
    env: { base: 'STRATA_BASE_URL', key: 'STRATA_API_KEY', model: 'STRATA_MODEL' },
    note: 'Strata Desktop by default; the terminal build on port 8080 is detected automatically.'
  },
  {
    id: 'lmstudio',
    label: 'LM Studio',
    kind: 'openai',
    defaultBase: 'http://127.0.0.1:1234/v1',
    env: { base: 'LMSTUDIO_BASE_URL', key: 'LMSTUDIO_API_KEY', model: 'LMSTUDIO_MODEL' },
    note: 'Start the LM Studio local server and load a model.'
  },
  {
    id: 'llamacpp',
    label: 'llama.cpp',
    kind: 'openai',
    defaultBase: 'http://127.0.0.1:8080/v1',
    env: { base: 'LLAMACPP_BASE_URL', key: 'LLAMACPP_API_KEY', model: 'LLAMACPP_MODEL' },
    note: 'llama-server with the OpenAI-compatible chat endpoint.'
  },
  {
    id: 'custom',
    label: 'Custom OpenAI-compatible',
    kind: 'openai',
    defaultBase: 'http://127.0.0.1:8000/v1',
    env: { base: 'CODEFIELD_AI_BASE_URL', key: 'CODEFIELD_AI_KEY', model: 'CODEFIELD_AI_MODEL' },
    note: 'vLLM, LocalAI, or anything speaking /chat/completions.'
  }
];

export function normalizeBase(value, fallback) {
  const raw = (value || fallback || '').trim();
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('The model address is not a valid URL.');
  }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('The model address must use http or https.');
  if (!isLocalModelHost(url.hostname)) {
    throw new Error('Only loopback or private-network model servers are allowed (127.0.0.1, 10.x, 172.16-31.x or 192.168.x).');
  }
  if (url.username || url.password) throw new Error('Credentials in the address are not supported.');
  return url.toString().replace(/\/+$/, '');
}

export function resolveProvider(id, overrides = {}) {
  const def = providerDefs.find(provider => provider.id === id);
  if (!def) throw new Error(`Unknown model provider: ${id}`);
  const base = normalizeBase(overrides.baseUrl || process.env[def.env.base] || localConfig[`${def.id}BaseUrl`], def.defaultBase);
  const apiKey = overrides.apiKey || process.env[def.env.key] || localConfig[`${def.id}ApiKey`] || (def.id === 'strata' ? 'local' : '');
  const model = overrides.model || process.env[def.env.model] || localConfig[`${def.id}Model`] || '';
  return { ...def, base, apiKey, model };
}

export function publicProviders() {
  return providerDefs.map(def => {
    let base = def.defaultBase;
    try {
      base = normalizeBase(process.env[def.env.base] || localConfig[`${def.id}BaseUrl`], def.defaultBase);
    } catch {
      base = def.defaultBase;
    }
    return {
      id: def.id,
      label: def.label,
      kind: def.kind,
      baseUrl: base,
      note: def.note,
      model: process.env[def.env.model] || localConfig[`${def.id}Model`] || '',
      hasKey: Boolean(process.env[def.env.key] || localConfig[`${def.id}ApiKey`] || def.id === 'strata')
    };
  });
}

export function authHeaders(provider) {
  const headers = { 'Content-Type': 'application/json' };
  if (provider.apiKey) headers.Authorization = `Bearer ${provider.apiKey}`;
  return headers;
}

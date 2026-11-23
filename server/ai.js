import { resolveProvider, authHeaders } from './providers.js';

const MAX_MESSAGES = 40;
const MAX_TOTAL_CHARS = 60000;

export class AiError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.status = status;
  }
}

/** Validate and trim a chat request so a model server never receives arbitrary JSON. */
export function readChatRequest(body) {
  if (!body || typeof body !== 'object') throw new AiError('Expected a JSON body.', 400);
  const providerId = String(body.provider || 'ollama');
  const model = String(body.model || '').trim().slice(0, 200);
  if (!model) throw new AiError('Choose a model first.', 400);
  if (!Array.isArray(body.messages) || !body.messages.length) throw new AiError('Send at least one message.', 400);
  if (body.messages.length > MAX_MESSAGES) throw new AiError('Too many messages in one request.', 413);
  let total = 0;
  const messages = body.messages.map(message => {
    const role = message?.role;
    const content = typeof message?.content === 'string' ? message.content : '';
    if (!['system', 'user', 'assistant'].includes(role) || !content) throw new AiError('Each message needs a role and content.', 400);
    total += content.length;
    return { role, content };
  });
  if (total > MAX_TOTAL_CHARS) throw new AiError('The conversation is too large for one request.', 413);
  const temperature = Number.isFinite(body.temperature) ? Math.min(Math.max(body.temperature, 0), 2) : 0.3;
  const maxTokens = Number.isFinite(body.maxTokens) ? Math.min(Math.max(Math.round(body.maxTokens), 64), 8192) : 1400;
  return {
    providerId,
    model,
    messages,
    temperature,
    maxTokens,
    stream: body.stream !== false,
    think: body.think === true,
    baseUrl: body.baseUrl,
    apiKey: body.apiKey
  };
}

async function timeoutFetch(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, redirect:'error', signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function networkMessage(error, provider) {
  if (error?.name === 'AbortError') return `${provider.label} did not answer in time.`;
  if (error?.cause?.code === 'ECONNREFUSED' || /fetch failed/i.test(error?.message || '')) {
    return `Cannot reach ${provider.label} at ${provider.base}. Start the server, load a model, then retry.`;
  }
  return `${provider.label} request failed: ${error.message}`;
}

export async function listModels(providerId, overrides = {}) {
  const provider = resolveProvider(providerId, overrides);
  const url = provider.kind === 'ollama' ? `${provider.base}/api/tags` : `${provider.base}/models`;
  try {
    const response = await timeoutFetch(url, { headers: authHeaders(provider) }, 8000);
    if (!response.ok) throw new AiError(`${provider.label} returned HTTP ${response.status}.`);
    const data = await response.json();
    const models = provider.kind === 'ollama'
      ? (data.models || []).map(item => item.name).filter(Boolean)
      : (data.data || []).map(item => item.id).filter(Boolean);
    return {
      provider: provider.id,
      label: provider.label,
      baseUrl: provider.base,
      ok: true,
      models: [...new Set(models)].sort((a, b) => a.localeCompare(b)),
      suggested: provider.model || models[0] || ''
    };
  } catch (error) {
    return {
      provider: provider.id,
      label: provider.label,
      baseUrl: provider.base,
      ok: false,
      models: [],
      suggested: provider.model || '',
      error: error instanceof AiError ? error.message : networkMessage(error, provider)
    };
  }
}

function readLines(response, onLine) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  return (async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let index;
      while ((index = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, index).replace(/\r$/, '');
        buffer = buffer.slice(index + 1);
        if (line.trim()) onLine(line);
      }
    }
    if (buffer.trim()) onLine(buffer.trim());
  })();
}

/** Yield plain text deltas from an Ollama or OpenAI-compatible streaming response. */
export async function* streamChat(request, signal) {
  const provider = resolveProvider(request.providerId, { baseUrl: request.baseUrl, apiKey: request.apiKey });
  const url = provider.kind === 'ollama' ? `${provider.base}/api/chat` : `${provider.base}/chat/completions`;
  const payload = provider.kind === 'ollama'
    ? {
        model: request.model,
        messages: request.messages,
        stream: true,
        think: request.think === true,
        options: { temperature: request.temperature, num_predict: request.maxTokens }
      }
    : {
        model: request.model,
        messages: request.messages,
        stream: true,
        temperature: request.temperature,
        max_tokens: request.maxTokens
      };
  let response;
  try {
    response = await fetch(url, {
      method: 'POST', redirect:'error',
      headers: authHeaders(provider),
      body: JSON.stringify(payload),
      signal
    });
  } catch (error) {
    throw new AiError(networkMessage(error, provider));
  }
  if (!response.ok) {
    let detail = '';
    try {
      detail = (await response.text()).slice(0, 300);
    } catch {}
    throw new AiError(`${provider.label} returned HTTP ${response.status}${detail ? `: ${detail}` : ''}`);
  }
  const queue = [];
  let finished = false;
  let failure = null;
  let wake = null;
  const onAbort = () => {
    failure = new AiError('Stopped.');
    finished = true;
    wake?.();
  };
  if (signal) {
    if (signal.aborted) onAbort();
    else signal.addEventListener('abort', onAbort, { once: true });
  }
  const emit = chunk => {
    queue.push(chunk);
    wake?.();
  };
  const consume = readLines(response, line => {
    try {
      if (provider.kind === 'ollama') {
        const data = JSON.parse(line);
        if (data.message?.content) emit(data.message.content);
        if (data.done) finished = true;
        if (data.error) failure = new AiError(String(data.error));
      } else {
        if (!line.startsWith('data:')) return;
        const value = line.slice(5).trim();
        if (value === '[DONE]') {
          finished = true;
          return;
        }
        const data = JSON.parse(value);
        if (data.error) failure = new AiError(String(data.error.message || data.error));
        const choice = data.choices?.[0];
        const text = choice?.delta?.content ?? choice?.message?.content ?? '';
        if (text) emit(text);
        if (choice?.finish_reason) finished = true;
      }
    } catch {
      // A malformed line is not fatal: keep reading the rest of the stream.
    }
  })
    .catch(error => {
      failure = new AiError(networkMessage(error, provider));
    })
    .finally(() => {
      finished = true;
      wake?.();
    });

  try {
    while (!finished || queue.length) {
      if (queue.length) {
        yield queue.shift();
        continue;
      }
      if (finished) break;
      await new Promise(resolve => {
        wake = resolve;
      });
      wake = null;
    }
    if (failure) throw failure;
  } finally {
    signal?.removeEventListener?.('abort', onAbort);
    if (!finished) signal?.abort?.();
    await consume.catch(() => {});
  }
}

export async function completeChat(request, signal) {
  let text = '';
  for await (const chunk of streamChat(request, signal)) text += chunk;
  return text;
}

import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';
import { AiError, listModels, readChatRequest, streamChat } from './ai.js';
import { LeetCodeError, getProblem, resolveProblem, searchProblems } from './leetcode.js';
import { publicProviders } from './providers.js';

const runFile = promisify(execFile);
const floatingHelper = fileURLToPath(new URL('./floating-window.ps1', import.meta.url));

const MAX_BODY = 1024 * 1024;

function json(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new AiError('Request body is too large.', 413));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new AiError('Expected a JSON body.', 400));
      }
    });
    req.on('error', reject);
  });
}

function sse(res, event) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

async function chat(req, res) {
  const body = await readBody(req);
  const request = readChatRequest(body);
  if (!request.stream) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 180000);
    res.on('close', () => controller.abort());
    let text = '';
    try {
      for await (const chunk of streamChat(request, controller.signal)) text += chunk;
      json(res, 200, { ok: true, text });
    } finally {
      clearTimeout(timer);
    }
    return;
  }
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 180000);
  let closed = false;
  res.on('close', () => {
    closed = true;
    controller.abort();
  });
  try {
    for await (const chunk of streamChat(request, controller.signal)) {
      if (closed) break;
      sse(res, { delta: chunk });
    }
    if (!closed) sse(res, { done: true });
  } catch (error) {
    if (!closed) sse(res, { error: error.message || 'The model stream failed.' });
  } finally {
    clearTimeout(timer);
    if (!closed) res.end();
  }
}

export async function handleApi(req, res, url) {
  const path = url.pathname;
  try {
    if (path === '/api/floating-window' && req.method === 'POST') {
      if (process.platform !== 'win32') return json(res, 501, {error:'Borderless windows are available on Windows.'});
      const body = await readBody(req);
      if (!/^[0-9a-f-]{36}$/.test(body.token || '') || !['attach','move'].includes(body.action))
        return json(res, 400, {error:'Invalid window request.'});
      const dx = Number(body.dx || 0), dy = Number(body.dy || 0);
      if (![dx,dy].every(value => Number.isInteger(value) && Math.abs(value) <= 10000))
        return json(res, 400, {error:'Invalid window position.'});
      try {
        await runFile('powershell.exe', ['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',floatingHelper,'-Token',body.token,'-Action',body.action,'-Dx',String(dx),'-Dy',String(dy)], {windowsHide:true, timeout:18000});
        return json(res, 200, {ok:true});
      } catch {
        return json(res, 503, {error:'Could not configure the floating window.'});
      }
    }
    if (path === '/api/health' && req.method === 'GET') {
      return json(res, 200, { ok: true, name: 'codefield', version: '0.5.1-alpha', providers: publicProviders().map(item => item.id) });
    }
    if (path === '/api/ai/providers' && req.method === 'GET') {
      return json(res, 200, { providers: publicProviders() });
    }
    if (path === '/api/ai/models' && req.method === 'POST') {
      const body = await readBody(req);
      const result = await listModels(String(body.provider || 'ollama'), { baseUrl: body.baseUrl, apiKey: body.apiKey });
      return json(res, 200, result);
    }
    if (path === '/api/ai/chat' && req.method === 'POST') {
      return await chat(req, res);
    }
    if (path === '/api/leetcode/problems' && req.method === 'GET') {
      const result = await searchProblems({
        query: url.searchParams.get('query') || '',
        difficulty: url.searchParams.get('difficulty') || '',
        tag: url.searchParams.get('tag') || '',
        limit: url.searchParams.get('limit') || 30,
        skip: url.searchParams.get('skip') || 0,
        refresh: url.searchParams.get('refresh') === '1'
      });
      return json(res, 200, result);
    }
    if (path === '/api/leetcode/problem' && req.method === 'GET') {
      const result = await getProblem(url.searchParams.get('slug'), { preferLive: url.searchParams.get('live') === '1' });
      return json(res, 200, result);
    }
    if (path === '/api/leetcode/resolve' && req.method === 'GET') {
      const result = await resolveProblem(url.searchParams.get('q'));
      return json(res, 200, result);
    }
    return json(res, 404, { error: 'Unknown API route.' });
  } catch (error) {
    const status = error instanceof AiError || error instanceof LeetCodeError ? error.status : 500;
    if (status === 500) console.error(error);
    if (!res.headersSent) return json(res, status, { error: error.message || 'Server error.' });
    res.end();
  }
}







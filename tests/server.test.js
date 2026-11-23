import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeHtml, examplesFromContent, decodeEntities, getProblem, resolveProblem } from '../server/leetcode.js';
import { normalizeBase, resolveProvider } from '../server/providers.js';
import { AiError, readChatRequest } from '../server/ai.js';
import { renderMarkdown, markdownToText } from '../app/markdown.js';
import { apiBase, modelCandidates, STRATA_DESKTOP, STRATA_TERMINAL } from '../app/provider-utils.js';

test('sanitises scraped HTML and drops unsafe attributes', () => {
  const html = '<p onclick="steal()">Hi <strong>there</strong></p><script>alert(1)</script><img src=x onerror="alert(2)"><a href="javascript:alert(1)">bad</a><a href="https://leetcode.com/x">ok</a>';
  const clean = sanitizeHtml(html);
  assert.ok(!/script/i.test(clean));
  assert.ok(!/onclick|onerror|javascript:/i.test(clean));
  assert.match(clean, /<strong>there<\/strong>/);
  assert.match(clean, /href="https:\/\/leetcode.com\/x"/);
});

test('extracts published input and output pairs', () => {
  const html = `<p>Add them.</p>
<pre>
<strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9.
</pre>
<pre>
<strong>Input:</strong> nums = [3,2,4], target = 6
<strong>Output:</strong> [1,2]
</pre>`;
  const examples = examplesFromContent(html);
  assert.deepEqual(examples, [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
  ]);
  assert.equal(decodeEntities('a &lt; b &amp; c'), 'a < b & c');
});

test('only loopback and private-network model servers are allowed', () => {
  assert.equal(normalizeBase('http://127.0.0.1:8080/v1/'), 'http://127.0.0.1:8080/v1');
  assert.equal(normalizeBase('http://10.0.0.157:47832/v1'), 'http://10.0.0.157:47832/v1');
  assert.equal(normalizeBase('http://192.168.1.20:1234/v1'), 'http://192.168.1.20:1234/v1');
  assert.throws(() => normalizeBase('http://203.0.113.5:8080/v1'), /private-network/i);
  assert.throws(() => normalizeBase('https://example.com/v1'), /private-network/i);
  assert.throws(() => normalizeBase('file:///etc/passwd'), /http/i);
  const provider = resolveProvider('strata', { baseUrl: 'http://127.0.0.1:47831/v1' });
  assert.equal(provider.kind, 'openai');
  assert.equal(provider.base, 'http://127.0.0.1:47831/v1');
  const fallback = resolveProvider('strata', {});
  assert.match(fallback.base, /^http:\/\/(127\.0\.0\.1|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01]))/);
  const terminal = resolveProvider('strata', { baseUrl: 'http://127.0.0.1:8080/v1' });
  assert.match(terminal.base, /:8080\/v1$/);
});

test('chat requests are validated and clamped', () => {
  const request = readChatRequest({
    provider: 'ollama',
    model: 'qwen',
    messages: [{ role: 'user', content: 'hello' }],
    temperature: 9,
    maxTokens: 999999
  });
  assert.equal(request.temperature, 2);
  assert.equal(request.maxTokens, 8192);
  assert.throws(() => readChatRequest({ model: '', messages: [] }), AiError);
  assert.throws(() => readChatRequest({ model: 'x', messages: [{ role: 'system', content: 'x' }, { role: 'tool', content: 'x' }] }), AiError);
});

test('built-in problem details include a runnable signature', async () => {
  const problem = await getProblem('two-sum');
  assert.equal(problem.source, 'seed');
  assert.equal(problem.functionName, 'twoSum');
  assert.equal(problem.params.length, 2);
  assert.ok(problem.tests.length >= 3);
  assert.match(problem.content, /two numbers/);
});

test('rejects invalid problem slugs without a network request', async () => {
  await assert.rejects(() => getProblem('../etc/passwd'), /not valid/);
  await assert.rejects(() => resolveProblem('%%%'), /number, title slug, or LeetCode URL/i);
});

test('resolves a slug and a full LeetCode URL', async () => {
  const bySlug = await resolveProblem('two-sum');
  assert.equal(bySlug.slug, 'two-sum');
  const byUrl = await resolveProblem('https://leetcode.com/problems/two-sum/description/');
  assert.equal(byUrl.slug, 'two-sum');
});

test('Strata Desktop is preferred over the terminal port', () => {
  const candidates = modelCandidates({ providerId: 'strata', kind: 'openai', typed: '' });
  assert.deepEqual(candidates, [STRATA_DESKTOP, STRATA_TERMINAL]);
  const configured = modelCandidates({ providerId: 'strata', kind: 'openai', typed: '', preferred: 'http://10.0.0.157:47832/v1' });
  assert.equal(configured[0], 'http://10.0.0.157:47832/v1');
  assert.ok(configured.includes(STRATA_DESKTOP));
  assert.deepEqual(modelCandidates({ providerId: 'ollama', kind: 'ollama', typed: '' }), [undefined]);
  assert.deepEqual(modelCandidates({ providerId: 'strata', kind: 'openai', typed: 'http://127.0.0.1:9000' }), ['http://127.0.0.1:9000/v1']);
  assert.equal(apiBase('http://127.0.0.1:47831'), 'http://127.0.0.1:47831/v1');
  assert.equal(apiBase('http://127.0.0.1:47831/v1'), 'http://127.0.0.1:47831/v1');
  assert.equal(apiBase('http://127.0.0.1:47831/api'), 'http://127.0.0.1:47831/api/v1');
});

test('markdown never returns raw model HTML', () => {
  const html = renderMarkdown('<img src=x onerror=alert(1)>\n\n**bold** and `code`');
  assert.ok(!/<img/i.test(html));
  assert.match(html, /&lt;img/);
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /<code>code<\/code>/);
  const fenced = renderMarkdown('```js\nconst x = "<script>";\n```');
  assert.match(fenced, /md-code/);
  assert.ok(!/<script>/i.test(fenced));
  assert.equal(markdownToText('## Title\n\n`x`'), 'Title x');
});

test('markdown code blocks survive streaming fragments', () => {
  const partial = renderMarkdown('Try this:\n\n```js\nconst a = 1;');
  assert.match(partial, /<pre class="md-code" data-language="js">/);
});

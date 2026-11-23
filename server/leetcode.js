import {sanitizeHtml} from '../app/sanitize.js';
export {sanitizeHtml};
import { problems as seedProblems } from '../app/problems.js';
import {seedDetail, filterCatalog} from '../app/catalog.js';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = join(root, '.cache', 'leetcode');
const index = JSON.parse(await readFile(join(root, 'app', 'catalog.json'), 'utf8')).questions;
const endpoint = 'https://leetcode.com/graphql/';
const LIST_TTL = 6 * 60 * 60 * 1000;
const PROBLEM_TTL = 7 * 24 * 60 * 60 * 1000;
const MIN_GAP = 450;

export class LeetCodeError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.status = status;
  }
}

let lastRequest = 0;
let queue = Promise.resolve();

/** Serialize outbound requests and keep a polite gap between them. */
function schedule(task) {
  const run = queue.then(async () => {
    const wait = Math.max(0, MIN_GAP - (Date.now() - lastRequest));
    if (wait) await new Promise(resolve => setTimeout(resolve, wait));
    lastRequest = Date.now();
    return task();
  });
  queue = run.catch(() => {});
  return run;
}

async function graphql(query, variables) {
  return schedule(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://leetcode.com/problemset/all/',
          'User-Agent': 'Codefield/0.4 (personal learning workspace)'
        },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal
      });
      if (!response.ok) throw new LeetCodeError(`LeetCode returned HTTP ${response.status}.`);
      const data = await response.json();
      if (data.errors?.length) throw new LeetCodeError(data.errors[0].message || 'LeetCode rejected the query.');
      return data.data;
    } catch (error) {
      if (error instanceof LeetCodeError) throw error;
      if (error.name === 'AbortError') throw new LeetCodeError('LeetCode took too long to answer.');
      throw new LeetCodeError('LeetCode is unreachable from this machine. Cached and built-in problems still work.');
    } finally {
      clearTimeout(timer);
    }
  });
}

const key = value => createHash('sha1').update(JSON.stringify(value)).digest('hex');

async function readCache(name) {
  try {
    return JSON.parse(await readFile(join(cacheDir, name), 'utf8'));
  } catch {
    return null;
  }
}

async function writeCache(name, value) {
  try {
    await mkdir(cacheDir, { recursive: true });
    await writeFile(join(cacheDir, name), JSON.stringify(value), 'utf8');
  } catch {
    // A read-only checkout still works; caching is best-effort.
  }
}

async function cached(name, ttl, load, options = {}) {
  const entry = await readCache(name);
  if (!options.refresh && entry && Date.now() - entry.time < ttl) return { ...entry.value, source: 'cache', fetchedAt: entry.time };
  try {
    const value = await load();
    await writeCache(name, { time: Date.now(), value });
    return { ...value, source: 'live', fetchedAt: Date.now() };
  } catch (error) {
    if (entry) return { ...entry.value, source: 'cache', fetchedAt: entry.time, stale: true, warning: error.message };
    throw error;
  }
}

const listQuery = `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
    total: totalNum
    questions: data { acRate difficulty questionFrontendId title titleSlug topicTags { name slug } isPaidOnly }
  }
}`;

const detailQuery = `query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId questionFrontendId title titleSlug content difficulty isPaidOnly
    exampleTestcases metaData hints categoryTitle
    topicTags { name slug }
    codeSnippets { lang langSlug code }
  }
}`;

export function decodeEntities(text = '') {
  return String(text)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

const plain = html => decodeEntities(String(html).replace(/<[^>]+>/g, '\n')).replace(/\n{2,}/g, '\n').trim();

/** LeetCode puts one example per <pre> block; extract the published input/output strings. */
export function examplesFromContent(html = '') {
  const blocks = String(html).match(/<pre[\s\S]*?<\/pre>/gi) || [];
  const examples = [];
  for (const block of blocks) {
    const text = plain(block);
    const input = /Input:\s*([\s\S]*?)(?:\n|Output:)/.exec(text)?.[1]?.trim();
    const output = /Output:\s*([\s\S]*?)(?:\n|Explanation:|$)/.exec(text)?.[1]?.trim();
    if (output) examples.push({ input: input || '', output });
  }
  return examples;
}

export async function fetchCatalogPage(offset, size, filters = {}) {
  const result = await graphql(listQuery, { categorySlug: '', limit: size, skip: offset, filters });
  const list = result?.problemsetQuestionList;
  if (!list) throw new LeetCodeError('LeetCode returned an unexpected response.');
  return {
    total: list.total,
    questions: (list.questions || []).map(item => ({
      number: Number(item.questionFrontendId) || null,
      id: item.questionFrontendId,
      title: item.title,
      slug: item.titleSlug,
      difficulty: item.difficulty,
      acceptance: item.acRate == null ? null : Math.round(item.acRate * 10) / 10,
      tags: item.topicTags || [],
      paidOnly: Boolean(item.isPaidOnly)
    }))
  };
}

export async function searchProblems({ query = '', difficulty = '', tag = '', limit = 30, skip = 0, refresh = false } = {}) {
  const filters = {};
  const level = String(difficulty).toUpperCase();
  if (['EASY', 'MEDIUM', 'HARD'].includes(level)) filters.difficulty = level;
  if (tag) filters.tags = [String(tag)];
  if (query) filters.searchKeywords = String(query).slice(0, 100);
  const size = Math.min(Math.max(Number(limit) || 30, 1), 60);
  const offset = Math.max(Number(skip) || 0, 0);
  try {
    const data = await cached(`list-${key({ ...filters, size, offset })}.json`, LIST_TTL, async () => {
      return fetchCatalogPage(offset, size, filters);
    }, { refresh });
    return { ...data, offset, limit: size };
  } catch (error) {
    return {...filterCatalog(index, {query, difficulty, tag, skip:offset, limit:size}), warning:error.message};
  }
}

/** Accept a problem number, a title slug, or a full LeetCode URL. */
export async function resolveProblem(input) {
  const text = String(input || '').trim();
  if (!text) throw new LeetCodeError('Enter a problem number, slug or URL.', 400);
  const urlMatch = text.match(/leetcode\.com\/problems\/([a-zA-Z0-9-]+)/i);
  let slug = urlMatch ? urlMatch[1].toLowerCase() : '';
  if (!slug && !/^\d+$/.test(text) && /^[a-z0-9-]+$/i.test(text)) slug = text.toLowerCase();
  if (!slug && /^\d{1,5}$/.test(text)) {
    const number = Number(text);
    const builtIn = seedProblems.find(problem => Number(problem.number) === number);
    if (builtIn) return seedDetail(builtIn);
    const indexed = index.find(item => item.number === number);
    if (indexed) return getProblem(indexed.slug);
    const list = await searchProblems({ query: text, limit: 50 });
    const match = (list.questions || []).find(question => Number(question.number) === number);
    if (!match) throw new LeetCodeError(`Problem ${number} was not found. Try its title slug instead.`, 404);
    slug = match.slug;
  }
  if (!slug) throw new LeetCodeError('Use a problem number, title slug, or LeetCode URL.', 400);
  return getProblem(slug);
}

export async function getProblem(slug, { preferLive = false } = {}) {
  const clean = String(slug || '').trim();
  if (!/^[a-z0-9-]{1,120}$/i.test(clean)) throw new LeetCodeError('That problem slug is not valid.', 400);
  const seed = seedProblems.find(problem => problem.id === clean);
  if (seed && !preferLive) return seedDetail(seed);
  const data = await cached(`problem-${key(clean)}.json`, PROBLEM_TTL, async () => {
    const result = await graphql(detailQuery, { titleSlug: clean });
    const q = result?.question;
    if (!q) throw new LeetCodeError('LeetCode could not find that problem.', 404);
    let meta = null;
    try {
      meta = q.metaData ? JSON.parse(q.metaData) : null;
    } catch {}
    return {
      id: q.questionFrontendId,
      number: Number(q.questionFrontendId) || null,
      title: q.title,
      slug: q.titleSlug,
      difficulty: q.difficulty,
      paidOnly: Boolean(q.isPaidOnly),
      content: q.isPaidOnly ? '<p>This is a LeetCode Premium problem. The statement is not public.</p>' : sanitizeHtml(q.content || ''),
      examples: q.isPaidOnly ? [] : examplesFromContent(q.content || ''),
      hints: q.isPaidOnly ? [] : q.hints || [],
      tags: q.topicTags || [],
      snippets: Object.fromEntries((q.codeSnippets || []).map(snippet => [snippet.langSlug, snippet.code])),
      meta: meta ? JSON.stringify(meta) : '',
      exampleTestcases: q.exampleTestcases || '',
      categoryTitle: q.categoryTitle || '',
      url: `https://leetcode.com/problems/${q.titleSlug}/`,
      source: 'leetcode'
    };
  });
  return seed ? {...seedDetail(seed), snippets:{...seedDetail(seed).snippets, ...data.snippets}} : data;
}

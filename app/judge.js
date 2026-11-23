// Executes a learner's function against structured tests inside a Web Worker.
// LeetCode publishes example inputs as one raw value per line plus a function signature in
// metaData; this module turns those into typed arguments and comparable results.

const identifier = /^[A-Za-z_$][\w$]*$/;

export function parseMeta(raw) {
  if (!raw) return null;
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!value || !identifier.test(value.name || '')) return null;
    if (!Array.isArray(value.params)) return null;
    return {
      name: value.name,
      params: value.params.map(param => ({ name: String(param.name || 'arg'), type: String(param.type || 'integer') })),
      returns: { type: String(value.return?.type || value.returns?.type || 'integer') }
    };
  } catch {
    return null;
  }
}

const unquote = text => {
  const value = String(text).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
  }
  return value;
};

/** Parse one LeetCode-printed value into a JavaScript value of the declared type. */
export function parseValue(text, type = 'integer') {
  const raw = String(text ?? '').trim();
  if (!raw) return null;
  if (type.endsWith('[]') || type === 'ListNode' || type === 'TreeNode') {
    try {
      return JSON.parse(raw.replace(/\bNone\b/g, 'null').replace(/\btrue\b/g, 'true').replace(/\bfalse\b/g, 'false'));
    } catch {
      return null;
    }
  }
  switch (type) {
    case 'integer':
      return Number.parseInt(raw, 10);
    case 'double':
      return Number.parseFloat(raw);
    case 'boolean':
      return raw === 'true';
    case 'character':
      return unquote(raw).slice(0, 1);
    case 'string':
      return unquote(raw);
    default:
      return unquote(raw);
  }
}

/** Split `exampleTestcases` into one argument list per example. */
export function parseExampleTestcases(text, params = []) {
  const lines = String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
  if (!params.length) return [];
  const groups = [];
  for (let index = 0; index + params.length <= lines.length; index += params.length) {
    groups.push(params.map((param, offset) => parseValue(lines[index + offset], param.type)));
  }
  return groups;
}

const trailingNulls = value => {
  const copy = [...value];
  while (copy.length && copy.at(-1) === null) copy.pop();
  return copy;
};

function normalize(value, type) {
  if (type === 'TreeNode' && Array.isArray(value)) return trailingNulls(value);
  if (Array.isArray(value)) return value.map(item => normalize(item, type.replace(/\[\]$/, '')));
  return value;
}

/** Deep, type-aware comparison. Doubles use a small relative tolerance. */
export function compareValues(actual, expected, type = '') {
  if (type === 'double') return Math.abs(Number(actual) - Number(expected)) <= 1e-5 * Math.max(1, Math.abs(Number(expected)));
  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || actual.length !== expected.length) return false;
    const inner = type.replace(/\[\]$/, '');
    return expected.every((item, index) => compareValues(actual[index], item, inner));
  }
  if (expected === null) return actual === null || actual === undefined;
  if (typeof expected === 'number') return Number(actual) === expected;
  if (typeof expected === 'boolean') return actual === expected;
  return String(actual) === String(expected);
}

/** Build the tests for a problem, whether it came from the built-in set or LeetCode. */
export function testsFromProblem(problem) {
  if (Array.isArray(problem.tests) && problem.tests.length) {
    const meta = parseMeta(problem.meta);
    return {
      tests: problem.tests.map(test => ({ args: test.args, expected: test.expected, known: true })),
      functionName: problem.functionName || meta?.name || '',
      params: problem.params || meta?.params || [],
      returns: problem.returns || meta?.returns || { type: 'integer' },
      note: ''
    };
  }
  const meta = parseMeta(problem.meta);
  if (!meta) {
    return { tests: [], functionName: '', params: [], returns: { type: 'integer' }, note: 'This problem has no machine-readable signature, so there are no runnable examples.' };
  }
  const groups = parseExampleTestcases(problem.exampleTestcases, meta.params);
  const expected = (problem.examples || []).map(example => example.output);
  const tests = groups.map((args, index) => {
    const output = expected[index];
    return {
      args,
      expected: output === undefined ? undefined : parseValue(output, meta.returns.type),
      known: output !== undefined,
      printed: output === undefined ? '' : String(output)
    };
  });
  const note = tests.length
    ? expected.length < tests.length
      ? `${tests.length} examples found; ${tests.length - expected.length} have no published output and are shown for self-checking.`
      : ''
    : 'LeetCode did not publish runnable examples for this problem.';
  return { tests, functionName: meta.name, params: meta.params, returns: meta.returns, note };
}

const toJsLiteral = value => JSON.stringify(value === undefined ? null : value);

/**
 * Produce the source evaluated in the worker. It defines the LeetCode node helpers,
 * evaluates the learner's code, runs each test, and posts a serialisable report.
 */
export function buildJudgeSource({ code, functionName, params = [], returns = { type: 'integer' }, tests = [], id = 0 }) {
  if (!identifier.test(functionName || '')) throw new Error('This problem does not expose a callable function.');
  const result = `"use strict";
const __id = ${Number(id) || 0};
const __tests = ${JSON.stringify(tests)};
const __params = ${JSON.stringify(params)};
const __returnType = ${JSON.stringify(returns.type || 'integer')};
const __name = ${JSON.stringify(functionName)};
function ListNode(val, next) { this.val = (val === undefined ? 0 : val); this.next = (next === undefined ? null : next); }
function TreeNode(val, left, right) { this.val = (val === undefined ? 0 : val); this.left = (left === undefined ? null : left); this.right = (right === undefined ? null : right); }
function __fromList(values) { if (!values || !values.length) return null; const head = new ListNode(values[0]); let node = head; for (let i = 1; i < values.length; i++) { node.next = new ListNode(values[i]); node = node.next; } return head; }
function __toList(node) { const out = []; let guard = 0; while (node && guard++ < 10000) { out.push(node.val); node = node.next; } return out; }
function __fromTree(values) { if (!values || !values.length || values[0] === null) return null; const root = new TreeNode(values[0]); const queue = [root]; let i = 1; while (queue.length && i < values.length) { const node = queue.shift(); if (i < values.length && values[i] !== null) { node.left = new TreeNode(values[i]); queue.push(node.left); } i++; if (i < values.length && values[i] !== null) { node.right = new TreeNode(values[i]); queue.push(node.right); } i++; } return root; }
function __toTree(root) { if (!root) return []; const out = []; const queue = [root]; while (queue.length) { const node = queue.shift(); if (!node) { out.push(null); continue; } out.push(node.val); queue.push(node.left || null, node.right || null); } while (out.length && out.at(-1) === null) out.pop(); return out; }
function __convert(value, type) { if (type === 'ListNode') return __fromList(value); if (type === 'TreeNode') return __fromTree(value); return value; }
function __serialize(value) { if (value === undefined) return null; if (value && typeof value === 'object' && 'val' in value && 'next' in value) return __toList(value); if (value && typeof value === 'object' && 'val' in value && ('left' in value || 'right' in value)) return __toTree(value); return value; }
function __trim(value) { if (!Array.isArray(value)) return value; const copy = value.slice(); while (copy.length && copy.at(-1) === null) copy.pop(); return copy; }
function __equal(actual, expected, type) {
  if (type === 'double') return Math.abs(Number(actual) - Number(expected)) <= 1e-5 * Math.max(1, Math.abs(Number(expected)));
  if (Array.isArray(expected)) { if (!Array.isArray(actual) || actual.length !== expected.length) return false; const inner = type.replace(/\\[\\]$/, ''); return expected.every((item, index) => __equal(actual[index], item, inner)); }
  if (expected === null) return actual === null || actual === undefined;
  if (typeof expected === 'number') return Number(actual) === expected;
  if (typeof expected === 'boolean') return actual === expected;
  return String(actual) === String(expected);
}
function __clone(value) { if (value === null || value === undefined) return value; return JSON.parse(JSON.stringify(value)); }
const __results = [];
let __fn = null;
let __loadError = null;
try {
${code}
  __fn = typeof ${functionName} === 'function' ? ${functionName} : null;
} catch (error) {
  __loadError = error.name + ': ' + error.message;
}
if (!__fn) {
  self.postMessage({ type: 'judge', id: __id, report: { ok: false, loadError: __loadError || 'No function named ' + __name + ' was defined.' }, results: [] });
} else {
  for (let index = 0; index < __tests.length; index++) {
    const test = __tests[index];
    const logs = [];
    const original = console.log;
    console.log = (...args) => logs.push(args.map(item => typeof item === 'string' ? item : JSON.stringify(item)).join(' '));
    const started = Date.now();
    try {
      const args = test.args.map((value, position) => __convert(__clone(value), __params[position]?.type || 'integer'));
      const value = __fn.apply(null, args);
      const actual = __serialize(value);
      console.log = original;
      const expected = test.expected === undefined ? undefined : __trim(__serialize(test.expected));
      const known = test.expected !== undefined;
      __results.push({
        index,
        passed: known ? __equal(__trim(actual), expected, __returnType) : null,
        input: __params.map((param, position) => param.name + ' = ' + JSON.stringify(test.args[position])).join(', '),
        expected: known ? test.expected : null,
        actual,
        logs,
        ms: Date.now() - started
      });
    } catch (error) {
      console.log = original;
      __results.push({ index, passed: false, input: '', expected: test.expected ?? null, error: error.name + ': ' + error.message, logs, ms: Date.now() - started });
    }
  }
  const passed = __results.filter(item => item.passed === true).length;
  const known = __results.filter(item => item.passed !== null).length;
  self.postMessage({ type: 'judge', id: __id, report: { ok: __results.every(item => item.passed !== false), passed, known, total: __results.length, loadError: null }, results: __results });
}`;
  return result;
}

/** A small worker pool wrapper with a hard timeout for runaway user code. */
export function createJudgeRunner({ timeoutMs = 8000 } = {}) {
  let worker = null;
  let sequence = 0;
  const pending = new Map();

  const ensure = () => {
    if (worker) return worker;
    worker = new Worker('./javascript-worker.js', { type: 'module' });
    worker.onmessage = event => {
      const message = event.data;
      if (message.type !== 'judge') return;
      const callback = pending.get(message.id);
      pending.delete(message.id);
      if (!callback) return;
      clearTimeout(callback.timer);
      callback.resolve({ report: message.report, results: message.results || [] });
    };
    worker.onerror = () => {
      for (const [id, callback] of pending) {
        clearTimeout(callback.timer);
        callback.resolve({ report: { ok: false, loadError: 'The JavaScript worker crashed.' }, results: [] });
        pending.delete(id);
      }
      worker?.terminate();
      worker = null;
    };
    return worker;
  };

  return {
    run(payload) {
      const id = ++sequence;
      let source;
      try {
        source = buildJudgeSource({ ...payload, id });
      } catch (error) {
        return Promise.resolve({ report: { ok: false, loadError: error.message }, results: [] });
      }
      return new Promise(resolve => {
        const timer = setTimeout(() => {
          pending.delete(id);
          worker?.terminate();
          worker = null;
          resolve({ report: { ok: false, loadError: 'Stopped after 8 seconds. Check for an infinite loop.' }, results: [] });
        }, timeoutMs);
        pending.set(id, { resolve, timer });
        try {
          ensure().postMessage({ type: 'judge', id, source });
        } catch (error) {
          clearTimeout(timer);
          pending.delete(id);
          resolve({ report: { ok: false, loadError: error.message }, results: [] });
        }
      });
    },
    dispose() {
      for (const [id, callback] of pending) {
        clearTimeout(callback.timer);
        callback.resolve({ report: { ok: false, loadError: 'Runner closed.' }, results: [] });
        pending.delete(id);
      }
      worker?.terminate();
      worker = null;
    }
  };
}

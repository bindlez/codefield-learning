// JavaScript method catalogue used by the editor's learning popups. Descriptions are short
// on purpose: the preview pane is a nudge, not the MDN page.
import { inferContext } from '../src/inference.js';

const method = (name, signature, description, example, returns, args = true) => ({
  name, signature, description, example, returns, args, kind: 'method'
});
const property = (name, signature, description, example, returns) => ({
  name, signature, description, example, returns, args: false, kind: 'property'
});

export const jsMethods = {
  String: [
    method('charAt', 'text.charAt(index)', 'Returns the character at an index, or an empty string when the index is out of range.', '"hello".charAt(1) // "e"', 'string'),
    method('at', 'text.at(index)', 'Returns the character at an index; negative indexes count from the end.', '"hello".at(-1) // "o"', 'string'),
    method('includes', 'text.includes(search)', 'Reports whether the text contains a substring. Case sensitive.', '"hello".includes("ell") // true', 'boolean'),
    method('indexOf', 'text.indexOf(search)', 'Returns the first index of a substring, or -1 when absent.', '"hello".indexOf("l") // 2', 'number'),
    method('slice', 'text.slice(start, end)', 'Copies a section of the text. A negative start counts from the end.', '"hello".slice(1, 3) // "el"', 'string'),
    method('substring', 'text.substring(start, end)', 'Like slice, but swaps the arguments when start is greater than end.', '"hello".substring(1, 3) // "el"', 'string'),
    method('split', 'text.split(separator)', 'Breaks the text into an array at each separator.', '"a,b".split(",") // ["a","b"]', 'Array'),
    method('toUpperCase', 'text.toUpperCase()', 'Returns a new string with every letter uppercased.', '"hi".toUpperCase() // "HI"', 'string', false),
    method('toLowerCase', 'text.toLowerCase()', 'Returns a new string with every letter lowercased.', '"HI".toLowerCase() // "hi"', 'string', false),
    method('trim', 'text.trim()', 'Removes whitespace from both ends of the string.', '"  hi  ".trim() // "hi"', 'string', false),
    method('trimStart', 'text.trimStart()', 'Removes whitespace from the start only.', '"  hi".trimStart() // "hi"', 'string', false),
    method('trimEnd', 'text.trimEnd()', 'Removes whitespace from the end only.', '"hi  ".trimEnd() // "hi"', 'string', false),
    method('replace', 'text.replace(search, replacement)', 'Replaces the first match of a string or regular expression.', '"a-b".replace("-", "+") // "a+b"', 'string'),
    method('replaceAll', 'text.replaceAll(search, replacement)', 'Replaces every match, not just the first.', '"a-b-c".replaceAll("-", "+") // "a+b+c"', 'string'),
    method('startsWith', 'text.startsWith(search)', 'Reports whether the text begins with a substring.', '"hello".startsWith("he") // true', 'boolean'),
    method('endsWith', 'text.endsWith(search)', 'Reports whether the text ends with a substring.', '"hello".endsWith("lo") // true', 'boolean'),
    method('padStart', 'text.padStart(length, pad)', 'Pads the start until the string reaches a length.', '"7".padStart(3, "0") // "007"', 'string'),
    method('repeat', 'text.repeat(count)', 'Returns the string repeated count times.', '"ab".repeat(2) // "abab"', 'string'),
    method('concat', 'text.concat(other)', 'Joins strings and returns a new one.', '"a".concat("b") // "ab"', 'string'),
    method('match', 'text.match(regexp)', 'Matches a regular expression and returns the matches, or null.', '"a1b2".match(/\\d/g) // ["1","2"]', 'Array'),
    method('toString', 'text.toString()', 'Returns the string itself; useful when the value might not be a string.', '"hi".toString() // "hi"', 'string', false),
    property('length', 'text.length', 'Number of UTF-16 code units in the string. Emoji can count as two.', '"hello".length // 5', 'number')
  ],
  Array: [
    method('map', 'array.map(callback)', 'Builds a new array by transforming every element.', '[1, 2, 3].map(n => n * 2) // [2,4,6]', 'Array'),
    method('filter', 'array.filter(callback)', 'Keeps only the elements whose callback returns true.', '[1, 2, 3, 4].filter(n => n % 2 === 0) // [2,4]', 'Array'),
    method('reduce', 'array.reduce(callback, initial)', 'Folds the array into one value, carrying an accumulator.', '[1, 2, 3].reduce((sum, n) => sum + n, 0) // 6', 'any'),
    method('forEach', 'array.forEach(callback)', 'Runs a callback for each element. Returns undefined.', '[1, 2].forEach(n => console.log(n))', 'undefined'),
    method('find', 'array.find(callback)', 'Returns the first element that satisfies the test, or undefined.', '[2, 5, 8].find(n => n > 3) // 5', 'element'),
    method('findIndex', 'array.findIndex(callback)', 'Returns the index of the first match, or -1.', '[2, 5, 8].findIndex(n => n > 3) // 1', 'number'),
    method('some', 'array.some(callback)', 'Reports whether at least one element passes the test.', '[1, 2, 3].some(n => n > 2) // true', 'boolean'),
    method('every', 'array.every(callback)', 'Reports whether every element passes the test.', '[2, 4].every(n => n % 2 === 0) // true', 'boolean'),
    method('includes', 'array.includes(value)', 'Reports whether the array contains a value.', '[1, 2].includes(2) // true', 'boolean'),
    method('indexOf', 'array.indexOf(value)', 'Returns the first index of a value, or -1.', '["a", "b"].indexOf("b") // 1', 'number'),
    method('push', 'array.push(value)', 'Adds one value to the end and returns the new length.', 'const a = [1]; a.push(2) // 2, a is [1,2]', 'number'),
    method('pop', 'array.pop()', 'Removes and returns the last element.', '[1, 2].pop() // 2', 'element', false),
    method('shift', 'array.shift()', 'Removes and returns the first element.', '[1, 2].shift() // 1', 'element', false),
    method('unshift', 'array.unshift(value)', 'Adds a value to the front and returns the new length.', 'const a = [2]; a.unshift(1) // 2', 'number'),
    method('slice', 'array.slice(start, end)', 'Copies a section without changing the original array.', '[1, 2, 3].slice(1) // [2,3]', 'Array'),
    method('splice', 'array.splice(start, count, ...items)', 'Removes and/or inserts items in place, returning the removed items.', 'const a = [1, 2, 3]; a.splice(1, 1, 9)', 'Array'),
    method('concat', 'array.concat(other)', 'Joins arrays into a new one.', '[1].concat([2, 3]) // [1,2,3]', 'Array'),
    method('join', 'array.join(separator)', 'Turns the array into a string with a separator.', '[1, 2, 3].join("-") // "1-2-3"', 'string'),
    method('reverse', 'array.reverse()', 'Reverses the array in place and returns it.', '[1, 2, 3].reverse() // [3,2,1]', 'Array', false),
    method('sort', 'array.sort(compare)', 'Sorts in place. Without a comparator, items are compared as strings.', '[10, 2].sort((a, b) => a - b) // [2,10]', 'Array'),
    method('flat', 'array.flat(depth)', 'Flattens nested arrays up to a depth.', '[1, [2, [3]]].flat(2) // [1,2,3]', 'Array'),
    method('flatMap', 'array.flatMap(callback)', 'Maps each element, then flattens one level.', '[1, 2].flatMap(n => [n, n]) // [1,1,2,2]', 'Array'),
    method('at', 'array.at(index)', 'Returns the element at an index; negative counts from the end.', '[1, 2, 3].at(-1) // 3', 'element'),
    method('toSorted', 'array.toSorted(compare)', 'Returns a sorted copy, leaving the original untouched.', '[3, 1].toSorted((a, b) => a - b) // [1,3]', 'Array'),
    method('toReversed', 'array.toReversed()', 'Returns a reversed copy, leaving the original untouched.', '[1, 2].toReversed() // [2,1]', 'Array', false),
    method('keys', 'array.keys()', 'Returns an iterator over the indexes.', '[...["a", "b"].keys()] // [0,1]', 'iterator', false),
    method('values', 'array.values()', 'Returns an iterator over the values.', '[...["a"].values()] // ["a"]', 'iterator', false),
    method('entries', 'array.entries()', 'Returns an iterator of [index, value] pairs.', '[...["a"].entries()] // [[0,"a"]]', 'iterator', false),
    property('length', 'array.length', 'Number of elements in the array.', '[1, 2, 3].length // 3', 'number')
  ],
  Object: [
    method('hasOwnProperty', 'object.hasOwnProperty(name)', 'Reports whether the object has its own property, ignoring inherited ones.', '({a: 1}).hasOwnProperty("a") // true', 'boolean'),
    method('toString', 'object.toString()', 'Returns a string representation of the object.', '({a: 1}).toString() // "[object Object]"', 'string', false)
  ],
  Map: [
    method('set', 'map.set(key, value)', 'Stores a value under a key and returns the map, so calls can chain.', 'const m = new Map(); m.set("a", 1)', 'Map'),
    method('get', 'map.get(key)', 'Returns the value for a key, or undefined.', 'm.get("a") // 1', 'value'),
    method('has', 'map.has(key)', 'Reports whether a key exists, even when its value is 0 or false.', 'm.has("a") // true', 'boolean'),
    method('delete', 'map.delete(key)', 'Removes a key and reports whether it existed.', 'm.delete("a") // true', 'boolean'),
    method('clear', 'map.clear()', 'Removes every entry from the map.', 'm.clear()', 'undefined', false),
    method('keys', 'map.keys()', 'Returns an iterator over the keys in insertion order.', '[...m.keys()] // ["a"]', 'iterator', false),
    method('values', 'map.values()', 'Returns an iterator over the values.', '[...m.values()] // [1]', 'iterator', false),
    method('entries', 'map.entries()', 'Returns an iterator of [key, value] pairs.', '[...m.entries()] // [["a",1]]', 'iterator', false),
    property('size', 'map.size', 'Number of entries in the map.', 'm.size // 1', 'number')
  ],
  Set: [
    method('add', 'set.add(value)', 'Adds a value if it is not already present, returning the set.', 'const s = new Set(); s.add(1)', 'Set'),
    method('has', 'set.has(value)', 'Reports whether the value is in the set.', 'new Set([1, 2]).has(2) // true', 'boolean'),
    method('delete', 'set.delete(value)', 'Removes a value and reports whether it was present.', 'new Set([1]).delete(1) // true', 'boolean'),
    method('clear', 'set.clear()', 'Removes every value from the set.', 's.clear()', 'undefined', false),
    method('values', 'set.values()', 'Returns an iterator over the values.', '[...new Set([1, 2])] // [1,2]', 'iterator', false),
    property('size', 'set.size', 'Number of distinct values.', 'new Set([1, 1, 2]).size // 2', 'number')
  ],
  Date: [
    method('toISOString', 'date.toISOString()', 'Formats the date as UTC ISO 8601 text.', 'new Date(0).toISOString() // "1970-01-01T00:00:00.000Z"', 'string', false),
    method('getFullYear', 'date.getFullYear()', 'Returns the local calendar year.', 'new Date().getFullYear()', 'number', false),
    method('getTime', 'date.getTime()', 'Returns milliseconds since 1 January 1970 UTC.', 'new Date(0).getTime() // 0', 'number', false)
  ],
  ListNode: [
    property('val', 'node.val', 'The value stored in this linked-list node.', 'node.val // 7', 'number'),
    property('next', 'node.next', 'The next node, or null at the end of the list.', 'while (node) node = node.next', 'ListNode')
  ],
  TreeNode: [
    property('val', 'node.val', 'The value stored in this tree node.', 'node.val // 7', 'number'),
    property('left', 'node.left', 'The left child, or null when absent.', 'node.left?.val', 'TreeNode'),
    property('right', 'node.right', 'The right child, or null when absent.', 'node.right?.val', 'TreeNode')
  ],
  Number: [
    method('toFixed', 'number.toFixed(digits)', 'Formats with a fixed number of decimals and returns a string.', '(1.234).toFixed(2) // "1.23"', 'string'),
    method('toString', 'number.toString(radix)', 'Converts the number to a string, optionally in another base.', '(255).toString(16) // "ff"', 'string')
  ]
};

export const jsGlobals = {
  Math: [
    method('floor', 'Math.floor(x)', 'Rounds down to the nearest integer.', 'Math.floor(2.9) // 2', 'number'),
    method('ceil', 'Math.ceil(x)', 'Rounds up to the nearest integer.', 'Math.ceil(2.1) // 3', 'number'),
    method('round', 'Math.round(x)', 'Rounds to the nearest integer.', 'Math.round(2.5) // 3', 'number'),
    method('abs', 'Math.abs(x)', 'Returns the distance from zero.', 'Math.abs(-4) // 4', 'number'),
    method('max', 'Math.max(...values)', 'Returns the largest argument.', 'Math.max(1, 9, 3) // 9', 'number'),
    method('min', 'Math.min(...values)', 'Returns the smallest argument.', 'Math.min(1, 9, 3) // 1', 'number'),
    method('sqrt', 'Math.sqrt(x)', 'Returns the square root.', 'Math.sqrt(9) // 3', 'number'),
    method('pow', 'Math.pow(base, exponent)', 'Raises a base to an exponent.', 'Math.pow(2, 3) // 8', 'number')
  ],
  JSON: [
    method('stringify', 'JSON.stringify(value)', 'Turns a value into JSON text.', 'JSON.stringify({a: 1}) // "{\\"a\\":1}"', 'string'),
    method('parse', 'JSON.parse(text)', 'Reads JSON text into a value.', 'JSON.parse("[1,2]") // [1,2]', 'any')
  ],
  console: [
    method('log', 'console.log(value)', 'Prints a value to the output panel.', 'console.log("hi")', 'undefined'),
    method('warn', 'console.warn(value)', 'Prints a warning to the output panel.', 'console.warn("careful")', 'undefined'),
    method('error', 'console.error(value)', 'Prints an error to the output panel.', 'console.error("bad")', 'undefined'),
    method('table', 'console.table(value)', 'Prints an array or object as a table where supported.', 'console.table([{a: 1}])', 'undefined')
  ],
  Object: [
    method('keys', 'Object.keys(object)', 'Returns an array of the object\'s own property names.', 'Object.keys({a: 1, b: 2}) // ["a","b"]', 'Array'),
    method('values', 'Object.values(object)', 'Returns an array of the object\'s own values.', 'Object.values({a: 1}) // [1]', 'Array'),
    method('entries', 'Object.entries(object)', 'Returns [key, value] pairs as an array.', 'Object.entries({a: 1}) // [["a",1]]', 'Array'),
    method('assign', 'Object.assign(target, source)', 'Copies properties onto a target object.', 'Object.assign({}, {a: 1})', 'Object'),
    method('fromEntries', 'Object.fromEntries(entries)', 'Builds an object from [key, value] pairs.', 'Object.fromEntries([["a", 1]]) // {a: 1}', 'Object')
  ],
  Array: [
    method('isArray', 'Array.isArray(value)', 'Reports whether a value is an array.', 'Array.isArray([]) // true', 'boolean'),
    method('from', 'Array.from(iterable)', 'Builds an array from a string, set or other iterable.', 'Array.from("abc") // ["a","b","c"]', 'Array')
  ],
  Number: [
    method('isInteger', 'Number.isInteger(value)', 'Reports whether a value is a whole number.', 'Number.isInteger(3) // true', 'boolean')
  ]
};

const byName = new Map();
const allEntries = { ...jsMethods };
for (const [owner, entries] of Object.entries(jsGlobals)) {
  allEntries[owner] = [...(allEntries[owner] || []), ...entries];
}
for (const [owner, entries] of Object.entries(allEntries)) {
  for (const entry of entries) {
    if (!byName.has(entry.name)) byName.set(entry.name, []);
    byName.get(entry.name).push({ ...entry, owner });
  }
}

/** Map a LeetCode-style parameter type (integer[], string, ListNode...) to a catalogue type. */
export function typeForParam(type = '') {
  if (String(type).endsWith('[]')) return 'Array';
  if (type === 'string' || type === 'character') return 'String';
  if (type === 'integer' || type === 'double') return 'Number';
  if (type === 'boolean') return 'Boolean';
  if (type === 'ListNode' || type === 'TreeNode') return type;
  return 'Object';
}

function itemFor(entry, owner) {
  const property = entry.kind === 'property';
  return {
    label: entry.name,
    display: property ? entry.name : `${entry.name}()`,
    insert: property ? entry.name : `${entry.name}()`,
    cursorOffset: property ? undefined : entry.name.length + (entry.args ? 1 : 2),
    detail: entry.description,
    preview: {
      name: entry.name,
      owner,
      signature: entry.signature,
      description: entry.description,
      example: entry.example,
      returns: entry.returns
    }
  };
}

/** Build completion items for the current receiver, using inference, then parameter bindings. */
export function javascriptCompletion({ source = '', caret = source.length, receiver = '', chain = [], prefix = '', bindings = {} } = {}) {
  const inferred = inferContext(source, caret, 'javascript', receiver, chain);
  const globalOwner = !chain.length && jsGlobals[receiver] ? receiver : null;
  const owner = globalOwner || inferred?.type || (chain.length ? null : bindings[receiver]);
  if (!owner) return [];
  const entries = globalOwner ? jsGlobals[globalOwner] : jsMethods[owner] || jsGlobals[owner] || [];
  return entries
    .filter(entry => entry.name.startsWith(prefix))
    .map(entry => itemFor(entry, owner));
}

/** Look up a guide by method name; a type makes the answer unambiguous. */
export function guideFor(label, type = '') {
  const name = String(label || '').replace(/[?!=]$/, '');
  if (!name) return null;
  const typed = type ? (jsMethods[type] || jsGlobals[type])?.find(entry => entry.name === name) : null;
  if (typed) return { ...typed, owner: type };
  const matches = byName.get(name) || [];
  if (matches.length === 1) return matches[0];
  return null;
}

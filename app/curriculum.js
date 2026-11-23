const tracks = [
  {
    id: 'start',
    title: 'Start here',
    blurb: 'Get oriented, then read your first program.',
    lessonIds: ['welcome', 'reading-code']
  },
  {
    id: 'core',
    title: 'Core JavaScript',
    blurb: 'The small language underneath every framework.',
    lessonIds: ['values-types', 'functions-scope', 'arrays-loops', 'objects-maps', 'strings-regex']
  },
  {
    id: 'patterns',
    title: 'Pattern Lab',
    blurb: 'The handful of shapes most interview problems reuse.',
    lessonIds: ['hash-maps', 'two-pointers', 'sliding-window', 'binary-search', 'recursion', 'dynamic-programming']
  },
  {
    id: 'interview',
    title: 'Interview sprint',
    blurb: 'Say what you mean, and prove it works.',
    lessonIds: ['trees-graphs', 'complexity', 'debugging-tests']
  }
];

const lessons = [
  {
    id: 'welcome',
    track: 'start',
    title: 'Welcome to the workspace',
    summary: 'What this workspace is, how to run a line, and how to read the output panel.',
    level: 'beginner',
    minutes: 8,
    language: 'javascript',
    objectives: [
      'Run a program and find its output.',
      'Explain why text needs quotes and numbers do not.',
      'Print text and a computed value with console.log.'
    ],
    sections: [
      {
        type: 'prose',
        html: "<p>This workspace runs JavaScript in your browser. You type in the editor, press <strong>Run</strong>, and the output appears in the panel below. There is nothing to install and no account to create.</p><p>You cannot break anything here. Run the same program ten times, change one character, run it again. That loop is the whole method.</p>"
      },
      {
        type: 'code',
        caption: 'Your first line. Prints: Hello, Codefield',
        code: `console.log('Hello, Codefield');`
      },
      {
        type: 'prose',
        html: "<p><code>console.log</code> takes a value and writes it on its own line. Text goes inside quotes; numbers do not. The computer runs your lines from top to bottom, one at a time.</p>"
      },
      {
        type: 'callout',
        tone: 'tip',
        title: 'Run first, understand second',
        html: '<p>If a sentence feels abstract, run the code under it before rereading. Watching a value appear usually beats another pass over the words.</p>'
      },
      {
        type: 'code',
        caption: 'Text plus a value, one line each. Prints: Hello, Ada / Lessons done: 2',
        code: `const name = 'Ada';
const lessons = 2;
console.log('Hello, ' + name);
console.log('Lessons done: ' + lessons);`
      },
      {
        type: 'quiz',
        question: 'Which line prints exactly 7?',
        options: [
          'console.log(3 + 4);',
          "console.log('3 + 4');",
          "console.log(3 + '4');",
          "console.log('3' + '4');"
        ],
        answer: 0,
        explain: 'The first line adds two numbers. The second prints the characters inside the quotes. The third and fourth glue text together, giving 34.'
      }
    ],
    checkpoint: {
      prompt: 'Print two lines: Ready to learn, then Lesson 1.',
      starter: `// One console.log per line.
`,
      expect: { kind: 'output', value: 'Ready to learn\nLesson 1' },
      hints: [
        'Text that should print exactly goes inside quotes.',
        'Each console.log call writes one line, in the order it runs.',
        "Two calls: console.log('Ready to learn') and console.log('Lesson 1')."
      ],
      solution: `console.log('Ready to learn');
console.log('Lesson 1');`
    },
    next: 'reading-code'
  },
  {
    id: 'reading-code',
    track: 'start',
    title: 'Read code like a computer',
    summary: 'Follow a program the way the machine does: one line, one value, one step at a time.',
    level: 'beginner',
    minutes: 12,
    language: 'javascript',
    objectives: [
      'Trace a short program with a table of names and values.',
      'Predict output before running it.',
      'Explain the difference between = and ===.'
    ],
    sections: [
      {
        type: 'prose',
        html: "<p>Reading code is simulation. Start at the first line with an empty table of names. When a value is stored, write it in the table. When a name is used, replace it with the value from the table.</p><p>That is all a computer does here, and it is faster than guessing.</p>"
      },
      {
        type: 'code',
        caption: 'Track total after every line. Prints: 12',
        code: `let total = 0;
total = total + 4;
total = total * 3;
console.log(total);`
      },
      {
        type: 'prose',
        html: "<p>A single <code>=</code> stores a value: <code>total = 12</code> means put 12 in total. A triple <code>===</code> asks a question and produces <code>true</code> or <code>false</code>. Read it as is equal to.</p>"
      },
      {
        type: 'code',
        caption: 'A number, then a comparison. Prints: 12 / true',
        code: `const price = 4;
const count = 3;
const total = price * count;
console.log(total);
console.log(total === 12);`
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'The right side runs first',
        html: '<p>In <code>total = total + 4</code>, the old value is read, four is added, and only then is the name updated. Read assignments from right to left.</p>'
      },
      {
        type: 'quiz',
        question: 'After these lines, what is x? let x = 2; x = x + x; x = x * x;',
        options: ['4', '8', '16', '64'],
        answer: 2,
        explain: 'The first line stores 2. Then x becomes 2 + 2, which is 4. Then x becomes 4 * 4, which is 16.'
      }
    ],
    checkpoint: {
      prompt: 'Trace this program on paper, then add one line so it prints the final value of a + b.',
      starter: `let a = 3;
let b = a + 2;
a = b * 2;
// Print a + b here.
`,
      expect: { kind: 'output', value: '15' },
      hints: [
        'Work down the lines with a table: a is 3, then b is 5.',
        'b is computed while a is still 3, so changing a later does not change b.',
        'a ends at 10 and b stays at 5, so print 10 + 5.'
      ],
      solution: `let a = 3;
let b = a + 2;
a = b * 2;
console.log(a + b);`
    },
    next: 'values-types'
  },
  {
    id: 'values-types',
    track: 'core',
    title: 'Values, types, and the console',
    summary: 'The five values you use daily, what typeof reports, and why "2" + 1 is not 3.',
    level: 'beginner',
    minutes: 12,
    language: 'javascript',
    objectives: [
      'Name the five common value types and what typeof reports for each.',
      'Predict the result of adding a number to a string.',
      'Build one line of output with a template literal.'
    ],
    sections: [
      {
        type: 'prose',
        html: "<p>A value is one piece of data: a number, a piece of text, a yes or no. Its <strong>type</strong> decides which operations make sense. <code>typeof</code> asks a value what it is.</p><p>You will use five types daily: <code>number</code>, <code>string</code>, <code>boolean</code>, <code>undefined</code>, and <code>null</code>.</p>"
      },
      {
        type: 'code',
        caption: 'Five typeof checks, one per line. Prints: number / string / boolean / undefined / object',
        code: `console.log(typeof 42);
console.log(typeof 'forty-two');
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof null);`
      },
      {
        type: 'prose',
        html: "<p><code>+</code> is the friendly operator: if either side is a string, it glues text. The other arithmetic operators try to turn both sides into numbers.</p><p>That single rule explains most beginner surprises with values that arrive as text.</p>"
      },
      {
        type: 'code',
        caption: 'Addition, then gluing, then subtraction. Prints: 3 / 21 / 1 / 3',
        code: `console.log(2 + 1);
console.log('2' + 1);
console.log('2' - 1);
console.log(Number('2') + 1);`
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Null is a very old quirk',
        html: '<p><code>typeof null</code> reports <code>object</code> for historical reasons. Do not use typeof to test for null; compare directly with <code>value === null</code>.</p>'
      },
      {
        type: 'quiz',
        question: 'What does console.log(\'3\' * 2) print?',
        options: ["'33'", '6', 'NaN', 'undefined'],
        answer: 1,
        explain: 'The * operator has no string meaning, so JavaScript converts both sides to numbers: 3 * 2 is 6.'
      }
    ],
    checkpoint: {
      prompt: 'Print one line of the form item x count = total, using the three values below.',
      starter: `const item = 'tea';
const price = 120;
const count = 3;
// Print: tea x 3 = 360
`,
      expect: { kind: 'output', value: 'tea x 3 = 360' },
      hints: [
        'A template literal uses backticks and puts values inside ${...}.',
        'Compute the total with price * count inside the template.',
        'The shape is `${item} x ${count} = ${price * count}` inside console.log.'
      ],
      solution: `const item = 'tea';
const price = 120;
const count = 3;
console.log(\`\${item} x \${count} = \${price * count}\`);`
    },
    next: 'functions-scope'
  },
  {
    id: 'functions-scope',
    track: 'core',
    title: 'Functions, scope, and return values',
    summary: 'Name a step, hand it inputs, and get a value back. Plus where variables live.',
    level: 'beginner',
    minutes: 14,
    language: 'javascript',
    objectives: [
      'Write a function with parameters and a return value.',
      'Explain the difference between returning a value and printing it.',
      'Predict which variables a function body can see.'
    ],
    sections: [
      {
        type: 'prose',
        html: "<p>A function names a step so you can repeat it without repeating the lines. Parameters are the inputs. <code>return</code> hands a value back to whoever called.</p><p>Printing shows a value to you. Returning gives it to the rest of the program. Learn the difference now and later lessons get easier.</p>"
      },
      {
        type: 'code',
        caption: 'The result is reusable. Prints: 8 / 12',
        code: `function double(n) {
  return n * 2;
}
console.log(double(4));
console.log(double(double(3)));`
      },
      {
        type: 'prose',
        html: "<p>A variable declared inside a function belongs to that call and disappears when the call ends. Names declared outside are visible inside, unless an inner declaration shadows them.</p>"
      },
      {
        type: 'code',
        caption: 'The inner name wins only inside the call. Prints: inner / outer',
        code: `const label = 'outer';
function show() {
  const label = 'inner';
  return label;
}
console.log(show());
console.log(label);`
      },
      {
        type: 'callout',
        tone: 'tip',
        html: '<p>Return a value and print it at the edge of your program. A function that only prints cannot be reused in a calculation or checked by a test.</p>'
      },
      {
        type: 'quiz',
        question: 'What does this print? function f(n) { return n + 1; } console.log(f(2) * 2);',
        options: ['5', 'undefined', '6', "'31'"],
        answer: 2,
        explain: 'f(2) returns 3, and the call is replaced by its return value before the multiplication: 3 * 2 is 6.'
      }
    ],
    checkpoint: {
      prompt: "Write a function describe(name, count) that returns a sentence like 2 tickets for Ada, then print the result of describe('Ada', 2).",
      starter: `function describe(name, count) {
  // Return the sentence, do not print it here.
}

// Print the returned value.
`,
      expect: { kind: 'output', value: '2 tickets for Ada' },
      hints: [
        'The function needs two parameters and a return statement.',
        'Build the text with a template literal: `${count} tickets for ${name}`.',
        'Call console.log(describe(...)) so the returned value is printed exactly once.'
      ],
      solution: `function describe(name, count) {
  return \`\${count} tickets for \${name}\`;
}
console.log(describe('Ada', 2));`
    },
    next: 'arrays-loops'
  },
  {
    id: 'arrays-loops',
    track: 'core',
    title: 'Arrays and loops without fear',
    summary: 'Index, length, and the three parts of a loop that never runs past the end.',
    level: 'beginner',
    minutes: 15,
    language: 'javascript',
    objectives: [
      'Read and change an array by index.',
      'Write a for loop that visits every element exactly once.',
      'Accumulate a total with a loop and explain the loop bound.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>An array is an ordered list. Each slot has an index, and the first index is <code>0</code>. <code>length</code> is the count of slots, so the last index is always <code>length - 1</code>.</p>'
      },
      {
        type: 'code',
        caption: 'First, last, count. Prints: 4 / 15 / 3',
        code: `const nums = [4, 8, 15];
console.log(nums[0]);
console.log(nums[nums.length - 1]);
console.log(nums.length);`
      },
      {
        type: 'prose',
        html: '<p>A <code>for</code> loop has three parts: where to start, when to keep going, and how to step. <code>i &lt; nums.length</code> stops at the last real index; <code>i &lt;= nums.length</code> takes one step too many.</p><p><code>for (const value of nums)</code> visits the same values when you do not need the index.</p>'
      },
      {
        type: 'code',
        caption: 'One pass, one total. Prints: 43',
        code: `const nums = [4, 8, 15, 16];
let total = 0;
for (let i = 0; i < nums.length; i++) {
  total = total + nums[i];
}
console.log(total);`
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'The loop that reads past the end',
        html: '<p>With <code>i &lt;=</code> instead of <code>i &lt;</code>, the last pass reads <code>undefined</code> and the total becomes <code>NaN</code>. When a sum is NaN, check the bound first.</p>'
      },
      {
        type: 'quiz',
        question: 'What does this print? const xs = [2, 4, 6]; console.log(xs[3]);',
        options: ['6', 'undefined', '0', 'A range error'],
        answer: 1,
        explain: 'The indexes are 0, 1 and 2. Reading index 3 finds no slot, so the value is undefined.'
      }
    ],
    checkpoint: {
      prompt: 'Add up every number in prices with a loop, then print the total.',
      starter: `const prices = [3, 5, 7, 11];
let total = 0;
// Loop over prices and add each one to total.
`,
      expect: { kind: 'output', value: '26' },
      hints: [
        'Start total at 0 before the loop, as the starter does.',
        'Loop while i is less than prices.length and add prices[i] each pass.',
        'Print total once, after the loop has finished.'
      ],
      solution: `const prices = [3, 5, 7, 11];
let total = 0;
for (let i = 0; i < prices.length; i++) {
  total = total + prices[i];
}
console.log(total);`
    },
    next: 'objects-maps'
  },
  {
    id: 'objects-maps',
    track: 'core',
    title: 'Objects, Maps, and counting things',
    summary: 'Named fields for fixed records, Maps for keys you learn at runtime, and the counting loop both share.',
    level: 'intermediate',
    minutes: 15,
    language: 'javascript',
    objectives: [
      'Read and update an object property with dot and bracket notation.',
      'Use a Map to count how often each value appears.',
      'Choose between a plain object and a Map for a given job.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>An object groups named fields. Use a dot when you know the field name while writing the code, and brackets when the name lives in a variable.</p>'
      },
      {
        type: 'code',
        caption: 'Dot, bracket, then update. Prints: Ada / 3 / 4',
        code: `const user = { name: 'Ada', lessons: 3 };
console.log(user.name);
const field = 'lessons';
console.log(user[field]);
user.lessons += 1;
console.log(user.lessons);`
      },
      {
        type: 'prose',
        html: '<p>A <code>Map</code> is a dictionary for keys you learn at runtime. <code>set</code> writes, <code>get</code> reads, <code>has</code> asks, and <code>size</code> counts entries. Keys can be strings, numbers, or objects.</p>'
      },
      {
        type: 'code',
        caption: 'Count the letters of abca. Prints: 2 / 3',
        code: `const counts = new Map();
for (const ch of 'abca') {
  counts.set(ch, (counts.get(ch) || 0) + 1);
}
console.log(counts.get('a'));
console.log(counts.size);`
      },
      {
        type: 'callout',
        tone: 'note',
        html: '<p>Use a plain object for a fixed record like a user. Use a <code>Map</code> when the keys are data, such as words, ids, or numbers, because it keeps any key type and reports <code>size</code> directly.</p>'
      },
      {
        type: 'quiz',
        question: 'A Map counts words. What does counts.get("missing") return?',
        options: ['0', 'null', 'undefined', 'It throws an error'],
        answer: 2,
        explain: 'A missing key has no entry, so get returns undefined. That is why counting uses (get(key) || 0) + 1.'
      }
    ],
    checkpoint: {
      prompt: 'Count the words with a Map, then print the count for go and the number of distinct words, each on its own line.',
      starter: `const words = ['go', 'stop', 'go', 'go', 'wait'];
const counts = new Map();
// Count the words, then print go=3 and distinct=3.
`,
      expect: { kind: 'output', value: 'go=3\ndistinct=3' },
      hints: [
        'Create the Map before the loop and set a count for every word.',
        'For each word, set its entry to (counts.get(word) || 0) + 1.',
        "Print counts.get('go') and counts.size on separate lines."
      ],
      solution: `const words = ['go', 'stop', 'go', 'go', 'wait'];
const counts = new Map();
for (const word of words) {
  counts.set(word, (counts.get(word) || 0) + 1);
}
console.log('go=' + counts.get('go'));
console.log('distinct=' + counts.size);`
    },
    next: 'strings-regex'
  },
  {
    id: 'strings-regex',
    track: 'core',
    title: 'Strings and a little regex',
    summary: 'Useful string methods, then just enough regex to pull a pattern out of text.',
    level: 'intermediate',
    minutes: 14,
    language: 'javascript',
    objectives: [
      'Trim, split, and slice a string without changing the original.',
      'Test a string against a small regular expression.',
      'Use the g flag to replace or collect every match.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>Strings are sequences of characters with useful methods. Most of them return a new string; the original stays unchanged. <code>trim</code> removes surrounding spaces, <code>split</code> cuts at a separator, and <code>slice</code> takes a range.</p>'
      },
      {
        type: 'code',
        caption: 'Three ways to ask about text. Prints: 9 / 3 / el',
        code: `const word = '  Codefield ';
console.log(word.trim().length);
console.log('a,b,c'.split(',').length);
console.log('hello'.slice(1, 3));`
      },
      {
        type: 'prose',
        html: '<p>A regular expression describes a shape of text. <code>/\\d+/</code> means one or more digits, <code>^</code> and <code>$</code> anchor the whole string, and the <code>g</code> flag makes a replacement repeat.</p>'
      },
      {
        type: 'code',
        caption: 'One true, one false, one global replace. Prints: true / false / a# b# c#',
        code: `const email = 'ada@example.com';
console.log(/^\\S+@\\S+\\.\\S+$/.test(email));
console.log(/\\d+/.test('no digits here'));
console.log('a1 b2 c3'.replace(/\\d/g, '#'));`
      },
      {
        type: 'callout',
        tone: 'tip',
        html: '<p>Start with the smallest pattern that matches, then add one piece at a time. Testing <code>/\\d/</code> against <code>abc</code> and <code>a1</code> teaches more than reading a regex table.</p>'
      },
      {
        type: 'quiz',
        question: "What does 'abc123'.replace(/[a-z]/g, '') return?",
        options: ["'abc'", "'123'", "'abc123'", "''"],
        answer: 1,
        explain: 'The class [a-z] matches every lowercase letter, and g replaces all of them with an empty string. Only the digits remain.'
      }
    ],
    checkpoint: {
      prompt: 'Print only the digits of ref, joined into one string.',
      starter: `const ref = 'AB-42-x9';
// Print 429
`,
      expect: { kind: 'output', value: '429' },
      hints: [
        'match with the g flag returns an array of every match.',
        'ref.match(/\\d/g) gives an array of digit strings.',
        'Join that array with an empty string and print the result.'
      ],
      solution: `const ref = 'AB-42-x9';
const digits = ref.match(/\\d/g);
console.log(digits.join(''));`
    },
    next: 'hash-maps'
  },
  {
    id: 'hash-maps',
    track: 'patterns',
    title: 'Hash maps: trade memory for speed',
    summary: 'The two-sum shape: check every pair, then replace the inner scan with a lookup.',
    level: 'intermediate',
    minutes: 18,
    language: 'javascript',
    objectives: [
      'Describe the cost of checking every pair.',
      'Use a Map to answer have I seen this in one step.',
      'State the time and space cost of the one-pass version.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>Problem: given a list of numbers and a target, find two positions whose values add to the target. The direct approach checks every pair: for each <code>i</code>, try every <code>j</code> after it.</p><p>It works, and it costs about <code>n * n / 2</code> comparisons. Watch the count grow when you run it.</p>'
      },
      {
        type: 'code',
        caption: 'The pair, then how many pairs were checked. Prints: 0,1 / 6',
        code: `const nums = [2, 7, 11, 15];
const target = 9;
let checks = 0;
for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) {
    checks++;
    if (nums[i] + nums[j] === target) console.log(i + ',' + j);
  }
}
console.log(checks);`
      },
      {
        type: 'prose',
        html: '<p>While scanning left to right, keep what you have already seen in a <code>Map</code> from value to index. For the current number <code>x</code>, the only partner that works is <code>target - x</code>, and the Map answers have I seen it in one step.</p><p>One pass, so <code>O(n)</code> time; up to <code>n</code> entries, so <code>O(n)</code> space. Trading memory for time is the whole idea.</p>'
      },
      {
        type: 'code',
        caption: 'Same answer, one pass. Prints: 0,1',
        code: `const nums = [2, 7, 11, 15];
const target = 9;
const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  const partner = target - nums[i];
  if (seen.has(partner)) {
    console.log(seen.get(partner) + ',' + i);
    break;
  }
  seen.set(nums[i], i);
}`
      },
      {
        type: 'callout',
        tone: 'note',
        html: '<p>Store the number as the key and its index as the value. The lookup asks about values; the answer you return is an index.</p>'
      },
      {
        type: 'quiz',
        question: 'In the one-pass version, what do you look up for the current number x?',
        options: ['target - x', 'x + target', 'The index of x', 'The last index seen'],
        answer: 0,
        explain: 'x needs a partner p such that x + p is the target, so p is target - x. That is the only value worth a lookup.'
      }
    ],
    checkpoint: {
      prompt: 'Print the first id that appears twice in the list, or none if every id is unique.',
      starter: `const ids = ['k3', 'p1', 'k3', 'z9', 'p1'];
let repeat = 'none';
// Use a Set to find the first repeat.
`,
      expect: { kind: 'output', value: 'k3' },
      hints: [
        'A Set remembers values you have already met.',
        'For each id, ask has(id) before you add(id).',
        'Store the first repeat, stop the loop, and print repeat after it.'
      ],
      solution: `const ids = ['k3', 'p1', 'k3', 'z9', 'p1'];
const seen = new Set();
let repeat = 'none';
for (const id of ids) {
  if (seen.has(id)) { repeat = id; break; }
  seen.add(id);
}
console.log(repeat);`
    },
    next: 'two-pointers'
  },
  {
    id: 'two-pointers',
    track: 'patterns',
    title: 'Two pointers: shrink the search space',
    summary: 'On sorted data, two ends beat two nested loops.',
    level: 'intermediate',
    minutes: 18,
    language: 'javascript',
    objectives: [
      'Explain why the nested-pair scan is quadratic.',
      'Use the sorted order to discard one end per step.',
      'Say when two pointers is the wrong tool.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>Problem: given a sorted list and a target, decide whether any two values add to the target. The direct approach checks every pair, which is the same nested loop you saw in the hash map lesson.</p>'
      },
      {
        type: 'code',
        caption: 'The answer, then the number of pairs tried. Prints: true / 10',
        code: `const nums = [1, 3, 4, 8, 11];
const target = 12;
let checks = 0;
let found = false;
for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) {
    checks++;
    if (nums[i] + nums[j] === target) found = true;
  }
}
console.log(found);
console.log(checks);`
      },
      {
        type: 'prose',
        html: '<p>Put one pointer on the smallest value and one on the largest. If their sum is too small, no partner can rescue the smallest value, because the largest is already its best chance, so move the left pointer up. If the sum is too big, no partner can rescue the largest, so move the right pointer down.</p><p>Each step discards one value for good, so the loop runs at most <code>n</code> times: <code>O(n)</code> time and <code>O(1)</code> extra space.</p>'
      },
      {
        type: 'code',
        caption: 'Same answer, no nested loop. Prints: true',
        code: `const nums = [1, 3, 4, 8, 11];
const target = 12;
let left = 0;
let right = nums.length - 1;
let found = false;
while (left < right) {
  const sum = nums[left] + nums[right];
  if (sum === target) { found = true; break; }
  if (sum < target) left++;
  else right--;
}
console.log(found);`
      },
      {
        type: 'callout',
        tone: 'warn',
        html: '<p>This only works because the list is sorted. On unsorted input, sort first and remember that sorting costs <code>O(n log n)</code>, which may outweigh the saving.</p>'
      },
      {
        type: 'quiz',
        question: 'The list is [1, 3, 4, 8, 11] and the target is 10. The first sum is 12. What happens next?',
        options: ['Move the left pointer up', 'Move the right pointer down', 'Return false at once', 'Restart from the middle'],
        answer: 1,
        explain: '12 is already too big, and the right value is the largest available. No smaller partner can help it, so the right pointer moves down.'
      }
    ],
    checkpoint: {
      prompt: 'The list is sorted. Print the pair that adds to target as left,right, for example 4,15.',
      starter: `const nums = [1, 4, 7, 12, 15];
const target = 19;
let left = 0;
let right = nums.length - 1;
// Move the pointers until the sum matches, then print the pair.
`,
      expect: { kind: 'output', value: '4,15' },
      hints: [
        'Keep the loop condition left < right so the pointers never cross.',
        'If the sum is too small, left++. If it is too big, right--.',
        "On a match, print nums[left] + ',' + nums[right] and stop."
      ],
      solution: `const nums = [1, 4, 7, 12, 15];
const target = 19;
let left = 0;
let right = nums.length - 1;
while (left < right) {
  const sum = nums[left] + nums[right];
  if (sum === target) {
    console.log(nums[left] + ',' + nums[right]);
    break;
  }
  if (sum < target) left++;
  else right--;
}`
    },
    next: 'sliding-window'
  },
  {
    id: 'sliding-window',
    track: 'patterns',
    title: 'Sliding windows: keep a running answer',
    summary: 'Track a moving range instead of recounting it, from fixed windows to the longest unique run.',
    level: 'intermediate',
    minutes: 20,
    language: 'javascript',
    objectives: [
      'Describe why restarting the scan at every position is quadratic.',
      'Move a window boundary instead of rebuilding the window.',
      'Use a last-seen Map to keep a window valid.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>Problem: find the length of the longest substring with no repeated character. The direct approach starts a fresh scan at every index and grows until it repeats.</p><p>That repeats a lot of work: the inner scan restarts at every position, which is quadratic in the length of the text.</p>'
      },
      {
        type: 'code',
        caption: 'Best length, then characters examined. Prints: 3 / 25',
        code: `const text = 'abcabcbb';
let best = 0;
let checks = 0;
for (let i = 0; i < text.length; i++) {
  const seen = new Set();
  for (let j = i; j < text.length; j++) {
    checks++;
    if (seen.has(text[j])) break;
    seen.add(text[j]);
    if (j - i + 1 > best) best = j - i + 1;
  }
}
console.log(best);
console.log(checks);`
      },
      {
        type: 'prose',
        html: '<p>Keep a window <code>[left, right]</code> that is always repeat-free and move <code>right</code> forward one character at a time. When the new character already appeared inside the window, jump <code>left</code> to one past that copy instead of restarting the whole scan.</p><p>Each character enters once and leaves once, so the scan is <code>O(n)</code> time. The last-seen Map holds at most one entry per distinct character.</p>'
      },
      {
        type: 'code',
        caption: 'The same answer in one pass. Prints: 3',
        code: `const text = 'abcabcbb';
const last = new Map();
let left = 0;
let best = 0;
for (let right = 0; right < text.length; right++) {
  const ch = text[right];
  if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
  last.set(ch, right);
  if (right - left + 1 > best) best = right - left + 1;
}
console.log(best);`
      },
      {
        type: 'callout',
        tone: 'tip',
        html: '<p>Fixed-size windows are simpler: add the entering element, subtract the leaving one. Variable windows add one question, is the window still valid, and the answer decides whether <code>left</code> moves.</p>'
      },
      {
        type: 'quiz',
        question: "For 'abcabcbb', when right reaches the second 'a' at index 3, where does left move?",
        options: ['0', '1', '3', '4'],
        answer: 1,
        explain: "The previous 'a' is at index 0, and it is still inside the window. Left moves to 0 + 1, so the window becomes bca."
      }
    ],
    checkpoint: {
      prompt: 'Print the largest sum of k consecutive numbers in the list.',
      starter: `const nums = [2, 1, 5, 1, 3, 2];
const k = 3;
// Sum the first window, then slide it across the list.
`,
      expect: { kind: 'output', value: '9' },
      hints: [
        'Sum the first k numbers before the loop and store that as the best so far.',
        'To slide, add nums[i] and subtract nums[i - k].',
        'Update the best after each slide and print it when the loop ends.'
      ],
      solution: `const nums = [2, 1, 5, 1, 3, 2];
const k = 3;
let sum = 0;
for (let i = 0; i < k; i++) sum += nums[i];
let best = sum;
for (let i = k; i < nums.length; i++) {
  sum += nums[i] - nums[i - k];
  if (sum > best) best = sum;
}
console.log(best);`
    },
    next: 'binary-search'
  },
  {
    id: 'binary-search',
    track: 'patterns',
    title: 'Binary search beyond sorted arrays',
    summary: 'Halve the range, then reuse the same loop for questions that have no array at all.',
    level: 'intermediate',
    minutes: 20,
    language: 'javascript',
    objectives: [
      'Trace the lo, hi, and mid bounds through a search.',
      'Write an inclusive-bounds binary search without looping forever.',
      'Recognise a false-then-true question that the same loop can answer.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>Problem: find a value in a sorted list. A linear scan is honest work: check index 0, then 1, then 2. For a value near the end of a long list, that is a lot of checks.</p><p>Order is extra information, and binary search spends it.</p>'
      },
      {
        type: 'code',
        caption: 'Index, then checks for a value at the end. Prints: 5 / 6',
        code: `const nums = [1, 3, 5, 7, 9, 11];
const target = 11;
let found = -1;
let checks = 0;
for (let i = 0; i < nums.length; i++) {
  checks++;
  if (nums[i] === target) { found = i; break; }
}
console.log(found);
console.log(checks);`
      },
      {
        type: 'prose',
        html: '<p>Keep two bounds, <code>lo</code> and <code>hi</code>, both inclusive. Look at the middle. If it is too small, everything at or left of it is too small, so <code>lo = mid + 1</code>. If it is too big, <code>hi = mid - 1</code>. Stop when <code>lo &gt; hi</code>.</p><p>Each guess halves the range, so the loop runs about <code>log2(n)</code> times: <code>O(log n)</code> time and <code>O(1)</code> space. The same shape answers any question that is false for a while and then true forever, even without an array. A loading dock has a capacity: too small fails, every larger capacity works, and the loop finds the smallest one that works.</p>'
      },
      {
        type: 'code',
        caption: 'The index where 7 sits. Prints: 3',
        code: `const nums = [1, 3, 5, 7, 9, 11];
const target = 7;
let lo = 0;
let hi = nums.length - 1;
let found = -1;
while (lo <= hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (nums[mid] === target) { found = mid; break; }
  if (nums[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
console.log(found);`
      },
      {
        type: 'callout',
        tone: 'warn',
        html: '<p>Inclusive bounds need <code>while (lo &lt;= hi)</code>. Pairing <code>lo &lt; hi</code> with <code>hi = mid - 1</code> can skip the answer or spin forever. Pick one convention and keep it.</p>'
      },
      {
        type: 'quiz',
        question: 'Roughly how many guesses does binary search need for 1000 sorted items?',
        options: ['10', '100', '500', '1000'],
        answer: 0,
        explain: 'Each guess halves the range, and 2 to the power 10 is 1024. About ten guesses cover a thousand items.'
      }
    ],
    checkpoint: {
      prompt: 'Print the index where target belongs in the sorted list, so the order stays correct.',
      starter: `const nums = [2, 4, 4, 6, 10];
const target = 5;
let lo = 0;
let hi = nums.length - 1;
// Print the insertion index: 3
`,
      expect: { kind: 'output', value: '3' },
      hints: [
        'Keep the loop condition lo <= hi and both bounds inclusive.',
        'When nums[mid] is smaller than target, lo = mid + 1. Otherwise hi = mid - 1.',
        'When the loop ends, lo is the first index whose value is at least target.'
      ],
      solution: `const nums = [2, 4, 4, 6, 10];
const target = 5;
let lo = 0;
let hi = nums.length - 1;
while (lo <= hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (nums[mid] < target) lo = mid + 1;
  else hi = mid - 1;
}
console.log(lo);`
    },
    next: 'recursion'
  },
  {
    id: 'recursion',
    track: 'patterns',
    title: 'Recursion and backtracking, one frame at a time',
    summary: 'A base case, a smaller call, and a stack of frames that unwinds in reverse.',
    level: 'advanced',
    minutes: 22,
    language: 'javascript',
    objectives: [
      'Write a function that calls itself with a strictly smaller input.',
      'Predict the order in which a recursive trace prints.',
      'Record and undo a choice when exploring combinations.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>A recursive function solves a problem by calling itself on a smaller version of the same problem. Two parts are mandatory: a <strong>base case</strong> that returns without calling, and a <strong>recursive case</strong> that moves toward the base.</p><p>Each waiting call keeps its own copy of the parameters, which is why the work unwinds in reverse order. That stack costs memory: <code>n</code> nested calls use <code>O(n)</code> space and can overflow if the input is huge.</p>'
      },
      {
        type: 'code',
        caption: 'The trace unwinds from the base case. Prints: 1 + 0 / 2 + 1 / 3 + 3 / 6',
        code: `function sumTo(n) {
  if (n === 0) return 0;
  const rest = sumTo(n - 1);
  console.log(n + ' + ' + rest);
  return n + rest;
}
console.log(sumTo(3));`
      },
      {
        type: 'prose',
        html: '<p>Backtracking is recursion over choices: choose an option, explore it, then undo the choice before trying the next. The undo is what lets the next branch start from a clean slate.</p><p>Copy the path when you record it (<code>path.slice()</code>), because the same array keeps changing as you explore.</p>'
      },
      {
        type: 'code',
        caption: 'Every subset of two items. Prints: [[],[1],[1,2],[2]]',
        code: `function subsets(items) {
  const out = [];
  function walk(start, path) {
    out.push(path.slice());
    for (let i = start; i < items.length; i++) {
      path.push(items[i]);
      walk(i + 1, path);
      path.pop();
    }
  }
  walk(0, []);
  return out;
}
console.log(JSON.stringify(subsets([1, 2])));`
      },
      {
        type: 'callout',
        tone: 'warn',
        html: '<p>If a recursive branch returns nothing, adding its result gives <code>NaN</code>. Return the value from every branch, including the base case.</p>'
      },
      {
        type: 'quiz',
        question: 'Including the base case, how many calls does sumTo(4) make?',
        options: ['3', '4', '5', '10'],
        answer: 2,
        explain: 'The calls are sumTo(4), sumTo(3), sumTo(2), sumTo(1) and sumTo(0). That is five calls, and the base case is one of them.'
      }
    ],
    checkpoint: {
      prompt: 'Write factorial(n) recursively and print factorial(5).',
      starter: `function factorial(n) {
  // Base case, then the smaller call.
}

console.log(factorial(5));
`,
      expect: { kind: 'output', value: '120' },
      hints: [
        'The base case is n <= 1, which returns 1.',
        'Otherwise return n * factorial(n - 1).',
        'Print factorial(5) once, outside the function.'
      ],
      solution: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(5));`
    },
    next: 'dynamic-programming'
  },
  {
    id: 'dynamic-programming',
    track: 'patterns',
    title: 'Dynamic programming: reuse a subanswer',
    summary: 'Stop recomputing the same subanswer. Climbing stairs twice: the slow way, then the table.',
    level: 'advanced',
    minutes: 25,
    language: 'javascript',
    objectives: [
      'Show where a naive recursive count repeats work.',
      'Name the state in one sentence before writing a table.',
      'Turn a recurrence into a bottom-up loop.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>Problem: count the ways to climb <code>n</code> stairs when each step is one or two stairs. The natural recursive answer branches on the first step: take one, or take two.</p><p>That is correct, and it recomputes the same smaller counts again and again. The number of calls grows like the Fibonacci sequence, which is exponential.</p>'
      },
      {
        type: 'code',
        caption: 'Ways for six stairs, then calls made. Prints: 13 / 25',
        code: `let calls = 0;
function climb(n) {
  calls++;
  if (n <= 1) return 1;
  return climb(n - 1) + climb(n - 2);
}
console.log(climb(6));
console.log(calls);`
      },
      {
        type: 'prose',
        html: '<p>The insight is that the answer for <code>n</code> depends only on <code>n - 1</code> and <code>n - 2</code>. Store each answer the first time you compute it and every later request is a lookup.</p><p>State it in one sentence: ways(i) is the number of ways to reach step i, and ways(i) is ways(i - 1) plus ways(i - 2). Each state is computed once, so the loop is <code>O(n)</code> time; the table holds <code>n + 1</code> numbers, so <code>O(n)</code> space.</p>'
      },
      {
        type: 'code',
        caption: 'The same count from a table. Prints: 13',
        code: `const n = 6;
const ways = [1, 1];
for (let i = 2; i <= n; i++) {
  ways[i] = ways[i - 1] + ways[i - 2];
}
console.log(ways[n]);`
      },
      {
        type: 'callout',
        tone: 'note',
        html: '<p>The table is the last step, not the first. Write down what a smaller answer means, in words, before you allocate anything.</p>'
      },
      {
        type: 'quiz',
        question: 'With ways = [1, 1, 2, 3, 5], what is ways[4] built from?',
        options: ['ways[3] + ways[2]', 'ways[4] + ways[3]', 'The number of stairs', 'A fresh recursive call'],
        answer: 0,
        explain: 'Each entry is the sum of the two before it, so ways[4] is 3 + 2, which is 5.'
      }
    ],
    checkpoint: {
      prompt: 'Here each step can be 1, 2, or 3 stairs. Print the number of ways to climb n = 6 steps.',
      starter: `const n = 6;
// Base cases: 1 way for 0 steps, 1 for 1 step, 2 for 2 steps.
// Each later value is the sum of the previous three.
`,
      expect: { kind: 'output', value: '24' },
      hints: [
        'Start the table as [1, 1, 2] for zero, one, and two steps.',
        'For i from 3 to n, set ways[i] to ways[i - 1] + ways[i - 2] + ways[i - 3].',
        'Print ways[n] after the loop.'
      ],
      solution: `const n = 6;
const ways = [1, 1, 2];
for (let i = 3; i <= n; i++) {
  ways[i] = ways[i - 1] + ways[i - 2] + ways[i - 3];
}
console.log(ways[n]);`
    },
    next: 'trees-graphs'
  },
  {
    id: 'trees-graphs',
    track: 'interview',
    title: 'Trees and graphs: visit everything once',
    summary: 'Depth-first on a tree, breadth-first on a graph, and one seen set that keeps both honest.',
    level: 'advanced',
    minutes: 25,
    language: 'javascript',
    objectives: [
      'Walk a tree with a recursive depth-first function.',
      'Walk a graph with a queue and a seen set.',
      'Explain why a queue gives the shortest edge count in an unweighted graph.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>A tree is a set of nodes where each node points to children and nothing points back. A graph is the same idea without the no-cycles promise, so a walk can return to a node it has already met.</p><p>Visiting everything once means carrying a set of visited nodes, even when the structure looks small.</p>'
      },
      {
        type: 'code',
        caption: 'Depth-first sum of the tree. Prints: 10',
        code: `const tree = {
  value: 1,
  children: [
    { value: 2, children: [] },
    { value: 3, children: [{ value: 4, children: [] }] }
  ]
};
function total(node) {
  let sum = node.value;
  for (const child of node.children) sum += total(child);
  return sum;
}
console.log(total(tree));`
      },
      {
        type: 'prose',
        html: '<p>An adjacency list stores a graph as a plain object: each node maps to an array of neighbours. A queue explores in rings, so the first time you reach a node is along a shortest path.</p><p>The queue touches every node and every edge once: <code>O(V + E)</code> time and <code>O(V)</code> space.</p>'
      },
      {
        type: 'code',
        caption: 'Fewest edges from a to e. Prints: 3',
        code: `const graph = {
  a: ['b', 'c'],
  b: ['a', 'd'],
  c: ['a', 'd'],
  d: ['b', 'c', 'e'],
  e: ['d']
};
function distance(start, goal) {
  const queue = [[start, 0]];
  const seen = new Set([start]);
  while (queue.length > 0) {
    const [node, dist] = queue.shift();
    if (node === goal) return dist;
    for (const next of graph[node]) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push([next, dist + 1]);
      }
    }
  }
  return -1;
}
console.log(distance('a', 'e'));`
      },
      {
        type: 'callout',
        tone: 'warn',
        html: '<p>Mark a node as seen when you add it to the queue, not when you remove it. Otherwise two neighbours can enqueue the same node and your count or distance drifts.</p>'
      },
      {
        type: 'quiz',
        question: 'Which structure gives the shortest path in an unweighted graph?',
        options: ['A stack', 'A Map of all edges', 'A queue', 'Recursion without a seen set'],
        answer: 2,
        explain: 'A queue finishes every node at distance 1 before any node at distance 2, so the first arrival at a node is a shortest one.'
      }
    ],
    checkpoint: {
      prompt: 'Print how many nodes are reachable from a in this graph, including a itself.',
      starter: `const graph = {
  a: ['b', 'c'],
  b: ['a'],
  c: ['a', 'd'],
  d: ['c'],
  e: ['f'],
  f: ['e']
};
const seen = new Set(['a']);
const queue = ['a'];
// Walk from a, then print seen.size
`,
      expect: { kind: 'output', value: '4' },
      hints: [
        'Keep looping while queue.length is greater than zero.',
        'Take the first node with shift, then add every neighbour that is not in seen.',
        'When the queue is empty, print seen.size.'
      ],
      solution: `const graph = {
  a: ['b', 'c'],
  b: ['a'],
  c: ['a', 'd'],
  d: ['c'],
  e: ['f'],
  f: ['e']
};
const seen = new Set(['a']);
const queue = ['a'];
while (queue.length > 0) {
  const node = queue.shift();
  for (const next of graph[node]) {
    if (!seen.has(next)) {
      seen.add(next);
      queue.push(next);
    }
  }
}
console.log(seen.size);`
    },
    next: 'complexity'
  },
  {
    id: 'complexity',
    track: 'interview',
    title: 'Complexity you can defend',
    summary: 'Count the steps, name the growth, and say what n is before you say O.',
    level: 'intermediate',
    minutes: 16,
    language: 'javascript',
    objectives: [
      'Count the operations a loop performs as a function of n.',
      'Name the growth class of nested loops and halving loops.',
      'State time and space with a definition of n attached.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>Two programs that both work can differ wildly in how their work grows. Complexity is a way to describe that growth without depending on the machine.</p><p>Count one operation you care about, express the count in terms of the input size <code>n</code>, and keep the fastest-growing term. That term is the part that decides what happens when the input gets big.</p>'
      },
      {
        type: 'code',
        caption: 'Pairs checked in a five-item list. Prints: 10',
        code: `const nums = [3, 1, 4, 1, 5];
let steps = 0;
for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) {
    steps++;
  }
}
console.log(steps);`
      },
      {
        type: 'prose',
        html: '<p>One loop over the input is <code>O(n)</code>. Nested loops multiply, so two levels are <code>O(n^2)</code>. Halving the input each step is <code>O(log n)</code>. The usual ladder runs <code>O(1)</code>, <code>O(log n)</code>, <code>O(n)</code>, <code>O(n log n)</code>, <code>O(n^2)</code>, <code>O(2^n)</code>.</p><p>For this loop the count is <code>n * (n - 1) / 2</code>, which is about half of <code>n^2</code>. Constants do not change the class, so it is still quadratic. Space uses the same ladder: a Map of n keys is <code>O(n)</code> space, and a recursion stack n deep is <code>O(n)</code> too.</p>'
      },
      {
        type: 'code',
        caption: 'Halving until the value reaches one. Prints: 9',
        code: `let n = 1000;
let steps = 0;
while (n > 1) {
  n = Math.floor(n / 2);
  steps++;
}
console.log(steps);`
      },
      {
        type: 'callout',
        tone: 'tip',
        html: '<p>Say what <code>n</code> counts before you name a class: n is the number of nodes, and each edge is visited once, so <code>O(V + E)</code>. A bare <em>it is O(n)</em> invites the next question.</p>'
      },
      {
        type: 'quiz',
        question: 'Two separate loops each visit every element of the same list once. What is the time complexity?',
        options: ['O(1)', 'O(n)', 'O(n^2)', 'O(log n)'],
        answer: 1,
        explain: 'Two passes add rather than multiply: n + n is 2n, and constant factors drop, leaving O(n).'
      }
    ],
    checkpoint: {
      prompt: 'Run the pair-counting loop for n = 6 and print the count, then the text O(n^2), separated by a space.',
      starter: `const n = 6;
let steps = 0;
// Count the pairs with i < j, then print: 15 O(n^2)
`,
      expect: { kind: 'output', value: '15 O(n^2)' },
      hints: [
        'The inner loop runs 5, then 4, then 3, 2 and 1 times.',
        'The total is n * (n - 1) / 2, which is 15 for n = 6.',
        "Print steps + ' O(n^2)' once, after the loops."
      ],
      solution: `const n = 6;
let steps = 0;
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    steps++;
  }
}
console.log(steps + ' O(n^2)');`
    },
    next: 'debugging-tests'
  },
  {
    id: 'debugging-tests',
    track: 'interview',
    title: 'Debugging with tests and traces',
    summary: 'Turn a bug into a failing case, shrink it, and let a trace tell you where the value went wrong.',
    level: 'intermediate',
    minutes: 18,
    language: 'javascript',
    objectives: [
      'Write a tiny test that fails for the right reason.',
      'Use a trace to locate the pass where a value turns wrong.',
      'Fix one cause at a time and rerun the same test.'
    ],
    sections: [
      {
        type: 'prose',
        html: '<p>A bug is a claim that did not hold. The fastest way to find it is to make the claim small: one input, one expected value, one line of output you can compare.</p><p>Predict the result before you run. The gap between your prediction and the output is the information you came for.</p>'
      },
      {
        type: 'code',
        caption: 'One extra pass, one broken total. Prints: average is NaN',
        code: `function average(nums) {
  let total = 0;
  for (let i = 0; i <= nums.length; i++) total += nums[i];
  return total / nums.length;
}
console.log('average is ' + average([2, 4, 6]));`
      },
      {
        type: 'prose',
        html: '<p>Nothing threw. The loop simply made one more pass than there are slots, read <code>undefined</code>, and NaN spread through the total. When a number is NaN, suspect a missing value before you suspect arithmetic.</p><p>A trace settles it: print the index and the value on each pass, run again, and look at the last line.</p>'
      },
      {
        type: 'code',
        caption: 'Two claims, one pass and one fail. Prints: pass length / fail coercion: got 21',
        code: `function assertEqual(actual, expected, label) {
  if (actual === expected) console.log('pass ' + label);
  else console.log('fail ' + label + ': got ' + actual);
}
assertEqual([1, 2, 3].length, 3, 'length');
assertEqual('2' + 1, 3, 'coercion');`
      },
      {
        type: 'callout',
        tone: 'tip',
        html: '<p>Change one thing at a time. If you fix two things and the test passes, you do not know which fix mattered, and you cannot explain the bug later.</p>'
      },
      {
        type: 'quiz',
        question: 'A loop uses i <= arr.length on an array of three items. How many passes does it make?',
        options: ['2', '3', '4', 'It throws an error'],
        answer: 2,
        explain: 'The indexes 0, 1 and 2 are real, and index 3 is the extra pass. It reads undefined but does not throw.'
      }
    ],
    checkpoint: {
      prompt: 'countEven should count the even numbers. It returns the wrong answer. Find the two mistakes, fix them, and print the count for the list.',
      starter: `const nums = [1, 2, 4, 5, 6];
function countEven(list) {
  let count = 0;
  for (let i = 0; i <= list.length; i++) {
    if (list[i] % 2 === 1) count++;
  }
  return count;
}
console.log(countEven(nums));
`,
      expect: { kind: 'output', value: '3' },
      hints: [
        'Print i and list[i] inside the loop and look at the final pass.',
        'The loop should stop before list.length, so use i < list.length.',
        'Even means a remainder of 0, so compare with === 0.'
      ],
      solution: `const nums = [1, 2, 4, 5, 6];
function countEven(list) {
  let count = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] % 2 === 0) count++;
  }
  return count;
}
console.log(countEven(nums));`
    }
  }
];

export const curriculum = { tracks, lessons };

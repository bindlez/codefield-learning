// Pattern briefings shown before a problem. Each one is a compact lesson: the idea, a plan,
// a template, a worked miniature, traps and a comprehension check. The full related lesson is
// rendered below it, so the learner never starts from a cold statement.
export const briefings = {
  array: {
    title: 'Arrays: one pass, one piece of state',
    idea: 'An array gives constant-time indexing but linear-time insertion. Most array problems are solved by scanning once and carrying a small amount of state: a best value, a count, or a boundary.',
    steps: ['Restate what a single index means.', 'Decide what must be remembered after each step.', 'Update the answer after updating the state.', 'Check empty, single and repeated values.'],
    template: `function scan(nums) {
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    // update state with nums[i]
    // update best from the state
  }
  return best;
}`,
    worked: {
      prompt: 'Find the largest value in [3, 7, 2].',
      walk: ['Start best = -Infinity.', 'i=0: 3 is larger, best = 3.', 'i=1: 7 is larger, best = 7.', 'i=2: 2 is smaller, keep 7.'],
      result: 'Return 7. One pass, constant extra space.'
    },
    pitfalls: ['Using <= in a loop over the last index and reading past the array.', 'Copying the array inside the loop and turning O(n) into O(n²).'],
    complexity: 'O(n) time · O(1) extra space',
    quiz: { question: 'For an array of length n, which index is the last valid one?', options: ['n', 'n - 1', 'n + 1'], answer: 1, explain: 'Indexes run from 0 to n - 1. Reading n is undefined.' },
    lessonId: 'arrays-loops'
  },
  string: {
    title: 'Strings: characters, slices and frequency',
    idea: 'A JavaScript string is immutable, so every change builds a new string. Treat it as a sequence of characters: index it, slice it, or count it with a Map. When a problem says "substring" or "prefix", think about windows and boundaries.',
    steps: ['Clarify whether characters are ASCII, Unicode, or just lowercase letters.', 'Choose between indexing, slicing, and splitting.', 'Keep counts or a window when order matters.', 'Test empty strings and one-character strings.'],
    template: `function charCounts(text) {
  const counts = new Map();
  for (const ch of text) {
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }
  return counts;
}`,
    worked: {
      prompt: 'Count the characters in "aba".',
      walk: ['Read "a": map { a: 1 }.', 'Read "b": map { a: 1, b: 1 }.', 'Read "a": map { a: 2, b: 1 }.'],
      result: 'Two a characters and one b. The loop touched each character once.'
    },
    pitfalls: ['Using text[i] with an index past the end and expecting an error; you get undefined.', 'Assuming one emoji is one code unit — it is often two.'],
    complexity: 'O(n) time · O(k) space for k distinct characters',
    quiz: { question: 'Strings in JavaScript are…', options: ['Mutable in place', 'Immutable; methods return new strings', 'Always arrays of numbers'], answer: 1, explain: 'Methods such as slice and toUpperCase return new strings; the original is unchanged.' },
    lessonId: 'strings-regex'
  },
  'hash-table': {
    title: 'Hash maps: remember what you have seen',
    idea: 'A hash map trades memory for speed: lookups, inserts and deletes are O(1) on average. For each new value, ask what earlier value would complete it, then check the map instead of rescanning.',
    steps: ['Name the key: the value itself, a count, or an index.', 'Before inserting the current item, ask what partner you need.', 'Store the current item so later positions can find it.', 'Watch for duplicate keys and updates.'],
    template: `function twoSum(nums, target) {
  const seen = new Map();          // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    worked: {
      prompt: 'Find two values in [2, 7, 11] that add to 9.',
      walk: ['i=0: need 7; map is empty; store 2 at 0.', 'i=1: need 2; map has 2 at index 0.', 'Return [0, 1].'],
      result: 'One pass. The map answered "have I seen 2?" in one lookup.'
    },
    pitfalls: ['Inserting before looking up and reusing the same element twice.', 'Using an object for numeric keys and hitting prototype keys such as "constructor".'],
    complexity: 'O(n) time · O(n) space',
    quiz: { question: 'In the one-pass two-sum scan, what do you store in the map?', options: ['The target', 'Each value with its index', 'Only values greater than the target'], answer: 1, explain: 'Later positions look up the needed partner by value; the index is what you return.' },
    lessonId: 'hash-maps'
  },
  'two-pointers': {
    title: 'Two pointers: use order to remove a loop',
    idea: 'When the input is sorted, or when you only need a pair at the ends, two moving indexes can replace a nested scan. Each step discards a whole set of impossible pairs.',
    steps: ['Confirm what order or invariant the pointers rely on.', 'Start at the ends for pairs, or both at the start for fast/slow.', 'Move the pointer that can still improve the answer.', 'Stop when the pointers meet or cross.'],
    template: `function pairSum(sorted, target) {
  let left = 0, right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
    worked: {
      prompt: 'Find a pair in [1, 3, 5, 8] that sums to 9.',
      walk: ['Pointers start at values 1 and 8.', '1 + 8 = 9, so the pair is found.'],
      result: '[0, 3]. The pointers met the answer in one comparison.'
    },
    pitfalls: ['Using two pointers on unsorted data when the movement rule needs order.', 'Forgetting to move a pointer and looping forever.'],
    complexity: 'O(n) time · O(1) space after sorting',
    quiz: { question: 'In a sorted pair-sum, the current sum is too small. Which pointer moves?', options: ['right--', 'left++', 'Both at once'], answer: 1, explain: 'Increasing the smaller side is the only way to raise the sum.' },
    lessonId: 'two-pointers'
  },
  'sliding-window': {
    title: 'Sliding windows: keep a range valid',
    idea: 'A window is a contiguous range plus a running summary: a sum, a count, or a set. Expand the right edge, and only move the left edge when the range breaks its rule.',
    steps: ['Define exactly what makes a window valid.', 'Add the new right element to the summary.', 'While invalid, remove the left element and advance left.', 'Record the answer after the window is valid again.'],
    template: `function longestUnique(text) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < text.length; right++) {
    const ch = text[right];
    if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
    worked: {
      prompt: 'Longest substring without repeats in "abcabc".',
      walk: ['right=0..2 builds "abc", best 3.', 'right=3 sees "a" last at 0; left becomes 1.', 'Window "bca", best stays 3.'],
      result: '3. Each character entered and left at most once.'
    },
    pitfalls: ['Shrinking with an if instead of a while when several elements must leave.', 'Forgetting to remove the outgoing element from the summary.'],
    complexity: 'O(n) time · O(k) space',
    quiz: { question: 'When a variable window becomes invalid, what happens?', options: ['Restart the scan from right', 'Move left until it is valid again', 'Clear the whole summary'], answer: 1, explain: 'Shrinking from the left restores the invariant without re-reading the window.' },
    lessonId: 'sliding-window'
  },
  'binary-search': {
    title: 'Binary search: halve a monotone answer space',
    idea: 'Binary search works whenever a predicate is false up to a point and true afterwards. That includes sorted arrays, rotated arrays, and numeric answer ranges.',
    steps: ['Write the predicate: is the answer at least mid?', 'Choose inclusive or half-open bounds and keep them consistent.', 'Compute mid without overflowing or drifting.', 'Return the boundary, not just "found".'],
    template: `function lowerBound(nums, target) {
  let lo = 0, hi = nums.length - 1, answer = nums.length;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] >= target) { answer = mid; hi = mid - 1; }
    else lo = mid + 1;
  }
  return answer;
}`,
    worked: {
      prompt: 'Find 7 in [1, 3, 5, 7, 9].',
      walk: ['lo=0, hi=4, mid=2 → 5 < 7, lo=3.', 'mid=3 → 7, found.'],
      result: 'Index 3. Two comparisons instead of four.'
    },
    pitfalls: ['Mixing inclusive hi with a while (lo < hi) condition and skipping the last element.', 'Forgetting that the array must be sorted or the predicate monotone.'],
    complexity: 'O(log n) time · O(1) space',
    quiz: { question: 'Binary search requires the search space to be…', options: ['Random', 'Monotone: one side is impossible', 'Always numeric'], answer: 1, explain: 'Each step must be able to discard half the space using a consistent predicate.' },
    lessonId: 'binary-search'
  },
  stack: {
    title: 'Stacks: last in, first out',
    idea: 'A stack remembers unfinished work. Push an opening symbol, a candidate, or a running maximum; pop when the current item resolves it. Monotonic stacks keep values in order so each element is pushed and popped once.',
    steps: ['Decide what an unfinished item looks like.', 'Push when the item cannot be resolved yet.', 'Pop while the current item is better or closes it.', 'Handle leftovers after the loop.'],
    template: `function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (!pairs[ch]) stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}`,
    worked: {
      prompt: 'Check "([)]".',
      walk: ['Push ( and [.', 'See ); top is [, mismatch.'],
      result: 'false. The stack remembered the most recent opener.'
    },
    pitfalls: ['Popping from an empty stack.', 'Forgetting to check leftovers at the end.'],
    complexity: 'O(n) time · O(n) space',
    quiz: { question: 'Which structure fits matching parentheses?', options: ['Queue', 'Stack', 'Heap'], answer: 1, explain: 'The most recent opener must close first, which is LIFO.' },
    lessonId: 'arrays-loops'
  },
  'linked-list': {
    title: 'Linked lists: rewire pointers, do not copy',
    idea: 'A linked list is nodes joined by next pointers. You cannot index it in O(1), so most solutions walk once while keeping a few references: previous, current, and a saved next.',
    steps: ['Sketch the nodes and arrows before writing code.', 'Use a dummy head when the first node may change.', 'Save next before rewiring.', 'Check null before reading val or next.'],
    template: `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
    worked: {
      prompt: 'Reverse 1 → 2 → 3.',
      walk: ['Save 2, point 1 to null, prev=1.', 'Save 3, point 2 to 1, prev=2.', 'Point 3 to 2, prev=3.'],
      result: '3 → 2 → 1. Every pointer was saved before it changed.'
    },
    pitfalls: ['Losing the rest of the list by overwriting next first.', 'Returning head instead of the new head after a reversal.'],
    complexity: 'O(n) time · O(1) space',
    quiz: { question: 'Why use a dummy head?', options: ['To store a copy of the list', 'To avoid special cases when the first node changes', 'To make the list circular'], answer: 1, explain: 'dummy.next gives one stable place to build or return the result.' },
    lessonId: 'trees-graphs'
  },
  tree: {
    title: 'Trees: a base case and two smaller trees',
    idea: 'Almost every tree solution is recursion: handle null, solve the left and right subtrees, then combine. When you need levels or the shortest path, switch to a queue and BFS.',
    steps: ['Write the null base case first.', 'Decide what each call returns to its parent.', 'Combine left, right and the current value.', 'Use a queue when the answer depends on depth or level order.'],
    template: `function sumTree(node) {
  if (!node) return 0;
  return node.val + sumTree(node.left) + sumTree(node.right);
}`,
    worked: {
      prompt: 'Sum a tree with root 2, children 3 and 4.',
      walk: ['sum(3) = 3, sum(4) = 4.', 'Return 2 + 3 + 4.'],
      result: '9. The null children contribute 0.'
    },
    pitfalls: ['Forgetting the null check before reading node.left.', 'Using DFS when the question asks for the nearest or level-order result.'],
    complexity: 'O(n) time · O(h) recursion depth',
    quiz: { question: 'An inorder traversal of a binary search tree produces…', options: ['Random order', 'Sorted order', 'Reverse level order'], answer: 1, explain: 'Left subtree, node, right subtree is exactly ascending order in a BST.' },
    lessonId: 'trees-graphs'
  },
  graph: {
    title: 'Graphs: visit each node once',
    idea: 'A graph is nodes plus edges. Keep a visited set, then flood outward with a stack (DFS) or a queue (BFS). Grids are graphs: each cell is a node with up to four neighbours.',
    steps: ['Build or identify adjacency.', 'Mark a node when you enqueue it, not when you dequeue it.', 'Process neighbours that are inside bounds and unvisited.', 'Count components or distances as you go.'],
    template: `function components(graph) {
  const seen = new Set();
  let count = 0;
  for (const start of graph.keys()) {
    if (seen.has(start)) continue;
    count++;
    const stack = [start];
    seen.add(start);
    while (stack.length) {
      const node = stack.pop();
      for (const next of graph.get(node) || []) {
        if (!seen.has(next)) { seen.add(next); stack.push(next); }
      }
    }
  }
  return count;
}`,
    worked: {
      prompt: 'Count components in a → b, c isolated.',
      walk: ['Start a, visit b.', 'c is unvisited, start again.'],
      result: '2 components. Each node entered the stack once.'
    },
    pitfalls: ['Marking visited only after popping, which can enqueue a node twice.', 'Forgetting bounds checks on a grid.'],
    complexity: 'O(V + E) time · O(V) space',
    quiz: { question: 'Why mark a node visited before pushing it?', options: ['To save memory', 'To stop duplicate work and cycles', 'To sort the neighbours'], answer: 1, explain: 'Cycles would otherwise enqueue the same node repeatedly.' },
    lessonId: 'trees-graphs'
  },
  'dynamic-programming': {
    title: 'Dynamic programming: name the state',
    idea: 'DP replaces repeated subproblems with stored answers. Write the state in one sentence, find how a larger state uses smaller ones, then choose recursion with memo or a bottom-up table.',
    steps: ['Define dp[i] in words.', 'Write the recurrence using smaller states.', 'Set the base cases.', 'Choose the loop order so dependencies exist; trim space if only the last few states matter.'],
    template: `function climbStairs(n) {
  const ways = [1, 1];
  for (let i = 2; i <= n; i++) ways[i] = ways[i - 1] + ways[i - 2];
  return ways[n];
}`,
    worked: {
      prompt: 'Count ways to climb 4 stairs with steps 1 or 2.',
      walk: ['ways[0]=1, ways[1]=1.', 'ways[2]=2, ways[3]=3, ways[4]=5.'],
      result: '5. Each state used the two before it.'
    },
    pitfalls: ['Starting the loop before the base cases are filled.', 'Using a state that does not contain enough information to make the next choice.'],
    complexity: 'O(n) time · O(n) or O(1) space',
    quiz: { question: 'What must dp[i] mean?', options: ['The answer for the whole input', 'A complete, unambiguous answer for the first i items', 'The largest value only'], answer: 1, explain: 'A vague state cannot produce a correct recurrence.' },
    lessonId: 'dynamic-programming'
  },
  backtracking: {
    title: 'Backtracking: choose, explore, undo',
    idea: 'Backtracking is recursion over choices. At each level, pick a candidate, recurse, then undo the pick so the next candidate starts from the same state. Sorting and pruning remove duplicate branches.',
    steps: ['Define the choice at each level.', 'Maintain the current path and the remaining options.', 'Undo the choice before the next iteration.', 'Prune branches that cannot produce a valid answer.'],
    template: `function subsets(nums) {
  const out = [], path = [];
  function walk(start) {
    out.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      walk(i + 1);
      path.pop();
    }
  }
  walk(0);
  return out;
}`,
    worked: {
      prompt: 'Subsets of [1, 2].',
      walk: ['Record [].', 'Pick 1 → record [1] → pick 2 → record [1,2], undo 2.', 'Undo 1, pick 2 → record [2].'],
      result: '[[], [1], [1,2], [2]]. Every path was undone before the next choice.'
    },
    pitfalls: ['Pushing path itself instead of a copy; later undo mutates the stored answer.', 'Forgetting the undo step and leaking choices into siblings.'],
    complexity: 'O(2^n · n) for subsets · O(n) recursion depth',
    quiz: { question: 'What does the undo step restore?', options: ['The output array', 'The state before the current choice', 'The input order'], answer: 1, explain: 'Backtracking explores siblings from an identical state.' },
    lessonId: 'recursion'
  },
  greedy: {
    title: 'Greedy: take the locally best step that is safe',
    idea: 'A greedy algorithm commits to the best local choice and never revisits it. It is correct only when an exchange argument shows that the local choice cannot hurt the global answer.',
    steps: ['Identify the choice you would make at each step.', 'Try to prove it is safe; look for a counterexample.', 'Scan once, keeping the best reachable state.', 'Check whether the answer needs the whole sequence or just a running value.'],
    template: `function maxProfit(prices) {
  let low = Infinity, best = 0;
  for (const price of prices) {
    low = Math.min(low, price);
    best = Math.max(best, price - low);
  }
  return best;
}`,
    worked: {
      prompt: 'Best profit in [7, 1, 5, 3, 6].',
      walk: ['low=7, best=0.', 'low=1; price 5 gives 4; price 6 gives 5.'],
      result: '5. Buy at 1, sell at 6.'
    },
    pitfalls: ['Assuming greedy works without checking a counterexample.', 'Tracking the best price but forgetting the best profit.'],
    complexity: 'O(n) time · O(1) space',
    quiz: { question: 'When is greedy unsafe?', options: ['When the input is unsorted', 'When a locally good choice blocks a better global one', 'When the array is long'], answer: 1, explain: 'Greedy needs an argument that no later choice can recover a lost opportunity.' },
    lessonId: 'complexity'
  },
  'heap-priority-queue': {
    title: 'Heaps: keep the best k items',
    idea: 'A heap gives O(log n) insert and O(1) peek at the smallest or largest item. It is the right tool for top-k, streaming medians, and merging many sorted lists. JavaScript has no built-in heap, so either implement one or sort when the input is small.',
    steps: ['Decide whether you need the smallest or largest at the front.', 'Keep only k items when the answer is top-k.', 'For a max-heap in JS, store negated values in a min-heap.', 'Compare cost: sorting is O(n log n); a heap is O(n log k).'],
    template: `// Small inputs: sorting is clear and fast enough.
function topK(nums, k) {
  return [...nums].sort((a, b) => b - a).slice(0, k);
}
// Large streams: implement a binary heap with push/pop in O(log n).`,
    worked: {
      prompt: 'Three largest values in [5, 1, 9, 3].',
      walk: ['Sort descending: 9, 5, 3, 1.', 'Take the first three.'],
      result: '[9, 5, 3]. A size-3 min-heap would cost O(n log 3) without sorting everything.'
    },
    pitfalls: ['Using the default sort on numbers and getting string order: [10, 2] becomes [10, 2].', 'Forgetting that JS has no priority queue in the standard library.'],
    complexity: 'O(n log k) with a heap · O(n log n) with sorting',
    quiz: { question: 'A size-k heap for top-k uses which complexity?', options: ['O(n log n)', 'O(n log k)', 'O(k)'], answer: 1, explain: 'Each of n items costs at most log k to insert into a heap of size k.' },
    lessonId: 'complexity'
  },
  sorting: {
    title: 'Sorting: order first, then scan',
    idea: 'Sorting turns unordered data into something two pointers, binary search, or adjacent comparisons can use. In JavaScript, always pass a numeric comparator; the default converts values to strings.',
    steps: ['Ask whether order would simplify the problem.', 'Write the comparator explicitly.', 'Sort a copy if the original must stay intact.', 'Look for adjacent duplicates or intervals after sorting.'],
    template: `const intervals = [[5, 7], [1, 3], [2, 4]];
intervals.sort((a, b) => a[0] - b[0]);
// [[1,3], [2,4], [5,7]]`,
    worked: {
      prompt: 'Merge overlapping intervals [[5,7], [1,3], [2,4]].',
      walk: ['Sort by start: [1,3], [2,4], [5,7].', '[2,4] overlaps [1,3] → [1,4].', '[5,7] starts after 4 → new interval.'],
      result: '[[1,4], [5,7]]. Sorting made overlap a local check.'
    },
    pitfalls: ['Using sort() without a comparator on numbers.', 'Assuming sort is stable for every engine (modern engines are stable, but do not rely on it for correctness).'],
    complexity: 'O(n log n) time · O(log n) to O(n) space depending on the engine',
    quiz: { question: '[10, 2, 1].sort() produces…', options: ['[1, 2, 10]', '[1, 10, 2]', '[10, 2, 1]'], answer: 1, explain: 'Default sort compares strings: "1" < "10" < "2".' },
    lessonId: 'arrays-loops'
  },
  math: {
    title: 'Math: keep the invariant, watch the limits',
    idea: 'Math problems reward writing the relationship before coding: parity, divisibility, gcd, powers, or modular arithmetic. JavaScript numbers are floating point, so large integers lose precision beyond 2^53 - 1.',
    steps: ['Write the mathematical relationship in words.', 'Check the numeric range and whether overflow or precision matters.', 'Reduce the problem with gcd, parity, or modular arithmetic.', 'Test 0, 1, negatives and the maximum input.'],
    template: `function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}`,
    worked: {
      prompt: 'gcd(12, 18).',
      walk: ['12 % 18 = 12 → (18, 12).', '18 % 12 = 6 → (12, 6).', '12 % 6 = 0 → gcd 6.'],
      result: '6. The remainder shrinks the pair every step.'
    },
    pitfalls: ['Using bitwise operators on numbers above 2^31; they truncate to 32 bits.', 'Forgetting that 0.1 + 0.2 is not exactly 0.3.'],
    complexity: 'O(log min(a, b)) for gcd',
    quiz: { question: 'The largest integer JavaScript represents exactly is…', options: ['2^31 - 1', '2^53 - 1', '2^64 - 1'], answer: 1, explain: 'Number.MAX_SAFE_INTEGER is 2^53 - 1; beyond that, integers can collide.' },
    lessonId: 'complexity'
  },
  'bit-manipulation': {
    title: 'Bits: XOR finds the odd one out',
    idea: 'Bit operations work on the binary representation. XOR cancels equal pairs, AND tests a bit, and shifts move place value. They are useful for parity, subsets, and constant-space tricks.',
    steps: ['Write the numbers in binary when the rule is unclear.', 'Use XOR for pairs that cancel.', 'Use x & (x - 1) to clear the lowest set bit.', 'Remember JavaScript bitwise operators use 32-bit signed integers.'],
    template: `function singleNumber(nums) {
  let answer = 0;
  for (const n of nums) answer ^= n;
  return answer;
}`,
    worked: {
      prompt: 'Find the value that appears once in [4, 1, 2, 1, 2].',
      walk: ['4 ^ 1 = 5.', '5 ^ 2 = 7, 7 ^ 1 = 6, 6 ^ 2 = 4.'],
      result: '4. Equal pairs cancelled; only the single value remained.'
    },
    pitfalls: ['Using bitwise operators on values beyond 32 bits.', 'Confusing logical && with bitwise &.'],
    complexity: 'O(n) time · O(1) space',
    quiz: { question: 'What does x & (x - 1) do?', options: ['Sets the lowest bit', 'Clears the lowest set bit', 'Reverses all bits'], answer: 1, explain: 'Subtracting one borrows through the lowest set bit, so AND clears it.' },
    lessonId: 'values-types'
  },
  trie: {
    title: 'Tries: share prefixes',
    idea: 'A trie stores words character by character, sharing prefixes. Each node holds a map of children and a flag for "a word ends here". Lookup costs O(length of the word), independent of how many words are stored.',
    steps: ['Create a node with children and an end flag.', 'Insert by walking or creating one child per character.', 'Search by walking; check the end flag for a full word.', 'For prefix search, stop when the prefix runs out.'],
    template: `class Trie {
  constructor() { this.root = { children: new Map(), end: false }; }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), end: false });
      node = node.children.get(ch);
    }
    node.end = true;
  }
}`,
    worked: {
      prompt: 'Insert "cat" and "car".',
      walk: ['c → a → t, mark end.', 'c → a already exists, add r, mark end.'],
      result: 'The shared "ca" prefix is stored once.'
    },
    pitfalls: ['Marking end on the wrong node.', 'Assuming a prefix is a word; check the end flag.'],
    complexity: 'O(L) per operation · O(total characters) space',
    quiz: { question: 'A trie lookup for a word of length L costs…', options: ['O(number of words)', 'O(L)', 'O(L log n)'], answer: 1, explain: 'It follows one edge per character.' },
    lessonId: 'trees-graphs'
  },
  'union-find': {
    title: 'Union-find: merge groups and ask "same set?"',
    idea: 'Disjoint set union tracks connected components under merges. Each element points to a parent; find walks to the root, union links two roots. Path compression makes repeated finds almost constant time.',
    steps: ['Initialize parent[i] = i and a size or rank.', 'Find the root with path compression.', 'Union the roots, attaching the smaller tree to the larger.', 'Count components or check connectivity after each union.'],
    template: `const parent = Array.from({ length: n }, (_, i) => i);
function find(x) {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]];
    x = parent[x];
  }
  return x;
}
function union(a, b) {
  const ra = find(a), rb = find(b);
  if (ra !== rb) parent[rb] = ra;
}`,
    worked: {
      prompt: 'Union (1,2), (3,4), (2,3). How many components?',
      walk: ['{1,2}', '{3,4}', '2 and 3 merge the two groups.'],
      result: 'One component {1,2,3,4}.'
    },
    pitfalls: ['Comparing parent[a] === parent[b] instead of the roots.', 'Unioning without finding the roots first.'],
    complexity: 'Nearly O(1) amortized per operation',
    quiz: { question: 'What does find(x) return?', options: ['The parent of x', 'The root of x\'s set', 'The size of the set'], answer: 1, explain: 'Two elements are in the same set when their roots match.' },
    lessonId: 'trees-graphs'
  },
  matrix: {
    title: 'Matrices: rows, columns and neighbours',
    idea: 'A matrix is an array of rows. Most problems are a scan with two indexes, a direction table for neighbours, or an in-place transformation that needs a boundary or a marker.',
    steps: ['Decide whether rows and columns have different meanings.', 'For neighbours, use four direction pairs and bounds checks.', 'For in-place work, store the boundary or mark visited.', 'Transpose or reverse rows for rotations.'],
    template: `const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
for (const [dr, dc] of directions) {
  const nr = row + dr, nc = col + dc;
  if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
    // visit grid[nr][nc]
  }
}`,
    worked: {
      prompt: 'Count neighbours of the centre cell in a 3×3 grid.',
      walk: ['Four orthogonal neighbours.', 'All are inside bounds.'],
      result: '4 neighbours. Diagonal moves would make it 8.'
    },
    pitfalls: ['Swapping row and column bounds.', 'Mutating a cell before reading it as a marker elsewhere.'],
    complexity: 'O(rows × cols) time',
    quiz: { question: 'For an m×n matrix, grid[0].length is…', options: ['m', 'n', 'm × n'], answer: 1, explain: 'The first row has one entry per column.' },
    lessonId: 'arrays-loops'
  },
  'prefix-sum': {
    title: 'Prefix sums: pay once, answer ranges fast',
    idea: 'A prefix array stores the sum from the start to each index. Any range sum becomes prefix[right] - prefix[left - 1] in O(1), which turns repeated range queries from O(n) each into O(1).',
    steps: ['Build prefix[0] = 0, prefix[i + 1] = prefix[i] + nums[i].', 'For range [l, r], use prefix[r + 1] - prefix[l].', 'For subarrays with a target, store prefix counts in a map.', 'Watch negative numbers; sliding windows no longer work.'],
    template: `const prefix = [0];
for (const n of nums) prefix.push(prefix[prefix.length - 1] + n);
// sum of nums[l..r]:
const rangeSum = prefix[r + 1] - prefix[l];`,
    worked: {
      prompt: 'Range sum of [2, 4, 1, 3] from index 1 to 2.',
      walk: ['prefix = [0, 2, 6, 7, 10].', 'prefix[3] - prefix[1] = 7 - 2.'],
      result: '5. Two array reads instead of a loop.'
    },
    pitfalls: ['Off-by-one between prefix length n + 1 and index ranges.', 'Using a sliding window when values can be negative.'],
    complexity: 'O(n) build · O(1) per query · O(n) space',
    quiz: { question: 'Why does prefix[0] equal 0?', options: ['To make the array longer', 'So ranges starting at index 0 need no special case', 'Because sums start at zero'], answer: 1, explain: 'The empty prefix gives a uniform formula for every range.' },
    lessonId: 'arrays-loops'
  },
  design: {
    title: 'Design: state plus invariants',
    idea: 'Design problems ask you to implement an API. Decide the fields, the meaning of each field, and the invariant every method must preserve. Then make each operation as cheap as the constraints demand.',
    steps: ['List the methods and their complexity budget.', 'Choose the fields that make the common operation cheap.', 'Write the invariant in one sentence.', 'Handle duplicate keys, empty structures, and repeated calls.'],
    template: `class Counter {
  constructor() { this.counts = new Map(); }
  add(key) { this.counts.set(key, (this.counts.get(key) || 0) + 1); }
  count(key) { return this.counts.get(key) || 0; }
  remove(key) {
    const next = (this.counts.get(key) || 0) - 1;
    if (next <= 0) this.counts.delete(key);
    else this.counts.set(key, next);
  }
}`,
    worked: {
      prompt: 'Track counts for add("a"), add("a"), remove("a").',
      walk: ['add a → 1.', 'add a → 2.', 'remove a → 1.'],
      result: 'The key remains with count 1; a second remove would delete it.'
    },
    pitfalls: ['Leaving zero-count keys behind and reporting them later.', 'Choosing a structure that makes the required operation O(n).'],
    complexity: 'Depends on the chosen structures; usually O(1) per operation',
    quiz: { question: 'What should you write before coding a design problem?', options: ['The full class immediately', 'The methods, invariants and complexity budget', 'Only the constructor'], answer: 1, explain: 'The invariant tells you what every method must preserve.' },
    lessonId: 'objects-maps'
  },
  general: {
    title: 'Start from the constraints',
    idea: 'Before choosing a pattern, read the input size, the value range, and what the output must contain. The constraints usually eliminate most approaches: n ≤ 20 invites backtracking, n ≤ 10^5 asks for O(n log n), and n ≤ 10^9 asks for math or binary search on the answer.',
    steps: ['Restate the input, output and constraints in your own words.', 'Write the brute force and its complexity.', 'Use the constraint to pick a target complexity.', 'Test the smallest, largest and most repetitive inputs.'],
    template: `function solve(input) {
  // 1. Restate the task in one sentence.
  // 2. Choose the pattern from the constraints.
  // 3. Handle the empty / single-element case first.
  return input;
}`,
    worked: {
      prompt: 'n = 1,000,000 and you need a pair sum.',
      walk: ['A nested loop is 10^12 operations, too slow.', 'A hash map makes it one pass, O(n).'],
      result: 'Choose the map. The constraint chose the pattern for you.'
    },
    pitfalls: ['Optimising before writing a correct brute force.', 'Ignoring the value range and hitting precision or overflow limits.'],
    complexity: 'Pick a target from the constraints before coding',
    quiz: { question: 'The first thing to read in a new problem is…', options: ['The examples', 'The constraints and required output', 'The title'], answer: 1, explain: 'Constraints determine which complexity class can pass.' },
    lessonId: 'reading-code'
  }
};

const aliases = {
  'depth-first-search': 'tree',
  'breadth-first-search': 'tree',
  'binary-tree': 'tree',
  'binary-search-tree': 'tree',
  recursion: 'backtracking',
  memoization: 'dynamic-programming',
  'monotonic-stack': 'stack',
  queue: 'stack',
  heap: 'heap-priority-queue',
  'priority-queue': 'heap-priority-queue',
  'ordered-set': 'heap-priority-queue',
  'divide-and-conquer': 'backtracking',
  'segment-tree': 'tree',
  'binary-indexed-tree': 'tree',
  'topological-sort': 'graph',
  'shortest-path': 'graph',
  'disjoint-set': 'union-find',
  simulation: 'general',
  counting: 'hash-table',
  'number-theory': 'math',
  'game-theory': 'math',
  geometry: 'math',
  combinatorics: 'math',
  'probability-and-statistics': 'math',
  database: 'general',
  shell: 'general',
  concurrency: 'general'
};

/** Choose the most specific briefing for a problem's topic tags. */
export function briefingFor(tags = []) {
  const slugs = tags.map(tag => String(tag.slug || tag).toLowerCase());
  for (const slug of slugs) {
    const key = briefings[slug] ? slug : aliases[slug];
    if (key && briefings[key]) return { key, briefing: briefings[key] };
  }
  return { key: 'general', briefing: briefings.general };
}

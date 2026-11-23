export const problems = [
  {
    id: 'two-sum',
    number: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    url: 'https://leetcode.com/problems/two-sum/',
    statement: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Each input has exactly one valid pair, you may not use the same element twice, and the pair should be returned in increasing index order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    functionName: 'twoSum',
    params: [{ name: 'nums', type: 'integer[]' }, { name: 'target', type: 'integer' }],
    returns: { type: 'integer[]' },
    starter: `var twoSum = function(nums, target) {
  // Return the two indices.
};`,
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[-1, -2, -3, -4], -6], expected: [1, 3] },
      { args: [[0, 4, 3, 0], 0], expected: [0, 3] }
    ],
    hints: [
      'Checking every pair works but costs O(n^2). Can you answer in one pass by remembering what you have already seen?',
      'For each number, the value you still need is target - nums[i]. A hash map can tell you whether that value appeared earlier.',
      'Store each value with its index as you scan, and look up the needed value before inserting the current one so a single element is never reused.'
    ],
    solution: `var twoSum = function(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
};`
  },
  {
    id: 'valid-parentheses',
    number: 2,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    url: 'https://leetcode.com/problems/valid-parentheses/',
    statement: 'Given a string s made up of round (), curly {} and square [] brackets, determine whether the brackets are valid. Brackets are valid when every opening bracket is closed by the same type, closing brackets appear in the correct order, and nothing is left open.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' }
    ],
    functionName: 'isValid',
    params: [{ name: 's', type: 'string' }],
    returns: { type: 'boolean' },
    starter: `var isValid = function(s) {
  // Return true when every bracket is closed in order.
};`,
    tests: [
      { args: ['()'], expected: true },
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['([)]'], expected: false },
      { args: [']'], expected: false }
    ],
    hints: [
      'You need to remember opening brackets that are still waiting for a closer.',
      'A stack fits: push every opening bracket and pop when a closing bracket appears.',
      'The popped bracket must match the closer, and the stack must be empty once the string ends.'
    ],
    solution: `var isValid = function(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else if (stack.pop() !== pairs[ch]) {
      return false;
    }
  }
  return stack.length === 0;
};`
  },
  {
    id: 'contains-duplicate',
    number: 3,
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    url: 'https://leetcode.com/problems/contains-duplicate/',
    statement: 'Given an array of integers nums, return true if any value appears at least twice and false if every element is distinct. An empty array has no duplicates.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' },
      { input: 'nums = [1,2,3,4]', output: 'false' }
    ],
    functionName: 'containsDuplicate',
    params: [{ name: 'nums', type: 'integer[]' }],
    returns: { type: 'boolean' },
    starter: `var containsDuplicate = function(nums) {
  // Return true if a value repeats.
};`,
    tests: [
      { args: [[1, 2, 3, 1]], expected: true },
      { args: [[1, 2, 3, 4]], expected: false },
      { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
      { args: [[]], expected: false },
      { args: [[-1, -2, -3, -1]], expected: true }
    ],
    hints: [
      'Sorting first would put equal values next to each other. What does that cost?',
      'A set of values seen so far answers the question in a single pass.',
      'Return true as soon as a value is already in the set, and false after the loop ends.'
    ],
    solution: `var containsDuplicate = function(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
};`
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    number: 4,
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    tags: ['Array', 'Greedy'],
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    statement: 'You are given an array prices where prices[i] is the price of a stock on day i. Choose one day to buy and a later day to sell. Return the maximum profit you can make, or 0 when no profitable trade is possible.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', note: 'Buy at price 1 and sell at price 6.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', note: 'Prices only fall, so no profit is possible.' }
    ],
    functionName: 'maxProfit',
    params: [{ name: 'prices', type: 'integer[]' }],
    returns: { type: 'integer' },
    starter: `var maxProfit = function(prices) {
  // Return the best profit from one buy and one later sell.
};`,
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[2, 4, 1]], expected: 2 },
      { args: [[1]], expected: 0 },
      { args: [[2, 1, 2, 1, 0, 1, 2]], expected: 2 }
    ],
    hints: [
      'Scan the days left to right and track the lowest price seen so far.',
      'On each day the best sale today is today\'s price minus that running minimum.',
      'Keep a running minimum and a running best profit, and return 0 if prices never rise.'
    ],
    solution: `var maxProfit = function(prices) {
  let lowest = Infinity;
  let best = 0;
  for (const price of prices) {
    if (price < lowest) {
      lowest = price;
    } else if (price - lowest > best) {
      best = price - lowest;
    }
  }
  return best;
};`
  },
  {
    id: 'valid-anagram',
    number: 5,
    title: 'Valid Anagram',
    difficulty: 'Easy',
    tags: ['String', 'Hash Table'],
    url: 'https://leetcode.com/problems/valid-anagram/',
    statement: 'Given two strings s and t, return true if t is an anagram of s, meaning t uses exactly the same characters the same number of times, and false otherwise.',
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' }
    ],
    functionName: 'isAnagram',
    params: [{ name: 's', type: 'string' }, { name: 't', type: 'string' }],
    returns: { type: 'boolean' },
    starter: `var isAnagram = function(s, t) {
  // Return true when both strings use the same letters.
};`,
    tests: [
      { args: ['anagram', 'nagaram'], expected: true },
      { args: ['rat', 'car'], expected: false },
      { args: ['a', 'a'], expected: true },
      { args: ['ab', 'a'], expected: false },
      { args: ['', ''], expected: true }
    ],
    hints: [
      'If the two strings have different lengths, they cannot be anagrams.',
      'Count how many times each character appears in the first string.',
      'Walk the second string and decrement those counts; a missing or exhausted count means false.'
    ],
    solution: `var isAnagram = function(s, t) {
  if (s.length !== t.length) return false;
  const counts = new Map();
  for (const ch of s) {
    counts.set(ch, (counts.get(ch) || 0) + 1);
  }
  for (const ch of t) {
    const left = counts.get(ch) || 0;
    if (left === 0) return false;
    counts.set(ch, left - 1);
  }
  return true;
};`
  },
  {
    id: 'maximum-subarray',
    number: 6,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    url: 'https://leetcode.com/problems/maximum-subarray/',
    statement: 'Given an integer array nums, find the contiguous subarray with the largest sum and return that sum. The subarray must contain at least one element, and nums may contain negative numbers.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', note: 'The subarray [4,-1,2,1] sums to 6.' },
      { input: 'nums = [1]', output: '1' }
    ],
    functionName: 'maxSubArray',
    params: [{ name: 'nums', type: 'integer[]' }],
    returns: { type: 'integer' },
    starter: `var maxSubArray = function(nums) {
  // Return the largest sum of a contiguous subarray.
};`,
    tests: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-3, -1, -2]], expected: -1 },
      { args: [[2, -1, 2]], expected: 3 }
    ],
    hints: [
      'Think about the best subarray ending at each position instead of every possible start and end.',
      'At index i the best sum ending there is either nums[i] alone or the previous best ending sum plus nums[i].',
      'Track the largest value seen across all positions, and initialise from the first element because all values may be negative.'
    ],
    solution: `var maxSubArray = function(nums) {
  let best = nums[0];
  let current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
};`
  },
  {
    id: 'climbing-stairs',
    number: 7,
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    tags: ['Math', 'Dynamic Programming'],
    url: 'https://leetcode.com/problems/climbing-stairs/',
    statement: 'You are climbing a staircase with n steps. Each move you climb either 1 or 2 steps. Return the number of distinct ways to reach the top.',
    examples: [
      { input: 'n = 2', output: '2', note: '1+1 or a single 2-step move.' },
      { input: 'n = 3', output: '3' }
    ],
    functionName: 'climbStairs',
    params: [{ name: 'n', type: 'integer' }],
    returns: { type: 'integer' },
    starter: `var climbStairs = function(n) {
  // Return the number of distinct ways to reach step n.
};`,
    tests: [
      { args: [2], expected: 2 },
      { args: [3], expected: 3 },
      { args: [1], expected: 1 },
      { args: [5], expected: 8 },
      { args: [10], expected: 89 }
    ],
    hints: [
      'Start with the smallest cases: one step has one way, two steps have two ways.',
      'To reach step n you arrive from step n-1 or step n-2, so the counts add together.',
      'Only the last two counts matter, so keep two variables and loop upward instead of storing every value.'
    ],
    solution: `var climbStairs = function(n) {
  let previous = 1;
  let current = 1;
  for (let step = 2; step <= n; step++) {
    const next = previous + current;
    previous = current;
    current = next;
  }
  return current;
};`
  },
  {
    id: 'binary-search',
    number: 8,
    title: 'Binary Search',
    difficulty: 'Easy',
    tags: ['Array', 'Binary Search'],
    url: 'https://leetcode.com/problems/binary-search/',
    statement: 'Given an array of integers nums sorted in ascending order and an integer target, return the index of target if it exists, otherwise return -1. Aim for O(log n) time.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' }
    ],
    functionName: 'search',
    params: [{ name: 'nums', type: 'integer[]' }, { name: 'target', type: 'integer' }],
    returns: { type: 'integer' },
    starter: `var search = function(nums, target) {
  // Return the index of target, or -1.
};`,
    tests: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[5], 5], expected: 0 },
      { args: [[5], -5], expected: -1 },
      { args: [[1, 3, 5, 7, 9, 11], 11], expected: 5 }
    ],
    hints: [
      'Keep low and high indices that bound the part of the array still worth searching.',
      'Compare the middle element with the target and throw away the half that cannot contain it.',
      'Continue while low is not past high, and return -1 once the range is empty.'
    ],
    solution: `var search = function(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
};`
  },
  {
    id: 'move-zeroes',
    number: 9,
    title: 'Move Zeroes',
    difficulty: 'Easy',
    tags: ['Array', 'Two Pointers'],
    url: 'https://leetcode.com/problems/move-zeroes/',
    statement: 'Given an integer array nums, move all zeroes to the end while keeping the relative order of the non-zero elements. Modify nums in place and return it; the tests compare the returned array.',
    examples: [
      { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' },
      { input: 'nums = [0]', output: '[0]' }
    ],
    functionName: 'moveZeroes',
    params: [{ name: 'nums', type: 'integer[]' }],
    returns: { type: 'integer[]' },
    starter: `var moveZeroes = function(nums) {
  // Move the zeroes to the end and return nums.
};`,
    tests: [
      { args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
      { args: [[0]], expected: [0] },
      { args: [[1, 2, 3]], expected: [1, 2, 3] },
      { args: [[0, 0, 1]], expected: [1, 0, 0] },
      { args: [[-1, 0, -2, 0, 3]], expected: [-1, -2, 3, 0, 0] }
    ],
    hints: [
      'Use two positions: one to read every value and one to write the non-zero values.',
      'Copy each non-zero value to the write position and advance that position.',
      'After the pass, fill the remaining slots from the write position to the end with zeroes, then return nums.'
    ],
    solution: `var moveZeroes = function(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }
  for (let i = write; i < nums.length; i++) {
    nums[i] = 0;
  }
  return nums;
};`
  },
  {
    id: 'product-of-array-except-self',
    number: 10,
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    tags: ['Array', 'Prefix Sum'],
    url: 'https://leetcode.com/problems/product-of-array-except-self/',
    statement: 'Given an integer array nums, return an array answer where answer[i] is the product of every element of nums except nums[i]. Do not use division, and solve it in O(n) time.',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' }
    ],
    functionName: 'productExceptSelf',
    params: [{ name: 'nums', type: 'integer[]' }],
    returns: { type: 'integer[]' },
    starter: `var productExceptSelf = function(nums) {
  // Return the product of all other elements for each index.
};`,
    tests: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      { args: [[2, 3]], expected: [3, 2] },
      { args: [[1, 0]], expected: [0, 1] },
      { args: [[-1, -2, -3]], expected: [6, 3, 2] }
    ],
    hints: [
      'For each index, the answer is the product of everything to its left times the product of everything to its right.',
      'Build the left-hand products in one forward pass and store them directly in the result array.',
      'Add the right-hand products with a backward pass and a single running variable, without dividing.'
    ],
    solution: `var productExceptSelf = function(nums) {
  const answer = new Array(nums.length).fill(1);
  let left = 1;
  for (let i = 0; i < nums.length; i++) {
    answer[i] = left;
    left *= nums[i];
  }
  let right = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    answer[i] = answer[i] * right;
    right *= nums[i];
  }
  // Normalise negative zero so results compare cleanly with 0.
  return answer.map((value) => (value === 0 ? 0 : value));
};`
  }
];

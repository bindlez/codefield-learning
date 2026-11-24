export const roadmaps = {
  'Array':['contains-duplicate','two-sum','maximum-subarray','product-of-array-except-self','3sum','first-missing-positive'],
  'String':['valid-anagram','valid-palindrome','longest-common-prefix','group-anagrams','longest-substring-without-repeating-characters','minimum-window-substring'],
  'Hash Table':['contains-duplicate','valid-anagram','two-sum','group-anagrams','top-k-frequent-elements'],
  'Two Pointers':['move-zeroes','valid-palindrome','two-sum-ii-input-array-is-sorted','3sum','trapping-rain-water'],
  'Sliding Window':['maximum-average-subarray-i','minimum-size-subarray-sum','longest-substring-without-repeating-characters','minimum-window-substring'],
  'Binary Search':['binary-search','search-insert-position','find-first-and-last-position-of-element-in-sorted-array','search-in-rotated-sorted-array'],
  'Stack':['valid-parentheses','min-stack','daily-temperatures','largest-rectangle-in-histogram'],
  'Linked List':['reverse-linked-list','merge-two-sorted-lists','linked-list-cycle','reorder-list','reverse-nodes-in-k-group'],
  'Tree':['maximum-depth-of-binary-tree','invert-binary-tree','binary-tree-level-order-traversal','validate-binary-search-tree','binary-tree-maximum-path-sum'],
  'Graph':['find-if-path-exists-in-graph','number-of-islands','clone-graph','course-schedule','word-ladder'],
  'Dynamic Programming':['climbing-stairs','house-robber','coin-change','longest-increasing-subsequence','edit-distance'],
  'Backtracking':['subsets','permutations','combination-sum','word-search','n-queens']
};

export function orderedPath(topic,catalog) {
  const rank=new Map((roadmaps[topic]||[]).map((slug,i)=>[slug,i]));
  const difficulty={Easy:0,Medium:1,Hard:2};
  return catalog.filter(p=>!p.paidOnly && (rank.has(p.slug)||p.tags.some(t=>t.name===topic))).sort((a,b)=>
    (rank.get(a.slug)??Infinity)-(rank.get(b.slug)??Infinity) || difficulty[a.difficulty]-difficulty[b.difficulty] || a.number-b.number);
}

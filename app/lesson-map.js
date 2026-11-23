// Map practice topics to curriculum lessons so a problem can point back at the concept.
export const lessonForTag = {
  array: 'arrays-loops',
  string: 'strings-regex',
  'hash-table': 'hash-maps',
  'two-pointers': 'two-pointers',
  'sliding-window': 'sliding-window',
  'binary-search': 'binary-search',
  stack: 'hash-maps',
  'linked-list': 'trees-graphs',
  tree: 'trees-graphs',
  graph: 'trees-graphs',
  'dynamic-programming': 'dynamic-programming',
  backtracking: 'recursion',
  recursion: 'recursion',
  greedy: 'complexity',
  sorting: 'arrays-loops',
  math: 'complexity',
  'bit-manipulation': 'values-types'
};

export function relatedLessons(tags = []) {
  return [...new Set(tags.map(tag => lessonForTag[String(tag).toLowerCase().replace(/\s+/g, '-')]).filter(Boolean))];
}

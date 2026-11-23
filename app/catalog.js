export function seedDetail(problem) {
  const params = problem.params || [];
  return {
    id: String(problem.number),
    number: problem.number,
    title: problem.title,
    slug: problem.id,
    difficulty: problem.difficulty,
    paidOnly: false,
    content: `<p>${problem.statement}</p>`,
    examples: problem.examples || [],
    hints: problem.hints || [],
    tags: (problem.tags || []).map(name => ({ name, slug: name.toLowerCase().replace(/\s+/g, '-') })),
    snippets: { javascript: problem.starter, ruby: '', python3: '', rust: '', cpp: '' },
    meta: JSON.stringify({ name: problem.functionName, params, return: problem.returns }),
    exampleTestcases: '',
    tests: problem.tests,
    functionName: problem.functionName,
    params,
    returns: problem.returns,
    starter: problem.starter,
    solution: problem.solution,
    categoryTitle: 'Codefield practice',
    url: problem.url,
    source: 'seed'
  };
}


export function filterCatalog(questions, {query='', difficulty='', tag='', skip=0, limit=60}) {
  const needle = query.trim().toLowerCase().replace(/\s+/g, '-');
  const matches = questions.filter(item =>
    (!difficulty || item.difficulty.toLowerCase() === difficulty.toLowerCase()) &&
    (!tag || item.tags.some(topic => topic.slug === tag)) &&
    (!needle || item.id === needle || item.slug.includes(needle))
  );
  const offset = Number(skip);
  return {total:matches.length, questions:matches.slice(offset, offset + Number(limit)), source:'snapshot'};
}

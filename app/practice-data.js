import {filterCatalog, seedDetail} from './catalog.js';
import {problems} from './problems.js';

let index;
export async function catalogIndex() {
  if (!index) {
    index = fetch(new URL('./catalog.json', import.meta.url)).then(async response => {
      if (!response.ok) throw Error('Could not read the bundled catalog.');
      return (await response.json()).questions;
    }).catch(error => { index = null; throw error; });
  }
  return index;
}

export async function practiceData(route, parameters, signal) {
  const query = new URLSearchParams(parameters);
  try {
    const response = await fetch('/api/leetcode/' + route + '?' + query, {signal});
    if (response.ok && response.headers.get('content-type')?.includes('application/json')) return await response.json();
  } catch (error) {
    if (signal?.aborted) throw error;
  }
  const questions = await catalogIndex();
  if (route === 'problems') return filterCatalog(questions, Object.fromEntries(query));
  const input = (query.get('slug') || query.get('q') || '').trim().toLowerCase();
  const slug = input.match(/^https?:\/\/(?:www\.)?leetcode\.com\/problems\/([\w-]+)/)?.[1] || input;
  const item = questions.find(entry => entry.slug === slug || entry.id === slug);
  if (!item) throw Error('No matching problem. Try its number, slug or LeetCode URL.');
  const seed = problems.find(problem => problem.id === item.slug);
  if (seed) return seedDetail(seed);
  const content = item.paidOnly ? 'Open this problem on LeetCode with your Premium account.' :
    'Open on LeetCode to read the statement. Run the Codefield workspace server for live statement imports.';
  return {...item, source:'snapshot', content, url:'https://leetcode.com/problems/' + item.slug + '/'};
}

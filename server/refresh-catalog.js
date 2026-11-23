import {writeFile, rename} from 'node:fs/promises';
import {fetchCatalogPage} from './leetcode.js';

const questions = [];
let total;
do {
  const page = await fetchCatalogPage(questions.length, 500);
  total ??= page.total;
  if (!page.questions.length || page.total !== total) throw Error('Catalog changed during refresh. Retry.');
  questions.push(...page.questions);
} while (questions.length < total);

if (new Set(questions.map(item => item.slug)).size !== total) throw Error('Incomplete catalog');
const path = new URL('../app/catalog.json', import.meta.url);
const pending = new URL('../app/catalog.pending.json', import.meta.url);
await writeFile(pending, JSON.stringify({questions, total}));
await rename(pending, path);
console.log('Saved ' + total + ' unique catalog entries.');

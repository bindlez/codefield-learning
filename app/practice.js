import {instrumentJavaScript, instrumentInterpreted} from './trace.js';
import {runExamples, buildScript} from './multilang-judge.js';
import {tokenizeRuby} from '../src/languages/ruby.js';
import {tokenizePython} from '../src/languages/python.js';
import {tokenizeRust} from '../src/languages/rust.js';
import {tokenizeCpp} from '../src/languages/cpp.js';
import {runProgram} from './languages.js';
import {practiceData, catalogIndex} from './practice-data.js';
import {problems as pathProblems} from './problems.js';
import { createEditor } from '../src/editor.js';
import { tokenizeJavaScript } from '../src/languages/javascript.js';
import { createJudgeRunner, testsFromProblem } from './judge.js';
import { sanitizeHtml, textOf } from './sanitize.js';
import { initCoach } from './ai.js';
import { initLibrary } from './library.js';
import { curriculum } from './curriculum.js';
import { relatedLessons } from './lesson-map.js';
import { briefingFor } from './briefings.js';
import { runOnce } from './run-js.js';
import { javascriptCompletion, guideFor, typeForParam } from './js-methods.js';
import { inferContext } from '../src/inference.js';
import { createMethodCard } from './method-card.js';

const $ = selector => document.querySelector(selector);
const storageKey = 'codefield.practice.v1';


let store = { drafts: {}, attempts: {}, solutions: [] };
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  store = { drafts: saved.drafts || {}, attempts: saved.attempts || {}, solutions: Array.isArray(saved.solutions) ? saved.solutions : [] };
} catch {}

const saveStore = () => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(store));
  } catch {}
};

const state = {
  query: '',
  difficulty: '',
  tag: '',
  items: [],
  total: 0,
  source: '',
  warning: '',
  loading: false,
  selected: '',
  problem: null,
  plan: null,
  lastReport: '',
  hintIndex: 0,
  runToken: 0,
  tab: 'description'
};

let editor = null;
let methodCard = null;
let listController = null;
let listToken = 0;
let problemController = null;
const runner = createJudgeRunner();
let traceRunner, traceTimer, traceVersion = 0, traceController;
const lastKey = 'codefield.practice.last.v1';
function rememberProblem(stage) {
  if (!state.problem) return;
  try {
    const previous = JSON.parse(localStorage.getItem(lastKey) || 'null');
    localStorage.setItem(lastKey, JSON.stringify({slug:state.problem.slug,title:state.problem.title,language:languageSelect.value,stage:stage || (previous?.slug === state.problem.slug ? previous.stage : 'learn')}));
  } catch {}
}
const languageSelect = $('#practice-language');
const browserPanel = $('#problem-browser');
const phoneMedia = matchMedia('(max-width: 760px)');
let sprintDeadline = 0, sprintTimer = 0;
function pathChoices() {
  return pathProblems.filter(item => item.tags.includes($('#path-topic').value));
}
function choosePath(random = false) {
  const candidates = pathChoices().filter(item => item.id !== state.selected);
  if (!candidates.length) { $('#path-status').textContent = 'No other problems in this path yet.'; return; }
  const unseen = candidates.filter(item => !store.attempts[item.id]?.passed);
  const pool = unseen.length ? unseen : candidates;
  const item = pool[random ? Math.floor(Math.random()*pool.length) : 0];
  $('#path-status').textContent = `Opening ${item.title} · ${unseen.length} unsolved in this path`;
  openProblem(item.id);
}
$('#path-next').onclick = () => choosePath();
$('#path-random').onclick = () => choosePath(true);
function updateSprint() {
  if (!sprintDeadline) return;
  const remaining = Math.max(0, Math.ceil((sprintDeadline-Date.now())/1000));
  $('#sprint-status').textContent = remaining ? `${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')} remaining` : 'Time is up. Review your solution or try the next problem.';
  if (!remaining) { clearInterval(sprintTimer); sprintDeadline=0; $('#sprint-next').hidden=false; }
}
$('#sprint-start').onclick = () => {
  sprintDeadline = Date.now() + Number($('#sprint-minutes').value)*60000;
  clearInterval(sprintTimer); sprintTimer=setInterval(updateSprint,1000); updateSprint();
  $('#sprint-next').hidden=true;
};
$('#sprint-next').onclick = () => { choosePath(); $('#sprint-start').click(); };
function sprintSolved() {
  if (!sprintDeadline) return;
  clearInterval(sprintTimer); sprintDeadline=0;
  $('#sprint-status').textContent='Examples passed! Continue with the next problem.';
  $('#sprint-next').hidden=false;
}
browserPanel.open = !phoneMedia.matches;
phoneMedia.addEventListener('change', event => { browserPanel.open = !event.matches; });
const tokenizers = {javascript:tokenizeJavaScript, ruby:tokenizeRuby, python:tokenizePython, rust:tokenizeRust, cpp:tokenizeCpp, csharp:tokenizeCpp};
const snippetKeys = {javascript:'javascript', ruby:'ruby', python:'python3', rust:'rust', cpp:'cpp', csharp:'csharp'};
const draftKey = () => languageSelect.value === 'javascript' ? state.problem.slug : state.problem.slug + ':' + languageSelect.value;
function starter(problem) {
  return (languageSelect.value === 'javascript' ? problem.starter : '') || problem.snippets?.[snippetKeys[languageSelect.value]] || '';
}
function renderProgress() {
  const solutions = store.solutions;
  const counts = {};
  for (const item of solutions) counts[item.language] = (counts[item.language] || 0) + 1;
  const problems = new Set(solutions.map(item => item.slug)).size;
  $('#progress-summary').textContent = problems + ' problems · ' + solutions.length + ' saved approaches';
  const colors = ['#8ed9b7','#a993ff','#f3bc76','#78acf7','#ed91ad','#c5d779'];
  let offset = 0;
  const segments = Object.entries(counts).map(([name,count],i) => {
    const start=offset; offset+=count/solutions.length*100;
    return colors[i%colors.length]+' '+start+'% '+offset+'%';
  });
  $('#progress-chart').style.background = segments.length ? 'conic-gradient('+segments.join(',')+')' : '#34434a';
  $('#progress-legend').textContent = Object.entries(counts).map(([name,count])=>name+' '+count).join('  ·  ') || 'Save your first approach to begin.';
}
function refreshApproaches() {
  const select=$('#saved-approaches');
  select.replaceChildren(new Option('Saved solutions',''));
  for(const item of store.solutions.filter(item=>item.slug===state.problem?.slug && item.language===languageSelect.value))
    select.add(new Option(item.name + (item.verified ? ' ✓' : ''),item.id));
}


const difficultyClass = difficulty => `chip--${String(difficulty).toLowerCase()}`;
const sourceLabel = source => source === 'snapshot' ? 'bundled catalog' : source === 'seed' ? 'built-in set' : source === 'cache' ? 'cached copy' : 'imported live';

function toast(text) {
  let node = document.querySelector('.coach-toast');
  if (!node) {
    node = document.createElement('div');
    node.className = 'coach-toast';
    node.setAttribute('role', 'status');
    document.body.append(node);
  }
  node.textContent = text;
  node.classList.add('visible');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove('visible'), 3200);
}

async function buildTagOptions() {
  const questions = await catalogIndex();
  const topics = new Map(questions.flatMap(item => item.tags.map(tag => [tag.slug, tag.name])));
  const select = $('#problem-tag');
  for (const [slug, label] of [...topics].sort((a,b) => a[1].localeCompare(b[1]))) {
    const option = document.createElement('option');
    option.value = slug;
    option.textContent = label;
    select.append(option);
  }
}

async function loadProblems({ append = false, refresh = false } = {}) {
  const token = ++listToken;
  state.loading = true;
  listController?.abort();
  listController = new AbortController();
  const params = new URLSearchParams({ limit: '60', skip: String(append ? state.items.length : 0) });
  if (state.query) params.set('query', state.query);
  if (state.difficulty) params.set('difficulty', state.difficulty);
  if (state.tag) params.set('tag', state.tag);
  if (refresh) params.set('refresh', '1');
  if (!append) {
    $('#problem-list').innerHTML = '<div class="practice-empty"><strong>Searching…</strong>LeetCode answers may take a second.</div>';
  }
  $('#problem-more').disabled = true;
  try {
    const data = await practiceData('problems', params, listController.signal);
    if (token !== listToken) return;
    const items = data.questions || [];
    state.items = append ? [...state.items, ...items] : items;
    state.total = data.total || 0;
    state.source = data.source || '';
    state.warning = data.warning || '';
    renderList();
    renderBanner();
    $('#problem-count').textContent = `${state.total.toLocaleString()} problems · ${sourceLabel(state.source)}`;
    $('#problem-more').hidden = state.items.length >= state.total;
    if (!state.selected && state.items[0]) openProblem(window.__initialSlug || state.items[0].slug);
  } catch (error) {
    if (token !== listToken || error.name === 'AbortError') return;
    if (append) {
      toast(`Could not load more problems: ${error.message}`);
      $('#problem-more').hidden = state.items.length >= state.total;
      return;
    }
    $('#problem-list').innerHTML = `<div class="practice-empty"><strong>Could not load problems</strong>${escapeHtml(error.message)}. Check that the workspace server is running, then retry.</div>`;
    $('#problem-count').textContent = 'Offline';
  } finally {
    if (token === listToken) {
      state.loading = false;
      $('#problem-more').disabled = false;
    }
  }
}

function renderList() {
  const list = $('#problem-list');
  list.replaceChildren();
  if (!state.items.length) {
    list.innerHTML = '<div class="practice-empty"><strong>No matches</strong>Try a shorter keyword, another difficulty, or a different topic.</div>';
    return;
  }
  for (const item of state.items) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'problem-item';
    button.setAttribute('aria-current', String(item.slug === state.selected));
    const number = document.createElement('span');
    number.className = 'num';
    number.textContent = item.number ?? '·';
    const title = document.createElement('strong');
    title.textContent = item.title;
    const meta = document.createElement('span');
    meta.className = 'meta';
    const dot = document.createElement('i');
    dot.className = `dot ${item.difficulty}`;
    const difficulty = document.createElement('span');
    difficulty.textContent = item.difficulty;
    meta.append(dot, difficulty);
    if (item.acceptance != null) {
      const acceptance = document.createElement('span');
      acceptance.textContent = `${item.acceptance}% accepted`;
      meta.append(acceptance);
    }
    if (item.paidOnly) {
      const paid = document.createElement('span');
      paid.textContent = 'premium';
      meta.append(paid);
    }
    button.append(number, title, meta);
    button.onclick = () => { if (phoneMedia.matches) browserPanel.open = false; openProblem(item.slug); };
    list.append(button);
  }
}

function renderBanner() {
  const banner = $('#source-banner');
  if (state.warning) {
    banner.hidden = false;
    banner.innerHTML = '';
    const text = document.createElement('span');
    text.textContent = state.source === 'seed'
      ? `LeetCode could not be reached, so the built-in set is shown. ${state.warning}`
      : `Showing a cached copy because LeetCode could not be reached. ${state.warning}`;
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'pill-button';
    retry.textContent = 'Retry import';
    retry.onclick = () => loadProblems({ refresh: true });
    banner.append(text, retry);
  } else {
    banner.hidden = true;
  }
}

async function openProblem(slug, preloaded = null) {
  if (!slug || (slug === state.selected && state.problem)) return;
  cancelTrace();
  state.selected = slug;
  state.problem = null;
  state.plan = null;
  state.runToken++;
  $('#test-run').disabled = false;
  $('#test-status').textContent = '';
  state.lastReport = '';
  state.lastVerifiedCode = '';
  state.hintIndex = 0;
  state.tab = 'description';
  const params = new URLSearchParams(location.search);
  params.set('p', slug);
  history.replaceState(null, '', '?' + params);
  renderList();
  problemController?.abort();
  problemController = new AbortController();
  $('#practice-empty').hidden = true;
  showStage('learn');
  $('#briefing-title').textContent = 'Preparing the lesson…';
  $('#briefing-idea').textContent = '';
  $('#briefing-meta').replaceChildren();
  $('#briefing-task-text').textContent = '';
  $('#briefing-example').hidden = true;
  $('#briefing-steps').replaceChildren();
  $('#briefing-pitfalls').replaceChildren();
  $('#briefing-walk').replaceChildren();
  $('#briefing-quiz').replaceChildren();
  $('#briefing-lesson-body').replaceChildren();
  $('#briefing-template').textContent = '';
  $('#briefing-complexity').textContent = '';
  $('#briefing-worked-prompt').textContent = '';
  $('#briefing-result').textContent = '';
  $('#problem-title').textContent = 'Loading…';
  $('#problem-meta').replaceChildren();
  $('#statement-body').innerHTML = '<p class="muted">Fetching the statement and published examples…</p>';
  $('#statement-note').textContent = '';
  $('#results').innerHTML = '<div class="results-empty">Run the examples to see each case.</div>';
  $('#practice-hints').hidden = true;
  $('#reveal-box').hidden = true;
  $('#problem-link').hidden = true;
  try {
    if (preloaded) {
      state.problem = preloaded;
      rememberProblem();
      state.plan = testsFromProblem(preloaded);
      renderProblem();
      mountEditor();
      renderBriefing(preloaded);
      showStage((new URLSearchParams(location.search).get('mode') === 'problem' || (window.__resumeSlug === state.problem.slug && window.__resumeStage === 'code')) ? 'code' : 'learn');
      refreshApproaches();
      return;
    }
    const data = await practiceData('problem', {slug}, problemController.signal);
    if (state.selected !== slug) return;
    state.problem = data;
    rememberProblem();
    state.plan = testsFromProblem(data);
    renderProblem();
    mountEditor();
    renderBriefing(data);
    showStage(new URLSearchParams(location.search).get('mode') === 'problem' ? 'code' : 'learn');
    refreshApproaches();
  } catch (error) {
    if (error.name === 'AbortError') return;
    $('#briefing-title').textContent = 'Could not load this problem';
    $('#briefing-idea').textContent = error.message;
    $('#problem-title').textContent = 'Could not load this problem';
    $('#statement-body').innerHTML = `<p class="muted">${escapeHtml(error.message)}</p>`;
    toast(error.message, true);
  }
}

function showStage(stage, focus = false) {
  const learning = stage === 'learn';
  if (state.problem) rememberProblem(stage);
  $('#briefing').hidden = !learning;
  $('#problem-grid').hidden = learning;
  $('#briefing-back').hidden = learning;
  if (learning) cancelTrace();
  else queueTrace();
  if (focus && learning) $('#briefing').scrollIntoView({block:'start',behavior:'smooth'});
  if (focus && !learning) {
    $('#problem-grid').scrollIntoView({block:'start',behavior:'smooth'});
    setTimeout(() => editor?.focus(), 120);
  }
}

function renderBriefing(problem) {
  const { briefing } = briefingFor(problem.tags || []);
  const lesson = curriculum.lessons.find(item => item.id === briefing.lessonId);
  $('#briefing-title').textContent = briefing.title;
  $('#briefing-idea').textContent = briefing.idea;
  const meta = $('#briefing-meta');
  meta.replaceChildren();
  const pattern = document.createElement('span');
  pattern.className = 'chip chip--violet';
  pattern.textContent = 'Pattern: ' + briefing.title.replace(/:.+$/, '');
  meta.append(pattern);
  const difficulty = document.createElement('span');
  difficulty.className = `chip ${difficultyClass(problem.difficulty)}`;
  difficulty.textContent = problem.difficulty;
  meta.append(difficulty);
  if (lesson) {
    const lessonChip = document.createElement('span');
    lessonChip.className = 'chip';
    lessonChip.textContent = `${lesson.title} · ${lesson.minutes} min`;
    meta.append(lessonChip);
  }

  const task = textOf(problem.content || '').slice(0, 1400);
  $('#briefing-task-text').textContent = task || 'The statement is not available for this problem.';
  const example = $('#briefing-example');
  const first = (problem.examples || [])[0];
  if (first) {
    example.hidden = false;
    example.innerHTML = `<p><b>First example</b></p><p><b>Input:</b> ${escapeHtml(first.input)}</p><p><b>Output:</b> ${escapeHtml(first.output)}</p>`;
  } else example.hidden = true;

  for (const step of briefing.steps || []) {
    const item = document.createElement('li');
    item.textContent = step;
    $('#briefing-steps').append(item);
  }
  for (const trap of briefing.pitfalls || []) {
    const item = document.createElement('li');
    item.textContent = trap;
    $('#briefing-pitfalls').append(item);
  }
  $('#briefing-complexity').textContent = briefing.complexity || '';
  $('#briefing-template').textContent = briefing.template || '';
  $('#briefing-worked-prompt').textContent = briefing.worked?.prompt || '';
  for (const step of briefing.worked?.walk || []) {
    const item = document.createElement('li');
    item.textContent = step;
    $('#briefing-walk').append(item);
  }
  $('#briefing-result').textContent = briefing.worked?.result || '';

  const quiz = briefing.quiz;
  const quizHost = $('#briefing-quiz');
  quizHost.replaceChildren();
  if (quiz) {
    const card = document.createElement('div');
    card.className = 'quiz';
    const question = document.createElement('h4');
    question.textContent = quiz.question;
    const options = document.createElement('div');
    options.className = 'quiz-options';
    const explain = document.createElement('p');
    explain.className = 'quiz-explain';
    explain.hidden = true;
    const buttons = (quiz.options || []).map((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      const letter = document.createElement('b');
      letter.textContent = String.fromCharCode(65 + index);
      const text = document.createElement('span');
      text.textContent = label;
      button.append(letter, text);
      button.onclick = () => {
        for (const [position, other] of buttons.entries()) {
          other.disabled = true;
          if (position === quiz.answer) other.classList.add('correct');
          else if (position === index) other.classList.add('wrong');
        }
        explain.hidden = false;
        explain.textContent = `${index === quiz.answer ? 'Correct. ' : `Not quite — the answer is ${String.fromCharCode(65 + quiz.answer)}. `}${quiz.explain || ''}`;
      };
      return button;
    });
    options.append(...buttons);
    card.append(question, options, explain);
    quizHost.append(card);
  }

  const body = $('#briefing-lesson-body');
  body.replaceChildren();
  if (lesson) {
    const objectives = document.createElement('ul');
    objectives.className = 'objectives';
    for (const objective of lesson.objectives || []) {
      const item = document.createElement('li');
      item.textContent = objective;
      objectives.append(item);
    }
    body.append(objectives);
    for (const section of lesson.sections || []) {
      if (section.type === 'prose' || section.type === 'callout') {
        const node = document.createElement('div');
        node.className = section.type === 'prose' ? 'lesson-prose' : `lesson-callout lesson-callout--${section.tone || 'tip'}`;
        node.innerHTML = sanitizeHtml(section.html);
        body.append(node);
      } else if (section.type === 'code') {
        const figure = document.createElement('figure');
        figure.className = 'snippet';
        const bar = document.createElement('div');
        bar.className = 'snippet-bar';
        const label = document.createElement('strong');
        label.textContent = 'JavaScript';
        const run = document.createElement('button');
        run.type = 'button';
        run.className = 'pill-button';
        run.textContent = 'Run';
        bar.append(label, run);
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = section.code;
        pre.append(code);
        const caption = document.createElement('figcaption');
        caption.className = 'snippet-caption';
        caption.textContent = section.caption || '';
        if (!section.caption) caption.hidden = true;
        const output = document.createElement('div');
        output.className = 'snippet-output';
        figure.append(bar, pre, caption, output);
        run.onclick = async () => {
          run.disabled = true;
          output.textContent = 'Running…';
          output.classList.remove('error');
          const result = await runOnce(section.code);
          output.textContent = result.ok ? (result.output || '(no output)') : `${result.error || 'The example failed.'}${result.output ? `\n${result.output}` : ''}`;
          output.classList.toggle('error', !result.ok);
          run.disabled = false;
        };
        body.append(figure);
      }
    }
    $('#briefing-lesson-summary').textContent = `${lesson.title} · ${lesson.minutes} min`;
    const link = $('#briefing-link');
    link.hidden = false;
    link.href = `./learn.html?lesson=${encodeURIComponent(lesson.id)}`;
  } else {
    const note = document.createElement('p');
    note.className = 'muted';
    note.textContent = 'A full lesson for this topic is not written yet. Use the plan and template above, then ask the coach.';
    body.append(note);
    $('#briefing-lesson-summary').textContent = 'Full lesson';
    $('#briefing-link').hidden = true;
  }
}

async function openAnyProblem() {
  const input = $('#problem-open');
  const query = input.value.trim();
  if (!query) return;
  const button = $('#problem-open-go');
  button.disabled = true;
  try {
    const data = await practiceData('resolve', {q:query});
    const stub = {
      number: data.number,
      id: data.id,
      title: data.title,
      slug: data.slug,
      difficulty: data.difficulty,
      acceptance: null,
      tags: data.tags || [],
      paidOnly: data.paidOnly
    };
    state.items = [stub, ...state.items.filter(item => item.slug !== stub.slug)];
    state.selected = '';
    renderList();
    input.value = '';
    if (phoneMedia.matches) browserPanel.open = false;
    await openProblem(stub.slug, data);
  } catch (error) {
    toast(error.message, true);
    $('#problem-count').textContent = 'Could not open that problem';
  } finally {
    button.disabled = false;
  }
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character]));
}

function renderProblem() {
  const problem = state.problem;
  $('#problem-title').textContent = `${problem.number ? `${problem.number}. ` : ''}${problem.title}`;
  const meta = $('#problem-meta');
  meta.replaceChildren();
  const difficulty = document.createElement('span');
  difficulty.className = `chip ${difficultyClass(problem.difficulty)}`;
  difficulty.textContent = problem.difficulty;
  meta.append(difficulty);
  for (const tag of (problem.tags || []).slice(0, 5)) {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = tag.name;
    meta.append(chip);
  }
  const related = relatedLessons((problem.tags || []).map(tag => tag.slug)).slice(0, 2);
  for (const id of related) {
    const lesson = curriculum.lessons.find(item => item.id === id);
    if (!lesson) continue;
    const link = document.createElement('a');
    link.className = 'chip chip--violet';
    link.href = `./learn.html?lesson=${encodeURIComponent(lesson.id)}`;
    link.textContent = `Learn: ${lesson.title}`;
    meta.append(link);
  }
  if (problem.paidOnly) {
    const paid = document.createElement('span');
    paid.className = 'chip chip--hard';
    paid.textContent = 'Premium · statement unavailable';
    meta.append(paid);
  }
  const link = $('#problem-link');
  link.hidden = !problem.url;
  link.href = problem.url || '#';

  const solutionTab = document.querySelector('[data-tab="solution"]');
  solutionTab.hidden = !problem.solution;
  $('#test-reveal').hidden = !problem.solution;
  solutionTab.setAttribute('aria-selected', 'false');

  const tests = state.plan?.tests?.length || 0;
  $('#statement-note').textContent = tests
    ? `${tests} published example${tests === 1 ? '' : 's'} can be run here. LeetCode's hidden tests are not included.`
    : 'No runnable examples were published for this problem.';

  const note = $('#statement-note');
  if (problem.source === 'seed') note.textContent += ' Built-in problem, saved with this workspace.';
  else if (problem.source === 'snapshot') note.textContent = problem.content;
  else note.textContent += ' Statement imported from LeetCode.';
  if (state.plan?.note) note.textContent += ` ${state.plan.note}`;

  setTab('description');
  $('#draft-status').textContent = store.drafts[draftKey()] !== undefined ? 'Draft restored' : 'New draft';
}

function setTab(tab) {
  const problem = state.problem;
  if (!problem) return;
  state.tab = tab;
  for (const button of document.querySelectorAll('.statement-tabs button')) {
    button.setAttribute('aria-selected', String(button.dataset.tab === tab));
  }
  const body = $('#statement-body');
  body.innerHTML = '';
  if (tab === 'description') {
    const article = document.createElement('div');
    article.innerHTML = sanitizeHtml(problem.content || '<p>No statement was provided.</p>');
    body.append(article);
    if (!problem.content || problem.source === 'seed') {
      const examples = document.createElement('div');
      for (const [index, example] of (problem.examples || []).entries()) {
        const card = document.createElement('div');
        card.className = 'example-card';
        card.innerHTML = `<p><b>Example ${index + 1}</b></p><p><b>Input:</b> ${escapeHtml(example.input)}</p><p><b>Output:</b> ${escapeHtml(example.output)}</p>${example.note ? `<p><b>Note:</b> ${escapeHtml(example.note)}</p>` : ''}`;
        examples.append(card);
      }
      body.append(examples);
    }
    return;
  }
  if (tab === 'hints') {
    const hints = problem.hints || [];
    if (!hints.length) {
      body.innerHTML = '<p class="muted">No hints were published for this problem. Ask the coach for a nudge that does not spoil it.</p>';
      return;
    }
    const wrap = document.createElement('div');
    wrap.className = 'hint-list';
    for (const [index, hint] of hints.entries()) {
      const item = document.createElement('div');
      item.className = 'hint-item';
      item.textContent = `Hint ${index + 1}: ${hint}`;
      wrap.append(item);
    }
    body.append(wrap);
    return;
  }
  if (tab === 'solution') {
    if (!problem.solution) {
      body.innerHTML = '<p class="muted">LeetCode does not include a reference solution in its public problem data.</p>';
      return;
    }
    body.innerHTML = '<p class="muted">One reference solution. It is not the only valid one.</p>';
    const pre = document.createElement('pre');
    pre.textContent = problem.solution;
    body.append(pre);
  }
}

function mountEditor() {
  if (editor) editor.destroy();
  $('#practice-editor').replaceChildren();
  $('#practice-method-card').replaceChildren();
  methodCard = createMethodCard($('#practice-method-card'));
  const problem = state.problem;
  const bindings = Object.fromEntries((state.plan?.params || []).map(param => [param.name, typeForParam(param.type)]));
  editor = createEditor('#practice-editor', {
    value: store.drafts[draftKey()] ?? starter(problem),
    label: `${problem.title} solution editor`,
    tokenize: tokenizers[languageSelect.value],
    autoIndent: true,
    complete: languageSelect.value === 'javascript' ? context => javascriptCompletion({
      ...context,
      source: editor ? editor.getValue() : '',
      caret: editor ? editor.getCaret() : 0,
      bindings
    }) : undefined,
    onSelection: (value, parent) => {
      if (!editor || languageSelect.value !== 'javascript') return;
      const inferred = parent
        ? inferContext(editor.getValue(), editor.getCaret(), 'javascript', parent.receiver, parent.chain)
        : null;
      const fallback = parent && !parent.chain.length ? bindings[parent.receiver] : '';
      methodCard.show(guideFor(value, inferred?.type || fallback || ''));
    },
    onChange: value => {
      methodCard.hide();
      if (!state.problem) return;
      store.drafts[draftKey()] = value;
      queueTrace();
      clearTimeout(mountEditor.saveTimer);
      mountEditor.saveTimer = setTimeout(saveStore, 250);
      $('#draft-status').textContent = 'Draft saved';
    }
  });
  $('#draft-status').textContent = store.drafts[problem.slug] ? 'Draft restored' : 'New draft';
}

function renderResults(report, results) {
  const container = $('#results');
  container.replaceChildren();
  const head = document.createElement('div');
  head.className = 'results-head';
  const known = results.filter(row => row.passed !== null).length;
  const passed = results.filter(row => row.passed === true).length;
  const summary = document.createElement('strong');
  summary.textContent = results.length ? `${passed} / ${known || results.length} ${known ? 'published examples pass' : 'examples ran'}` : 'No tests';
  head.append(summary);
  if (results.length > known) {
    const note = document.createElement('span');
    note.textContent = `${results.length - known} self-check`;
    head.append(note);
  }
  const chip = document.createElement('span');
  chip.className = `chip ${report.ok ? 'chip--easy' : 'chip--medium'}`;
  chip.textContent = report.loadError ? 'did not run' : report.ok ? 'all pass' : 'keep going';
  head.append(chip);
  container.append(head);
  if (report.loadError) {
    const row = document.createElement('div');
    row.className = 'result-row fail';
    row.innerHTML = `<div class="line"><span class="badge">✕</span><span class="value bad">${escapeHtml(report.loadError)}</span></div>`;
    container.append(row);
    return;
  }
  if (!results.length) {
    container.innerHTML += '<div class="results-empty">This problem has no published examples to run.</div>';
    return;
  }
  for (const result of results) {
    const row = document.createElement('div');
    const status = result.passed === null ? 'self' : result.passed ? 'pass' : 'fail';
    row.className = `result-row ${status === 'pass' ? 'pass' : 'fail'}`;
    const badge = result.passed === true ? '✓' : result.passed === null ? '·' : '✕';
    const lines = [
      `<div class="line"><span class="badge">${badge}</span><span class="label">case ${result.index + 1}</span><span class="value">${escapeHtml(result.input || '')}</span></div>`
    ];
    if (result.error) lines.push(`<div class="line"><span class="label">error</span><span class="value bad">${escapeHtml(result.error)}</span></div>`);
    if (result.expected !== undefined && result.expected !== null) lines.push(`<div class="line"><span class="label">expected</span><span class="value">${escapeHtml(JSON.stringify(result.expected))}</span></div>`);
    if (result.actual !== undefined) lines.push(`<div class="line"><span class="label">actual</span><span class="value ${result.passed === false ? 'bad' : 'good'}">${escapeHtml(JSON.stringify(result.actual))}</span></div>`);
    if (result.logs?.length) lines.push(`<div class="line"><span class="label">logs</span><span class="logs">${escapeHtml(result.logs.join('\n'))}</span></div>`);
    row.innerHTML = lines.join('');
    container.append(row);
  }
  const footnote = document.createElement('div');
  footnote.className = 'results-empty';
  footnote.textContent = 'These are the published examples, not LeetCode’s hidden judge. Passing here is evidence, not a verdict.';
  container.append(footnote);
}

async function runTests() {
  cancelTrace();
  const problem = state.problem;
  if (!problem || !editor) return;
  if (languageSelect.value !== 'javascript') {
    const token = ++state.runToken;
    const language = languageSelect.value;
    const code = editor.getValue();
    const plan = state.plan || testsFromProblem(problem);
    $('#results').textContent = 'Running…';
    $('#test-run').disabled = true;
    let checked;
    try {
      checked = await runExamples(language, code, plan);
      if (state.runToken !== token || state.problem !== problem || languageSelect.value !== language) return;
      if (checked) {
        const passed = !checked.error && checked.results.length > 0 && checked.results.every(row => row.passed === true);
        renderResults({ok:passed,loadError:checked.error}, checked.results);
        if (passed) { state.lastVerifiedCode = code; store.attempts[problem.slug] = {...store.attempts[problem.slug], passed:true, at:new Date().toISOString()}; saveStore(); sprintSolved(); }
        $('#test-status').textContent = passed ? 'All examples passed ✓' : checked.error ? 'Execution failed' : 'Review your results';
      } else {
        const result = await runProgram(language, code);
        if (state.runToken !== token || state.problem !== problem || languageSelect.value !== language) return;
        $('#results').textContent = [result.output, result.stderr, result.ok ? result.value : result.error].filter(Boolean).join('\n') || '(no output)';
        $('#test-status').textContent = result.ok ? 'Program finished · check output against examples' : 'Execution failed';
      }
    } catch(error) {
      if (state.runToken === token) $('#results').textContent = error.message;
    } finally {
      if (state.runToken === token) $('#test-run').disabled = false;
    }
    return;
  }
  const plan = state.plan || testsFromProblem(problem);
  if (!plan.functionName) {
    toast('This problem does not expose a callable function.', true);
    return;
  }
  if (!plan.tests.length) {
    toast('No published examples can be run for this problem.', true);
    return;
  }
  const token = ++state.runToken;
  $('#test-run').disabled = true;
  $('#test-status').textContent = 'Running in a fresh worker…';
  const tests = plan.tests.map(test => ({ args: test.args, expected: test.known === false ? undefined : test.expected }));
  const { report, results } = await runner.run({
    code: editor.getValue(),
    functionName: plan.functionName,
    params: plan.params,
    returns: plan.returns,
    tests
  });
  if (token !== state.runToken || state.problem !== problem) return;
  $('#test-run').disabled = false;
  renderResults(report, results);
  const passed = results.filter(row => row.passed === true).length;
  $('#test-status').textContent = report.loadError ? 'Could not run. Read the error below.' : `${passed}/${results.length} pass · ${results.reduce((sum, row) => sum + (row.ms || 0), 0)} ms`;
  state.lastReport = [
    report.loadError || '',
    results.map(row => `case ${row.index + 1}: ${row.passed === true ? 'pass' : row.passed === null ? 'self-check' : 'fail'} | ${row.input} | expected ${JSON.stringify(row.expected)} | actual ${JSON.stringify(row.actual)} ${row.error || ''}`).join('\n')
  ].filter(Boolean).join('\n');
  if (report.ok && results.length && results.every(row => row.passed === true)) {
    state.lastVerifiedCode=editor.getValue();
    $('#test-status').textContent += ' · All examples passed ✓';
    const attempt = store.attempts[problem.slug] || { runs: 0 };
    attempt.runs += 1;
    attempt.passed = true;
    attempt.at = new Date().toISOString();
    store.attempts[problem.slug] = attempt;
    saveStore();
    sprintSolved();
  }
  if (!report.ok && problem.solution) $('#test-reveal').hidden = false;
}

function revealSolution() {
  const box = $('#reveal-box');
  if (!box.hidden) {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  box.replaceChildren();
  const note = document.createElement('p');
  note.className = 'muted';
  note.style.fontSize = '12px';
  note.textContent = 'Read it once, then close it and write your own version. Copying a solution is not practice.';
  const use = document.createElement('button');
  use.type = 'button';
  use.className = 'pill-button';
  use.textContent = 'Put it in the editor';
  use.onclick = () => {
    editor?.setValue(state.problem?.solution || '');
    toast('Reference copied. Now change one thing and explain why.');
  };
  const pre = document.createElement('pre');
  pre.textContent = state.problem?.solution || '';
  box.append(note, use, pre);
}

function nextHint() {
  const hints = state.problem?.hints || [];
  if (!hints.length) {
    setTab('hints');
    return;
  }
  const panel = $('#practice-hints');
  panel.hidden = false;
  if (state.hintIndex >= hints.length) {
    toast('That is every published hint. Ask the coach what to try next.');
    return;
  }
  const item = document.createElement('div');
  item.className = 'hint-item';
  item.textContent = `Hint ${state.hintIndex + 1}: ${hints[state.hintIndex]}`;
  panel.append(item);
  state.hintIndex++;
}

function cancelTrace() {
  clearTimeout(traceTimer);
  traceVersion++;
  traceRunner?.dispose();
  traceRunner = null;
  traceController?.abort(); traceController = null;
}
function queueTrace() {
  cancelTrace();
  const status = $('#trace-status'), output = $('#trace-output');
  if (!$('#trace-toggle').checked) {
    status.textContent = 'Turn on live trace to follow the first example.';
    return;
  }
  if (!state.problem || !editor || $('#problem-grid').hidden) return;
  const plan = state.plan, code = editor.getValue(), test = plan?.tests?.[0];
  const language = languageSelect.value;
  if (language !== 'javascript') {
    const source = ['python','ruby'].includes(language) && plan && test ? buildScript(language, instrumentInterpreted(language,code), {...plan,tests:[test]}) : null;
    if (!source) {
      status.textContent = 'Line trace is not available for this language or problem shape yet.';
      output.textContent = 'Run examples to inspect printed output. Compiled-language line tracing requires a debugger.';
      return;
    }
    const version = traceVersion;
    status.textContent = 'Waiting for you to pause…';
    output.textContent = '';
    traceTimer = setTimeout(async () => {
      traceController = new AbortController();
      status.textContent = 'Tracing the first example…';
      const result = await runProgram(language, source, {signal:traceController.signal});
      if (version !== traceVersion) return;
      traceController = null;
      output.textContent = 'Input  ' + JSON.stringify(test.args) + '\n\n' + [result.output,result.error].filter(Boolean).join('\n').slice(0,16000);
      status.textContent = result.ok ? 'First example · executed lines and scalar locals' : 'Trace could not run';
    },1500);
    return;
  }
  if (!test || !plan.functionName || !code.trim()) {
    status.textContent = 'Add a solution and select a problem with an example.';
    return;
  }
  const version = traceVersion;
  status.textContent = 'Waiting for you to pause…';
  output.textContent = '';
  traceTimer = setTimeout(async () => {
    if (version !== traceVersion) return;
    const instrumented = instrumentJavaScript(code);
    traceRunner = createJudgeRunner({timeoutMs:2500});
    status.textContent = 'Running the first example…';
    const {report, results} = await traceRunner.run({
      code:instrumented.code, functionName:plan.functionName, params:plan.params,
      returns:plan.returns, tests:[{args:test.args, expected:test.known === false ? undefined : test.expected}]
    });
    if (version !== traceVersion) return;
    traceRunner?.dispose(); traceRunner = null;
    const row = results[0];
    if (report.loadError || !row) {
      status.textContent = 'Waiting for runnable code.';
      output.textContent = report.loadError || 'No example result yet.';
      return;
    }
    const steps = row.logs?.length ? row.logs.join('\n') : instrumented.count ? 'No instrumented assignments ran.' : 'No simple assignments to show. Add console.log to inspect other steps.';
    output.textContent = 'Input  ' + row.input + '\n\n' + steps + '\n\n' + (row.error ? 'Error  ' + row.error : 'Result  ' + JSON.stringify(row.actual) + (row.passed === null ? '' : row.passed ? '  ✓' : '  · expected ' + JSON.stringify(row.expected)));
    status.textContent = 'First example · assignments and console output';
  }, 1500);
}
$('#trace-toggle').onchange = () => { $('#trace-output').hidden = !$('#trace-toggle').checked; try { localStorage.setItem('codefield.trace.enabled', $('#trace-toggle').checked ? '1' : '0'); } catch {} queueTrace(); };
try { $('#trace-toggle').checked = localStorage.getItem('codefield.trace.enabled') === '1'; } catch {}
$('#trace-output').hidden = !$('#trace-toggle').checked;
$('#quick-code').onclick = () => { if(state.problem) showStage('code', true); };
$('#quick-learn').onclick = () => { if(state.problem) showStage('learn', true); };
languageSelect.onchange = async () => {
  if (!state.problem) return;
  const problem = state.problem;
  const language = languageSelect.value;
  cancelTrace();
  rememberProblem();
  state.runToken++;
  $('#test-run').disabled = false;
  state.lastVerifiedCode = '';
  mountEditor();
  refreshApproaches();
  if (language !== 'javascript' && !problem.snippets?.[snippetKeys[language]] && problem.source === 'seed') {
    $('#test-status').textContent = 'Loading starter…';
    try {
      const response = await fetch('/api/leetcode/problem?live=1&slug=' + encodeURIComponent(problem.slug));
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const details = await response.json();
        if (state.problem === problem) problem.snippets = {...problem.snippets, ...details.snippets};
      }
    } catch {}
    if (state.problem !== problem || languageSelect.value !== language) return;
    if (store.drafts[draftKey()] === undefined && !editor.getValue()) editor.setValue(starter(problem));
  }
  $('#test-status').textContent = languageSelect.value === 'javascript' ? 'Run published examples' : 'Run as a program; add your own test calls';
};
$('#save-approach').onclick = () => {
  if(!state.problem || !editor) return;
  const name=$('#approach-name').value.trim() || 'Approach ' + (store.solutions.filter(x=>x.slug===state.problem.slug && x.language===languageSelect.value).length+1);
  const code=editor.getValue();
  const duplicate=store.solutions.find(x=>x.slug===state.problem.slug && x.language===languageSelect.value && x.code===code);
  if(duplicate){toast('This exact solution is already saved as '+duplicate.name);return}
  const item={id:crypto.randomUUID(),slug:state.problem.slug,language:languageSelect.value,name,code,verified:!!code && state.lastVerifiedCode===code,at:new Date().toISOString()};
  store.solutions.unshift(item);
  try{localStorage.setItem(storageKey,JSON.stringify(store))}catch{store.solutions.shift();toast('Could not save. Browser storage may be full.');return}
  refreshApproaches();renderProgress();$('#saved-approaches').value=item.id;
  toast(item.verified ? 'Verified approach saved ✓' : 'Approach saved');
};
$('#open-approach').onclick=()=>{
  const item=store.solutions.find(x=>x.id===$('#saved-approaches').value);
  if(!item || !editor)return;
  editor.setValue(item.code);store.drafts[draftKey()]=item.code;saveStore();
  $('#approach-name').value=item.name;$('#draft-status').textContent='Solution opened';queueTrace();editor.focus();
};
renderProgress();
buildTagOptions().catch(error => toast(error.message));
$('#problem-search').addEventListener('input', event => {
  state.query = event.target.value.trim();
  clearTimeout(window.__searchTimer);
  window.__searchTimer = setTimeout(() => loadProblems(), 320);
});
$('#problem-tag').addEventListener('change', event => {
  state.tag = event.target.value;
  loadProblems();
});
for (const button of document.querySelectorAll('.difficulty-tabs button')) {
  button.addEventListener('click', () => {
    state.difficulty = button.dataset.difficulty || '';
    for (const other of document.querySelectorAll('.difficulty-tabs button')) {
      other.setAttribute('aria-pressed', String(other === button));
    }
    loadProblems();
  });
}
$('#problem-more').addEventListener('click', () => loadProblems({ append: true }));
for (const button of document.querySelectorAll('.statement-tabs button')) {
  button.addEventListener('click', () => setTab(button.dataset.tab));
}
$('#test-run').addEventListener('click', runTests);
$('#test-hint').addEventListener('click', nextHint);
$('#test-reveal').addEventListener('click', revealSolution);
$('#briefing-start').addEventListener('click', () => showStage('code', true));
$('#briefing-skip').addEventListener('click', () => showStage('code'));
$('#briefing-back').addEventListener('click', () => showStage('learn', true));
$('#briefing-copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#briefing-template').textContent || '');
    $('#briefing-copy').textContent = 'Copied';
    setTimeout(() => { $('#briefing-copy').textContent = 'Copy template'; }, 1500);
  } catch {}
});
$('#problem-open-go').addEventListener('click', openAnyProblem);
$('#problem-open').addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    openAnyProblem();
  }
});
$('#practice-reset').addEventListener('click', () => {
  if (!state.problem || !editor) return;
  editor.setValue(starter(state.problem));
  store.drafts[draftKey()] = editor.getValue();
  saveStore();
  queueTrace();
  toast('Starter code restored. Your old draft was overwritten.');
});
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    runTests();
  }
});

initCoach({
  context: () => ({
    mode: 'practice',
    language: languageSelect.value,
    title: state.problem ? state.problem.title : '',
    code: editor ? editor.getValue() : '',
    output: state.lastReport,
    details: state.problem
      ? [
          `Difficulty: ${state.problem.difficulty}`,
          `Topics: ${(state.problem.tags || []).map(tag => tag.name).join(', ')}`,
          `Statement: ${textOf(state.problem.content || '').slice(0, 1800)}`,
          `Function signature: ${state.plan?.functionName || ''}(${(state.plan?.params || []).map(param => `${param.name}: ${param.type}`).join(', ')})`,
          `Published examples: ${(state.problem.examples || []).map(example => `${example.input} => ${example.output}`).join(' | ')}`
        ].join('\n')
      : ''
  }),
  insert: text => {
    if (editor) editor.insert(text);
  }
});

const requested = new URLSearchParams(location.search).get('p');
let last = null;
try { last = JSON.parse(localStorage.getItem(lastKey) || 'null'); } catch {}
if ((!requested || requested === last?.slug) && last?.language && tokenizers[last.language]) languageSelect.value = last.language;
if (requested || last?.slug) window.__initialSlug = requested || last.slug;
if (last && (!requested || requested === last.slug)) { window.__resumeSlug = last.slug; window.__resumeStage = last.stage; }
initLibrary({ getEditor: () => editor });
loadProblems();


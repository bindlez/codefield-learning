import {languages,tokenizers,languageOptions,runProgram} from './languages.js';
import { curriculum } from './curriculum.js';
import { createEditor } from './workspace-editor.js';
import { tokenizeJavaScript } from '../src/languages/javascript.js';
import { sanitizeHtml } from './sanitize.js';
import { initCoach } from './ai.js';
import { javascriptCompletion, guideFor } from './js-methods.js';
import { inferContext } from '../src/inference.js';
import { createMethodCard } from './method-card.js';
import { createNotebook } from './notebook.js';
import { runOnce } from './run-js.js';
import { initLibrary } from './library.js';
import {sharedCompletion} from './shared-completion.js';

const progressKey = 'codefield.learn.v1';
const $ = selector => document.querySelector(selector);

const lessons = curriculum.lessons;
const byId = new Map(lessons.map(lesson => [lesson.id, lesson]));
const trackById = new Map(curriculum.tracks.map(track => [track.id, track]));
const ordered = curriculum.tracks.flatMap(track => track.lessonIds.map(id => byId.get(id)).filter(Boolean));

let progress = { completed: {}, drafts: {}, lastId: '' };
try {
  const saved = JSON.parse(localStorage.getItem(progressKey) || '{}');
  progress = { ...progress, ...saved, completed: saved.completed || {}, drafts: saved.drafts || {} };
} catch {}

let activeId = '';
let activeLesson = null;
let checkpointEditor = null;
let lessonLanguage = 'javascript';
const draftId = id => lessonLanguage === 'javascript' ? id : id + ':' + lessonLanguage;
let lastCheck = '';
let focusSnippet = null;
let notebook = null;

const save = () => {
  try {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  } catch {}
};

function markComplete(id, silent = false) {
  if (progress.completed[draftId(id)]) return;
  progress.completed[draftId(id)] = new Date().toISOString();
  save();
  renderSidebar();
  renderProgress();
  if (!silent) toast('Checkpoint passed. Lesson marked complete.');
}

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

function renderProgress() {
  const done = ordered.filter(lesson => progress.completed[draftId(lesson.id)]).length;
  const percent = Math.round((done / lessons.length) * 100);
  $('#learn-progress').style.width = `${percent}%`;
  $('#learn-meter').setAttribute('aria-valuenow', String(percent));
  $('#learn-progress-label').textContent = `${done} of ${lessons.length} lessons complete`;
  $('#track-summary').textContent = `${lessons.length} lessons across ${curriculum.tracks.length} tracks`;
}

function renderSidebar() {
  const list = $('#track-list');
  list.replaceChildren();
  for (const track of curriculum.tracks) {
    const group = document.createElement('div');
    group.className = 'track-group';
    const heading = document.createElement('h3');
    const done = track.lessonIds.filter(id => progress.completed[draftId(id)]).length;
    heading.innerHTML = `<span>${track.title}</span><em>${done}/${track.lessonIds.length}</em>`;
    group.append(heading);
    for (const id of track.lessonIds) {
      const lesson = byId.get(id);
      if (!lesson) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lesson-link';
      button.setAttribute('aria-current', String(id === activeId));
      button.title = lesson.title;
      const dot = document.createElement('span');
      dot.className = 'lesson-dot' + (progress.completed[draftId(id)] ? ' done' : '');
      const label = document.createElement('span');
      label.textContent = lesson.title;
      const minutes = document.createElement('small');
      minutes.textContent = `${lesson.minutes}m`;
      button.append(dot, label, minutes);
      button.onclick = () => openLesson(id);
      group.append(button);
    }
    list.append(group);
  }
}

function sectionNode(section) {
  if (section.type === 'prose') {
    const node = document.createElement('section');
    node.className = 'lesson-section lesson-prose';
    node.innerHTML = sanitizeHtml(section.html);
    return node;
  }
  if (section.type === 'callout') {
    const node = document.createElement('aside');
    node.className = `lesson-section lesson-callout lesson-callout--${section.tone || 'tip'}`;
    if (section.title) {
      const title = document.createElement('strong');
      title.textContent = section.title;
      node.append(title);
    }
    const body = document.createElement('div');
    body.innerHTML = sanitizeHtml(section.html);
    node.append(body);
    return node;
  }
  if (section.type === 'code') {
    const figure = document.createElement('figure');
    figure.className = 'lesson-section snippet';
    const bar = document.createElement('div');
    bar.className = 'snippet-bar';
    const label = document.createElement('strong');
    label.textContent = 'JavaScript';
    const run = document.createElement('button');
    run.type = 'button';
    run.className = 'pill-button';
    run.textContent = 'Run';
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'text-button';
    copy.textContent = 'Copy';
    copy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(section.code);
        copy.textContent = 'Copied';
        setTimeout(() => { copy.textContent = 'Copy'; }, 1400);
      } catch {}
    };
    const ask = document.createElement('button');
    ask.type = 'button';
    ask.className = 'text-button';
    ask.textContent = 'Ask coach';
    ask.onclick = () => {
      focusSnippet = section.code;
      coach.open();
      coach.ask('Explain this example in plain language, then ask me one question about it.');
    };
    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'text-button';
    openButton.textContent = 'Open in editor';
    openButton.onclick = () => {
      notebook?.open(section.code, `${activeLesson?.title || 'Lesson'} · ${section.caption || 'example'}`);
    };
    bar.append(label, openButton, ask, copy, run);
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
    output.setAttribute('role', 'status');
    figure.append(bar, pre, caption, output);
    run.onclick = async () => {
      run.disabled = true;
      output.textContent = 'Running…';
      output.classList.remove('error');
      const result = await runOnce(section.code);
      output.textContent = result.ok
        ? [result.output, result.value && result.value !== 'undefined' ? `⇒ ${result.value}` : ''].filter(Boolean).join('\n') || '(no output)'
        : `${result.error || 'The snippet failed.'}${result.output ? `\n${result.output}` : ''}`;
      output.classList.toggle('error', !result.ok);
      run.disabled = false;
    };
    return figure;
  }
  if (section.type === 'quiz') {
    const card = document.createElement('section');
    card.className = 'lesson-section quiz';
    const title = document.createElement('h4');
    title.textContent = section.question;
    const options = document.createElement('div');
    options.className = 'quiz-options';
    const explain = document.createElement('p');
    explain.className = 'quiz-explain';
    explain.hidden = true;
    explain.textContent = section.explain || '';
    const buttons = (section.options || []).map((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      const letter = document.createElement('b');
      letter.textContent = String.fromCharCode(65 + index);
      const text = document.createElement('span');
      text.textContent = option;
      button.append(letter, text);
      button.onclick = () => {
        for (const [position, other] of buttons.entries()) {
          other.disabled = true;
          if (position === section.answer) other.classList.add('correct');
          else if (position === index) other.classList.add('wrong');
        }
        explain.hidden = false;
        explain.textContent = `${index === section.answer ? 'Correct. ' : `Not quite — the answer is ${String.fromCharCode(65 + section.answer)}. `}${section.explain || ''}`;
      };
      return button;
    });
    options.append(...buttons);
    card.append(title, options, explain);
    return card;
  }
  return null;
}

function comparison(expect, output) {
  const text = String(output || '');
  if (expect.kind === 'output') return text.trim() === String(expect.value).trim();
  if (expect.kind === 'contains') return (expect.values || []).every(value => text.includes(value));
  if (expect.kind === 'regex') {
    try {
      return new RegExp(expect.pattern, expect.flags || '').test(text);
    } catch {
      return false;
    }
  }
  return null;
}

function expectationText(expect) {
  if (expect.kind === 'output') return `Expected output:\n${expect.value}`;
  if (expect.kind === 'contains') return `Output should include: ${(expect.values || []).join(' · ')}`;
  if (expect.kind === 'regex') return `Output should match /${expect.pattern}/${expect.flags || ''}`;
  return 'This checkpoint is reviewed by you, or by the coach.';
}

function renderLesson() {
  const lesson = activeLesson;
  const main = $('#lesson-main');
  if (checkpointEditor) checkpointEditor.destroy();
  checkpointEditor = null;
  main.replaceChildren();
  if (!lesson) return;
  document.title = `${lesson.title} — Codefield`;

  const top = document.createElement('div');
  top.className = 'lesson-top';
  const track = trackById.get(lesson.track);
  const crumb = document.createElement('span');
  crumb.className = 'crumb';
  crumb.textContent = `${track?.title || 'Lesson'} / Lesson ${ordered.indexOf(lesson) + 1} of ${ordered.length}`;
  const level = document.createElement('span');
  level.className = `chip chip--${lesson.level === 'beginner' ? 'easy' : lesson.level === 'advanced' ? 'hard' : 'medium'}`;
  level.textContent = lesson.level;
  const minutes = document.createElement('span');
  minutes.className = 'chip chip--muted';
  minutes.textContent = `${lesson.minutes} min`;
  top.append(crumb, level, minutes);
  if (progress.completed[draftId(lesson.id)]) {
    const done = document.createElement('span');
    done.className = 'chip chip--easy';
    done.textContent = '✓ complete';
    top.append(done);
  }

  const title = document.createElement('h1');
  title.textContent = lesson.title;
  const summary = document.createElement('p');
  summary.className = 'lesson-summary';
  summary.textContent = lesson.summary;

  const objectives = document.createElement('ul');
  objectives.className = 'objectives';
  for (const objective of lesson.objectives || []) {
    const item = document.createElement('li');
    item.textContent = objective;
    objectives.append(item);
  }
  main.append(top, title, summary, objectives);

  for (const section of lesson.sections || []) {
    const node = sectionNode(section);
    if (node) main.append(node);
  }

  main.append(checkpointNode(lesson));
  main.append(footerNode(lesson));
}

function checkpointNode(lesson) {
  const checkpoint = lesson.checkpoint || { prompt: '', starter: '', expect: { kind: 'self' }, hints: [], solution: '' };
  const card = document.createElement('section');
  card.className = 'checkpoint';
  const head = document.createElement('div');
  head.className = 'checkpoint-head';
  const heading = document.createElement('div');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'YOUR TURN';
  const title = document.createElement('h2');
  title.textContent = 'Checkpoint';
  const prompt = document.createElement('p');
  prompt.textContent = checkpoint.prompt;
  heading.append(eyebrow, title, prompt);
  head.append(heading);
  const body = document.createElement('div');
  body.className = 'checkpoint-body';
  const editorHost = document.createElement('div');
  editorHost.className = 'checkpoint-editor';
  editorHost.id = 'checkpoint-editor';
  const guideHost = document.createElement('div');
  guideHost.className = 'method-card-host';
  const methodCard = createMethodCard(guideHost);
  const actions = document.createElement('div');
  actions.className = 'checkpoint-actions';
  const run = document.createElement('button');
  run.type = 'button';
  run.className = 'run';
  run.textContent = 'Run & check';
  const hint = document.createElement('button');
  hint.type = 'button';
  hint.className = 'text-button';
  hint.textContent = 'Hint';
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'text-button';
  reset.textContent = 'Reset';
  const solution = document.createElement('button');
  solution.type = 'button';
  solution.className = 'text-button';
  solution.textContent = 'Show solution';
  const status = document.createElement('span');
  status.className = 'run-hint';
  status.setAttribute('role', 'status');
  const language = document.createElement('select');
  language.setAttribute('aria-label','Checkpoint language');
  languageOptions(language, lessonLanguage);
  actions.append(language, run, hint, reset, solution, status);
  const hints = document.createElement('div');
  hints.className = 'hint-list';
  const result = document.createElement('div');
  result.className = 'checkpoint-result';
  result.setAttribute('role', 'status');
  const solutionBox = document.createElement('div');
  solutionBox.className = 'solution-box';
  solutionBox.hidden = true;
  const solutionPre = document.createElement('pre');
  solutionPre.textContent = checkpoint.solution || 'No reference solution is provided for this checkpoint.';
  const useSolution = document.createElement('button');
  useSolution.type = 'button';
  useSolution.className = 'text-button';
  useSolution.textContent = 'Use as my draft';
  useSolution.onclick = () => {
    checkpointEditor?.setValue(checkpoint.solution || '');
    saveDraft();
    toast('Reference solution copied into the editor. Read it, then change something.');
  };
  solutionBox.append(useSolution, solutionPre);
  body.append(editorHost, guideHost, actions, hints, result, solutionBox);
  card.append(head, body);

  function mountCheckpoint() {
    if (!editorHost.isConnected) return;
    checkpointEditor?.destroy();
    methodCard.hide();
    solution.hidden = lessonLanguage !== 'javascript';
    solutionBox.hidden = true;
    checkpointEditor = createEditor(editorHost, {language:lessonLanguage,
      value: progress.drafts[draftId(lesson.id)] ?? (lessonLanguage === 'javascript' ? checkpoint.starter || '' : ''),
      label: `${lesson.title} checkpoint editor`,
      tokenize: tokenizers[lessonLanguage],
      autoIndent: true,
      complete: context => sharedCompletion(lessonLanguage,checkpointEditor?.getValue() || '',checkpointEditor?.getCaret() || 0,context),
      onSelection: (value, parent) => {
        if (!checkpointEditor || lessonLanguage !== 'javascript') return;
        const inferred = parent
          ? inferContext(checkpointEditor.getValue(), checkpointEditor.getCaret(), 'javascript', parent.receiver, parent.chain)
          : null;
        methodCard.show(guideFor(value, inferred?.type || ''));
      },
      onChange: () => {
        methodCard.hide();
        saveDraft();
      }
    });
  }
  language.onchange = () => {
    saveDraft();
    lessonLanguage = language.value;
    renderSidebar();
    renderProgress();
    mountCheckpoint();
    result.textContent = '';
    status.textContent = lessonLanguage === 'javascript' ? '' : 'Write your solution in ' + languages[lessonLanguage] + '.';
  };
  requestAnimationFrame(mountCheckpoint);

  let hintIndex = 0;
  hint.onclick = () => {
    if (hintIndex >= (checkpoint.hints || []).length) {
      toast('No more hints. Ask the coach for a nudge.');
      return;
    }
    const item = document.createElement('div');
    item.className = 'hint-item';
    item.textContent = checkpoint.hints[hintIndex];
    hints.append(item);
    hintIndex++;
    hint.textContent = hintIndex >= (checkpoint.hints || []).length ? 'No more hints' : `Hint ${hintIndex + 1}`;
  };
  reset.onclick = () => {
    checkpointEditor?.setValue(lessonLanguage === 'javascript' ? checkpoint.starter || '' : '');
    saveDraft();
    result.className = 'checkpoint-result';
    result.textContent = '';
  };
  solution.onclick = () => {
    solutionBox.hidden = !solutionBox.hidden;
    solution.textContent = solutionBox.hidden ? 'Show solution' : 'Hide solution';
  };
  run.onclick = async () => {
    if (!checkpointEditor) return;
    run.disabled = true;
    status.textContent = 'Running in a fresh worker…';
    result.className = 'checkpoint-result';
    result.textContent = '';
    const output = await runProgram(lessonLanguage, checkpointEditor.getValue());
    lastCheck = output.ok ? output.output || '' : `${output.error || ''}\n${output.output || ''}`.trim();
    if (!output.ok) {
      status.textContent = '';
      result.className = 'checkpoint-result fail';
      result.textContent = `${output.error || 'The program failed.'}${output.output ? `\n\nOutput:\n${output.output}` : ''}`;
      run.disabled = false;
      return;
    }
    const passed = comparison(checkpoint.expect || { kind: 'self' }, output.output || '');
    if (passed === null) {
      result.className = 'checkpoint-result';
      result.textContent = `Program ran.\n\n${expectationText(checkpoint.expect)}\n\nOutput:\n${output.output || '(no output)'}`;
      status.textContent = 'Reviewed by you or the coach.';
      if (!card.querySelector('[data-mark]')) {
        const mark = document.createElement('button');
        mark.type = 'button';
        mark.className = 'outline';
        mark.dataset.mark = '1';
        mark.textContent = 'Mark this lesson done';
        mark.onclick = () => {
          markComplete(lesson.id);
          mark.remove();
        };
        actions.append(mark);
      }
    } else if (passed) {
      result.className = 'checkpoint-result pass';
      result.textContent = `Passed.\n\n${expectationText(checkpoint.expect)}\n\nYour output:\n${output.output || '(no output)'}`;
      status.textContent = 'Nice. Lesson marked complete.';
      markComplete(lesson.id);
    } else {
      result.className = 'checkpoint-result fail';
      result.textContent = `Not yet.\n\n${expectationText(checkpoint.expect)}\n\nYour output:\n${output.output || '(no output)'}`;
      status.textContent = 'Compare the two outputs closely.';
    }
    run.disabled = false;
  };
  return card;
}

function saveDraft() {
  if (!activeLesson || !checkpointEditor) return;
  focusSnippet = null;
  progress.drafts[draftId(activeLesson.id)] = checkpointEditor.getValue();
  progress.lastId = activeLesson.id;
  clearTimeout(saveDraft.timer);
  saveDraft.timer = setTimeout(save, 250);
}

function footerNode(lesson) {
  const index = ordered.indexOf(lesson);
  const previous = ordered[index - 1];
  const next = ordered[index + 1];
  const foot = document.createElement('nav');
  foot.className = 'lesson-foot';
  if (previous) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pill-button';
    button.textContent = `← ${previous.title}`;
    button.onclick = () => openLesson(previous.id);
    foot.append(button);
  }
  if (next) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pill-button next';
    button.textContent = `Next: ${next.title} →`;
    button.onclick = () => openLesson(next.id);
    foot.append(button);
  }
  return foot;
}

function openLesson(id) {
  const lesson = byId.get(id);
  if (!lesson) return;
  if (activeLesson && checkpointEditor) {
    progress.drafts[activeLesson.id] = checkpointEditor.getValue();
  }
  activeId = id;
  activeLesson = lesson;
  focusSnippet = null;
  progress.lastId = id;
  lastCheck = '';
  save();
  history.replaceState(null, '', `?lesson=${encodeURIComponent(id)}`);
  renderSidebar();
  renderLesson();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  $('#lesson-main').focus?.();
}

const coach = initCoach({
  context: () => {
    const checkpoint = activeLesson?.checkpoint;
    const inNotebook = notebook ? notebook.isOpen() : false;
    return {
      mode: 'lesson',
      language: inNotebook ? notebook.getLanguage() : lessonLanguage,
      title: activeLesson ? activeLesson.title + (inNotebook ? ' · notebook' : focusSnippet ? ' · example' : '') : '',
      code: inNotebook ? notebook.getValue() : focusSnippet || (checkpointEditor ? checkpointEditor.getValue() : ''),
      output: inNotebook || focusSnippet ? '' : lastCheck,
      details: activeLesson
        ? [
            `Track: ${trackById.get(activeLesson.track)?.title || ''}`,
            `Lesson summary: ${activeLesson.summary}`,
            `Objectives: ${(activeLesson.objectives || []).join('; ')}`,
            inNotebook ? `The learner is editing "${notebook.getTitle()}" in the code notebook.` : '',
            focusSnippet ? 'The learner asked about the example currently shown in the coach context.' : '',
            checkpoint ? `Checkpoint: ${checkpoint.prompt}` : '',
            checkpoint ? `Expected: ${expectationText(checkpoint.expect || { kind: 'self' })}` : ''
          ].filter(Boolean).join('\n')
        : ''
    };
  },
  insert: text => {
    if (!checkpointEditor) return;
    checkpointEditor.insert(text);
    saveDraft();
  }
});

notebook = createNotebook({
  onAsk: ({ title }) => {
    coach.open();
    coach.ask(`Explain this notebook example ("${title}") in plain language, then ask me one question about it.`);
  }
});
initLibrary({
  getEditor: () => (notebook && notebook.isOpen() ? notebook.getEditor() : checkpointEditor)
});

renderSidebar();
renderProgress();
const requested = new URLSearchParams(location.search).get('lesson');
const initial = byId.has(requested) ? requested : byId.has(progress.lastId) ? progress.lastId : ordered[0]?.id;
if (initial) openLesson(initial);

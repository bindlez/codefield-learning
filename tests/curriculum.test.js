import { test } from 'node:test';
import assert from 'node:assert/strict';
import { curriculum } from '../app/curriculum.js';

const lessons = curriculum.lessons;
const ids = new Set(lessons.map(lesson => lesson.id));

const runScript = code => {
  const output = [];
  const original = console.log;
  console.log = (...args) => output.push(args.map(value => typeof value === 'string' ? value : JSON.stringify(value)).join(' '));
  try {
    new Function(code)();
    return { ok: true, output: output.join('\n') };
  } catch (error) {
    return { ok: false, output: output.join('\n'), error: `${error.name}: ${error.message}` };
  } finally {
    console.log = original;
  }
};

const matches = (expect, output) => {
  if (expect.kind === 'output') return output.trim() === String(expect.value).trim();
  if (expect.kind === 'contains') return (expect.values || []).every(value => output.includes(value));
  if (expect.kind === 'regex') return new RegExp(expect.pattern, expect.flags || '').test(output);
  return true;
};

test('curriculum is structurally valid', () => {
  assert.ok(curriculum.tracks.length >= 4);
  assert.ok(lessons.length >= 12);
  assert.equal(ids.size, lessons.length, 'lesson ids must be unique');
  for (const track of curriculum.tracks) {
    assert.ok(track.lessonIds.length, `${track.id} needs lessons`);
    for (const id of track.lessonIds) assert.ok(ids.has(id), `missing lesson ${id}`);
  }
  for (const lesson of lessons) {
    assert.ok(lesson.title && lesson.summary, `${lesson.id} needs a title and summary`);
    assert.ok(lesson.objectives?.length >= 2, `${lesson.id} needs objectives`);
    assert.ok(lesson.sections?.length >= 3, `${lesson.id} needs sections`);
    assert.ok(lesson.checkpoint?.solution, `${lesson.id} needs a checkpoint solution`);
    assert.ok(lesson.checkpoint?.expect?.kind, `${lesson.id} needs an expectation`);
    if (lesson.next) assert.ok(ids.has(lesson.next), `${lesson.id} points at a missing next lesson`);
    for (const section of lesson.sections) {
      assert.ok(['prose', 'code', 'callout', 'quiz'].includes(section.type), `${lesson.id} has an unknown section`);
      if (section.type === 'prose' || section.type === 'callout') assert.ok(!/<script/i.test(section.html), `${lesson.id} contains a script tag`);
      if (section.type === 'quiz') assert.ok(Array.isArray(section.options) && section.options.length >= 2, `${lesson.id} quiz needs options`);
    }
  }
});

test('every checkpoint solution satisfies its own expectation', () => {
  for (const lesson of lessons) {
    const result = runScript(lesson.checkpoint.solution);
    assert.ok(result.ok, `${lesson.id} checkpoint solution threw: ${result.error}`);
    assert.ok(
      matches(lesson.checkpoint.expect, result.output),
      `${lesson.id} expected ${JSON.stringify(lesson.checkpoint.expect)} but printed ${JSON.stringify(result.output)}`
    );
  }
});

test('every runnable code section executes', () => {
  for (const lesson of lessons) {
    for (const [index, section] of lesson.sections.entries()) {
      if (section.type !== 'code') continue;
      const result = runScript(section.code);
      assert.ok(result.ok, `${lesson.id} section ${index} threw: ${result.error}`);
    }
  }
});

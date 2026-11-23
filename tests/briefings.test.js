import { test } from 'node:test';
import assert from 'node:assert/strict';
import { briefings, briefingFor } from '../app/briefings.js';
import { curriculum } from '../app/curriculum.js';

const lessonIds = new Set(curriculum.lessons.map(lesson => lesson.id));

test('every briefing is a usable pre-problem lesson', () => {
  for (const [key, briefing] of Object.entries(briefings)) {
    assert.ok(briefing.title.length > 10, `${key} title`);
    assert.ok(briefing.idea.length > 60, `${key} idea`);
    assert.ok(briefing.steps.length >= 3, `${key} steps`);
    assert.ok(briefing.template.includes('function') || briefing.template.includes('const') || briefing.template.includes('class'), `${key} template`);
    assert.ok(briefing.worked?.prompt && briefing.worked?.walk?.length >= 2, `${key} worked example`);
    assert.ok(briefing.pitfalls.length >= 2, `${key} pitfalls`);
    assert.ok(briefing.complexity.length > 4, `${key} complexity`);
    assert.ok(briefing.quiz?.options?.length >= 3, `${key} quiz options`);
    assert.ok(briefing.quiz.answer >= 0 && briefing.quiz.answer < briefing.quiz.options.length, `${key} quiz answer`);
    assert.ok(briefing.quiz.explain.length > 20, `${key} quiz explanation`);
    assert.ok(lessonIds.has(briefing.lessonId), `${key} lesson link ${briefing.lessonId}`);
  }
});

test('briefingFor picks a specific topic before the general fallback', () => {
  assert.equal(briefingFor([{ slug: 'array' }]).key, 'array');
  assert.equal(briefingFor([{ slug: 'dynamic-programming' }]).key, 'dynamic-programming');
  assert.equal(briefingFor([{ slug: 'depth-first-search' }]).key, 'tree');
  assert.equal(briefingFor([{ slug: 'memoization' }]).key, 'dynamic-programming');
  assert.equal(briefingFor([{ slug: 'unknown-topic' }]).key, 'general');
  assert.equal(briefingFor([]).key, 'general');
});

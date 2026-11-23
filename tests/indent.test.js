import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { nextLineIndent } from '../src/indent.js';

test('copies only the current line leading whitespace', () => {
  assert.equal(nextLineIndent('first\n  puts "hi"', 17), '  ');
  assert.equal(nextLineIndent('first\n\tword', 11), '\t');
  assert.equal(nextLineIndent('  first\nsecond', 14), '');
  assert.equal(nextLineIndent('', 0), '');
});
test('handles a cursor inside the indentation', () => {
  assert.equal(nextLineIndent('    word', 2), '  ');
});

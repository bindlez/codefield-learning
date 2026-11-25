import test from 'node:test';
import assert from 'node:assert/strict';
import {parseVoiceCommand,resolveVoiceSelection,findVoiceMatches} from '../src/voice-commands.js';

test('voice selection handles identifiers and previous words without an LLM', () => {
  const code = 'word.chars.tally';
  assert.deepEqual(resolveVoiceSelection(code, code.length, parseVoiceCommand('highlight tally')), {start:11,end:16});
  assert.deepEqual(resolveVoiceSelection(code, code.length, parseVoiceCommand('highlight back 3')), {start:0,end:16});
});
test('ambiguous or impossible commands do not select code', () => {
  assert.equal(resolveVoiceSelection('x + x', 5, parseVoiceCommand('highlight x')), null);
  assert.equal(resolveVoiceSelection('x', 1, parseVoiceCommand('highlight back 3')), null);
  assert.equal(parseVoiceCommand('delete everything').type, 'unknown');
});

test('recognizes speech-friendly counts and method context', () => {
  assert.deepEqual(parseVoiceCommand('highlight back three.'), {type:'highlight-back',count:3});
  assert.deepEqual(parseVoiceCommand('dot tally'), {type:'insert-method',name:'tally'});
  assert.deepEqual(parseVoiceCommand('highlight tally.'), {type:'highlight-name',name:'tally'});
  assert.deepEqual(parseVoiceCommand('open parenthesis'), {type:'insert-symbol',text:'('});
  assert.deepEqual(parseVoiceCommand('semicolon'), {type:'insert-symbol',text:';'});
  assert.deepEqual(parseVoiceCommand('equals equals'), {type:'insert-symbol',text:' == '});
  assert.deepEqual(parseVoiceCommand('greater than or equal'), {type:'insert-symbol',text:' >= '});
  assert.deepEqual(parseVoiceCommand('underscore'), {type:'insert-symbol',text:'_'});
});

test('ambiguous names provide ordered exact token matches', () => {
  assert.deepEqual(findVoiceMatches('x + xy + x','x'),[{start:0,end:1},{start:9,end:10}]);
});

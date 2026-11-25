import test from 'node:test';
import assert from 'node:assert/strict';
import {sharedCompletion} from '../app/shared-completion.js';
import {completionContext} from '../src/completion.js';

test('Ruby collection chains offer tally before runtime documentation loads',()=>{
  const source='word = "hello"\nword.chars.ta';
  const context=completionContext(source,source.length);
  assert.ok(sharedCompletion('ruby',source,source.length,context).some(item=>item.label==='tally'));
});

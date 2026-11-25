import {test} from 'node:test';
import assert from 'node:assert/strict';
import {findSavedFile,saveNamedFile} from '../app/file-manager.js';

test('voice and editor file actions share the latest saved file by language', t => {
  const data=new Map();
  globalThis.localStorage={
    getItem:key=>data.get(key) ?? null,
    setItem:(key,value)=>data.set(key,value)
  };
  t.after(()=>{delete globalThis.localStorage;});
  saveNamedFile('Example','ruby','puts 1');
  saveNamedFile('example','python','print(2)');
  saveNamedFile('EXAMPLE','ruby','puts 3');
  assert.equal(findSavedFile('example','ruby').code,'puts 3');
  assert.equal(findSavedFile('EXAMPLE','python').code,'print(2)');
  assert.equal(findSavedFile('example','go'),undefined);
});

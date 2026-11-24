import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRubyParser,analyzeRuby} from '../app/semantic-model.js';
const parse=await createRubyParser(await readFile(new URL('../app/vendor/prism/prism.wasm',import.meta.url)));
test('Prism traces the PRD example without Ruby execution',()=>{
 const graph=analyzeRuby(parse('word = "hello"\nchars = word.chars\ncounts = chars.tally'));
 const variables=graph.nodes.filter(n=>n.kind==='LocalVariableWrite');
 assert.deepEqual(variables.map(n=>n.type),['String','Array','Hash']);
 assert.deepEqual({...variables[2].value},{h:1,e:1,l:2,o:1});
 assert.equal(variables[2].confidence,'Inferred');
 assert.ok(graph.edges.length>=6);
});
test('unrecognized calls and syntax errors stay visible',()=>{
 assert.equal(analyzeRuby(parse('value = mystery()')).nodes.at(-1).confidence,'Unknown');
 assert.ok(analyzeRuby(parse('value = [')).diagnostics.length);
});

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

test('models simple select and map blocks without executing user Ruby',()=>{
 const code='numbers = [1, 2, 3, 4, 5]\nlarge_numbers = numbers.select do |n|\n n > 2\nend\ndoubled = large_numbers.map do |n|\n n * 2\nend';
 const graph=analyzeRuby(parse(code));
 const values=graph.nodes.filter(n=>n.kind==='LocalVariableWrite');
 assert.deepEqual(values.map(n=>n.value),[[1,2,3,4,5],[3,4,5],[6,8,10]]);
 const operation=graph.nodes.find(n=>n.name==='select');
 assert.equal(operation.confidence,'Inferred');
 assert.deepEqual(operation.transformation.steps.map(step=>step.result),[false,false,true,true,true]);
});

test('records UTF-16 source columns for precise editor selection',()=>{
 const graph=analyzeRuby(parse('greeting = "😀"; first = "x"; second = "x"'));
 const second=graph.nodes.find(n=>n.kind==='LocalVariableWrite' && n.name==='second');
 assert.equal(second.column,'greeting = "😀"; first = "x"; '.length);
});

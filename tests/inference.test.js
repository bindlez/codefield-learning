import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {inferVariables,inferCurrent,inferContext,inferExpression} from '../src/inference.js';
test('recognizes a closed string assignment without executing it',()=>{
 const code='myvar="abc"';
 assert.equal(inferCurrent(code,code.length,'ruby').type,'String');
 assert.equal(inferVariables(code,code.length,'ruby').get('myvar'),'String');
 assert.equal(inferCurrent('myvar="abc',10,'ruby'),null);
});
test('tracks known methods and retains the last known type for unknown chains',()=>{
 const code='myvar = "abc"\nmyvar.chars.tally';
 assert.equal(inferContext(code,code.length,'ruby','myvar',['chars','tally']).type,'Hash');
 const incomplete=inferContext(code,code.length,'ruby','myvar',['unknown','chars']);
 assert.equal(incomplete.type,'Array');assert.equal(incomplete.uncertain,true);
});
test('unknown reassignment does not reuse the old inferred type',()=>{
 const code='x = "hello"\nx = mystery()\nx.';
 assert.equal(inferContext(code,code.length,'ruby','x',[]),null);
});
test('understands Rust string slices, String and vectors',()=>{
 const code='let greeting = "hello";\nlet name = String::from("Jo");\nlet values = vec![1, 2];';
 const vars=inferVariables(code,code.length,'rust');
 assert.equal(vars.get('greeting'),'&str');assert.equal(vars.get('name'),'String');assert.equal(vars.get('values'),'Vec');
});
test('supports Rust variables in compact functions and long known chains',()=>{
 const code='fn main() { let message = String::from("hello"); message.trim().chars().';
 const result=inferContext(code,code.length,'rust','message',['trim','chars']);
 assert.equal(result.type,'Iterator');assert.equal(result.uncertain,false);
 const text='word = "hello"\nword'+'.upcase'.repeat(120);
 assert.equal(inferCurrent(text,text.length,'ruby').type,'String');
});
test('recognizes standard C++ string and vector declarations',()=>{
 const code='int main() { std::string word = "hello"; std::vector<int> numbers = {1,2}; word.substr(0, 2).';
 const vars=inferVariables(code,code.length,'cpp');
 assert.equal(vars.get('word'),'CppString');assert.equal(vars.get('numbers'),'CppVector');
 assert.equal(inferContext(code,code.length,'cpp','word',['substr']).type,'CppString');
});
test('distinguishes C++ literals from std::string variables',()=>{
 assert.equal(inferExpression('"hello"',new Map(),'cpp').type,'CppStringLiteral');
 const code='int main() { std::string greeting = "hello"; greeting.';
 assert.equal(inferContext(code,code.length,'cpp','greeting',[]).type,'CppString');
});
test('does not split string literals on semicolons or mistake Rust chars for strings',()=>{
 const code='x = "a;b";\ny = x';
 assert.equal(inferVariables(code,code.length,'ruby').get('y'),'String');
 const rust="let letter = 'x';";
 assert.equal(inferVariables(rust,rust.length,'rust').get('letter'),'char');
});
test('tracks string elements through split, an index and Ruby print',()=>{
 const code='word="how"\nlongword="how the hell"\np longword.split(\' \')[0].char';
 const context=inferContext(code,code.length,'ruby','longword',['split','[0]']);
 assert.equal(context.type,'String');assert.equal(context.uncertain,true);
 const current=inferCurrent(code,code.length,'ruby');
 assert.equal(current.type,'String');assert.equal(current.uncertain,true);
 const assignment='word = "hello world".split(" ")[0]\nword.';
 const fromAssignment=inferContext(assignment,assignment.length,'ruby','word',[]);
 assert.equal(fromAssignment.type,'String');assert.equal(fromAssignment.uncertain,true);
});
test('follows first and last with and without empty parentheses',()=>{
 const code='words = "one two".split(" ")\nwords.last().';
 assert.equal(inferContext(code,code.length,'ruby','words',['last']).type,'String');
 const parens='"one two".split(" ").last()';
 assert.equal(inferExpression(parens,new Map(),'ruby').type,'String');
 const count='"one two".split(" ").last(2)';
 assert.notEqual(inferExpression(count,new Map(),'ruby').type,'String');
});
test('recognizes loop variables only when collection element types are known',()=>{
 const code='longword="how the hell"\nws = longword.split(\' \')\nfor w in ws\n  p w.';
 const context=inferContext(code,code.length,'ruby','w',[]);
 assert.equal(context.type,'String');
 const unknown='ws = [1, "two"]\nfor w in ws\n  p w.';
 assert.equal(inferContext(unknown,unknown.length,'ruby','w',[]),null);
 const mutated='ws = "a b".split(" ")\nws << 42\nfor w in ws\n  p w.';
 assert.equal(inferContext(mutated,mutated.length,'ruby','w',[]),null);
});
test('tracks each_cons and numeric method receivers without evaluation',()=>{
 const code='word = "hello".chars\nword.each_cons(2).';
 assert.equal(inferContext(code,code.length,'ruby','word',['each_cons']).type,'Enumerator');
 assert.equal(inferExpression('"hello".length',new Map(),'ruby').type,'Integer');
 assert.equal(inferExpression('42',new Map(),'ruby').type,'Integer');
});

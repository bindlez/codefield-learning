import test from 'node:test';
import assert from 'node:assert/strict';
import {curriculum} from '../app/curriculum.js';
import {cppLessonSolutions} from '../app/lesson-cpp-solutions.js';
import {rustLessonSolutions} from '../app/lesson-rust-solutions.js';
import {csharpLessonSolutions} from '../app/lesson-csharp-solutions.js';

test('every lesson has a C++ checkpoint solution',()=>{
  for(const lesson of curriculum.lessons) assert.match(cppLessonSolutions[lesson.id] || '', /int main\(\)/, lesson.id);
});
test('every lesson has a Rust checkpoint solution',()=>{
  for(const lesson of curriculum.lessons) assert.match(rustLessonSolutions[lesson.id] || '', /fn main\(\)/, lesson.id);
});
test('every lesson has a C# checkpoint solution',()=>{
  for(const lesson of curriculum.lessons) assert.match(csharpLessonSolutions[lesson.id] || '', /static void Main\(\)/, lesson.id);
});

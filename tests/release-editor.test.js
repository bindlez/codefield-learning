import {test} from 'node:test';
import assert from 'node:assert/strict';
import {completionContext} from '../src/completion.js';
import {inferContext} from '../src/inference.js';
import {cppProgram} from '../app/cpp-snippet.js';
test('completes after each block and follows the subsequent chain',()=>{
 const source='word = "hello"\nword.chars.each do |letter|\n  p letter\nend.join.upcase.do';
 const context=completionContext(source);
 assert.equal(context.receiver,'word');
 assert.deepEqual(context.chain,['chars','each','join','upcase']);
 assert.equal(inferContext(source,source.length,'ruby',context.receiver,context.chain).type,'String');
});
test('wraps C++ statements while retaining complete programs',()=>{
 const snippet=cppProgram('#include <vector>\nstd::cout << "hi";');
 assert.equal(snippet.wrapped,true);
 assert.match(snippet.code,/int main\(\)/);
 assert.ok(snippet.code.indexOf('#include <vector>')<snippet.code.indexOf('int main'));
 const program='int main() { return 0; }';
 assert.equal(cppProgram(program).code,program);
});

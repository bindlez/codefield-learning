import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {rustProgram} from '../app/rust-snippet.js';

test('wraps snippets and leaves complete programs unchanged',()=>{
 assert.deepEqual(rustProgram('println!("hello");'),{wrapped:true,code:'fn main() {\nprintln!("hello");\n}'});
 const full='fn main() { println!("hi"); }';
 assert.deepEqual(rustProgram(full),{wrapped:false,code:full});
 assert.equal(rustProgram('println!("fn main() is text");').wrapped,true);
 assert.equal(rustProgram('let x = 1;',false).wrapped,false);
});

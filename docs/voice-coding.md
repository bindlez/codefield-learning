# Voice coding

Open Voice from the navigation or from a problem, choose a language, then start the microphone. Commands are interpreted locally without an AI model. Browser speech recognition can require a network connection. Recognition errors are possible: inspect the Heard text and use Undo when necessary.

## Build a program

Speak one command at a time. New commands insert at the cursor or replace the current selection. They do not automatically add a newline.

1. Say `variable count equals 3`.
2. Say `new line`.
3. Say `if condition count greater than 2`.
4. The cursor is placed inside the condition's body. Say `print expression count`.
5. Say `run code`.

JavaScript, Ruby, Python, Rust, C++, C#, Java, Crystal, Go and Elixir have language-specific syntax templates. Compiled languages require the surrounding program structure expected by their runtime. Java `var` requires a local variable inside a method. C++ output requires iostream, C# output requires System, and Go output requires fmt. Use the editor's existing starter program.

## Statement commands

| Say | Result |
|---|---|
| `variable count equals 3` | Declaration using the selected language |
| `constant count equals 3` | `const` in JavaScript and Go, immutable `let` in Rust; ordinary declaration in the other languages with a template |
| `set count to count plus 1` | Assignment |
| `print expression count` | Language-specific output |
| `return expression count` | Return statement inside an existing function, except Elixir |
| `if condition count greater than 2` | Conditional block, cursor inside |
| `while condition count less than 10` | Loop block, cursor inside. Go uses `for`; Elixir uses recursion or enumeration |
| `for each item in nums` | Iterate over a collection, with the cursor inside the loop |
| `for each index i in nums` | Ruby index loop |
| `inspect expression item` | Ruby `p item` |
| `call sort on nums` | Insert `nums.sort()` |
| `comment explain this loop` | Language-specific comment |

Supported expression phrases: `greater than or equal`, `less than or equal`, `not equals`, `equals equals`, `greater than`, `less than`, `plus`, `minus`, `times`, `modulo`. Python booleans become `True` and `False`. Expressions containing quotes are inserted literally so string contents are preserved. These commands use a small deterministic grammar; they do not translate arbitrary spoken English into code.

## Literal code and punctuation

Use `insert` followed by exact code for anything outside the templates. Say `new line`, `tab`, `space`, `underscore`, `open parenthesis`, `close parenthesis`, `open bracket`, `close bracket`, `open brace`, `close brace`, `comma`, `colon`, `semicolon`, `quote`, or `single quote`. Operator commands include `equals`, `equals equals`, `not equals`, `less than`, `greater than`, `less than or equal`, `greater than or equal`, `plus`, `minus`, `multiply`, `divide`, and `modulo`.

## Navigate and repair

- `go to line 3`, `go to start`, `go to end`, `go to line start`, `go to line end`.
- `highlight count`, `highlight back three`, `find count`, `select all`.
- If several occurrences match, say `choose first` or `choose 2`.
- `replace selection with text` and `delete selection` require `confirm` or `cancel`.
- `undo` and `redo` recover edits. `new file` requires confirmation.

## Explore methods

After a receiver, say `dot`, then `suggest methods`. Say `use suggestion 1` or `use first` to insert a listed method. Say `dot tally` to insert a known method directly. `explain tally` reads the available method guide when Speak feedback is enabled. Suggestions depend on the inferred receiver type and runtime availability; this is not universal language-server completion.

## Practice, save and listen

Say `read problem`, `read example`, `read code`, `read line`, `read output`, `run code`, or `next problem`. Published-example results are not a LeetCode submission or hidden-test verdict.

`save file demo` and `open file demo` use the shared Files collection for the selected language. Opening replaces the editor; Undo restores it. Older voice-only saves can still be opened. Export valuable work separately because clearing browser storage deletes saved drafts.

Switch with `language ruby`, `language python`, `language javascript`, `language rust`, `language c plus plus`, `language c sharp`, `language java`, `language crystal`, `language go`, or `language elixir`. Say `stop listening` to stop the microphone. Remote compilation asks for confirmation before sending code.

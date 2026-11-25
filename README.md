# Codefield 0.6.0-alpha

To use the Codefield editor directly beside a problem on the LeetCode website, install the separate [Codefield for LeetCode extension](leetcode-extension/README.md). Its bundled local runners provide step replay for JavaScript, Ruby and Python without starting the app server.

This release adds the LeetCode browser extension, a shared file drawer, method previews, additional language checkpoints and voice editing commands. The playground, practice and learning workspaces share the editor. See the [release notes](docs/release-0.6.0-alpha.md) for verified coverage and the [next-pass backlog](docs/next-pass.md) for remaining work.

On Windows, double-click `Start Codefield.cmd`. To enable the website's **Start local server** link, run `Enable site launcher.ps1` once. The launcher uses the project directory containing that script. Java, Crystal, Rust, C++ and C# execution use remote services. Speech recognition depends on browser support and may require a network connection.

Run `node server.js` with Node.js 22 or newer, then open http://127.0.0.1:8765/. No dependency installation or build is required. Run the checks with `node --test tests/*.test.js`.

- **Playground** includes the existing editor, saved work, language comparisons, generated practice sets and five interactive code challenges. Open **AI studio** to start a challenge, answer it, request a hint or reveal a walkthrough. **Pop out** opens a compact editor that runs after you pause and shares edits with the playground. On Windows, the local server attempts to make it borderless and always on top. Drag the LIVE RESULT label to move it and press Escape to close it. Browser and window-system support can vary.
- **Beginner** provides a 14-step path from first code through introductory practice problems. It uses saved lesson checkpoints and verified practice results to show progress.
- **Learn** has 16 JavaScript-authored lessons across four tracks. Checkpoints and the notebook offer eight language editors and keep drafts separately. Lesson examples and reference solutions are written in JavaScript.
- **Practice** searches the live LeetCode problem catalog by title, difficulty and topic. Open a problem by number, slug or URL. The local server imports public statements and starters on demand and caches successful requests. Supported scalar and array function examples can also run in Ruby, Python, JavaScript, Rust, C++, C#, Java and Crystal. Unsupported signatures require custom test calls. Use **Open on LeetCode** for official submissions, hidden tests and account-gated material.
- **AI coach** shares one model connection across all three modes. With Ollama running, a loaded chat model is selected automatically. **Detect local model** checks Ollama, Strata, LM Studio and llama.cpp. For a second PC or custom server, select the provider and enter its address under **Connection**. Hosted OpenAI-compatible servers and Gemini can also be selected. Model preferences persist in this browser; provider keys entered in the UI are scoped to the tab session.
- **Static hosting** includes the bundled catalog index, ten built-in practice problems, lessons and playground. Other indexed problems open on LeetCode. Local-server mode adds live imports and proxied local AI. Static AI requests require the provider to allow the browser origin. The existing Pages bridge is available in `app/local-bridge.mjs`.
- Refresh the bundled public catalog metadata with `node server/refresh-catalog.js`. This updates titles, difficulty, tags and links. Ruby fetches its WebAssembly runtime on first use.

The workspace includes a dependency-free embeddable editor, experimental highlighting, interactive Ruby and JavaScript, Rust and C++ program execution, result inspection, method references, exercises, notes and local browser saves. Ruby values persist until the session is reset, times out, or the page reloads. History and notes survive in local storage, but live runtime objects are not restored. JavaScript runs in a persistent worker; use `var` or `globalThis` for bindings reused across submissions. Each visit starts with starter code. Prior drafts are kept as local versions when possible; users can also save named versions and restore or delete them. Up to 50 versions are stored on this browser, subject to local storage limits and clearing.

Only run code you trust. Browser workers are not security sandboxes; code can use browser APIs available to workers. The 10-second timeout stops runaway execution, but is not a security boundary. Rust uses the public Rust Playground, and C++ uses Compiler Explorer: code is sent when Run is pressed or remote auto-run is explicitly enabled, and each run starts a fresh program. Python and C# are also available in the playground. Ruby highlighting is incomplete (including interpolation and heredocs). Auto-indent undo behavior, mobile input and screen-reader support require further testing.

Select a method to open its official documentation and browse adjacent methods. Ruby and Rust reference pages can be opened inside the workspace; other links open the provider's site. Links are best-effort, especially for inherited or dynamically defined methods. The official sources supply the documentation and may change or be unavailable.

The practice lab saves locally created problems in browser storage and compares the last run's printed output with an expected output. It is a basic output check, not an isolated test suite or full online judge. Tutor and translation requests use the shared model connection. Review generated code before running it.

The learning studio includes named local files and snippets, independent comparison editors, an embedded reference browser, simple task progress, and a lexical code breakdown. Local browser data is best-effort and may be cleared. The breakdown is approximate, not a semantic parser. Some documentation sites block embedding and must be opened separately. Rust and C++ comparison runs send code to external execution services after the user clicks Run.

The method explorer follows the highlighted autocomplete suggestion and shows a separate explanation, examples, and inferred parent path. Detailed guides cover a selection of common methods; others link to the official references. Rust snippets can be automatically wrapped in a visibly displayed `fn main()`; complete programs are sent unchanged. The opt-in live preview runs the entire Ruby or JavaScript editor in a fresh worker after typing pauses, separate from the main session. It may execute side effects and is not a security sandbox; it does not automatically send Rust or C++ code to remote services.

The Code Map presents statically inferred variables and expression steps as clickable chips; it does not execute code or show actual runtime values. Ruby completion recognizes simple multiline `map do ... end` chains, including `each_cons`; nested blocks and arbitrary Ruby syntax are not fully analyzed. Ruby method colors indicate inferred receiver types and are best-effort.

## Embed the editor

```html
<link rel="stylesheet" href="./src/editor.css">
<div id="editor"></div>
<script type="module">
  import { createEditor } from './src/editor.js';
  import { tokenizeRuby } from './src/languages/ruby.js';
  const editor = createEditor('#editor', {
    value: 'word = "hello"', tokenize: tokenizeRuby,
    onChange: value => console.log(value)
  });
</script>
```

See [the product specification](docs/product-spec.md) and [technology evaluation](docs/technology-evaluation.md). Ruby runtime: [ruby.wasm](https://github.com/ruby/ruby.wasm), loaded separately from the editor.

Method completion is available for simple Ruby local variables and string/array literals after the runtime starts. Use arrow keys, Enter or Tab to accept, and Escape to dismiss. JavaScript supports string/array literals and globals such as `var` bindings. Completion does not execute typed expressions. Common Ruby chains such as `word.chars.tally` and `word.split(" ").last` are inferred. Existing top-level constants are supported; simple unexecuted local assignments are inferred, but arbitrary chains, control flow, scopes and richer semantic analysis are not fully supported. Only the small built-in reference library currently provides method descriptions.

The editor includes line numbers, Ruby and JavaScript highlighting, bracket pairing, indentation preservation, find (Ctrl/Cmd+F while editing), copy, download, resizing, and method suggestions. Browser editing and accessibility support varies; automated cross-browser and assistive-technology verification is still needed.


Select a variable or supported expression to see its methods in the learning panel. Select a method name to explore the methods of its receiver and view the method guide when available.


Rust support includes syntax coloring, selected standard-library method suggestions, guides and real compile-and-run through the public Rust Playground. The Rust method list is curated, not exhaustive. Type inference never executes code, is heuristic, and marks guesses after unknown chain steps as tentative. Auto-detected Ruby String, Array and Hash methods come from the Ruby runtime. The editor should not be used to execute untrusted code.


Ruby's lightweight inference also follows string arrays produced by `split`, numeric indexing, and `for item in array` loops when element types are known. Indexed results are tentative because an index can return `nil`. Mixed arrays, mutations, dynamic values and other Ruby syntax can make inference uncertain or unavailable.

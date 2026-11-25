# Codefield 0.6.0-alpha

**Codefield for LeetCode 1.0.0** brings the shared Codefield editor, Code Map, autocomplete, method lookup, saved files and step replay into a browser side panel. Open a LeetCode problem, click **⌘ Codefield**, edit the solution, and watch the selected example run when you pause. Use the replay controls to inspect locals and jump to the corresponding source line.

## Downloads

- **codefield-0.6.0-alpha.zip** contains the complete app source. Extract it and open the offline playground, or run `node server.js` for the connected workspace.
- **Codefield-for-LeetCode-1.0.0.zip** contains the ready-to-load desktop Chrome/Edge extension with its runtimes. Extract it, enable Developer mode in the browser’s Extensions manager, choose **Load unpacked**, and select the folder containing `manifest.json`. Refresh any open LeetCode tabs.

## In the workspace

- Open practice problems in the playground and carry drafts back. The shared file drawer saves files and snippets by language and reads existing Studio saves.
- Explore method previews for supported literal transformations. Use documented voice commands for coding constructs and receive language-specific help during Ruby and Python lessons.
- Go has an online example runner with scalar assignment checkpoints. Elixir includes editing, starters and completions. Learn includes Go and Java checkpoint solutions.

## Verification and coverage

The public Two Sum page was tested in Edge. The on-page launcher opened the side panel, and JavaScript, Python and Ruby each returned the expected indices with a replayable trace. Tests also exercised sparse binary trees, linked lists, playback, source selection, draft persistence and editor transfer. Transfer was verified with a controlled native-editor fixture. On the signed-out public page, users can use **Copy code**.

The three interpreted extension runners execute locally. Rust, C++, C#, Java, Go and Crystal use optional online compilers and expose selected checkpoints. All six returned the expected result and source-line value in a compiler smoke test. Elixir execution is unavailable. A matching example is feedback on that input. Official submissions and hidden tests remain on LeetCode.

The workspace regression suite passed 115 tests and the extension passed three instrumentation tests. The [next-pass backlog](https://github.com/bindlez/codefield-learning/blob/v0.6.0-alpha/docs/next-pass.md) tracks remaining language, curriculum and mobile work.

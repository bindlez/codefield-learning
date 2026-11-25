# Codefield for LeetCode

Open a problem on leetcode.com and click **⌘ Codefield** near the bottom right, or use the extension toolbar button. The problem stays visible while the browser side panel hosts the same editor used by Codefield. Drag the browser’s panel divider to adjust its width.

## Install for testing

In desktop Chrome or Edge, open the Extensions manager, turn on **Developer mode**, choose **Load unpacked**, and select the **dist** folder containing manifest.json. If you downloaded the zip, extract it first and select the extracted folder. The source directory can also be selected after its build has created the dist folder. Refresh any LeetCode tabs that were open during installation.

## Solve and replay

1. Open **Two Sum**. The panel reads the current problem’s starter and published examples. If LeetCode exposes the active editor, Codefield also picks up its language and current code. Existing Codefield drafts take precedence and are saved separately by problem and language.
2. Write a solution and pause briefly. The selected example runs automatically. **Live values** shows the observed variables at the selected step, highlights changes from the prior step, and keeps the example's return in view. Press **▶** to watch it unfold, or use the arrows and slider to inspect a single step. The editor marks the active line. Select the line button to jump there. **Code Map** combines inferred symbols with the selected example’s observed values. Choose Example 1, 2, or 3 above Live values to switch inputs.
3. Type a dot and a letter, such as `word1.s`, to see matching methods beside the cursor. Use the arrow keys and Enter to choose a suggestion. **Quick reference** lists the receiver's methods. Select one to read its description, example, and official reference in **Method explorer**. Parameter types come from the problem signature when available. For supported operations, highlighting a suggestion previews its effect on the observed value without changing your code.
4. Switch examples, or choose **Custom example**, enter the function name and arguments as a JSON array. For Two Sum, enter `[[2,7,11,15],9]`. A custom example shows the actual return value. A published example with a known output also shows whether it matches. When supported, a prominent summary checks all published examples. Passing those examples is not an official acceptance: LeetCode grades hidden tests on submission.
5. Choose **Send to LeetCode** to copy the solution into its native editor, then submit there. **Import draft** brings edits back. Both transfers ask before replacing different code. If LeetCode’s editor API is unavailable, use **Copy code** and paste, or paste an existing solution into Codefield. Codefield never clicks LeetCode’s Run or Submit buttons.

Use **Save** to keep a named snapshot and **Files** to browse, restore, or delete saved work. Drafts and snapshots stay in this browser’s local storage and can be lost when browser data is cleared.

## Language support

- **JavaScript** runs locally. Traces include statement updates, conditions, loop iterations and returns. The example harness supports ordinary values, ListNode and TreeNode. The replay keeps the first 120 observations.
- **Python 3 and Ruby** run locally using bundled WebAssembly runtimes and standard libraries. Line events show locals immediately before executing that line. Results show the final return value. Variable snapshots show up to 50 local variables, and long or complex values are summarized. Supply ordinary JSON values, linked lists as arrays, and binary trees as level-order arrays with null for a missing child. Other specialized node types and design-class problems require additional adapters.
- **Rust, C++, C#, Java, Go and Crystal** can send the solution and example to an online compiler after you enable its named service. Codefield shows the result, printed output and checkpoints for supported single-line initializers. Go can show scalar values for short declarations. Rust shows values for explicitly typed scalar initializers. These harnesses support a subset of scalar and array signatures.
- **Elixir** supports editing and Code Map. Its runner is unavailable.
- With missing problem metadata, enter a custom example manually. Trace and verdict coverage are limited to the selected example and supported signatures. Runtime errors, incomplete code, or timeouts appear in the trace panel.

## Privacy and build

Local runs use a disposable, network-restricted worker in a sandbox without extension APIs. The editor reads problem metadata from LeetCode using the current tab’s session. Drafts and saved files use browser-local storage. The extension requests access to leetcode.com; access to Rust Playground or Compiler Explorer is optional. A browser panel session must enable online execution before code is sent. No local server, API key or AI service is required.

From the source directory run `npm ci --ignore-scripts` and `npm run build`. This copies the current application editor and static assets, bundles pinned local runtimes, and generates offline Ruby/Python method catalogs from those runtimes. Load the resulting dist directory. After rebuilding, click Reload in the browser’s Extensions manager.

Run `npm test` for the JavaScript instrumentation checks. After building, `npm run test:browser` exercises the installed extension against a controlled LeetCode fixture. It uses Edge on Windows by default. Set `BROWSER_PATH` to an extension-capable Chromium binary on other systems. Use `node test-browser.mjs --live` for the public Two Sum page in a fresh browser profile. `npm run test:compilers` sends synthetic examples to the optional online services.

The extension uses Chromium’s [Side Panel API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel) and [sandboxed pages](https://developer.chrome.com/docs/extensions/reference/manifest/sandbox). Local runtimes are [Pyodide 0.27.7](https://github.com/pyodide/pyodide/tree/0.27.7) and [ruby.wasm](https://github.com/ruby/ruby.wasm). Bundled license notices are in the vendor directory.

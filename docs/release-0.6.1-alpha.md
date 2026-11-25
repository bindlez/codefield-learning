# Codefield 0.6.1-alpha — release notes

## LeetCode workspace

- Code Map shows values observed at the selected trace step, with a selector for published examples.
- Highlight supported methods to preview their effect on a safely represented observed value. Incomplete Ruby calls retain trace values gathered before the error.
- Published examples with known outputs are checked automatically. Submit on LeetCode for its official result and hidden tests.
- Save creates a local snapshot; Files opens the local file and snippet drawer. Drafts remain separate by problem and language.
- Compact value cards show short arrays in order; repeated returned items include a small frequency chart.

## Learning workspace

- A bounded shared-editor expression preview shows supported simple transformations as you type, including Ruby `word.chars`.
- Ruby Trail adds introductory lessons and a guided reference tour; the value explorer demonstrates selected operations.
- Voice commands include loop and Ruby debugging templates.

## Limits

Previews support a bounded set of operations and simple values. They do not execute arbitrary expressions. Trace coverage and execution support vary by language and problem signature; online compilers require opt-in. Browser local storage can be cleared. Examples may be unavailable or have no known output.

See [the extension guide](../leetcode-extension/README.md) and [next-pass backlog](next-pass.md).

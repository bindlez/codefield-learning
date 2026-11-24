# Codefield 0.5.5-alpha

- Reshapes the playground around the editor: Code Map above it, output to its left, Live Result to its right, and reference panels alongside. The layout stacks on smaller screens.
- Opens practice problems in the playground with saved drafts or language-specific starter code. Switching languages retains each draft; returning to practice carries it back. Published examples run automatically after a pause for JavaScript, Ruby, and Python. Remote compiler auto-checks require enabling them for that language.
- Adds an offline index of official Ruby 4.0 descriptions for methods on 19 core classes and built-in Python runtime docstrings when Pyodide is available, with reference links and neutral fallbacks. See `reference-sources.md` for coverage.
- Adds verified Ruby, Python, C++, Rust, and C# checkpoint solutions to all 16 current lessons, alongside JavaScript solutions.

## Current limits

The lesson prose and worked examples are not yet translated into every language, and checkpoint solutions for the remaining languages are still to be written and verified. The method reference does not cover every library or method. Example checks are not LeetCode submissions or hidden tests, and some problem signatures are not supported by the example harness. Compiled-language execution uses remote services. See `next-pass.md` for the remaining work.

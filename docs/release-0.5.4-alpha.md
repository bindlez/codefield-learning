# Codefield 0.5.4-alpha

Open a practice problem in the playground using **Open in playground**. The problem, selected language, draft, and supported harder variant follow you. The playground can check published examples and return the saved draft to practice. Example checking does not submit to LeetCode and does not run its hidden tests.

The Ruby Code Model recognizes a limited static `select` or `map` block over known integer arrays. Select the method in the model to see inferred inputs, outputs, and per-item steps. Practice live traces have previous and next controls that select observed source lines. Inferred transformations and observed execution are labeled separately.

Ruby source navigation uses parser locations with UTF-16-aware columns. The implementation covers a deliberately limited set of expressions and does not execute the Ruby code during static analysis. Complex blocks and method calls may remain unknown. The broader semantic graph, visualization, and tracing goals remain in `docs/next-pass.md`.

The release was checked with automated tests and browser flows including practice round trips, a harder variant, the attached transformation example, trace navigation, and mobile-sized layouts. Physical phone, microphone, and assistive-technology testing remains outstanding.

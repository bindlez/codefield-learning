# Method result previews

The playground explorer and shared editor show a before/after value when highlighting a supported pure method. For example, `word = "hello"` followed by `word.chars.ta` previews `tally` as character counts. This is a prediction from literals, not a claim that the code ran.

The implementation never evaluates user code. It handles small straight-line literal assignments and supported method chains. It rejects unknown statements, branching, calls with arguments, interpolation, oversized input, and unsupported operations. Non-ASCII string transformations are deferred because runtime encoding and locale semantics differ.

Current operations:

| Language | Supported methods |
|---|---|
| Ruby | chars, tally, reverse, uniq, length, size, upcase, downcase |
| Python | upper, lower, copy |
| JavaScript | toUpperCase, toLowerCase, slice without arguments |
| Rust | to_uppercase, to_lowercase, clone, len, is_empty |
| C++ | size, length, empty |
| Java | toUpperCase, toLowerCase, length, isEmpty |
| C# | ToUpperInvariant, ToLowerInvariant, Length |
| Crystal | chars, reverse, uniq, size, upcase, downcase |

These names are checked against the known receiver value. A method that changes the receiver, needs arguments, requires a block, or cannot be predicted confidently shows an explanatory fallback. Language-specific runtime and parser integration, more literal forms, argument-aware previews, and observations inside functions remain future work.

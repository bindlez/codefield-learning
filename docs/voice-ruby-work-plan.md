# Voice and Ruby practice work plan

Implement and verify a hands-free coding session on desktop and narrow screens. Keep speech command interpretation deterministic and independent of an AI model.

1. Fix Set inference and method discovery across editor surfaces. Verify `Set.new`, `to_set`, `add`, and `insert` against the actual Ruby runtime.
2. Make Ruby practice show the first example's observed output, expected output, and pass status automatically after editing. Preserve explicit example runs and prevent stale results.
3. Connect the voice workspace to practice problems and their existing per-language drafts. Add voice commands to inspect a problem, examples, output, and current code, run examples, and navigate to another problem.
4. Support voice-driven autocomplete and code exploration using the existing language intelligence. Keep choices visible and make ambiguous commands recoverable.
5. Verify real Ruby WASM behavior, multiple problem states, simulated recognition, narrow layouts, and existing regression tests. Record which microphone and physical-device tests still require a user.

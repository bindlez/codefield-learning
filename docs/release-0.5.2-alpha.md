# Codefield 0.5.2-alpha

Open a practice problem and select **Voice coding** to carry its language and browser-saved draft into the voice workspace. Say “read problem”, “read example”, “dot”, “use suggestion 1”, “explain add”, “run code”, “read output”, or “next problem”. Commands and method selection use local logic without an AI model. Browser speech recognition can require a network service.

Ruby `Set.new` and `to_set` are recognized. The Ruby method catalog reads public methods for supported built-in types from the actual Ruby runtime. Ruby Set uses `add`; Rust HashSet uses `insert`. JavaScript Set uses `add`.

Ruby practice automatically runs and traces the first supported example after you pause, showing its output and expected value. Example results do not submit to LeetCode or test its hidden cases. Other examples can be run explicitly. Some signatures and data structures require a custom test call.

Desktop browser checks covered the real Ruby runtime, Set autocomplete and method finder, live example verdict, voice suggestions, and practice-draft handoff. A simulated 390-pixel layout and simulated speech recognition were exercised. Physical phone, microphone, keyboard, accent, screen-reader, offline, and real speech-provider behavior still need device testing. The complete Ruby API and every possible language construct are not yet covered by static inference or authored method explanations.

# Codefield delivery backlog

Status: proposed; none of the features below are claimed as implemented. Baseline: Codefield 0.4.0-alpha. IDs are stable issue titles; dependencies imply ordering, not a promise of a release date.

## Milestone 1 — shared foundations

- [ ] **CF-01 — Audit editor parity.** Inventory every editor surface, controls, languages, completion, selection, inspection, persistence, run and accessibility differences. Acceptance: a checked-in capability matrix and reproducible parity cases for Playground, Practice, Learn, notebook, comparison and floating editor.
- [ ] **CF-02 — Extract full editor integration.** Share capabilities and configuration across surfaces without coupling their drafts. Acceptance: same core editing, completion, inspection and history features where applicable; switching views/languages preserves each draft; parity tests cover representative surfaces. Depends: CF-01.
- [ ] **CF-03 — Unify execution contract.** Define request/result, backend capability, cancellation, timeout and output limits; distinguish local/remote. Acceptance: adapter contract tests cover success, compile failure, timeout, cancellation and stale responses.
- [ ] **CF-04 — Opt-in Rust/C++ auto-run.** Add debounce, concurrency/rate limits, source-destination consent, cancellation and clear status. Acceptance: both languages run after an edit and pause when enabled, stale results never win, no remote request before opt-in, manual run works, network failure is visible. Depends: CF-03.
- [ ] **CF-05 — Phone-ready editor shell.** Responsive layouts, safe areas, reachable controls, soft keyboard and touch selection; preserve context when changing panes. Acceptance: complete edit/run cycle at narrow phone and desktop sizes with no clipped essential controls; test on iOS Safari and Android Chrome, record devices and findings. Depends: CF-02.

## Milestone 2 — reliable voice interaction

- [ ] **CF-06 — Voice workspace and lifecycle.** Dedicated navigation and workspace, explicit start/stop, permission/error states, transcript, feedback, help and touch fallback. Acceptance: no listening when stopped; permission denial/revocation and unsupported recognition are understandable; audio/transcript processing is disclosed.
- [ ] **CF-07 — Recognition adapter.** Isolate speech-to-text backend and surface whether it uses network; expose partial/final results and interruptions. Acceptance: mockable recognition, no duplicate actions from interim results, restart and error tests. Depends: CF-06.
- [ ] **CF-08 — Deterministic command grammar.** Implement local intent parsing, modes for commands versus literal dictation, documented punctuation, naming and dot/method handling. Acceptance: fixtures for `highlight tally`, `highlight back 3`, punctuation, ambiguous matches, mistaken recognition and literal command phrases; no LLM required for interpretation. Depends: CF-07.
- [ ] **CF-09 — Voice editor operations.** Implement token-aware selection, navigation, insert, replace, delete, undo/redo and ambiguity resolution via editor APIs. Acceptance: selection boundaries are predictable, multi-match choices are explicit, destructive actions confirm or are recoverable, and edits behave correctly across language samples. Depends: CF-02, CF-08.
- [ ] **CF-10 — Hands-free session.** Voice commands for open/create, language, run, results, trace and help; optional spoken feedback. Acceptance: a user completes and repairs a small program without keyboard/touch after starting microphone; feedback and mute work on supported desktop and mobile browsers. Depends: CF-05, CF-09.

## Milestone 3 — actual live tracing

- [ ] **CF-11 — Trace event model and harness.** Define versioned events, source mapping, supported values and bounds; distinguish actual values from static analysis. Acceptance: runner fixture verifies line mapping, event order, truncation, exceptions, timeouts and stale cancellation. Depends: CF-03.
- [ ] **CF-12 — Interpreted language trace adapters.** Support JavaScript, Ruby and Python with real runtime events. Acceptance: representative loops, branches, functions and variable changes match reference execution; unsupported constructs report limitations. Depends: CF-11.
- [ ] **CF-13 — Compiled language trace adapters.** Support Rust, C++ and C# with viable instrumentation/debugging and matching source maps, including wrappers. Acceptance: each language traces a real example correctly, handles compilation failure and resource limits, and accurately identifies unsupported cases. Any remote transmission follows CF-04 consent. Depends: CF-11.
- [ ] **CF-14 — Practice trace experience.** Example selection/custom input, source highlighting, step navigation, current values and results. Acceptance: all six language adapters work in practice on representative problems, and unsupported problem shapes show a clear fallback. Depends: CF-12, CF-13.

## Milestone 4 — structured practice

- [ ] **CF-15 — Topic roadmaps.** Curate arrays, strings and additional topic paths with ordering, metadata and prerequisites. Acceptance: validate entries, browse paths, choose next or random eligible item, persist progress and handle unavailable problems.
- [ ] **CF-16 — Verified harder variants.** Add a starter set of problem-specific constraints, examples and independent test oracles. Acceptance: a verified solve unlocks a variation; correct and incorrect reference solutions are distinguished, original and variant progress remain independent, no unsupported variation is advertised as verified.
- [ ] **CF-17 — Grow curriculum.** Extend paths and verified variants across many problems using reviewed metadata and tests. Acceptance: publish exact coverage counts and fallback behavior; avoid implying that all catalog problems have a variation. Depends: CF-15, CF-16.

## Milestone 5 — release readiness

- [ ] **CF-18 — Cross-platform and accessibility validation.** Automated regression suite plus documented real-device keyboard, touch, speech, screen-reader, denial/offline and flaky-network checks. Acceptance: record matrix, results, known limits and fixes for release blockers.
- [ ] **CF-19 — Release preparation.** Update version, documentation, capability matrix and truthful notes; build a clean testing ZIP, verify its contents and launch path; draft release on the correct repository and attach the tested artifact. Acceptance: release points to the reviewed commit, describes actual shipped features and limitations, and stays draft until ready. Depends: completed scope and CF-18.

## Risks and sequencing decisions

- Remote compilers, quotas and browser speech APIs may be unavailable or unsuitable for continuous use. Prototype each actual backend and state service/consent constraints rather than assuming compatibility.
- General tracing for compiled languages and adapting arbitrary LeetCode signatures is substantial. Establish representative supported fixtures early; do not claim universal correctness from output capture alone.
- Voice recognition is separate from deterministic command interpretation. Browser recognition may require connectivity; fully offline operation needs a separately verified engine.
- Phone experience and voice-only accessibility require testing with real devices and people; simulated viewports alone are insufficient.

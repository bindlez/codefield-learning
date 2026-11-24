# Codefield 0.5.0-alpha

This alpha is ready for testing. Extract the ZIP and launch `Start Codefield.cmd` with Node.js 22 or newer.

- The shared editor now includes a Code Model, method suggestions, reference access, search, undo, redo, and download in practice and learning workspaces. The Ruby Code Model uses the bundled Prism parser and shows known and inferred information without executing code.
- Algorithm Studio translates a small structured pseudocode grammar into eight language representations, with linked source lines and manual-edit protection. Projects provides browser-saved files and import/export.
- Practice includes twelve topic paths, timed sessions, ten harder variants, and example runners for supported scalar and array signatures across eight languages. Rust, C++, C#, Java, and Crystal use public compiler services, and Live Trace instruments selected simple initializers.
- Voice controls support dictation, selection, punctuation, named drafts, language changes, output narration, and confirmed deletion or remote execution. Speech recognition depends on browser support.

Automated tests passed, including the Prism example and pseudocode mapping. Browser checks covered the practice Code Model and autocomplete, mobile-sized pseudocode view, simulated speech, variants, and Python/Ruby example runners. Fixed examples were also run through the five compiled-language services.

This alpha does not implement the complete PRD. Its current limits and the next-pass plan are in `docs/next-pass.md`. Browser workers are not a security sandbox. Real phone, microphone, accessibility, full catalog statement coverage, runtime tracing, and language-adapter coverage need further validation and development.

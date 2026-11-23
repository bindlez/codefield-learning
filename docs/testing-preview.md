# Codefield testing preview

Start with `Start Codefield.cmd` on Windows (Node.js 22 or newer). The voice workspace is linked from the playground. Voice input requires a supported browser and its speech recognition service; it is not an offline voice engine.

Practice paths currently cover a small set of bundled problems. Timed practice runs locally and suggests the next unsolved problem in the selected path. The timer is not preserved after closing or reloading the page. Example passes are not LeetCode submissions.

Live Trace observes selected JavaScript assignments and, for compatible Python and Ruby problem examples, executed lines and scalar locals. Rust, C++, and C# do not yet have line-level tracing. Unsupported problem signatures cannot always be executed by the example harness. Remote Rust and C++ execution sends code to an external service and requires a network connection.

The voice workspace supports basic selection, dictation, undo, redo, running and reading output. It is an early prototype, not a complete hands-free programming workflow. Its microphone and mobile experience have not been validated on physical devices.

Editor capabilities still vary by surface and language. Harder verified problem variations, comprehensive roadmaps, all-language tracing, and the full voice workflow remain future work; see `mobile-voice-delivery-backlog.md`.

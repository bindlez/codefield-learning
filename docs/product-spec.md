# Product specification

## Vision
A learning-focused coding playground and community built on a lightweight, independently embeddable editor. Anyone can start without an account or installed language tools. Accounts enable cross-device saving and participation.

## Core experience
- A persistent, interactive workspace where supported, with code, results, discoverable methods, and documentation visible together.
- Select or inspect a result, discover operations, run examples, view helpful errors, and reset the session.
- Exercises and guides share the same workspace. Preserve code, notes, language version and output history; do not promise restoration of arbitrary live runtime state.
- No Rails support is required.

## Editor
- Standalone, framework-independent web component or JavaScript API, installable through npm and embeddable in plain HTML.
- Accessible keyboard interaction, responsive sizing, independent instances, change events, language-specific highlighting, and themes.
- Load language support, autocomplete, documentation, runtimes, and other features separately. The editor must not require an account or transmit code by default.
- Establish and enforce compressed-size budgets after evaluating real editing engines and measuring realistic bundles. Accessibility and reliable editing are acceptance criteria alongside size.

## Languages and execution
Support Ruby, Python, JavaScript, C#, C++, and Rust over time. A language adapter describes execution, completion, documentation, inspection, session persistence and limitations. Execution providers can be browser-based or isolated hosted services; an optional local companion is a later possibility. Interactive behavior may differ for compiled languages. Guest access must not require installation. Hosted execution requires isolation, resource limits, timeouts and abuse controls.

## Accounts and community
Guests can explore and run supported code; local browser saves are best-effort and may be cleared. Accounts enable private saved sessions, sync, profiles, publishing, remixes, bookmarks, follows and conversations. Users choose what to publish. Shared code must be reviewed before execution; never auto-run untrusted shared content.

The learning-focused feed supports posts, questions, runnable examples, guides, problems and attributed technology news. Discovery uses languages and topics. Public community content needs reporting and moderation. Private messaging is not decided.

## Content platform
Creators can use a visual editor and eventually a documented format, API, CLI and SDK for problems, guides, collections, news and playgrounds. Problems include starter code, hints and isolated checks that allow multiple valid solutions. News includes attribution, source and date. Accounts can publish immediately to profiles; submission to curated collections is optional and reviewed. Approval applies to a particular version; later substantive changes require review before replacing the curated version. Automated validation supports, but does not replace, editorial review.

## Architecture and stack direction
- Embed: framework-independent TypeScript or JavaScript, with separately loaded languages and extensions. Build the editor from scratch with no third-party editor dependencies, starting from native browser input. Measure size, accessibility, correctness, and maintenance as features grow.
- Playground: web application consuming the same editor API. Keep the app framework out of the embed bundle.
- Runtimes: browser workers where viable; isolated hosted execution for capabilities that need a server. Validate persistence and compatibility for each language.
- Services: accounts, saved content, social features, moderation and content APIs are separate from the editor. Database, hosting and framework remain decisions until requirements and operational costs are evaluated.
- Documentation: language-specific adapters and versioned sources; check redistribution licenses and attribution before bundling.

## Delivery
1. Establish an embeddable editor API and measure a working prototype; test keyboard and accessibility behavior.
2. Validate the Ruby console, persistent state, method discovery and side-by-side docs with a real runtime.
3. Add a second dynamic language and test a compiled-language execution spike to validate the adapter boundary.
4. Add guest persistence, optional accounts, saved sessions, sharing and remixing.
5. Add creator tools, versioned content, review, feed, conversations and moderation; expand language support incrementally.

## Initial prototype limits
The prototype is a dependency-free editor API and demo with experimental Ruby syntax highlighting, not a full editor engine or Ruby console. It does not execute code, implement accounts, or provide documentation. It is intended to validate embedding and measure the baseline before choosing an engine.


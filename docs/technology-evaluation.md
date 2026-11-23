# Technology evaluation

## Editor
We chose to build our own dependency-free editor, starting with a native textarea. Ruby highlighting is an optional, separately loaded module. Evaluate size, keyboard and screen-reader behavior, mobile behavior, and correctness as features grow. CodeMirror and other established editors remain reference points, not dependencies.

## Ruby runtime
Ruby.wasm provides CRuby compiled to WebAssembly and a JavaScript API for a browser VM. Evaluate a persistent binding across submissions, output capture, exception formatting, reset, termination of infinite loops in a worker, loading size, initialization time, docs availability, and runtime compatibility. Load it independently of the editor. Browser WebAssembly has restrictions and does not automatically provide IRB's autocomplete or documentation.

Source: https://github.com/ruby/ruby.wasm/blob/main/docs/cheat_sheet.md.

The current environment has Node but no npm command, and outbound CDN access from the shell failed. No runtime or editor bundle was downloaded, measured, or verified here. These are candidates, not validated performance claims.

## Account and community backend: Rails versus Go
Rails with PostgreSQL is the leading candidate for accounts, saved sessions, posts, comments, follows, content versioning and moderation. Active Record offers models, associations, migrations and validations, making the relationship-heavy product a natural fit. Query planning, indexing, authorization, transactions, and complex feed queries still require deliberate work; an ORM does not solve those automatically.

Go with PostgreSQL is a credible alternative, particularly if the team values static typing and direct control of service behavior. Go's standard database/sql offers database access and pooling; teams can choose an ORM or use SQL and a generator such as sqlc. Compared with Rails, selecting and integrating application-level components entails additional design decisions. Actual performance, operational costs, and development speed must be measured for our workload rather than assumed.

A Rails application backend and a separate execution service are compatible. No backend choice makes the browser editor bundle heavier by itself. The execution service needs strong isolation regardless of implementation language. A split into services is not necessary until operational requirements justify it.

Recommendation: prototype Rails + PostgreSQL for the product backend after the editor and Ruby experience are validated. Keep the decision provisional until deployment requirements, hosting costs, team preferences and a small end-to-end prototype are assessed.

Sources: https://guides.rubyonrails.org/active_record_basics.html, https://guides.rubyonrails.org/association_basics.html, https://pkg.go.dev/database/sql, https://docs.sqlc.dev/.


# Ruby learning path: curriculum outline

This is a planning document, not a completed course. It maps a proposed Ruby-specific learning experience to official references. Ruby mastery requires sustained practice beyond any single tutorial.

## Guided path

1. Values, expressions, output, variables and types.
2. Strings, interpolation, symbols and numbers.
3. Decisions, truthiness, comparisons and loops.
4. Arrays, hashes, ranges and nested data.
5. Methods, arguments, return values and scope.
6. Blocks, `each`, `map`, `select`, `reduce` and enumerators.
7. Classes, objects, state, inheritance and modules.
8. Exceptions, files, regular expressions and standard libraries.
9. Testing, debugging, packaging and a capstone project.
10. Advanced Ruby: pattern matching, method lookup, metaprogramming and concurrency.

Each unit should introduce an idea in plain language, animate or visualize a concrete example, give runnable exercises with hidden cases, and close with a project or reflection. Save progress locally and explain the limits of automated checks.

## Documentation expedition

The follow-up should ask learners to use the official references to resolve unfamiliar behavior, predict edge cases, explain tradeoffs, repair code and build a final project. Tests should cover all units, include multiple inputs and distinguish a passed check from mastery.

- [Ruby 4.0 documentation](https://docs.ruby-lang.org/en/4.0/)
- [Ruby syntax](https://docs.ruby-lang.org/en/4.0/syntax_rdoc.html)
- [Enumerable](https://docs.ruby-lang.org/en/4.0/Enumerable.html)
- [Classes and modules](https://docs.ruby-lang.org/en/4.0/syntax/modules_and_classes_rdoc.html)

## Implementation requirements

Add a dedicated navigation entry and responsive Ruby-specific interface; connect it to the existing Ruby runner, value explorer, and optional coach. Keep exercise execution isolated and bounded. Add independently checked lesson content, learner progress, accessibility and browser tests. Document how to use the path, application, and local storage. Verify the deployment target and preserve existing user changes before publication.

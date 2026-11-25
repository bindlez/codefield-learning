# Language parity status

Full parity is not yet delivered. The shared editor is available across sections, but language capabilities differ.

Go now has syntax highlighting, package completion, reference links, starter content, and a remote execution adapter. Practice harnesses support primitive and array arguments and JSON-serializable results. Sources with custom imports need further harness integration; tree/list nodes and line tracing are not implemented for Go.

Elixir now has syntax highlighting, module completion, starter content, problem starter generation, and official reference links. Execution is explicitly unavailable until a suitable runner is connected. It must not fall back to the JavaScript worker.

Java already has a remote execution adapter and typed practice harness. All 16 Java and Go checkpoints have solutions verified against their expected output. Worked lesson examples and richer parser-backed exploration remain incomplete. Ruby, Python, and C# likewise do not yet have every JavaScript lesson example, trace feature, and problem signature.

References: [Go documentation](https://go.dev/doc/), [Go standard library](https://pkg.go.dev/std), [Elixir documentation](https://hexdocs.pm/elixir/), [Enum](https://hexdocs.pm/elixir/Enum.html), [Java documentation](https://docs.oracle.com/en/java/javase/).

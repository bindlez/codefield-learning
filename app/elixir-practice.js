// Encode data as literals, including strings as UTF-8 byte sequences, so
// example text never becomes executable Elixir interpolation.
function literal(value) {
  if (Array.isArray(value)) return '['+value.map(literal).join(', ')+']';
  if (typeof value === 'string') return '<<'+Array.from(new TextEncoder().encode(value)).join(', ')+ '>>';
  if (typeof value === 'boolean' || Number.isFinite(value)) return String(value);
  throw Error('Unsupported Elixir example input');
}

export function elixirScript(source, plan) {
  if (!/^[a-zA-Z_]\w*$/.test(plan?.functionName || '') || !plan.tests?.length) return null;
  if ([...(plan.params || []),plan.returns].some(p=>!p || !/^(integer|string|double|boolean)(\[\])*$/.test(p.type))) return null;
  const method=plan.functionName.replace(/[A-Z]/g,c=>'_'+c.toLowerCase());
  // Jason is not part of the standard library. Emit valid JSON for the
  // primitive and nested-list signatures supported by this harness.
  const encoder = `defmodule CodefieldJSON do
  def encode(v) when is_list(v), do: "[" <> Enum.map_join(v, ",", &encode/1) <> "]"
  def encode(v) when is_binary(v) do
    escaped = for <<c::utf8 <- v>>, into: "", do: escape(c)
    <<34>> <> escaped <> <<34>>
  end
  def encode(nil), do: "null"
  def encode(v) when is_number(v) or is_boolean(v), do: to_string(v)
  defp escape(c) when c in [34, 92], do: <<92, c>>
  defp escape(c) when c < 32, do: <<92, 117>> <> String.pad_leading(Integer.to_string(c, 16), 4, "0")
  defp escape(c), do: <<c::utf8>>
end`;
  try {
    const calls=plan.tests.map(t=>'IO.puts("__CODEFIELD_CASE__" <> CodefieldJSON.encode(Solution.'+method+'('+t.args.map(literal).join(', ')+')))');
    return [source,encoder,...calls].join('\n');
  } catch { return null; }
}

export function instrumentJavaScript(code) {
  if (/[`]|\/\*/.test(String(code))) return {code:String(code), count:0};
  let count = 0;
  const lines = String(code).split('\n').map((line, index) => {
    // Restrict probes to simple, complete assignment expressions. Other code runs unchanged.
    const match = /^(\s*)(?:(const|let|var)\s+)?([A-Za-z_$][\w$]*)\s*=\s*([^;{}\x60]+);\s*$/.exec(line);
    if (!match || /\/\/|\/\*|\b(?:await|yield)\b|=>/.test(match[4])) return line;
    const [,indent,declaration,name,expression] = match;
    count++;
    return indent + (declaration ? declaration + ' ' : '') + name + ' = __codefieldTraceValue(' +
      (index + 1) + ', ' + JSON.stringify(name) + ', (' + expression + '));';
  });
  if (!count) return {code:String(code), count:0};
  const helper = `
let __codefieldTraceCount = 0;
function __codefieldTraceValue(line, name, value) {
  if (__codefieldTraceCount++ < 120) {
    let shown;
    try { shown = JSON.stringify(value); } catch { shown = '[unserializable]'; }
    console.log('[step ' + line + '] ' + name + ' = ' + (shown === undefined ? String(value) : shown));
  }
  return value;
}
`;
  return {code:helper + lines.join('\n'),count};
}

// Trace only frames belonging to the submitted solution. Bound output to keep
// tight loops from overwhelming the interface.
export function instrumentInterpreted(language, code) {
  const source = JSON.stringify(String(code));
  if (language === 'python') return `import sys as __cf_sys\n__cf_count = 0\ndef __cf_trace(frame, event, arg):\n    global __cf_count\n    if event == 'line' and frame.f_code.co_filename == '<codefield-solution>' and __cf_count < 120:\n        __cf_count += 1\n        values = {k: repr(v)[:100] for k,v in frame.f_locals.items() if not k.startswith('__') and type(v) in (int,float,str,bool,type(None))}\n        print('[line %s] %s' % (frame.f_lineno, values))\n    return __cf_trace\n__cf_sys.settrace(__cf_trace)\nexec(compile(${source}, '<codefield-solution>', 'exec'), globals())\n`;
  if (language === 'ruby') return `__cf_count = 0\n__cf_trace = TracePoint.new(:line) do |event|\n  if event.path == '<codefield-solution>' && __cf_count < 120\n    __cf_count += 1\n    values = event.binding.local_variables.each_with_object({}) do |name, out|\n      value = event.binding.local_variable_get(name)\n      out[name] = value.inspect[0, 100] if value.nil? || value.is_a?(TrueClass) || value.is_a?(FalseClass) || value.instance_of?(Integer) || value.instance_of?(Float) || value.instance_of?(String)\n    end\n    puts "[line #{event.lineno}] #{values}"\n  end\nend\n__cf_trace.enable\neval([${[...new TextEncoder().encode(String(code))].join(',')}].pack('C*').force_encoding('UTF-8'), TOPLEVEL_BINDING, '<codefield-solution>')\n`;
  return null;
}


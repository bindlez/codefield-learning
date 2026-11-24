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
  if (language === 'python') return `import sys as __cf_sys\nimport itertools as __cf_itertools\n__cf_count = 0\ndef __cf_safe(value, depth=0):\n    if type(value) in (int,float,str,bool,type(None)): return repr(value)[:100]\n    if depth < 2 and type(value) in (list,tuple): return '[' + ', '.join(__cf_safe(v,depth+1) for v in value[:12]) + (', …' if len(value)>12 else '') + ']'\n    if depth < 2 and type(value) is dict: return '{' + ', '.join(__cf_safe(k,depth+1)+': '+__cf_safe(v,depth+1) for k,v in __cf_itertools.islice(value.items(),12)) + (', …' if len(value)>12 else '') + '}'\n    return '<'+type(value).__name__+'>'\ndef __cf_trace(frame, event, arg):\n    global __cf_count\n    if event == 'line' and frame.f_code.co_filename == '<codefield-solution>' and __cf_count < 120:\n        __cf_count += 1\n        values = {k: __cf_safe(v) for k,v in list(frame.f_locals.items())[:20] if not k.startswith('__')}\n        print('[line %s] %s' % (frame.f_lineno, values))\n    return __cf_trace\n__cf_sys.settrace(__cf_trace)\nexec(compile(${source}, '<codefield-solution>', 'exec'), globals())\n`;
  if (language === 'ruby') return `def __cf_safe(value, depth=0)\n  return value.inspect[0,100] if value.nil? || value.equal?(true) || value.equal?(false) || value.instance_of?(Integer) || value.instance_of?(Float) || value.instance_of?(String)\n  if depth < 2 && value.instance_of?(Array)\n    return '[' + value.first(12).map { |v| __cf_safe(v,depth+1) }.join(', ') + (value.length > 12 ? ', …' : '') + ']'\n  end\n  if depth < 2 && value.instance_of?(Hash)\n    return '{' + value.first(12).map { |k,v| __cf_safe(k,depth+1) + ' => ' + __cf_safe(v,depth+1) }.join(', ') + (value.length > 12 ? ', …' : '') + '}'\n  end\n  '<' + value.class.to_s + '>'\nend\n__cf_count = 0\n__cf_trace = TracePoint.new(:line) do |event|\n  if event.path == '<codefield-solution>' && __cf_count < 120\n    __cf_count += 1\n    values = event.binding.local_variables.first(20).each_with_object({}) do |name, out|\n      out[name] = __cf_safe(event.binding.local_variable_get(name)) unless name.to_s.start_with?('__')\n    end\n    puts "[line #{event.lineno}] #{values}"\n  end\nend\n__cf_trace.enable\neval([${[...new TextEncoder().encode(String(code))].join(',')}].pack('C*').force_encoding('UTF-8'), TOPLEVEL_BINDING, '<codefield-solution>')\n`;
  return null;
}


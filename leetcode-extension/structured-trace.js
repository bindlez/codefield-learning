import {instrumentInterpreted} from './app/trace.js';

// Reuse the application's bounded instrumentation and emit machine-readable
// records only inside the extension. The user's output stays a separate stream.
export function instrumentStructured(language, source) {
  const code=instrumentInterpreted(language,source);
  if(language==='python') {
    const before="print('[line %s] %s%s' % (frame.f_lineno, values, (' → ' + __cf_safe(arg)) if event == 'return' else ''))";
    const after="print('__CODEFIELD_TRACE__' + __cf_json.dumps({'line': frame.f_lineno, 'event': event, 'variables': [{'name': k, 'value': v, 'type': type(frame.f_locals[k]).__name__} for k,v in values.items()], 'result': __cf_safe(arg) if event == 'return' else None}))";
    if(!code.includes(before))throw Error('Python trace instrumentation is unavailable.');
    return 'import json as __cf_json\n'+code.replace(before,after);
  }
  if(language==='ruby') {
    const before='puts "[line #{event.lineno}] #{values}"';
    // TracePoint reports nil for some non-local returns through blocks. The
    // example harness provides the actual return value separately.
    const after='types = values.keys.to_h { |name| [name, event.binding.local_variable_get(name).class.to_s] }\n    record = {line: event.lineno, event: (event.event == :return ? "exit" : "line"), variables: values.map { |name, value| {name: name.to_s, value: value, type: types[name]} }, result: nil}\n    puts "__CODEFIELD_TRACE__" + JSON.generate(record)';
    if(!code.includes(before))throw Error('Ruby trace instrumentation is unavailable.');
    return code.replace(before,after);
  }
  return code;
}

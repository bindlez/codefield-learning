// Runs in a disposable, opaque-origin worker with network access disabled by CSP.
self.onmessage = async ({data}) => {
  try {
    if (data.language === 'javascript') {
      const steps = [];
      function format(v,depth=0) {
        if (typeof v === 'string') return JSON.stringify(v.slice(0,120));
        if (v === null || typeof v !== 'object') return String(v).slice(0,120);
        if (depth > 1) return '…';
        if (v instanceof Map || v instanceof Set) {
          const sample=[];
          for (const entry of v) {sample.push(entry);if(sample.length===8)break;}
          return (v instanceof Map ? 'Map' : 'Set')+' ('+v.size+') '+format(sample,depth+1);
        }
        const array = Array.isArray(v);
        const parts = [];
        for (const k in v) {
          if (!Object.hasOwn(v,k)) continue;
          if (parts.length >= 8) { parts.push('…'); break; }
          const field = Object.getOwnPropertyDescriptor(v,k);
          parts.push((array?'':k+': ')+(Object.hasOwn(field,'value')?format(field.value,depth+1):'[accessor]'));
        }
        return (array?'[':'{')+parts.join(', ')+(array?']':'}');
      }
      let omitted = 0;
      function observe(line, event, reads, value) {
        if (steps.length >= 120) { omitted++; return; }
        const locals = [], variables = [];
        for (const [name,get] of reads) {
          try {
            const v=get();
            if (typeof v !== 'function') {
              const value=format(v);
              const type=v===null?'null':Array.isArray(v)?'Array':v instanceof Set?'Set':v instanceof Map?'Map':typeof v;
              locals.push(name+' = '+value);
              variables.push({name,value,type});
            }
          } catch {}
        }
        steps.push({line,event,variables,result:arguments.length===4?format(value):null,detail:locals.join('\n')+(arguments.length===4?'\n→ '+format(value):'')});
      }
      observe.result = (line,reads,value) => { observe(line,'return',reads,value); return value; };
      observe.test = (line,reads,value) => { observe(line,'condition',reads,Boolean(value)); return value; };
      const result = new Function(data.probe,'self',data.code);
      result(observe,{postMessage:report => self.postMessage({report,steps,omitted})});
      return;
    }
    const lines = [];
    self.capturedOutput = () => lines.join('\n');
    const output = line => {
      const text=String(line);
      if (lines.length < 350 || text.startsWith('__CODEFIELD_CASE__')) lines.push(text.startsWith('__CODEFIELD_CASE__')?text:text.slice(0,2600));
    };
    const files = data.files;
    if (data.language === 'python') {
      const base = 'https://runtime.invalid/';
      self.fetch = async url => {
        const file = String(url).slice(base.length);
        if (!String(url).startsWith(base) || !Object.hasOwn(files,file)) throw Error('Only bundled runtime files are available.');
        return new Response(files[file],{headers:{'Content-Type':file.endsWith('.wasm')?'application/wasm':'application/octet-stream'}});
      };
      const py = await self.loadPyodide({indexURL:base,stdout:output,stderr:output});
      await py.runPythonAsync(data.code);
    } else {
      const {vm} = await self['ruby-wasm-wasi'].DefaultRubyVM(await WebAssembly.compile(files['ruby.wasm']));
      self.traceOutput = output;
      vm.eval("require 'js'\nrequire 'json'\nrequire 'set'\nclass CodefieldOutput\n def write(s); JS.global.call(:traceOutput,s) unless s == \"\\n\"; s.bytesize; end\n def puts(*a); a.each { |s| JS.global.call(:traceOutput,s.to_s) }; end\n def flush; end\nend\n$stdout = CodefieldOutput.new");
      vm.eval(data.code);
    }
    self.postMessage({output:lines.join('\n')});
  } catch (error) { self.postMessage({error:String(error.message || error).slice(0,3000),output:typeof self.capturedOutput==='function'?self.capturedOutput():''}); }
};

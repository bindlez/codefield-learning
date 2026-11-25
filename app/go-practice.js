function goCheckpoints(source) {
  // Short declarations are function-local. Only append a probe after a complete,
  // single-line expression so multiline literals and continuation lines survive.
  if (source.includes('`') || source.includes('/*') || source.includes('codefieldObserve')) return source;
  const lines=source.split('\n').map((line,index)=>{
    const m=/^(\s*)([a-zA-Z_]\w*)\s*:=\s*([\w.\s+*/%<>=!&|()\[\]-]+)$/.exec(line);
    if (!m || m[2]==='_' || !/[\w)\]]$/.test(m[3].trim()) || m[3].includes('//')) return line;
    return line+'\n'+m[1]+'codefieldObserve('+JSON.stringify('L'+(index+1)+' '+m[2])+', '+m[2]+')';
  });
  return 'import codefieldObserveAtomic "sync/atomic"\n'+lines.join('\n')+`
var codefieldObserveCount int64
func codefieldObserve(label string, value any) {
    if codefieldObserveAtomic.AddInt64(&codefieldObserveCount,1) > 120 { return }
    switch v := value.(type) {
    case int, float64, bool, string:
        fmt.Printf("[step] %s = %v\\n", label, v)
    default:
        fmt.Printf("[step] %s (%T)\\n", label, value)
    }
}`;
}
export function goScript(source,plan,trace=false){
  const type=t=>t?.endsWith('[]')?'[]'+type(t.slice(0,-2)):({integer:'int',double:'float64',boolean:'bool',string:'string'}[t]||'');
  if(!/^[A-Za-z_]\w*$/.test(plan?.functionName||'')||!plan.tests?.length||plan.params.some(p=>!type(p.type)||type(p.type).endsWith('[]')))return null;
  if(/\b(?:package|import)\b/.test(source))return null;
  const cases=plan.tests.map(test=>{
    if(test.args.length!==plan.params.length)throw Error('Example argument count does not match the signature.');
    const args=plan.params.map((p,i)=>`var arg${i} ${type(p.type)}; if err := json.Unmarshal([]byte(${JSON.stringify(JSON.stringify(test.args[i]))}), &arg${i}); err != nil { panic(err) }`).join('\n');
    return `{\n${args}\nvalue := ${plan.functionName}(${plan.params.map((_,i)=>'arg'+i).join(', ')})\nencoded, err := json.Marshal(value); if err != nil { panic(err) }; fmt.Println("__CODEFIELD_CASE__"+string(encoded))\n}`;
  });
  return 'package main\nimport ("encoding/json"; "fmt")\n'+(trace?goCheckpoints(source):source)+'\nfunc main(){\n'+cases.join('\n')+'\n}';
}

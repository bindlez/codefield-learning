// Deterministic templates: no model, execution, or guessed intent.
const supported=new Set(['javascript','ruby','python','rust','cpp','csharp','java','crystal','go','elixir']);
export function voiceExpression(text,language){
  if(/["']/.test(text))return text; // Literal text must never be rewritten.
  return text.replace(/\b(greater than or equal|less than or equal|not equals|equals equals|greater than|less than|plus|minus|times|modulo)\b/gi,m=>({'greater than or equal':'>=','less than or equal':'<=','not equals':'!=','equals equals':'==','greater than':'>','less than':'<','plus':'+','minus':'-','times':'*','modulo':'%'}[m.toLowerCase()]))
    .replace(/\b(true|false)\b/gi,m=>language==='python'?m[0].toUpperCase()+m.slice(1).toLowerCase():m.toLowerCase());
}
export function voiceCode(transcript,language){
  if(!supported.has(language))return null;
  const text=transcript.trim(),semi=['javascript','rust','cpp','csharp','java'].includes(language)?';':'';
  const expression=x=>voiceExpression(x,language);
  const declaration=/^(?:create )?(variable|constant) ([a-zA-Z_]\w*) equals (.+)$/i.exec(text);
  if(declaration){
    const [,kind,name,raw]=declaration,value=expression(raw);
    if(language==='elixir' && kind.toLowerCase()==='constant')return null;
    const prefix={javascript:kind.toLowerCase()==='constant'?'const ':'let ',rust:kind.toLowerCase()==='constant'?'let ':'let mut ',cpp:'auto ',csharp:'var ',java:'var ',ruby:'',python:'',crystal:'',go:kind.toLowerCase()==='constant'?'const ':'var ',elixir:''}[language];
    return {code:prefix+name+' = '+value+semi};
  }
  const assign=/^set ([a-zA-Z_]\w*) to (.+)$/i.exec(text);
  if(assign)return {code:assign[1]+' = '+expression(assign[2])+semi};
  const output=/^print expression (.+)$/i.exec(text);
  if(output){const x=expression(output[1]);return {code:({javascript:`console.log(${x});`,ruby:`puts ${x}`,python:`print(${x})`,rust:`println!("{}", ${x});`,cpp:`std::cout << ${x} << std::endl;`,csharp:`Console.WriteLine(${x});`,java:`System.out.println(${x});`,crystal:`puts ${x}`,go:`fmt.Println(${x})`,elixir:`IO.inspect(${x})`})[language]};}
  const ret=/^return expression (.+)$/i.exec(text);
  if(ret && language!=='elixir')return {code:'return '+expression(ret[1])+semi};
  const block=/^(if|while) condition (.+)$/i.exec(text);
  if(block){const keyword=block[1].toLowerCase(),x=expression(block[2]);
    if(language==='elixir' && keyword==='while')return null;
    const head=language==='python'?`${keyword} ${x}:`:['ruby','crystal'].includes(language)?`${keyword} ${x}`:language==='elixir'?`${keyword} ${x} do`:language==='go'?`${keyword==='while'?'for':keyword} ${x} {`:language==='rust'?`${keyword} ${x} {`:`${keyword} (${x}) {`;
    const tail=language==='python'?'':['ruby','crystal','elixir'].includes(language)?'\nend':'\n}';
    return {code:head+'\n  '+tail,caret:head.length+3};
  }
  const comment=/^comment (.+)$/i.exec(text);
  if(comment)return {code:(['ruby','python','crystal','elixir'].includes(language)?'# ':'// ')+comment[1]};
  return null;
}

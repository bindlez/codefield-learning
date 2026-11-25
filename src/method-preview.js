// Bounded, pure previews. Never evaluates learner code or calls its methods.
const missing=Symbol('unknown');
function literal(text){
  text=text.trim();
  if(text.length>4000||text.includes('#{'))return missing;
  if(/^"(?:[^"\\]|\\["\\nrt])*"$/.test(text)){try{return JSON.parse(text)}catch{return missing}}
  if(/^'[^'\\]*'$/.test(text))return text.slice(1,-1);
  if(/^-?\d+(?:\.\d+)?$/.test(text))return Number(text);
  if(/^\[[\s\d,.-]*\]$/.test(text)){try{const a=JSON.parse(text);return a.length<=200&&a.every(Number.isFinite)?a:missing}catch{return missing}}
  return missing;
}
const names={ruby:{chars:'chars',tally:'tally',join:'join',reverse:'reverse',uniq:'uniq',length:'length',size:'length',upcase:'upper',downcase:'lower'},python:{upper:'upper',lower:'lower',copy:'copy'},javascript:{toUpperCase:'upper',toLowerCase:'lower',slice:'copy',join:'join'},rust:{to_uppercase:'upper',to_lowercase:'lower',clone:'copy',len:'length',is_empty:'empty'},cpp:{size:'length',length:'length',empty:'empty'},java:{toUpperCase:'upper',toLowerCase:'lower',length:'length',isEmpty:'empty'},csharp:{ToUpperInvariant:'upper',ToLowerInvariant:'lower',Length:'length'},crystal:{chars:'chars',reverse:'reverse',uniq:'uniq',size:'length',upcase:'upper',downcase:'lower'}};
function transform(value,method,language){
  const op=names[language]?.[method];
  const str=typeof value==='string',arr=Array.isArray(value);
  // Non-ASCII case/length semantics differ by runtime and locale.
  if(str && /[^\x20-\x7e]/.test(value))return missing;
  if(language==='java'&&str&&((op==='upper'&&value.includes('i'))||(op==='lower'&&value.includes('I'))))return missing;
  if(op==='upper'&&str)return value.toUpperCase();
  if(op==='lower'&&str)return value.toLowerCase();
  if(op==='chars'&&str)return [...value];
  if(op==='join'&&arr&&value.every(item=>typeof item==='string'))return value.join(language==='javascript'?',':'');
  if(op==='reverse'&&(str||arr))return str?[...value].reverse().join(''):[...value].reverse();
  if(op==='length'&&(str||arr))return value.length;
  if(op==='empty'&&(str||arr))return value.length===0;
  if(op==='copy'&&(str||arr))return arr?[...value]:value;
  if(op==='uniq'&&arr)return [...new Set(value)];
  if(op==='tally'&&arr){const counts=Object.create(null);for(const item of value){if(typeof item!=='string')return missing;counts[item]=(counts[item]||0)+1;}return counts;}
  return missing;
}
export function methodPreview({source,caret=source.length,language,receiver,chain=[],method,observed}){
  const unavailable={available:false,reason:'Preview needs a known literal value and a supported call without arguments.'};
  if(!receiver||source.length>100000||chain.length>20)return unavailable;
  const prefix=source.slice(0,caret),lineStart=prefix.lastIndexOf('\n')+1;
  // Do not infer through control flow, aliases, calls, or possible mutations.
  const vars=new Map();
  const hasObservation=observed && Object.hasOwn(observed.values || {},receiver);
  if(hasObservation && /[;=]/.test(prefix.slice(lineStart)))return unavailable;
  if(!hasObservation)for(const line of prefix.slice(0,lineStart).split('\n')){
    if(!line.trim()||/^\s*(?:#|\/\/)/.test(line))continue;
    const m=line.match(/^\s*(?:(?:let|const|var|auto|string|String)\s+(?:mut\s+)?)?([A-Za-z_]\w*)\s*=\s*(.*?)\s*;?\s*$/);
    if(!m)return unavailable;
    const value=literal(m[2]);if(value===missing)return unavailable;vars.set(m[1],value);
  }
  let value=hasObservation?observed.values[receiver]:vars.has(receiver)?vars.get(receiver):literal(receiver);
  if(value===missing)return unavailable;
  // Completion contexts omit arguments; reject any nonempty call to avoid guessing.
  if(/\([^)]*\S[^)]*\)/.test(prefix.slice(lineStart).replace(/\(\s*\)/g,'')))return unavailable;
  for(const step of chain){value=transform(value,step,language);if(value===missing)return unavailable;}
  const before=value,after=transform(value,method,language);
  return after===missing?unavailable:{available:true,before,after,label:hasObservation?'Preview from '+observed.label:'Predicted from literals · code unchanged'};
}
export function previewText(result){return result.available?result.label+'\n'+JSON.stringify(result.before)+' → '+JSON.stringify(result.after):result.reason;}

// Predict only a complete, simple standalone chain using the same bounded rules.
export function expressionPreview(source,caret,language,observed){
  const prefix=source.slice(0,caret),line=prefix.slice(prefix.lastIndexOf('\n')+1).trim();
  if(!/^[A-Za-z_]\w*(?:\.[A-Za-z_]\w*[!?]?(?:\(\))?)+$/.test(line))return null;
  const parts=line.replace(/\(\)/g,'').split('.'),receiver=parts.shift(),method=parts.pop();
  const result=methodPreview({source,caret,language,receiver,chain:parts,method,observed});
  return result.available?{...result,expression:line}:null;
}

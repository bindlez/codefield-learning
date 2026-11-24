import {inferContext} from '../src/inference.js';
import {javascriptCompletion} from './js-methods.js';
import {rustMethods} from './rust-methods.js';
import {cppMethods} from './cpp-methods.js';
import {content} from './content.js';
import {rubyMethods} from './ruby-catalog.js';

export function sharedCompletion(language, source, caret, context, bindings = {}) {
  if (language === 'javascript') return javascriptCompletion({...context,source,caret,bindings});
  const inferred = inferContext(source,caret,language,context.receiver,context.chain);
  const type = inferred?.type || bindings[context.receiver];
  if (!type) return [];
  const docs = content[language]?.docs || [];
  const map = language === 'rust' ? rustMethods : language === 'cpp' ? cppMethods : {};
  const aliases = {String:['String','str'],Array:['Array','list'],Hash:['Hash','dict']};
  const owners = aliases[type] || [type];
  const names = new Set([...(map[type] || []),...docs.filter(doc=>owners.some(owner=>doc.name.startsWith(owner+'#') || doc.name.startsWith(owner+'.'))).map(doc=>doc.name.split(/[.#]/).at(-1).replace(/\(\)$/,''))]);
  if (language==='ruby' && type==='Set') for(const name of ['add','add?','include?','member?','delete','delete?','merge','subtract','union','intersection','difference','to_a','to_set','size','empty?','each','clear']) names.add(name);
  return [...names].filter(name=>name.startsWith(context.prefix || '')).sort().map(label=>({label,insert:label,detail:type+' method'}));
}

export async function completeWithRuntime(language,source,caret,context,bindings={}) {
  const fallback=sharedCompletion(language,source,caret,context,bindings);
  if(language!=='ruby') return fallback;
  const inferred=inferContext(source,caret,language,context.receiver,context.chain);
  const type=inferred?.type || bindings[context.receiver];
  if(!type || inferred?.unknown) return fallback;
  try {
    const names=await Promise.race([rubyMethods(type),new Promise(resolve=>setTimeout(()=>resolve(null),1000))]);
    if(!names) return fallback;
    return names.filter(name=>name.startsWith(context.prefix || '') && /^[a-zA-Z_]/.test(name)).map(label=>({label,insert:label,detail:type+' method'}));
  } catch { return fallback; }
}

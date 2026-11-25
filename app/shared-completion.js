import {inferContext,inferExpression} from '../src/inference.js';
import {javascriptCompletion} from './js-methods.js';
import {rustMethods} from './rust-methods.js';
import {cppMethods} from './cpp-methods.js';
import {content} from './content.js';
import {rubyMethods} from './ruby-catalog.js';
import {pythonMethods,pythonGuide} from './python-methods.js';
import {pythonDocs} from './python-catalog.js';

function resolveContext(language,source,caret,context,bindings) {
  const inferred=inferContext(source,caret,language,context.receiver,context.chain,bindings);
  if (inferred && !inferred.unknown) return inferred;
  if (!bindings[context.receiver]) return inferred;
  const expression=context.receiver+(context.chain || []).map(name=>name.startsWith('[')?name:'.'+name).join('');
  return inferExpression(expression,new Map(Object.entries(bindings)),language);
}

export function sharedCompletion(language, source, caret, context, bindings = {}) {
  const modules={go:{strings:['Contains','Count','Fields','HasPrefix','HasSuffix','Join','ReplaceAll','Split','ToLower','ToUpper','TrimSpace'],fmt:['Print','Printf','Println','Sprint','Sprintf'],slices:['Clone','Contains','Delete','Equal','Index','Insert','Reverse','Sort'],maps:['Clone','Copy','Equal'],strconv:['Atoi','Itoa','ParseFloat','ParseInt']},elixir:{Enum:['all?','any?','at','count','each','filter','find','flat_map','frequencies','group_by','join','map','max','min','reduce','reverse','sort','sum','take','uniq'],String:['contains?','downcase','graphemes','length','replace','reverse','split','trim','upcase'],Map:['delete','fetch','get','has_key?','keys','merge','put','values'],MapSet:['delete','difference','intersection','member?','new','put','size','to_list','union'],IO:['inspect','puts']}};
  if(modules[language]?.[context.receiver])return modules[language][context.receiver].filter(name=>name.startsWith(context.prefix||'')).map(label=>({label,insert:label,detail:context.receiver+' function',receiverType:context.receiver}));
  if (language === 'javascript') return javascriptCompletion({...context,source,caret,bindings});
  const inferred = resolveContext(language,source,caret,context,bindings);
  if (inferred?.unknown) return [];
  const type = inferred?.type || bindings[context.receiver];
  if (!type) return [];
  const docs = content[language]?.docs || [];
  const map = language === 'rust' ? rustMethods : language === 'cpp' ? cppMethods : language==='python' ? pythonMethods : {};
  const aliases = {String:['String','str'],Array:['Array','list'],Hash:['Hash','dict']};
  const owners = aliases[type] || [type];
  const names = new Set([...(map[type] || []),...docs.filter(doc=>owners.some(owner=>doc.name.startsWith(owner+'#') || doc.name.startsWith(owner+'.'))).map(doc=>doc.name.split(/[.#]/).at(-1).replace(/\(\)$/,''))]);
  if (language==='ruby' && type==='Set') for(const name of ['add','add?','include?','member?','delete','delete?','merge','subtract','union','intersection','difference','to_a','to_set','size','empty?','each','clear']) names.add(name);
  if (language==='ruby' && ['Array','Hash','Set'].includes(type)) for(const name of ['tally','map','select','filter','find','count','each','reduce','group_by','any?','all?','none?']) names.add(name);
  return [...names].filter(name=>name.startsWith(context.prefix || '')).sort().map(label=>({label,insert:label,detail:language==='python'?pythonGuide(label).description:type+' method',receiverType:type}));
}

export async function completeWithRuntime(language,source,caret,context,bindings={}) {
  const fallback=sharedCompletion(language,source,caret,context,bindings);
  if(language==='python'){
    const inferred=resolveContext(language,source,caret,context,bindings);
    const type=inferred?.type || bindings[context.receiver];
    if(!type || inferred?.unknown)return fallback;
    try{
      const docs=await Promise.race([pythonDocs(type),new Promise(resolve=>setTimeout(()=>resolve(null),1000))]);
      if(!docs)return fallback;
      return Object.keys(docs).filter(name=>name.startsWith(context.prefix || '')).sort().map(label=>({label,insert:label,detail:docs[label].split('\n')[0] || type+' method',receiverType:type}));
    }catch{return fallback;}
  }
  if(language!=='ruby') return fallback;
  const inferred=resolveContext(language,source,caret,context,bindings);
  const type=inferred?.type || bindings[context.receiver];
  if(!type || inferred?.unknown) return fallback;
  try {
    const names=await Promise.race([rubyMethods(type),new Promise(resolve=>setTimeout(()=>resolve(null),1000))]);
    if(!names) return fallback;
    return names.filter(name=>name.startsWith(context.prefix || '') && /^[a-zA-Z_]/.test(name)).map(label=>({label,insert:label,detail:type+' method',receiverType:type}));
  } catch { return fallback; }
}

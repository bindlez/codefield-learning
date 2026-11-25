import {completeWithRuntime} from './shared-completion.js';
import {documentationUrl} from './documentation.js';
import {officialGuide} from './official-guide.js';
import {pythonDocs} from './python-catalog.js';
import {rubyMethods} from './ruby-catalog.js';

// Input is data, never evaluated as source code.
export function parseExploreValue(input) {
  const text=String(input).trim();
  if(text.length>2000) throw Error('Use a value shorter than 2,000 characters.');
  let value;
  try { value=JSON.parse(text); }
  catch { if(/^'[^'\\]*'$/.test(text)) value=text.slice(1,-1); else throw Error('Enter a quoted string, a number, or an array such as [1, 2, 3].'); }
  if(typeof value==='string' || typeof value==='number' && Number.isFinite(value)) return value;
  if(Array.isArray(value) && value.length<=100 && value.every(v=>typeof v==='string' || typeof v==='number' && Number.isFinite(v)))return value;
  throw Error('Try a string, a number, or an array of strings and numbers (up to 100 items).');
}
const definition={
  upper:{label:'Make uppercase',description:'Changes lowercase letters to uppercase. The original value stays the same.',methods:{ruby:'upcase',python:'upper',javascript:'toUpperCase'},run:v=>v.toUpperCase()},
  lower:{label:'Make lowercase',description:'Changes uppercase letters to lowercase. The original value stays the same.',methods:{ruby:'downcase',python:'lower',javascript:'toLowerCase'},run:v=>v.toLowerCase()},
  reverseText:{label:'Reverse characters',description:'Reads the characters in reverse order and returns a new string.',methods:{ruby:'reverse'},run:v=>[...v].reverse().join('')},
  chars:{label:'Break into characters',description:'Makes an array containing one character per item.',methods:{ruby:'chars'},run:v=>[...v]},
  contains:{label:'Find text inside',description:'Checks whether the string contains the text you enter. The result is true or false.',methods:{ruby:'include?',python:'in',javascript:'includes'},argument:'"e"',run:(v,arg)=>v.includes(arg)},
  split:{label:'Split into pieces',description:'Cuts the string at each separator and returns the pieces as an array.',methods:{ruby:'split',python:'split',javascript:'split'},argument:'","',run:(v,arg,language)=>{const parts=v.split(arg);if(language==='ruby')while(parts.length && parts.at(-1)==='')parts.pop();return parts;}},
  strLength:{label:'Count characters',description:'Counts the characters in the string.',methods:{ruby:'length',python:'__len__',javascript:'length'},run:v=>v.length},
  arrLength:{label:'Count items',description:'Counts the number of items in the array.',methods:{ruby:'length',python:'__len__',javascript:'length'},run:v=>v.length},
  arrReverse:{label:'Reverse the order',description:'Changes the order of items from last to first.',methods:{ruby:'reverse',python:'reversed',javascript:'reverse'},run:v=>[...v].reverse()},
  unique:{label:'Keep unique items',description:'Keeps the first occurrence of each item and removes later duplicates.',methods:{ruby:'uniq'},run:v=>[...new Set(v)]},
  sum:{label:'Add the items',description:'Adds all numbers together and returns the total.',methods:{ruby:'sum',python:'sum'},run:v=>v.reduce((a,b)=>a+b,0),numbers:true,safeSum:true},
  double:{label:'Double every item',description:'Visits each number and builds a new array containing twice its value. This is a map: one input produces one output.',methods:{ruby:'map',python:'list comprehension',javascript:'map'},run:v=>v.map(n=>n*2),numbers:true,safeNumbers:true},
  keepEven:{label:'Keep even numbers',description:'Tests each number and builds a new array containing only the even ones. This is a filter.',methods:{ruby:'select',python:'list comprehension',javascript:'filter'},run:v=>v.filter(n=>n%2===0),numbers:true,safeNumbers:true},
  first:{label:'Get the first item',description:'Returns the first item without changing the array. An empty array has no first item.',methods:{ruby:'first'},run:v=>v.length?v[0]:null},
  last:{label:'Get the last item',description:'Returns the last item without changing the array. An empty array has no last item.',methods:{ruby:'last'},run:v=>v.length?v[v.length-1]:null},
  abs:{label:'Absolute value',description:'Returns the distance from zero, removing a negative sign.',methods:{ruby:'abs',python:'abs',javascript:'abs'},run:v=>Math.abs(v)},
  even:{label:'Check if even',description:'Returns true when the integer is divisible by two, otherwise false.',methods:{ruby:'even?'},run:v=>v%2===0,integer:true},
  odd:{label:'Check if odd',description:'Returns true when the integer is not divisible by two, otherwise false.',methods:{ruby:'odd?'},run:v=>v%2!==0,integer:true}
};
export function exploreOperations(value,language) {
  const isString=typeof value==='string',isArray=Array.isArray(value);
  const keys=isString?['upper','lower','contains','split','reverseText','chars','strLength']:isArray?['arrLength','double','keepEven','arrReverse','unique','sum','first','last']:['abs','even','odd'];
  return keys.flatMap(key=>{
    const item=definition[key],method=item.methods[language];
    if(!method || item.numbers && !value.every(v=>typeof v==='number') || item.safeNumbers && !value.every(v=>Number.isSafeInteger(v) && Math.abs(v)<=Number.MAX_SAFE_INTEGER/2) || item.safeSum && (!value.every(Number.isSafeInteger) || value.reduce((sum,n)=>sum+Math.abs(n),0)>Number.MAX_SAFE_INTEGER) || item.integer && !Number.isSafeInteger(value))return [];
    // Unicode case conversion and length differ between language runtimes.
    if(isString && /[^\x20-\x7e]/.test(value))return [];
    const argument=item.argument===undefined?undefined:JSON.parse(item.argument);
    return [{...item,key,method,after:item.run(value,argument,language),mutates:language==='javascript' && key==='arrReverse'}];
  });
}
function expression(input,op,language,argument){
  const arg=argument===undefined?'':JSON.stringify(argument).replace(/#\{/g,language==='ruby'?'\\#{':'#{');
  if(op.key==='double')return language==='ruby'?`${input}.map { |n| n * 2 }`:language==='python'?`[n * 2 for n in ${input}]`:`${input}.map(n => n * 2)`;
  if(op.key==='keepEven')return language==='ruby'?`${input}.select { |n| n.even? }`:language==='python'?`[n for n in ${input} if n % 2 == 0]`:`${input}.filter(n => n % 2 === 0)`;
  if(op.key==='contains' && language==='python')return `${arg} in ${input}`;
  if(op.method==='__len__')return `len(${input})`;
  if(op.method==='reversed')return `list(reversed(${input}))`;
  if(op.method==='sum' && language==='python')return `sum(${input})`;
  if(op.method==='abs' && language==='python')return `abs(${input})`;
  if(op.method==='abs' && language==='javascript')return `Math.abs(${input})`;
  if(language==='javascript' && op.method==='length')return `${input}.length`;
  return `${input}.${op.method}${op.argument!==undefined?`(${arg})`:language==='ruby'?'':'()'}`;
}
function shown(value){return JSON.stringify(value,null,2);}
export function mountValueExplorer(host,language,getEditor){
  const panel=document.createElement('details');panel.className='value-explorer';
  panel.innerHTML=`<summary><span>Explore a value</span><small>See what methods do, step by step</small></summary><div class="vx-body"><p>Start with a value. Choose an operation to see what goes in, what comes out, and code you can use.</p><div class="vx-input"><label>Your value <input class="vx-value" value='"hello"' spellcheck="false" placeholder='"hello", 12, or [1, 2, 3]'></label><button type="button" class="vx-explore">Explore</button></div><div class="vx-error" role="status"></div><div class="vx-content" hidden><div class="vx-heading"><div><small>YOUR VALUE</small><strong class="vx-type"></strong></div><code class="vx-original"></code></div><div class="vx-grid"><div><h3>Try an operation</h3><p class="vx-hint">Choose a card to see the result.</p><div class="vx-operations"></div><details class="vx-more"><summary>Browse more methods</summary><input class="vx-search" type="search" placeholder="Search methods" aria-label="Search available methods"><div class="vx-methods"></div></details></div><div class="vx-detail" aria-live="polite"><p>Choose an operation to see how it changes your value.</p></div></div></div></div>`;
  host.before(panel);
  const $=s=>panel.querySelector(s), input=$('.vx-value'),ops=$('.vx-operations'),detail=$('.vx-detail'),list=$('.vx-methods');
  let value,methods=[],revision=0,detailRevision=0;
  const text=(tag,content,cls)=>{const node=document.createElement(tag);node.textContent=content;if(cls)node.className=cls;return node;};
  function showOperation(op,argument=op.argument===undefined?undefined:JSON.parse(op.argument)){
    detailRevision++;
    for(const button of ops.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.key===op.key));
    detail.replaceChildren();
    detail.append(text('small','WHAT IT DOES'),text('h3',op.label),text('p',op.description));
    if(op.argument!==undefined){
      const label=text('label',op.key==='split'?'Separator (quoted text)':'Text to find (quoted text)');
      const field=document.createElement('input');field.value=JSON.stringify(argument);field.setAttribute('aria-label',label.textContent);
      const apply=text('button','Update example');apply.type='button';
      const error=text('p','','vx-error');error.setAttribute('role','status');
      apply.onclick=()=>{try{const next=JSON.parse(field.value);if(typeof next!=='string' || op.key==='split' && (!next || language==='ruby' && next===' '))throw Error();showOperation(op,next);}catch{error.textContent=op.key==='split'?'Enter a quoted, non-empty separator. Ruby space separators have special behavior.':'Enter quoted text, such as "hello".';}};
      label.append(field);detail.append(label,apply,error);
    }
    const flow=document.createElement('div');flow.className='vx-flow';
    for(const [label,v] of [['BEFORE',value],['AFTER',op.run(value,argument,language)]]){const box=document.createElement('div');box.append(text('small',label),text('pre',v===null?(language==='ruby'?'nil':language==='python'?'None':'null'):language==='python' && typeof v==='boolean'?(v?'True':'False'):shown(v)));flow.append(box);}
    detail.append(flow,text('p',op.mutates?'This method changes the original array in JavaScript.':'The original value is unchanged by this example.','vx-note'));
    if(op.key==='double' || op.key==='keepEven'){
      const steps=document.createElement('div');steps.className='vx-steps';steps.append(text('small','EACH ITEM'));
      for(const n of value)steps.append(text('span',op.key==='double'?`${n} → ${n*2}`:`${n} → ${n%2===0?'kept':'skipped'}`));
      if(!value.length)steps.append(text('span','No items to visit.'));
      detail.append(steps);
    }
    let literal=JSON.stringify(value).replace(/#\{/g,language==='ruby'?'\\#{':'#{');
    if(language==='ruby' && typeof value==='number' && value<0)literal='('+literal+')';
    const code=expression(literal,op,language,argument),codeBox=text('pre',code,'vx-code');detail.append(text('small','TRY IT IN YOUR CODE'),codeBox);
    const actions=document.createElement('div');actions.className='vx-actions';
    const insert=text('button','Insert code');insert.type='button';insert.onclick=()=>getEditor().insert(code);
    const link=text('a','Read official documentation');link.href=documentationUrl(language,typeOf(value),op.method);link.target='_blank';link.rel='noopener noreferrer';
    const result=op.run(value,argument,language);
    if(typeof result==='string'||typeof result==='number'||Array.isArray(result)){const use=text('button','Explore result');use.type='button';use.onclick=()=>{input.value=JSON.stringify(result);explore();};actions.append(use);}
    actions.append(insert,link);detail.append(actions);
  }
  function typeOf(v){return Array.isArray(v)?'Array':typeof v==='string'?'String':Number.isInteger(v)?'Integer':'Float';}
  function renderMethods(){
    list.replaceChildren();const query=$('.vx-search').value.toLowerCase();
    const filtered=methods.filter(item=>item.label.toLowerCase().includes(query));
    for(const item of filtered){const button=text('button',item.label);button.type='button';button.onclick=()=>showMethod(item);list.append(button);}
    if(!filtered.length)list.append(text('p',methods.length?'No matching methods.':'No additional methods available for this type.'));
  }
  async function showMethod(item){
    const turn=++detailRevision;detail.replaceChildren(text('small','METHOD'),text('h3',item.label),text('p',item.detail || 'See the official reference for arguments, return values and examples.'));
    if(item.preview?.signature)detail.append(text('pre',item.preview.signature,'vx-code'));
    if(item.preview?.example)detail.append(text('small','EXAMPLE'),text('pre',item.preview.example,'vx-code'));
    if(item.preview?.returns)detail.append(text('p','Returns: '+item.preview.returns,'vx-note'));
    detail.append(text('p','A visual preview is not available for this method yet. Read its documentation before using it.','vx-note'));
    const link=text('a','Read official documentation');link.href=documentationUrl(language,typeOf(value),item.label);link.target='_blank';link.rel='noopener noreferrer';detail.append(link);
    const reference=language==='python'?(await pythonDocs(typeOf(value)).catch(()=>({})))[item.label]:await officialGuide(language,typeOf(value),item.label).catch(()=>null);
    if(turn!==detailRevision || !reference)return;
    const guide=typeof reference==='string'?reference:[reference.signature,reference.description].filter(Boolean).join('\n');
    detail.insertBefore(text('pre',guide,'vx-doc'),detail.lastChild);
  }
  async function explore(){
    const turn=++revision;detailRevision++;try{value=parseExploreValue(input.value);}catch(error){$('.vx-error').textContent=error.message;$('.vx-content').hidden=true;return;}
    $('.vx-error').textContent='';$('.vx-content').hidden=false;$('.vx-type').textContent=typeOf(value);$('.vx-original').textContent=shown(value);ops.replaceChildren();methods=[];renderMethods();
    const available=exploreOperations(value,language);
    for(const op of available){const button=document.createElement('button');button.type='button';button.dataset.key=op.key;button.append(text('strong',op.label),text('code',op.method));button.onclick=()=>showOperation(op);ops.append(button);}
    if(available.length)showOperation(available[0]);else detail.replaceChildren(text('p','Visual previews are not available for this value and language yet. Browse the available methods below.'));
    const type=typeOf(value),lookupType=language==='javascript' && (type==='Integer'||type==='Float')?'Number':type;
    try {
      const result=await completeWithRuntime(language,'',0,{receiver:'__value',chain:[],prefix:''},{__value:lookupType});
      if(turn!==revision)return;methods=result;renderMethods();
      // The live runtime may take longer than the completion popup's short timeout.
      if(language==='ruby'){
        const names=await rubyMethods(type);if(turn!==revision)return;
        methods=names.map(label=>({label,detail:type+' method'}));renderMethods();
      } else if(language==='python'){
        const docs=await pythonDocs(type);if(turn!==revision)return;
        methods=Object.keys(docs).map(label=>({label,detail:docs[label].split('\n')[0] || type+' method'}));renderMethods();
      }
    }catch{}
  }
  $('.vx-explore').onclick=explore;input.addEventListener('input',()=>{revision++;detailRevision++;$('.vx-content').hidden=true;$('.vx-error').textContent='Press Explore to see this value.';});input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();explore();}});$('.vx-search').oninput=renderMethods;
  panel.addEventListener('toggle',()=>{if(panel.open && value===undefined)explore();});
  return ()=>{revision++;panel.remove();};
}

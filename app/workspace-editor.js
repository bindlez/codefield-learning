import {createEditor as mountInput} from '../src/editor.js';
import {inferVariables,inferContext} from '../src/inference.js';
import {completeWithRuntime} from './shared-completion.js';
import {content} from './content.js';
import {methodGuide} from './method-guides.js';
import {tokenizers} from './languages.js';
import {modelPanel} from './model-panel.js';
import {rubyMethods} from './ruby-catalog.js';
import {officialGuide} from './official-guide.js';
import {documentationUrl} from './documentation.js';
import {pythonDocs} from './python-catalog.js';
import {pythonGuide} from './python-methods.js';

export function createEditor(target,options) {
  const host=typeof target==='string'?document.querySelector(target):target;
  const language=options.language;
  const docs=content[language]?.docs || [];
  const tools=document.createElement('details');
  tools.className='shared-editor-tools';
  tools.innerHTML='<summary>Editor tools</summary><div class="edit-actions"><input type="search" aria-label="Find code" placeholder="Find in code"><button type="button">Find next</button><button type="button">Indent</button><button type="button">Undo</button><button type="button">Redo</button><button type="button">Download</button></div><p class="editor-symbols"></p><div class="editor-reference"><select aria-label="Quick reference"></select><pre aria-live="polite"></pre><a target="_blank" rel="noopener noreferrer">Official reference ↗</a></div>';
  const picker=tools.querySelector('select'), detail=tools.querySelector('pre');
  picker.add(new Option('Method reference',''));
  for(const doc of docs) picker.add(new Option(doc.name,doc.name));
  let referenceType='';
  function inspect(name) {
    const doc=docs.find(d=>d.name===name || d.name.split(/[.#]/).at(-1)===name);
    const method=doc?.name.split(/[.#]/).at(-1) || name;
    if(!method)return;
    if(doc)picker.value=doc.name;
    const guide=language==='python'?pythonGuide(method):methodGuide(language,method,doc);
    detail.textContent=[doc?.name || method,guide.description,guide.example].filter(Boolean).join('\n');
    tools.querySelector('.editor-reference a').href=documentationUrl(language,referenceType,method);
    officialGuide(language,referenceType,method).then(reference=>{
      if(reference && detail.isConnected && (picker.value===name || !picker.value))detail.textContent=[reference.signature || method,reference.description,reference.source].filter(Boolean).join('\n');
    });
    if(language==='python' && referenceType)pythonDocs(referenceType).then(docs=>{if(docs[method] && detail.isConnected && (picker.value===name || !picker.value))detail.textContent=method+'\n'+docs[method]+'\nPython built-in documentation';}).catch(()=>{});
  }
  let selectionRevision=0;
  async function listRubyMethods(name,parent) {
    if(language!=='ruby')return;
    const revision=++selectionRevision;
    const code=editor.getValue(),caret=editor.getCaret();
    const receiver=parent?.receiver || name;
    const inferred=inferContext(code,caret,'ruby',receiver,parent?.chain || []);
    if(!inferred || inferred.unknown)return;
    referenceType=inferred.type;
    try {
      const methods=await rubyMethods(inferred.type);
      if(revision!==selectionRevision || code!==editor.getValue() || !host.isConnected)return;
      picker.replaceChildren(new Option(inferred.type+' methods',''),...methods.filter(n=>/^[a-zA-Z_]/.test(n)).map(n=>new Option(n,n)));
      detail.textContent='Select a '+inferred.type+' method to explore it.';
    } catch { /* Keep the local reference available if Ruby cannot load. */ }
  }
  picker.onchange=()=>inspect(picker.value);
  let model;
  const editor=mountInput(host,{...options,tokenize:tokenizers[language] || options.tokenize,
    complete:options.complete || (ctx=>completeWithRuntime(language,editor.getValue(),editor.getCaret(),ctx)),
    onCompletionHighlight:item=>{if(item?.label && !options.playground){inspect(item.label);tools.open=true;}options.onCompletionHighlight?.(item);},
    onSelection:(name,parent)=>{inspect(name);listRubyMethods(name,parent);model?.select(name);options.onSelection?.(name,parent);},
    onChange:(value,info)=>{options.onChange?.(value,info);model?.schedule();if(tools.open) renderMap();},
    onSetValue:value=>{options.onSetValue?.(value);model?.schedule();}
  });
  function renderMap() {
    const symbols=tools.querySelector('.editor-symbols');
    symbols.replaceChildren();
    for(const [name,type] of inferVariables(editor.getValue(),editor.getValue().length,language)){
      const button=document.createElement('button'); button.type='button';button.textContent=name+' · '+type;
      button.onclick=()=>editor.find(name);symbols.append(button);
    }
  }
  if(!options.minimal && !options.playground) host.before(tools);
  if(!options.minimal) model=modelPanel(host,language,()=>editor,name=>{inspect(name);if(!options.playground)tools.open=true;},!!options.modelOpen);
  if(options.modelOpen) model?.schedule();
  tools.ontoggle=()=>{if(tools.open) renderMap();};
  const [find,indent,undo,redo,download]=tools.querySelectorAll('.edit-actions button');
  find.onclick=()=>editor.find(tools.querySelector('input').value);
  indent.onclick=()=>editor.insert('  '); undo.onclick=()=>editor.undo();redo.onclick=()=>editor.redo();
  download.onclick=()=>{
    const url=URL.createObjectURL(new Blob([editor.getValue()],{type:'text/plain'}));
    const link=document.createElement('a');link.href=url;link.download=content[language]?.filename||'solution.txt';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const destroy=editor.destroy;
  editor.destroy=()=>{selectionRevision++;tools.remove();model?.destroy();destroy();};
  return editor;
}

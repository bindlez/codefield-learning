import {createEditor as mountInput} from '../src/editor.js';
import {inferVariables,inferContext} from '../src/inference.js';
import {completeWithRuntime} from './shared-completion.js';
import {content} from './content.js';
import {methodGuide} from './method-guides.js';
import {tokenizers} from './languages.js';
import {modelPanel} from './model-panel.js';
import {officialGuide} from './official-guide.js';
import {documentationUrl} from './documentation.js';
import {pythonDocs} from './python-catalog.js';
import {pythonGuide} from './python-methods.js';
import {completionContext} from '../src/completion.js';
import {methodPreview,previewText} from '../src/method-preview.js';
import {mountFileManager} from './file-manager.js';

export function createEditor(target,options) {
  const host=typeof target==='string'?document.querySelector(target):target;
  const language=options.language;
  const docs=content[language]?.docs || [];
  const tools=document.createElement('details');
  tools.className='shared-editor-tools';
  tools.innerHTML='<summary>Editor tools</summary><div class="edit-actions"><input type="search" aria-label="Find code" placeholder="Find in code"><button type="button">Find next</button><button type="button">Indent</button><button type="button">Undo</button><button type="button">Redo</button><button type="button">Download</button></div><p class="editor-symbols"></p><div class="editor-reference"><select aria-label="Quick reference"></select><pre aria-live="polite"></pre><a target="_blank" rel="noopener noreferrer">Official reference ↗</a></div>';
  const picker=tools.querySelector('select'), detail=tools.querySelector('pre');
  const preview=document.createElement('pre');preview.className='method-value-preview';preview.setAttribute('aria-live','polite');tools.append(preview);
  let previewContext=null;
  picker.add(new Option('Method reference',''));
  for(const doc of docs) picker.add(new Option(doc.name,doc.name));
  let referenceType='';
  let detailRevision=0;
  function inspect(name,completionItem) {
    if(typeof name!=='string' || /\s/.test(name) || name.length>80)return;
    const doc=docs.find(d=>d.name===name || d.name.split(/[.#]/).at(-1)===name);
    const method=doc?.name.split(/[.#]/).at(-1) || name;
    if(!method)return;
    const currentDetail=++detailRevision;
    const context=completionContext(editor.getValue(),editor.getCaret()) || previewContext;
    preview.textContent=previewText(methodPreview({source:editor.getValue(),caret:editor.getCaret(),language,receiver:context?.receiver,chain:context?.chain || [],method}));
    if(doc)picker.value=doc.name;
    const guide=completionItem?.preview || (language==='python'?pythonGuide(method):methodGuide(language,method,doc));
    let signature=guide.signature || doc?.name || method,description=guide.description || '',example=guide.example || '';
    detail.textContent=[doc?.name || method,guide.description,guide.example].filter(Boolean).join('\n');
    tools.querySelector('.editor-reference a').href=documentationUrl(language,referenceType,method);
    const publish=()=>options.onReferenceUpdate?.({method,type:referenceType,signature,description,example,preview:preview.textContent,url:tools.querySelector('.editor-reference a').href});
    publish();
    officialGuide(language,referenceType,method).then(reference=>{
      if(reference && currentDetail===detailRevision && detail.isConnected){signature=reference.signature || signature;description=reference.description || description;detail.textContent=[signature,description,reference.source].filter(Boolean).join('\n');publish();}
    });
    if(language==='python' && referenceType)pythonDocs(referenceType).then(docs=>{if(docs[method] && currentDetail===detailRevision && detail.isConnected){description=docs[method];detail.textContent=method+'\n'+description+'\nPython built-in documentation';publish();}}).catch(()=>{});
  }
  let selectionRevision=0;
  async function listMethods(name,parent) {
    const revision=++selectionRevision;
    const code=editor.getValue(),caret=editor.getCaret();
    const receiver=parent?.receiver || name;
    const inferred=inferContext(code,caret,language,receiver,parent?.chain || []);
    const bindings=options.getBindings?.() || {};
    try {
      const completions=await completeWithRuntime(language,code,caret,{receiver,chain:parent?.chain || [],prefix:''},bindings);
      const methods=completions.map(item=>item.label);
      if(revision!==selectionRevision || code!==editor.getValue() || !host.isConnected)return;
      if(!methods.length)return;
      referenceType=completions[0]?.receiverType || inferred?.type || bindings[receiver] || '';
      picker.replaceChildren(new Option((referenceType || 'Available')+' methods',''),...methods.filter(n=>/^[a-zA-Z_]/.test(n)).map(n=>new Option(n,n)));
      detail.textContent='Select a '+(referenceType || 'matching')+' method to explore it.';
      options.onReferenceMethods?.(completions,{receiver,chain:parent?.chain || []});
    } catch { /* Keep the local reference available if Ruby cannot load. */ }
  }
  picker.onchange=()=>inspect(picker.value);
  let model;
  const editor=mountInput(host,{...options,tokenize:tokenizers[language] || options.tokenize,
    complete:options.complete || (async ctx=>{
      const items=await completeWithRuntime(language,editor.getValue(),editor.getCaret(),ctx,options.getBindings?.() || {});
      if(!options.completionOverlay)return items;
      return items.map(item=>{
        const doc=docs.find(entry=>entry.name.split(/[.#]/).at(-1)===item.label);
        const guide=language==='python'?pythonGuide(item.label):methodGuide(language,item.label,doc);
        return {...item,detail:item.preview?.description || (language==='ruby'?guide.description:item.detail || guide.description)};
      });
    }),
    onCompletionHighlight:item=>{if(item?.label && !options.playground){referenceType=item.receiverType || item.preview?.owner || referenceType;inspect(item.label,item);if(!options.onReferenceUpdate)tools.open=true;}options.onCompletionHighlight?.(item);},
    onSelection:(name,parent)=>{previewContext=parent || {receiver:name,chain:[]};inspect(name);listMethods(name,parent);model?.select(name);options.onSelection?.(name,parent);},
    onChange:(value,info)=>{previewContext=null;preview.textContent='Highlight a method to preview the updated code.';options.onChange?.(value,info);model?.schedule();if(tools.open) renderMap();},
    onSetValue:value=>{previewContext=null;preview.textContent='Highlight a method to preview the updated code.';options.onSetValue?.(value);model?.schedule();}
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
  const removeFiles = options.minimal ? () => {} : mountFileManager(host, language, () => editor);
  if(!options.minimal) model=modelPanel(host,language,()=>editor,name=>{inspect(name);if(!options.playground && !options.onReferenceUpdate)tools.open=true;},!!options.modelOpen,!!options.compactModel);
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
  editor.inspectMethod=(name,type,item)=>{referenceType=type || referenceType;inspect(name,item);};
  editor.destroy=()=>{selectionRevision++;detailRevision++;removeFiles();tools.remove();model?.destroy();destroy();};
  return editor;
}

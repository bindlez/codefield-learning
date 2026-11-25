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
  function inspect(name) {
    const doc=docs.find(d=>d.name===name || d.name.split(/[.#]/).at(-1)===name);
    const method=doc?.name.split(/[.#]/).at(-1) || name;
    if(!method)return;
    const currentDetail=++detailRevision;
    const context=completionContext(editor.getValue(),editor.getCaret()) || previewContext;
    preview.textContent=previewText(methodPreview({source:editor.getValue(),caret:editor.getCaret(),language,receiver:context?.receiver,chain:context?.chain || [],method}));
    if(doc)picker.value=doc.name;
    const guide=language==='python'?pythonGuide(method):methodGuide(language,method,doc);
    detail.textContent=[doc?.name || method,guide.description,guide.example].filter(Boolean).join('\n');
    tools.querySelector('.editor-reference a').href=documentationUrl(language,referenceType,method);
    officialGuide(language,referenceType,method).then(reference=>{
      if(reference && currentDetail===detailRevision && detail.isConnected)detail.textContent=[reference.signature || method,reference.description,reference.source].filter(Boolean).join('\n');
    });
    if(language==='python' && referenceType)pythonDocs(referenceType).then(docs=>{if(docs[method] && currentDetail===detailRevision && detail.isConnected)detail.textContent=method+'\n'+docs[method]+'\nPython built-in documentation';}).catch(()=>{});
  }
  let selectionRevision=0;
  async function listMethods(name,parent) {
    const revision=++selectionRevision;
    const code=editor.getValue(),caret=editor.getCaret();
    const receiver=parent?.receiver || name;
    const inferred=inferContext(code,caret,language,receiver,parent?.chain || []);
    if(!inferred || inferred.unknown)return;
    referenceType=inferred.type;
    try {
      const methods=language==='ruby' ? await rubyMethods(inferred.type) : (await completeWithRuntime(language,code,caret,{receiver,chain:parent?.chain || [],prefix:''})).map(item=>item.label);
      if(revision!==selectionRevision || code!==editor.getValue() || !host.isConnected)return;
      if(!methods.length)return;
      picker.replaceChildren(new Option(inferred.type+' methods',''),...methods.filter(n=>/^[a-zA-Z_]/.test(n)).map(n=>new Option(n,n)));
      detail.textContent='Select a '+inferred.type+' method to explore it.';
    } catch { /* Keep the local reference available if Ruby cannot load. */ }
  }
  picker.onchange=()=>inspect(picker.value);
  let model;
  const editor=mountInput(host,{...options,tokenize:tokenizers[language] || options.tokenize,
    complete:options.complete || (ctx=>completeWithRuntime(language,editor.getValue(),editor.getCaret(),ctx)),
    onCompletionHighlight:item=>{if(item?.label && !options.playground){referenceType=item.receiverType || referenceType;inspect(item.label);tools.open=true;}options.onCompletionHighlight?.(item);},
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
  editor.destroy=()=>{selectionRevision++;detailRevision++;removeFiles();tools.remove();model?.destroy();destroy();};
  return editor;
}

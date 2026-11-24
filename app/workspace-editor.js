import {createEditor as mountInput} from '../src/editor.js';
import {inferVariables} from '../src/inference.js';
import {sharedCompletion} from './shared-completion.js';
import {content} from './content.js';
import {methodGuide} from './method-guides.js';
import {tokenizers} from './languages.js';
import {modelPanel} from './model-panel.js';

export function createEditor(target,options) {
  const host=typeof target==='string'?document.querySelector(target):target;
  const language=options.language;
  const docs=content[language]?.docs || [];
  const tools=document.createElement('details');
  tools.className='shared-editor-tools';
  tools.innerHTML='<summary>Editor tools</summary><div class="edit-actions"><input type="search" aria-label="Find code" placeholder="Find in code"><button type="button">Find next</button><button type="button">Indent</button><button type="button">Undo</button><button type="button">Redo</button><button type="button">Download</button></div><p class="editor-symbols"></p><div class="editor-reference"><select aria-label="Quick reference"></select><pre aria-live="polite"></pre></div>';
  const picker=tools.querySelector('select'), detail=tools.querySelector('pre');
  picker.add(new Option('Method reference',''));
  for(const doc of docs) picker.add(new Option(doc.name,doc.name));
  function inspect(name) {
    const doc=docs.find(d=>d.name===name || d.name.split(/[.#]/).at(-1)===name);
    if(!doc) return;
    picker.value=doc.name;
    const guide=methodGuide(language,doc.name.split(/[.#]/).at(-1),doc);
    detail.textContent=[doc.name,guide.description,guide.example].filter(Boolean).join('\n');
  }
  picker.onchange=()=>inspect(picker.value);
  let model;
  const editor=mountInput(host,{...options,tokenize:tokenizers[language] || options.tokenize,
    complete:options.complete || (ctx=>sharedCompletion(language,editor.getValue(),editor.getCaret(),ctx)),
    onSelection:(name,parent)=>{inspect(name);model?.select(name);options.onSelection?.(name,parent);},
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
  editor.destroy=()=>{tools.remove();model?.destroy();destroy();};
  return editor;
}

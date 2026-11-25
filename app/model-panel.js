export function modelPanel(host,language,getEditor,onInspect,expanded=false) {
  const panel=document.createElement('details');
  panel.className='shared-editor-tools semantic-panel'; panel.open=expanded;
  panel.innerHTML='<summary>Code Model</summary><div class="model-items"></div><pre class="model-detail" aria-live="polite"></pre><div class="model-transform" aria-label="Transformation steps"></div>';
  host.before(panel);
  const items=panel.querySelector('.model-items'),detail=panel.querySelector('pre'),transform=panel.querySelector('.model-transform');
  let worker,timer,revision=0,graph,selected='';
  function display(node) {
    if(!node)return;
    selected=node.name || node.source;
    const parents=graph.edges.filter(e=>e.to===node.id).map(e=>graph.nodes.find(n=>n.id===e.from)?.source);
    detail.textContent=[node.source,[node.confidence,node.type,node.scope].filter(Boolean).join(' · '),node.value===undefined?'Value unknown':JSON.stringify(node.value,null,2),parents.length?'From '+parents.join(' → '):''].filter(Boolean).join('\n');
    transform.replaceChildren();
    if(node.transformation){
      const title=document.createElement('strong');title.textContent='Inferred transformation · '+node.transformation.expression;transform.append(title);
      for(const [i,step] of node.transformation.steps.entries()){
        const button=document.createElement('button');button.type='button';
        button.textContent=String(step.input)+' → '+(node.transformation.method==='select'?(step.result?'kept':'filtered out'):String(step.result));
        button.onclick=()=>{detail.textContent=node.transformation.parameter+' = '+step.input+'\n'+node.transformation.expression+' → '+step.result+'\nInferred from source · item '+(i+1);};
        transform.append(button);
      }
    }
    if(node.kind==='Call')onInspect(node.name);
  }
  function schedule(){
    clearTimeout(timer);revision++;
    if(!panel.open)return;
    timer=setTimeout(()=>{
      worker??=new Worker(new URL('./model-worker.js',import.meta.url),{type:'module'});
      worker.onmessage=({data})=>{
        if(data.id!==revision)return;
        graph=data;items.replaceChildren();detail.textContent='';
        for(const node of graph.nodes.filter(n=>!['LocalVariableRead','String','Integer','Parameters','ErrorRecovery','Statements','Program'].includes(n.kind)).slice(-100)){
          const button=document.createElement('button');button.type='button';button.textContent=(node.name||node.kind)+' · '+node.type;
          button.onclick=()=>{display(node);if(node.line){const ed=getEditor(),lines=ed.getValue().split('\n');const offset=lines.slice(0,node.line-1).reduce((sum,s)=>sum+s.length+1,0);const pos=offset+(node.column || 0);if(ed.getValue().slice(pos,pos+node.source.length)===node.source)ed.selectRange(pos,pos+node.source.length);}};
          items.append(button);
        }
        display((selected && graph.nodes.findLast(n=>n.name===selected))||graph.nodes.at(-1));
        if(data.diagnostics.length)detail.textContent=data.diagnostics.join('\n')+'\n'+detail.textContent;
        if(!graph.nodes.length && !data.diagnostics.length)detail.textContent='Write an assignment to inspect it.';
      };
      worker.postMessage({id:revision,language,source:getEditor().getValue()});
    },200);
  }
  panel.ontoggle=schedule;
  return {schedule,select:(name)=>{if(panel.open)display(graph?.nodes.findLast(n=>n.source===name||n.name===name));},destroy(){clearTimeout(timer);worker?.terminate();panel.remove();}};
}

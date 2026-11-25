export function modelPanel(host,language,getEditor,onInspect,expanded=false,compact=false) {
  const panel=document.createElement('details');
  panel.className='shared-editor-tools semantic-panel'; panel.open=expanded;
  panel.innerHTML='<summary>Code Model</summary><div class="model-items"></div><pre class="model-detail" aria-live="polite"></pre><div class="model-transform" aria-label="Transformation steps"></div>';
  host.before(panel);
  const items=panel.querySelector('.model-items'),detail=panel.querySelector('pre'),transform=panel.querySelector('.model-transform');
  let worker,timer,revision=0,graph,selected='';
  let observed=new Map(),observationLabel='';
  function observation(node) {
    if(!node?.name || node.kind==='Call' || /Def/.test(node.kind))return null;
    return observed.get(node.name) || null;
  }
  function display(node) {
    if(!node)return;
    selected=node.name || node.source;
    const parents=graph.edges.filter(e=>e.to===node.id).map(e=>graph.nodes.find(n=>n.id===e.from)?.source);
    const actual=observation(node);
    detail.textContent=[node.source,actual?observationLabel+' · '+actual.type:[node.confidence,node.type,node.scope].filter(Boolean).join(' · '),actual?'Observed value: '+actual.value:node.value===undefined?'Value unknown':JSON.stringify(node.value,null,2),parents.length?'From '+parents.join(' → '):''].filter(Boolean).join('\n');
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
  function render() {
    if(!graph)return;
    items.replaceChildren();detail.textContent='';
    const visible=graph.nodes.filter(n=>{
      if(['LocalVariableRead','String','Integer','Parameters','ErrorRecovery','Statements','Program'].includes(n.kind))return false;
      if(!compact)return true;
      return n.kind==='Variable' || /VariableWrite|Parameter|Def/.test(n.kind) && n.kind!=='BlockParameters' ||
        n.kind==='Call' && /^[A-Za-z_]\w*[!?=]?$/.test(n.name || '');
    }).slice(-100);
    const shown=new Set();
    for(const node of visible){
      const actual=observation(node);
      if(actual)shown.add(node.name);
      const button=document.createElement('button');button.type='button';
      button.textContent=(node.name||node.kind)+' · '+(actual?actual.value:node.type);
      if(actual)button.title=observationLabel+' · '+actual.type;
      button.onclick=()=>{display(node);if(node.line){const ed=getEditor(),lines=ed.getValue().split('\n');const offset=lines.slice(0,node.line-1).reduce((sum,s)=>sum+s.length+1,0);const pos=offset+(node.column || 0);if(ed.getValue().slice(pos,pos+node.source.length)===node.source)ed.selectRange(pos,pos+node.source.length);}};
      items.append(button);
    }
    if(compact)for(const [name,value] of observed){
      if(shown.has(name))continue;
      const button=document.createElement('button');button.type='button';button.textContent=name+' · '+value.value;button.title=observationLabel+' · '+value.type;
      button.onclick=()=>{detail.textContent=observationLabel+'\n'+name+' · '+value.type+'\n'+value.value;getEditor().find(name);};
      items.append(button);
    }
    const current=(selected && graph.nodes.findLast(n=>n.name===selected)) || (!compact && graph.nodes.at(-1));
    if(current)display(current);
    else if(compact && (visible.length || observed.size))detail.textContent=observationLabel || 'Select a symbol to inspect it.';
    if(graph.diagnostics.length)detail.textContent=graph.diagnostics.join('\n')+'\n'+detail.textContent;
    if(!graph.nodes.length && !graph.diagnostics.length && !observed.size)detail.textContent='Write an assignment to inspect it.';
  }
  function schedule(){
    clearTimeout(timer);revision++;
    if(!panel.open)return;
    timer=setTimeout(()=>{
      worker??=new Worker(new URL('./model-worker.js',import.meta.url),{type:'module'});
      worker.onmessage=({data})=>{
        if(data.id!==revision)return;
        graph=data;render();
      };
      worker.postMessage({id:revision,language,source:getEditor().getValue()});
    },200);
  }
  panel.ontoggle=schedule;
  return {schedule,select:(name)=>{if(panel.open)display(graph?.nodes.findLast(n=>n.source===name||n.name===name));},
    setObservedValues(values,label){observed=new Map((values || []).filter(value=>typeof value.name==='string').map(value=>[value.name,value]));observationLabel=label || '';if(panel.open)render();},
    destroy(){clearTimeout(timer);worker?.terminate();panel.remove();}};
}

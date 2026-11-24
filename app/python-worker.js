import {loadPyodide} from 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs';
let output=[],errors=[];
try {
 const python=await loadPyodide({stdout:line=>output.push(line),stderr:line=>errors.push(line)});
 self.onmessage=async ({data})=>{
  if(data.type==='complete'){
   const allowed={String:'str',Array:'list',Hash:'dict',Set:'set',Integer:'int',Float:'float'};
   const type=allowed[data.staticType];
   if(!type){self.postMessage({type:'completion',id:data.id,methods:[],docs:{}});return}
   const raw=python.runPython(`import json\n__cf_class = ${type}\njson.dumps({name: (getattr(__cf_class, name).__doc__ or '') for name in dir(__cf_class) if not name.startswith('_')})`);
   const docs=JSON.parse(raw);
   self.postMessage({type:'completion',id:data.id,methods:Object.keys(docs),docs});return;
  }
  output=[];errors=[];
  try {const value=await python.runPythonAsync(data.code);self.postMessage({type:'result',result:{ok:true,output:output.join('\n'),stderr:errors.join('\n'),value:value==null?'':String(value),methods:[]}});if(value?.destroy)value.destroy()}
  catch(error){self.postMessage({type:'result',result:{ok:false,output:output.join('\n'),stderr:errors.join('\n'),error:String(error.message||error)}})}
 };
 self.postMessage({type:'ready'});
} catch(error){self.postMessage({type:'failure',error:String(error)})}

const cache=new Map();
let worker, ready, nextId=0;
const waiting=new Map();
function runtime(){
  if(ready)return ready;
  ready=new Promise((resolve,reject)=>{
    let timer;
    function fail(message){clearTimeout(timer);worker?.terminate();worker=null;ready=null;for(const item of waiting.values()){clearTimeout(item.timer);item.reject(Error(message));}waiting.clear();reject(Error(message));}
    try{worker=new Worker(new URL('./python-worker.js',import.meta.url),{type:'module'});}catch(error){reject(error);return;}
    timer=setTimeout(()=>fail('Python reference timed out'),60000);
    worker.onerror=()=>fail('Python reference could not start');
    worker.onmessage=({data})=>{
      if(data.type==='ready'){clearTimeout(timer);resolve(worker);return;}
      if(data.type==='failure'){fail(data.error || 'Python reference failed');return;}
      const item=waiting.get(data.id);if(item){waiting.delete(data.id);clearTimeout(item.timer);item.resolve(data.docs || {});}
    };
  });
  return ready;
}
export async function pythonDocs(type){
  if(cache.has(type))return cache.get(type);
  const active=await runtime(),id=++nextId;
  const docs=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{waiting.delete(id);reject(Error('Python method lookup timed out'));},5000);waiting.set(id,{resolve,reject,timer});active.postMessage({type:'complete',id,staticType:type});});
  cache.set(type,docs);return docs;
}

// A dedicated, read-only Ruby runtime supplies the actual public method list.
const cache = new Map();
let worker, ready, nextId = 0;
const waiting = new Map();

function runtime() {
  if (ready) return ready;
  ready = new Promise((resolve, reject) => {
    let timer;
    const fail = message => {
      clearTimeout(timer);
      worker?.terminate(); worker = null; ready = null;
      for (const request of waiting.values()) request.reject(Error(message));
      waiting.clear(); reject(Error(message));
    };
    try { worker = new Worker(new URL('./ruby-worker.js', import.meta.url), {type:'module'}); }
    catch (error) { ready=null; reject(error); return; }
    timer=setTimeout(()=>fail('Ruby method catalog timed out'),60000);
    worker.onerror=()=>fail('Ruby method catalog could not start');
    worker.onmessage=({data})=>{
      if(data.type==='ready'){clearTimeout(timer);resolve(worker);return;}
      if(data.type==='failure'){fail(data.error || 'Ruby method catalog failed');return;}
      const request=waiting.get(data.id);
      if(request){waiting.delete(data.id);clearTimeout(request.timer);request.resolve(data.methods || []);}
    };
    worker.postMessage({type:'init'});
  });
  return ready;
}

export async function rubyMethods(type) {
  if(cache.has(type)) return cache.get(type);
  const active=await runtime();
  const id=++nextId;
  const methods=await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{waiting.delete(id);reject(Error('Ruby method lookup timed out'));},5000);
    waiting.set(id,{resolve,reject,timer});
    active.postMessage({type:'complete',id,staticType:type});
  });
  cache.set(type,methods);
  return methods;
}

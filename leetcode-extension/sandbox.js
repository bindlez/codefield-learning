let worker, timer, blobURL, revision=0;
function stop() {
  clearTimeout(timer);
  worker?.terminate();
  if (blobURL) URL.revokeObjectURL(blobURL);
  worker = blobURL = null;
}
window.addEventListener('message', event => {
  if (event.source !== parent || !event.data) return;
  stop();
  const current=++revision;
  const {id,script,payload} = event.data;
  if (!script) return;
  function finish(data) { if(current!==revision)return;stop(); parent.postMessage({id,...data},'*'); }
  try {
    blobURL = URL.createObjectURL(new Blob([script],{type:'text/javascript'}));
    worker = new Worker(blobURL);
    timer = setTimeout(() => finish({error:'Stopped after 8 seconds. Check for a loop that never ends.'}),8000);
    worker.onerror = e => finish({error:e.message || 'The isolated runner stopped.'});
    worker.onmessage = ({data}) => finish(data);
    worker.postMessage(payload);
  } catch (error) { finish({error:error.message}); }
});
parent.postMessage({ready:true},'*');

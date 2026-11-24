const {spawn}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const base='http://127.0.0.1:8765';
async function online(){
  try{const r=await fetch(base+'/api/health',{signal:AbortSignal.timeout(800)});return (await r.json()).name==='codefield';}catch{return false;}
}
(async()=>{
  if(!await online()){
    const server=spawn(process.execPath,[path.join(root,'server.js')],{cwd:root,detached:true,windowsHide:true,stdio:'ignore',env:{...process.env,HOST:'127.0.0.1',CODEFIELD_PORT:'8765'}});
    server.unref();
    for(let i=0;i<40&&!await online();i++)await new Promise(r=>setTimeout(r,150));
  }
  if(!await online())throw Error('Port 8765 is unavailable.');
  spawn('rundll32.exe',['url.dll,FileProtocolHandler',base+'/app/'],{windowsHide:true,stdio:'ignore',detached:true}).unref();
})().catch(e=>{console.error(e.message);process.exitCode=1;});

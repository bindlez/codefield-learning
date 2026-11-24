import {analyzeBasic,analyzeRuby,createRubyParser} from './semantic-model.js';
let parser;
self.onmessage=async ({data:{id,language,source}})=>{
  try {
    if(source.length>100000)throw Error('Select a file under 100,000 characters to inspect it.');
    if(language==='ruby') parser??=fetch(new URL('./vendor/prism/prism.wasm',import.meta.url)).then(r=>r.arrayBuffer()).then(createRubyParser);
    const graph=language==='ruby'?analyzeRuby((await parser)(source)):analyzeBasic(language,source);
    self.postMessage({id,...graph});
  } catch(error){self.postMessage({id,nodes:[],edges:[],diagnostics:[error.message]});}
};

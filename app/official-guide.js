let rubyIndex;
export async function officialGuide(language,type,name,owner){
  if(language!=='ruby')return null;
  rubyIndex??=fetch(new URL('./ruby-official-docs.json',import.meta.url)).then(response=>{
    if(!response.ok)throw Error('Reference unavailable');
    return response.json();
  }).catch(()=>{rubyIndex=null;return {};});
  const index=await rubyIndex;
  return index[(owner || type)+'#'+name] || index[type+'#'+name] || index['Enumerable#'+name] || index['Object#'+name] || index['Kernel#'+name] || null;
}

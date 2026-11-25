(() => {
if (globalThis.__codefieldLauncherInstalled) return;
const launcher = document.createElement('div');
const shadow = launcher.attachShadow({mode:'closed'});
shadow.innerHTML = `<style>:host{all:initial;position:fixed;z-index:2147483640;right:12px;bottom:12px}button{background:#15372e;color:#baf6df;font:600 13px/1.2 system-ui;padding:9px 13px;border:1px solid #549e89;border-radius:20px;cursor:pointer}button:focus-visible{outline:3px solid white}</style><button type="button" title="Open the Codefield editor and live trace">⌘ Codefield</button>`;
const button = shadow.querySelector('button');
button.onclick = async () => {
  try { if (await chrome.runtime.sendMessage({type:'open-codefield'})) return; } catch {}
  button.textContent = 'Open Codefield from Extensions';
};
function syncLauncher() {
  if (/^\/problems\/[\w-]+(?:\/|$)/.test(location.pathname)) {
    if (!launcher.isConnected) document.documentElement.append(launcher);
  } else launcher.remove();
}
syncLauncher();
if (window.navigation) navigation.addEventListener('navigatesuccess',syncLauncher);
else setInterval(syncLauncher,1000);

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message.type !== 'question' || !/^[\w-]+$/.test(message.slug) || location.pathname.split('/')[2] !== message.slug) return;
  const languageNames={'javascript':'javascript','ruby':'ruby','python':'python','python3':'python','python 3':'python','rust':'rust','c++':'cpp','c#':'csharp','java':'java','go':'go','golang':'go','elixir':'elixir','crystal':'crystal'};
  const choices=[...document.querySelectorAll('main button,[id="main-content"] button')]
    .filter(element=>element.getClientRects().length)
    .map(element=>languageNames[element.textContent.trim().toLowerCase()])
    .filter(Boolean);
  const visibleLanguage=new Set(choices).size===1?choices[0]:null;
  const query = 'query CodefieldProblem($slug: String!) { question(titleSlug: $slug) { title titleSlug metaData exampleTestcases content codeSnippets { langSlug code } } }';
  fetch('/graphql/', {method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,variables:{slug:message.slug}}),signal:AbortSignal.timeout(6500)})
    .then(response => response.ok ? response.json() : null)
    .then(result => {
      const q = result?.data?.question;
      if (q?.titleSlug !== message.slug) return respond(null);
      // Parse inertly. Only text from published examples crosses into the panel.
      const template = document.createElement('template');
      template.innerHTML = q.content || '';
      for (const element of template.content.querySelectorAll('br,p,pre,div')) element.after('\n');
      const text = template.content.textContent;
      const numbered = text.split(/\bExample\s+\d+\s*:/i).slice(1);
      const blocks = numbered.length ? numbered : [...template.content.querySelectorAll('pre,.example-block')].map(b=>b.textContent);
      const examples = blocks.map(lines => {
        const output = /\bOutput:\s*([^\n]+?)(?=\s*(?:Explanation:|Constraints:|\n|$))/i.exec(lines)?.[1]?.trim();
        return output === undefined ? {} : {output};
      });
      respond({title:q.title,meta:q.metaData,exampleTestcases:q.exampleTestcases,examples,visibleLanguage,
        snippets:Object.fromEntries((q.codeSnippets || []).map(s => [s.langSlug,s.code]))});
    }).catch(() => respond(null));
  return true;
});
globalThis.__codefieldLauncherInstalled=true;
})();

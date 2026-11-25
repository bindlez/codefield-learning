// This self-contained function runs in the problem tab through chrome.scripting.
export function nativeEditor(slug, operation, language, replacement, expectedValue) {
  if (location.origin !== 'https://leetcode.com' || location.pathname.split('/')[2] !== slug)
    return {error:'The active problem changed.'};
  const api = window.monaco?.editor;
  const editors = (api?.getEditors?.() || []).filter(editor => editor.getDomNode()?.getClientRects().length);
  const models = editors.length ? editors.map(e => e.getModel()) : (api?.getModels?.() || []);
  const ids = {javascript:'javascript',python:'python',ruby:'ruby',cpp:'cpp',rust:'rust',csharp:'csharp',java:'java',go:'go',elixir:'elixir',crystal:'crystal'};
  const candidates = [...new Set(models)].filter(m => m && ids[m.getLanguageId()] && !m.isDisposed());
  if (candidates.length !== 1) return {error:'LeetCode’s native editor is unavailable. Paste your existing solution into Codefield, or use Copy code to take it back.'};
  const model = candidates[0], current = ids[model.getLanguageId()];
  if (operation === 'read') return {language:current,code:model.getValue()};
  if (operation !== 'write' || current !== language) return {error:'Select the same language in the LeetCode editor first.'};
  const view=editors.find(e=>e.getModel()===model);
  const readOnly=api.EditorOption?.readOnly;
  if (view && readOnly!==undefined && view.getOption(readOnly)) return {error:'The LeetCode editor is read-only.'};
  if (model.getValue() !== expectedValue) return {error:'LeetCode changed during transfer. Review its draft and try again.'};
  model.pushStackElement();
  model.pushEditOperations([], [{range:model.getFullModelRange(),text:replacement}], () => null);
  model.pushStackElement();
  return {language:current,code:model.getValue()};
}

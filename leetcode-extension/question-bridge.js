export async function loadQuestion(api,tabId,slug) {
  try {
    return await api.tabs.sendMessage(tabId,{type:'question',slug});
  } catch {
    // Reloading an unpacked extension invalidates content scripts in existing
    // tabs. Reconnect the same tab so users can keep their LeetCode draft.
    await api.scripting.executeScript({target:{tabId},files:['launcher.js']});
    return api.tabs.sendMessage(tabId,{type:'question',slug});
  }
}

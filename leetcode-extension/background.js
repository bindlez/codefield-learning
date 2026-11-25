chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true}).catch(console.error);
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message.type !== 'open-codefield' || !sender.tab || !/^https:\/\/leetcode\.com\/problems\/[\w-]+(?:\/|$)/.test(sender.url)) return;
  chrome.sidePanel.open({tabId:sender.tab.id}).then(() => respond(true), () => respond(false));
  return true;
});

const init = () => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) return;

    const tab = tabs[0];

    if (tab && tab.id && tab.url) {
      chrome.action.setBadgeText({ text: '' });
      chrome.action.setBadgeTextColor({ color: "#ffffff" });
      chrome.action.setBadgeBackgroundColor({ color: '#00a2f5' })

      chrome.tabs.sendMessage(tab.id, { action: "getTwitterUsernames" }, (response) => {
        if (chrome.runtime.lastError) return;

        if (response && response.usernames && response.usernames.length > 0) {
          chrome.action.setBadgeText({ text: response.usernames.length.toString() });
        } else {
          chrome.action.setBadgeText({ text: '' });
        }
      });
    }
  });
};

// Attach init to events
chrome.runtime.onStartup.addListener(init);
chrome.runtime.onInstalled.addListener(init);
chrome.tabs.onActivated.addListener(() => init());
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    init();
  }
});
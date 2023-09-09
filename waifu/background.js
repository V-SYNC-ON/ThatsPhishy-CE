chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'SAFE'
  });
});

chrome.action.onClicked.addListener(async (tab) => {
    
})

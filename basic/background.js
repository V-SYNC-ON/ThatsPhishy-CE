const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'

chrome.runtime.onInstalled.addListener(async (tab) => {
    if(tab.url.startsWith(extensions) || tab.url.startsWith(webstore)){
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        const nextState = prevState == 'ON' ? 'SHUT' : 'ON';
    }

    await chrome.action.setBadgeText({
        tabId: tab.id,
        text: nextState,
    })
})

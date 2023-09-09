chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'SHUT'
  });
});

const extensions = 'https://developer.chrome.com/docs/extensions'
const webstore = 'https://developer.chrome.com/docs/webstore'

chrome.action.onClicked.addListener(async (tab) => {
    if(tab.url.startsWith(extensions) || tab.url.startsWith(webstore)){

        // each opened tab has a id
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        const nextState = prevState === 'ON' ? 'SHUT' : 'ON';

        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });

        if (nextState === 'ON') {
            await chrome.scripting.insertCSS({
                files: ['focus-mode.css'],
                target: { tabId: tab.id }
            });
        } else if (nextState === 'SHUT') {
            await chrome.scripting.removeCSS({
                files: ['focus-mode.css'],
                target: { tabId: tab.id }
            });
        }
    }

});

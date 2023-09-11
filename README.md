# Phishing Detection Chrome Extension
An easy to use chrome extension detects phishng sites in just a single click. With the score shown on the extension, user can decide the reliability of any site with ease. Uses v3 manifest, no bloats, lightweight.

## Instructions
1. Clone the repo
2. Open <chrome://extensions> 
3. Load Unpacked
4. Select the repo folder

Install the [chrome-types](https://www.npmjs.com/package/chrome-types) npm package for code definition support.

## Quick Intro 
- `popup` files are directly related to extension's UI 
- `background.js` is the main service worker. Contact point for your API
- `manifest.json` defines which files can access API, list of required permission, icons and so on.

## References
Try making the 3 sample extension project to understand the development flow.
[Sample Extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/) 
[Extension 101](https://developer.chrome.com/docs/extensions/mv3/getstarted/extensions-101/)
[API References](https://developer.chrome.com/docs/extensions/reference/)

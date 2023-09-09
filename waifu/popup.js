const result = document.getElementById("result")
const button = document.querySelector("button")

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    result.textContent = tab.url
    // return tab;
}

button.addEventListener("click", getCurrentTab)


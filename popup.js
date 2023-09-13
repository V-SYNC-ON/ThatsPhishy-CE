const result = document.getElementById("result")
const button = document.querySelector("button")

result.textContent = '...'

let queryOptions = { active: true, lastFocusedWindow: true };
let [tab] = await chrome.tabs.query(queryOptions);

function getCurrentTab() {
    var req = {
            type: "predict",
            url: tab.url
        }
    console.log(tab.url)

    chrome.runtime.sendMessage(
        req, score => {
            if(chrome.runtime.lastError){
                console.log("Timeout")
                setTimeout(getCurrentTab, 1000)
            } else {
                result.textContent = score
            }
        }
    )
    // ref: https://stackoverflow.com/questions/54181734/chrome-extension-message-passing-unchecked-runtime-lasterror-could-not-establi/54686484#54686484
}


button.addEventListener("click", getCurrentTab)
// TODO: display all fields in response


// Reference to all result tags
const description = document.getElementById("description")
const domain = document.getElementById("domain")
const prediction = document.getElementById("prediction")
const statusRank  = document.getElementById("status")

const button = document.querySelector("button")

prediction.textContent = '...'

let queryOptions = { active: true, lastFocusedWindow: true };
let [tab] = await chrome.tabs.query(queryOptions);

function getCurrentTab() {
    var req = {
            type: "predict",
            url: tab.url
        }
    console.log(tab.url)

    chrome.runtime.sendMessage(
        req, res => {
            if(chrome.runtime.lastError){
                console.log("Timeout")
                setTimeout(getCurrentTab, 1000)
            } else {
                description.textContent = res.description
                domain.textContent = res.domain
                prediction.textContent = res.prediction + "/100"
                statusRank.textContent = res.status
            }
        }
    )
    // ref: https://stackoverflow.com/questions/54181734/chrome-extension-message-passing-unchecked-runtime-lasterror-could-not-establi/54686484#54686484
}


button.addEventListener("click", getCurrentTab)

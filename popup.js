
// Reference to all result tags
const description = document.getElementById("description")
const domain = document.getElementById("domain")
const prediction = document.getElementById("prediction")
const statusRank  = document.getElementById("status")

const button = document.querySelector("button")

// prediction.textContent = '...'
let queryOptions = { active: true, lastFocusedWindow: true };
var tab

function toggleScreens() {
    const predictContainer = document.getElementById("predict-container")
    const resultContainer = document.getElementById("result-container")
    
    // Make results Container visible
    resultContainer.style.visibility = "visible";
    resultContainer.style.display = "block";
    resultContainer.style.opacity = "1";

    // Make Search button and stuffs hidden
    predictContainer.style.visibility = "hidden";
    predictContainer.style.display = "none";
    predictContainer.style.opacity = "0";
}

async function getCurrentTab() {
    [tab] = await chrome.tabs.query(queryOptions);
}

async function getPredictionResults() {

    await getCurrentTab()
    var req = {
            type: "predict",
            url: tab.url
        }
    console.log(tab.url)

    chrome.runtime.sendMessage(
        req, res => {
            if(chrome.runtime.lastError){
                console.log("Timeout")
                setTimeout(getPredictionResults, 1000)
            } else {
                description.textContent = res.description
                domain.textContent = res.domain
                prediction.textContent = res.prediction + "/100"
                statusRank.textContent = res.status

                toggleScreens()
            }
        }
    )
    // ref: https://stackoverflow.com/questions/54181734/chrome-extension-message-passing-unchecked-runtime-lasterror-could-not-establi/54686484#54686484

}


button.addEventListener("click", getPredictionResults)

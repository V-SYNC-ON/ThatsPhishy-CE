// Reference to all result tags
const description = document.getElementById("description")
const domain = document.getElementById("domain")
const prediction = document.getElementById("prediction")
const statusRank  = document.getElementById("status")

const button = document.querySelector("button")

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

async function getPageContents() {

    // Execute a content script to extract text content
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
            const textContent = document.body.textContent;
            return textContent;
        },
    }, (result) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
        }

      const extractedText = result[0];
      console.log("Text Content:", extractedText.result);
    });
}

async function getPageLinks() {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
            const anchorElements = document.querySelectorAll('a')
            const hrefs = Array.from(anchorElements).map((element) => element.href)
            return hrefs
        },
    }, (result) => {
        const extractedLinks = result[0]

        var req = {
            type: "batch",
            hrefs: extractedLinks.result 
        }

        chrome.runtime.sendMessage(req, res => {
            if(chrome.runtime.lastError) {
                console.log("Batch Process Timeout")
                setTimeout(getPageLinks, 1000)
            } else {
                console.log("success:", res.status, res.score)
            }
        })
        // console.log("All URLS :", extractedLinks.result);
    });
}

async function getPredictionResults() {

    await getCurrentTab()
    //await getPageContents()
    await getPageLinks()
    var req = {
            type: "predict",
            url: tab.url,
            language: "English"
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

                if(res.status == "safe") 
                    statusRank.className = "safe"
                else if (res.status == "UNKNOWN" || res.status == "not recommended")
                    statusRank.className = "not-recommended"

                toggleScreens()
            }
        }
    )
    // ref: https://stackoverflow.com/questions/54181734/chrome-extension-message-passing-unchecked-runtime-lasterror-could-not-establi/54686484#54686484

}


button.addEventListener("click", getPredictionResults)

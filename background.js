// Set Tab Specific custom Badge Text
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, newTab) => {

    if(!changeInfo.url) return 
    let statusText = await updateBadge(changeInfo.url)
    //statusText = statusText.toUpperCase()
    statusText = (statusText ?? "UNKNOWN").toUpperCase();

    console.log("new " + statusText)

    chrome.action.setBadgeText({
        text: statusText,
        tabId: tabId
    })
    if(statusText == "RISKY")
        chrome.action.setBadgeBackgroundColor({
            color: "red",
            tabId: tabId
        })

    else if(statusText == "SAFE")
        chrome.action.setBadgeBackgroundColor({
            color: "green",
            tabId: tabId
        })

    else if(statusText == "UNKNOWN")
        chrome.action.setBadgeBackgroundColor({
            color: "gray",
            tabId: tabId
        })
})

async function updateBadge(newUrl) {
    try {
        const response = await fetch('http://127.0.0.1:8080/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: newUrl })
        });
        
        const data = await response.json();
        console.log(data.status); 
        return data.status;

    } catch (error) {
        console.error('Error:', error); 
        throw error; 

    }
}

chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(message => { console.log(message) })
})

chrome.runtime.onMessage.addListener(predict)
chrome.runtime.onMessage.addListener(batchCalculate)

// Iterates all links present in a website, to calculate a more accurate phishing score
async function batchCalculate(req, sender, sendResponse) {
    let count = 0
    let scoreTotal = 0

    try {
        if(req.type === "batch"){

            // index < req.hrefs.length - TODO: having this blocks the entire UI. Have to see how to fix it
            for (let index = 0; index < 1; index++){
                const response = await fetch('http://127.0.0.1:8080/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: req.hrefs[index] })
                })

                const data = await response.json()

                if(data.prediction){
                    scoreTotal += data.prediction
                    count++
                }
            }
            sendResponse({ status: "ROGER THAT", score: scoreTotal })
        }
    } catch (error) {
        console.error('Error:', error) 
        throw error; 
    }
    return true
}

function predict (req, sender, sendResponse) {

    fallbackValue = {
        "description": "The website doesn't exist, either the URL is faulty or maybe the site is down",
        "domain": "invalid domain",
        "prediction": "-",
        "status": "UNKNOWN"
    }
    console.log("prediction score execution")

    if(req.type === "predict"){
        fetch('http://127.0.0.1:8080/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: req.url })
        })
            .then(res => { 
                return res.json()
            }) 
            .then(data => {
                console.log("API Result: ", data); // Handle the data
                if(data.error) sendResponse(fallbackValue)

                sendResponse(data)
            })
            .catch(error => {
                console.error('Error:', error); // Handle any errors
                sendResponse(fallbackValue)
            })
    }
    return true
}

/* 
{
    API Result Format:
    "description": "This website archlinux.org exhibits a concerning security profile, that could potentially impact your online security",
    "domain": "archlinux.org",
    "prediction": 0,
    "status": "Risky"
}
*/

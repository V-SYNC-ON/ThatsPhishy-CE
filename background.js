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

function predict (req, sender, sendResponse) {
    console.log("predict execution")
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
                console.log(data); // Handle the data
                sendResponse(data)
            })
            .catch(error => {
                console.error('Error:', error); // Handle any errors
            })
        return true
    }
}

/* 
    API Result Format:
{
    "description": "This website archlinux.org exhibits a concerning security profile, that could potentially impact your online security",
    "domain": "archlinux.org",
    "prediction": 0,
    "status": "Risky"
}
*/

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'SAFE'
  });
});

chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(message => { console.log(message) })
})

chrome.runtime.onMessage.addListener(predict)

function predict (req, sender, sendResponse) {
    console.log("predict execution")
    if(req.type === "predict"){
        fetch('https://thats-phishy.onrender.com/predict', {
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

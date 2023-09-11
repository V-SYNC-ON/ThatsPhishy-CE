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
                sendResponse(data.prediction)
            })
            .catch(error => {
                console.error('Error:', error); // Handle any errors
            })
        return true
    }
}

console.log("from background")

// chrome.tabs.executeScript(null, { file: '/foreground.js' }, () => { console.log("I injected foreground") })

// chrome.runtime.onInstalled.addListener(() => {
//     // chrome.storage.sync.set({ color });
//     // var captureBtn = document.getElementById("AddVoucherOptions-Capture-Btn");
//     // captureBtn.addEventListener('click', () => {
//     //     console.log("click from background")
//     // })
// });
let id = 100;

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    switch (msg.type) {
        case 'login':
            response('login request');
            break;
        case 'captureTab':
            chrome.tabs.captureVisibleTab(
                null,
                {},
                function (dataUrl) {
                    response({ imgSrc: dataUrl });
                }
            ); //remember that captureVisibleTab() is a statement
            return true;
            break;
        default:
            response('unknown request');
            break;
    }
});
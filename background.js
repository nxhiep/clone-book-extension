chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ time: new Date().getTime() }, function () {
        console.log("The color is green.");
    });
});
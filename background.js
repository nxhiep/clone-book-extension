chrome.webNavigation.onCompleted.addListener(function(details) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.cookies.getAll({ "url": tabs[0].url }, function (cookie) {
            chrome.tabs.sendMessage(tabs[0].id, cookie);
        });
    });
});
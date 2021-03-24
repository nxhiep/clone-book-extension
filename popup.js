let page = document.getElementById('contentPanel');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
function constructOptions(kButtonColors) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        for (let item of kButtonColors) {
            let button = document.createElement('button');
            button.style.backgroundColor = item;
            button.addEventListener('click', function () {
                // chrome.storage.sync.set({ color: item }, function () {
                // });
                console.log(222);
                chrome.tabs.executeScript(
                    tabs[0].id,
                    { code: 'document.body.style.backgroundColor = "'+item+'";' });
            });
            page.appendChild(button);
        }
    });
}
constructOptions(kButtonColors);

let test = document.getElementById('test');
test.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log("test");
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'document.body.style.backgroundColor = "#e8453c";' });
    });
};
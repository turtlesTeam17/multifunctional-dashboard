chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({
        'url': chrome.extension.getURL('index.html'),
        'selected': true
    });
});

// Open browser popup with key combination Ctrl + Shift + K for Linux
chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // notification for colorpicker
    if(message["from"] == "colorPicked") {
        var notificationMsgg = {
            type: "basic",
            title: "Color",
            message: "Hex color code copied to clipboard, and it's data sent to color history",
            iconUrl: "icons/icon128.png"
        }
        chrome.notifications.create('done', notificationMsgg, function () {
            setTimeout(function () {
                chrome.notifications.clear('done', function () {});
            }, 2000);
        });
    }
    return true;
});
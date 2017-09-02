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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message["from"] == "position" || message["from"] == "mousemove") {
        var selectedColor = message["value"];
        (0, _App.showSelectedColor)(selectedColor);
    }
    if (message["from"] == "scroll") {
        console.log("scroll in tab");
        //capture_screen();
        chrome.tabs.captureVisibleTab(null, { "format": "png" }, function (img) {
            sendResponse({ "image": img });
        });
        return true;
    }
    // notification for colorpicker
    if (message["from"] == "colorPicked") {
        var notificationMsgg = {
            type: "basic",
            title: "Color Picker",
            message: "Hex color code copied to clipboard, and it's data sent to color history",
            iconUrl: "../../icons/icon48.png"
        };
        chrome.notifications.create('done', notificationMsgg, function () {
            console.log("Last error:", chrome.runtime.lastError);
            setTimeout(function () {
                chrome.notifications.clear('done', function () {});
            }, 2000);
        });
    }
    return true;
});
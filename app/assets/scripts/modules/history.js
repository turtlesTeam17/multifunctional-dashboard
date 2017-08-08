var globalCount = 0;

document.body.onload = function () {
    chrome.storage.sync.get('urlData', function (items) {
        if (!chrome.runtime.error) {
            for(var item in items){
                $('#urlHistory').append('<tr><td>' + item.title + '</td><td>' + item.url + '</td></tr>');
            }
            console.log(items);
        }
    });
}

// Listen for change in short-url-info div with custom jQuery event
$('.shortUrlInfo').on('contentChanged', function () {
    globalCount++;
    var tabTitle;
    var dataObj = {
        'url': $('.shortUrlInfo').text(),
    }
    chrome.tabs.query({
        'active': true,
        'currentWindow': true
    }, function (tabs) {
        dataObj.title = tabs[0].title;
        console.log(dataObj);
        chrome.storage.sync.set({
            'urlData': dataObj
        }, function () {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
        });
    });
});

// on dom ready get all stored urls in put them in the table
// on change event set the new url and title to chrome sync database(check if there is no same url first)
var globalCount = 0;

document.body.onload = function () {
    chrome.storage.sync.get('globalCount', function (items) {
        if (!chrome.runtime.error) {
            console.log(items);
        }
    });
    chrome.storage.sync.get(null, function (items) {
        if (!chrome.runtime.error) {
            for (var item in items) {
                $('#urlHistory').append('<tr><td>' + item.title + '</td><td>' + item.url + '</td></tr>');
            }
            console.log(items);
        }
    });
    // clearing whole chrome storage // debugging
    //chrome.storage.sync.clear();
    // this will display all items in chrome storage // debugging
    // chrome.storage.sync.get(null, function(items) {
    //     var allKeys = Object.keys(items);
    //     console.log('Items: ' + allKeys);
    // });
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
        console.log(globalCount);
        chrome.storage.sync.set({
            ['urlData' + globalCount]: dataObj,
            'globalCount': 0
        }, function () {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
        });
    });
});

// on dom ready get all stored urls in put them in the table
// on change event set the new url and title to chrome sync database(check if there is no same url first)
// move globalcount to chrome storage?!!
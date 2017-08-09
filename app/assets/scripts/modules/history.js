var localCount;
var url;
var title;

function readDataCount(val) {
    console.log(val);
}

function getDataCount(callback) {
    localCount = 0;

    chrome.storage.sync.get('globalCount', function (items) {
        console.log('***********');
        console.log(items.globalCount);
        localCount = items.globalCount;
        callback(localCount);
        console.log('***********');
    });
}

function getData(callback) {
    chrome.storage.sync.get('urlData11', function (obj) {
        if (!chrome.runtime.error) {
            url = obj.urlData11.title;
            title = obj.urlData11.url;
            console.log('***********');
            console.log(obj.urlData11.title);
            console.log(obj.urlData11.url);
            console.log(obj);
            console.log('***********');
            callback(url, title);
        } else {
            console.log('Error happened!');
        }
    });
}

function readData(val1, val2) {
    $('#urlHistory').append('<tr><td>' + val1 + '</td><td>' + val2 + '</td></tr>');
    console.log(val1, val2);
}

document.body.onload = function () {

    getDataCount(readDataCount);

    getData(readData);

    // clearing whole chrome storage // debugging
    // chrome.storage.sync.clear();
    // this will display all items in chrome storage // debugging
    // chrome.storage.sync.get(null, function (items) {
    //     var allKeys = Object.keys(items);
    //     console.log('Items: ' + allKeys);
    // });
    
    // chrome.storage.sync.get(null, function (obj) {

    //     for (var key in obj) {
    //         console.log('Starting: ');
    //         //do stuffs here
    //         // url = obj.key.title;
    //         // title = obj.key.url;
    //         // console.log(obj.key.title); 
    //         console.log(obj.key);
    //         console.log(key);
    //         console.log(key.url);
    //     }
    // });
}



// Listen for change in short-url-info div with custom jQuery event
$('.shortUrlInfo').on('contentChanged', function () {
    // localCount++;
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
        // console.log(globalCount);
        chrome.storage.sync.set({
            ['urlData' + localCount]: {
                'title': dataObj.title,
                'url': dataObj.url
            },
            'globalCount': localCount
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
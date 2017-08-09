var localCount = 0;
var tabTitle;
var url;
var title;

// get count of stored items
function readDataCount(val) {
    console.log(val);
    getLoop();
}

function getDataCount(callback) {
    localCount = 1;

    chrome.storage.sync.get('globalCount', function (items) {
        console.log(items.globalCount);
        localCount = items.globalCount;
        callback(localCount);
    });
}

// get stored url and title data from chrome.sync
function getData(callback) {
    chrome.storage.sync.get('urlData0', function (obj) {
        if (!chrome.runtime.error) {
            url = obj.urlData0.title;
            title = obj.urlData0.url;
            console.log(obj);
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

function getLoop() {
    for (var i = 0; i <= localCount; i++) {
        // apiLooper(`urlData` + i, readData);
        apiLooper(String.raw `urlData` + i, readData);
    }
}

function apiLooper(item, callback) {

    chrome.storage.sync.get(item, function (obj) {
        if (!chrome.runtime.error) {
            var stringified = JSON.stringify(obj);
            var parsed = JSON.parse(stringified);
            console.log("**************");
            console.log(stringified);
            console.log(parsed);
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var val = obj[key];
                    console.log(val);
                    title = val.title;
                    url = val.url;
                }
            }
            console.log(url);
            console.log(title);
            console.log("**************");
            callback(title, url);
        } else {
            console.log('Error happened!');
        }
    })
}

function showAllData() {
    chrome.storage.sync.get(null, function (items) {
        var allKeys = Object.keys(items);
        console.log('Items in storage: ' + allKeys);
    });
}

function storeUrlData() {
    var dataObj = {
        'url': $('.shortUrlInfo').text(),
        'title': tabTitle
    };
    chrome.storage.sync.set({
        ['urlData' + localCount]: dataObj,
        'globalCount': localCount
    }, function () {
        console.log('Saved to storage: ', dataObj, localCount);
    });
}

document.body.onload = function () {

    getDataCount(readDataCount);

    // getData(readData);

    // clearing whole chrome storage // debugging
    // chrome.storage.sync.clear();

    // this will display all items in chrome storage // debugging
    showAllData();
}

// Listen for change in short-url-info div with custom jQuery event
$('.shortUrlInfo').on('contentChanged', function () {
    localCount++;
    chrome.tabs.query({
        'active': true,
        'currentWindow': true
    }, function (tabs) {
        tabTitle = tabs[0].title;
        storeUrlData();
        console.log(localCount);
    });
});

// on dom ready get all stored urls in put them in the table
// on change event set the new url and title to chrome sync database(check if there is no same url first)
// move globalcount to chrome storage?!!
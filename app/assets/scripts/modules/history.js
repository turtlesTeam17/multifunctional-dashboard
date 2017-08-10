function urlHistory() {
    var localCount = 1;
    var tabTitle;
    var url;
    var title;

    // get count of stored items
    function readDataCount(val) {
        console.log(val);
        // after getting globalCount from chrome.storage start looping through it and print results to history table
        getLoop();
    }
    // get count of stored items // primary
    function getDataCount(callback) {

        chrome.storage.sync.get('globalCount', function (items) {
            console.log(items.globalCount);
            localCount = items.globalCount;
            // callback for dealing with async
            callback(localCount);
        });
    }

    // get single stored url and title data from chrome.sync // debugging
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

    // read recieved data from chrome.storage.get and print it to history table
    function readData(val1, val2) {
        // if values are not undefined 
        if (val1 && val2) {
            // and if longer than 50 characters
            if (val1.length >= 50) {
                // shorten it so it can fit into one row in table without slicing it in middle of an word(with regex)
                // This expressions returns the first 46 (any) characters plus any subsequent non-space characters.
                var shortenedTitle = val1.replace(/^(.{46}[^\s]*).*/, "$1") + "...";
                $('#urlHistory').append('<tr><td title="' + val1 + '">' + shortenedTitle + '</td><td><a href="' + val2 + '">' + val2 + '</a></td></tr>');
            } else {
                // if its no longer than 50 chars then display it as it is
                $('#urlHistory').append('<tr><td title="' + val1 + '">' + val1 + '</td><td><a href="' + val2 + '">' + val2 + '</a></td></tr>');
            }
            console.log(val1, val2);
        }
    }
    // functions for looping through storage
    function getLoop() {
        for (var i = 0; i <= localCount; i++) {
            apiLooper(String.raw `urlData` + i, readData);
        }
    }

    function apiLooper(item, callback) {
        // if not undefined
        if (item) {
            // call chrome API
            chrome.storage.sync.get(item, function (obj) {
                if (!chrome.runtime.error) {
                    // stringify recieved data, and then parse it to JSON object.
                    // I had to do this because chrome.api call is looking for string-name in sync.get call, and then for 
                    // same name but as an object if I want to extract its keys and values, and I couldnt think of better way to access received information.
                    var stringified = JSON.stringify(obj);
                    var parsed = JSON.parse(stringified);
                    console.log(stringified);
                    console.log(parsed);
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            var val = obj[key];
                            console.log(val);
                            title = val.title;
                            url = val.url;
                        }
                    };
                    // callback for dealing with async
                    callback(title, url);
                } else {
                    console.error('Error happened!');
                }
            });
        } else {
            console.error('Error happened!');
        }

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
        // localCount++;
        chrome.tabs.query({
            'active': true,
            'currentWindow': true
        }, function (tabs) {
            tabTitle = tabs[0].title;
            storeUrlData();
            console.log(localCount);
        });
    });

}

export default urlHistory;
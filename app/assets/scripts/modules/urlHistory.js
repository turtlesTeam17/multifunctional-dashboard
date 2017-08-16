function urlHistory() {
    var storageCount, tabTitle, url, title;
    var storage = chrome.storage.sync;
    var objects = [];
    var localCount = 0;

    async function main() {
        try {
            var storedUrls = await storage.get(null, function (items) {});
            var globalCount = await storage.get('globalCount', function (items) {});
            var storedUrlsCount = Object.keys(storedUrls).length - 1;

            var results = [storedUrls, globalCount.globalCount, storedUrlsCount]
            return results;
        } catch (err) {
            console.error(err);
        }
    }

    // get count of stored items 
    function getDataCount(y) {
        if (y) {
            if (y > 50) {
                resetCount();
            } else {
                localCount = y;
            }
        }

    };

    // read received data from chrome.storage.get and print it to history table
    function readData(val1, val2) {
        // if values are not undefined 
        if ((val1 && val2) && (val1 != 'undefined' && val2 != 'undefined')) {
            // and if longer than 50 characters
            if (val1.length >= 50) {
                // shorten it so it can fit into one row in table without slicing it in middle of an word(with regex)
                // This expressions returns the first 46 (any) characters plus any subsequent non-space characters.
                var shortenedTitle = val1.replace(/^(.{40}[^\s]*).*/, "$1") + "...";
                $('#urlHistory').append('<tr><td title="' + val1 + '">' + shortenedTitle + '</td><td><a target="_blank" href="' + val2 + '">' + val2 + '</a></td></tr>');
            } else {
                // if its no longer than 50 chars then display it as it is
                $('#urlHistory').append('<tr><td title="' + val1 + '">' + val1 + '</td><td><a target="_blank" href="' + val2 + '">' + val2 + '</a></td></tr>');
            }
        }
    }

    // create array from data received from storage
    function createDataArray(e) {
        var appendKeyPrefix = 'urlData';
        var appendKeyCount = storageCount;
        var keys = [];

        return new Promise((resolve, reject) => {
            $.each(e, function (key) {
                if (key.startsWith(appendKeyPrefix)) {
                    keys.push(key);
                }
            });
            for (var i = 0; i < keys.length; i++) {
                storage.get(keys[i], function (obj) {
                    objects.push(obj);
                })
            }
            console.log(objects);
            resolve(objects);
        });
    }

    function checkForDuplicateKey(item) {
        for (var i = 0; i < objects.length; i++) {
            for (var x in objects[i]) {
                if (objects[i][x].url == item) {
                    console.log('Already in storage!');
                    return true;
                }
            }
        }
    }

    function storeUrlData() {
        var dataObj = {
            'url': $('.shortUrlInfo').text(),
            'title': tabTitle
        };
        if (!(checkForDuplicateKey(dataObj.url))) {
            localCount++;
            storage.set({
                ['urlData' + localCount]: dataObj,
                'globalCount': localCount
            }, function () {
                console.log('Saved to storage: ', dataObj, localCount);
            });
            var notificationMsg = {
                type: "basic",
                title: "Url shortener",
                message: "Url shortened and it's data sent to storage",
                iconUrl: "icons/icon128.png"
            }
            chrome.notifications.create('success', notificationMsg, function () {
                setTimeout(function () {
                    chrome.notifications.clear('success', function () {});
                }, 2000);
            });
        }
    }

    function urlData(o) {
        Object.keys(o).map((e) => {
            if (`${o[e].url}` && `${o[e].title}`) {
                title = `${o[e].title}`;
                url = `${o[e].url}`;
                readData(title, url);
            }
            // console.log(`key=${e}  value1=${o[e].url}  value1=${o[e].title}`)
        });
    }

    function clearStorage() {
        // clearing whole chrome storage
        chrome.storage.sync.clear();
        resetCount();
    }

    function resetCount() {
        storage.get('globalCount', function (items) {
            storage.set({
                'globalCount': 0
            })
        });
        localCount = 0;
    }

    function showAllData() {
        storage.get(null, function (items) {
            var allKeys = Object.keys(items);
            console.log('Items in storage: ' + allKeys);
        });
    }

    // -----------------------------------------------------------------
    document.body.onload = function () {
        // clearStorage();
        showAllData();
        main().then(function (x) {
                console.log(x[0]); // stored Urls Object
                console.log(x[1] + ' globalCount');
                console.log(x[2] + ' storedUrlsCount');
                urlData(x[0]);
                getDataCount(x[1]);
                storageCount = x[2];
                createDataArray(x[0]);
            })
            .catch(err => console.error(err));
    }

    // Listen for change in short-url-info div with custom jQuery event
    $('.shortUrlInfo').on('contentChanged', function () {
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
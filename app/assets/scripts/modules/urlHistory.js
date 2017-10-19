function urlHistory() {
    var storageCount, tabTitle, url, title;
    var storage = chrome.storage.sync;
    var objects = [];
    var localCount = 0;

    // https://stackoverflow.com/a/38641281 for sorting retrieved object before displaying it to history
    var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

    function main() {
        return new Promise (function(resolve, reject){
            try {
            var storedUrls = await storage.get(null, function (items) {});
            var globalCount = await storage.get('globalCount', function (items) {});
            var storedUrlsCount = Object.keys(storedUrls).length - 1;

            var results = [storedUrls, globalCount.globalCount, storedUrlsCount]
            resolve(results);

            } catch (err) {
                console.error(err);
                reject(err);
            }
        }).then(function (x) {
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
    // function for shortening title 
    String.prototype.trimToLength = function(m) {
        return (this.length > m) 
          ? jQuery.trim(this).substring(0, m).split(" ").slice(0, -1).join(" ") + "..."
          : this;
      };

    // read received data from chrome.storage.get and print it to history table
    function readData(val1, val2) {
        // if values are not undefined 
        if ((val1 && val2) && (val1 != 'undefined' && val2 != 'undefined')) {
            // and if longer than 50 characters
            if (val1.length >= 50) {
                var shortenedTitle = val1.trimToLength(47);         
                $('#urlHistory').append('<tr><td title="' + val1 + '">' + shortenedTitle + '</td><td><a target="_blank" href="' + val2 + '">' + val2 + '</a></td></tr>');
            } else {
                // if its no longer than 50 chars then display it as it is
                $('#urlHistory').append('<tr><td title="' + val1 + '">' + val1 + '</td><td><a target="_blank" href="' + val2 + '">' + val2 + '</a></td></tr>');
            }
        }
    }

    // create array from data received from storage
    function createDataArray(e) {
        var appendKeySuffix = 'urlData';
        var appendKeyCount = storageCount;
        var keys = [];
        
        return new Promise((resolve, reject) => {
            $.each(e, function (key) {
                if (key.endsWith(appendKeySuffix)) {
                    keys.push(key);
                }
            });
            var sortedKeys = keys.sort(collator.compare);
            for (var i = 0; i < sortedKeys.length; i++) {
                storage.get(sortedKeys[i], function (obj) {
                    objects.push(obj);
                })
            }
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
                [localCount + '_' + 'urlData']: dataObj,
                'globalCount': localCount
            }, function () {
                console.log('Saved to storage: ', dataObj, localCount);
            });
            var notificationMsg = {
                type: "basic",
                title: "Url shortener",
                message: "Shortened url copied to clipboard, and it's data sent to storage",
                iconUrl: "icons/128.png"
            }
            chrome.notifications.create('success', notificationMsg, function () {
                setTimeout(function () {
                    chrome.notifications.clear('success', function () {});
                }, 3500);
            });
        }
    }
    // write shortened-urls data to history <table></table>
    function urlData(o) {
        Object.keys(o).sort(collator.compare).map((e) => {
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
 
        // clearStorage();
        showAllData();
        main();
    

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

    $('#clear-history').on('click', function () { 
        if (confirm('Are you sure you want to delete data from database?')) {
            clearStorage();
            console.log('Storage cleared');
        } else {
            // Do nothing!
        }
     });

}

export default urlHistory;
// Automagically gets current tab's urls and shorten it
import get_short_url from './bitlyAPIcall';


function shortenTabUrl() {

    var tabUrl;
    var tabTitle;
    var shortUrl;
    
    // getting the URL of the current tab 
    // https://developer.chrome.com/extensions/tabs#method-query
    chrome.tabs.query({
        'active': true,
        'currentWindow': true
    }, function (tabs) {
        tabUrl = tabs[0].url;
        tabTitle = tabs[0].title;
        console.log(tabUrl);
        console.log(tabTitle);

        get_short_url(tabUrl, function (short_url) {
            if (short_url) {
                shortUrl = short_url;
                $('.shortUrlInfo').append('<a href="' + short_url + '" target="_blank">' + short_url + '</a>').trigger('contentChanged');
                $('.url-shortener__qrcode').qrcode({
                    width: 120,
                    height: 120,
                    text: short_url
                });
            } else {
                $('.shortUrlInfo').append('<p> Invalid value </p>');
            }
        });
    });
}

export default shortenTabUrl;
// Automagically gets current tab's urls and shorten it
import get_short_url from './bitlyAPIcall';

function shortenTabUrl() {

    // getting the URL of the current tab 
    chrome.tabs.query({
        'active': true,
        'currentWindow': true
    }, function (tabs) {
        var tabUrl = tabs[0].url;
        console.log(tabUrl);

        get_short_url(tabUrl, function (short_url) {
            console.log(short_url);
            if (short_url) {
                $('.shortUrlInfo').append('<a href="' + short_url + '" target="_blank">' + short_url + '</a>');
                $('.url-shortener__qrcode').qrcode({
                    width: 100,
                    height: 100,
                    text: short_url
                });
            } else {
                $('.shortUrlInfo').append('<p> Invalid value </p>');
            }
        });
    });
}

export default shortenTabUrl;   
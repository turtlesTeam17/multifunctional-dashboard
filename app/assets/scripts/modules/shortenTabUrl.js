// Automagically gets current tab's urls and shorten it
import get_short_url from './bitlyAPIcall';


// http://stackoverflow.com/a/18455088/277133
function copyToClipboard(url) {
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.opacity = 0;
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    document.body.removeChild(input);
};

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
                copyToClipboard(short_url);
            } else {
                $('.shortUrlInfo').append('<p> Invalid value </p>');
            }
        });
    });
}

export default shortenTabUrl;


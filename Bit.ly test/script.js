var login = LOGIN;
var api_key = API;
var long_url;
var tablink;

// https://stackoverflow.com/questions/4760538/using-only-javascript-to-shrink-urls-using-the-bit-ly-api
function get_short_url(long_url, login, api_key, func) {
    $.getJSON(
        "http://api.bitly.com/v3/shorten?", {
            "format": "json",
            "apiKey": api_key,
            "login": login,
            "longUrl": long_url
        },
        function (response) {
            func(response.data.url);
        }
    );
}


// getting the URL of the current tab 
chrome.tabs.query({
    'active': true,
    'currentWindow': true
}, function (tabs) {
    tablink = tabs[0].url;
    long_url = tablink;

    console.log(tablink);

    get_short_url(long_url, login, api_key, function (short_url) {
        console.log(short_url);
        if (short_url) {
            $('#short').append('<a class="shortLink" href="' + short_url + '" target="_blank">' + short_url + '</a>');
            $('#qrCode').qrcode({width: 100,height: 100,text: short_url});
        } else {
            $('#short').append('<p class="shortLink"> Invalid value </p>');
        }
    });
});



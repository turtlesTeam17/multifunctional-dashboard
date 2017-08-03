

function getShortUrl() {
    var login = LOGIN;
    var api_key = API;
    var long_url;
    var tabLink;

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
    // chrome.tabs.query({
    //     'active': true,
    //     'currentWindow': true
    // }, function (tabs) {
    //     tabLink = tabs[0].url;
    //     long_url = tabLink;

    //     console.log(tabLink);

    //     get_short_url(long_url, login, api_key, function (short_url) {
    //         console.log(short_url);
    //         if (short_url) {
    //             $('.url-shortener__info').append('<a class="shortLink" href="' + short_url + '" target="_blank">' + short_url + '</a>');
    //             // $('.url-shortener__qrcode').qrcode({
    //             //     width: 100,
    //             //     height: 100,
    //             //     text: short_url
    //             // });
    //         } else {
    //             $('.url-shortener__info').append('<p class="shortLink"> Invalid value </p>');
    //         }
    //     });
    // });
}

export default getShortUrl;
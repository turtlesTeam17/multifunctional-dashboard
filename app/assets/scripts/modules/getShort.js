

function getShortUrl() {
    var login = "o_2p4gsm6h6i";
    var api_key = "R_0a45a9bb098641f19532ce1c36aabc0d";
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
}

export default getShortUrl;
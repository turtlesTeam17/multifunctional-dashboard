
function get_short_url(longUrl, func) {

    var login = "o_2p4gsm6h6i";
    var api_key = "R_0a45a9bb098641f19532ce1c36aabc0d";

    $.getJSON(
        "http://api.bitly.com/v3/shorten?", {
            "format": "json",
            "apiKey": api_key,
            "login": login,
            "longUrl": longUrl
        },
        function (response) {
            if (!response)
                console.log('Error happened :(');
            else
                func(response.data.url);
        }
    );
}

export default get_short_url;
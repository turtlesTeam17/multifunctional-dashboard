// reads value from input field and shorten it

function readInput() {

    var login = LOGIN;
    var api_key = API;
    var input;
    var long_UrlInput;

    // checking if the user input is a valid url
    // https://stackoverflow.com/questions/30970068/js-regex-url-validation
    function isUrlValid(userInput) {
        var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        if (res == null) {
            console.log('Invalid input!');
            return false;
        } else {
            input = userInput;
            console.log(input);         
            return true;
        }
    }
    // Bit.ly API call
    function get_short_url(longUrl, login, api_key, func) {
        $.getJSON(
            "http://api.bitly.com/v3/shorten?", {
                "format": "json",
                "apiKey": api_key,
                "login": login,
                "longUrl": longUrl
            },
            function (response) {
                if(!response)
                    console.log('Error happened :(');
                else
                    func(response.data.url);
            }
        );
    }
    // writes original and short url to infobox
    function writeUrls(long, short) {
        var shortedLong;
        // Substring displayed url if its longer than 80 chars
        if (long.length > 80) {
            shortedLong = long.substring(0, 80) + '...';
            var longUrl_text = '<p>Original url: <a href="' + long + '">' + shortedLong + '</a></p>';
        } else {
            var longUrl_text = '<p>Original url: <a href="' + long + '">' + long + '</a></p>';
        }
        var shortUrl_text = '<p>Short url: <a href="' + short + '">' + short + '</a></p>';
        $('.longUrlInfo').append(longUrl_text);
        $('.shortUrlInfo').append(shortUrl_text);
    }
    // clears long and short infobox urls
    function clearUrls() {
        $('.longUrlInfo').empty();
        $('.shortUrlInfo').empty();
    }

    $('#shortenButton').on('click', function () {
        clearUrls();
        long_UrlInput = $("#longUrl_input");
        isUrlValid(long_UrlInput.val());
        get_short_url(input, login, api_key, function (short_url) {
            console.log(short_url);
            writeUrls(input, short_url);
        });
        long_UrlInput.val('');
    })
}

export default readInput;
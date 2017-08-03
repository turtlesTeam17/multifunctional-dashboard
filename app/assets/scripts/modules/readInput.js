// reads value from input field and shorten it

function readInput() {
    // init variables and API keys
    var login = "o_2p4gsm6h6i";
    var api_key = "R_0a45a9bb098641f19532ce1c36aabc0d";
    var input;
    var long_UrlInput = $("#longUrl_input");

    // checking if the user input is a valid url
    // https://stackoverflow.com/questions/30970068/js-regex-url-validation
    function isUrlValid(userInput) {
        // Regex ftw
        var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
       // if not valid, displays error message
        if (res == null) {
            console.log('Invalid input!');
            var error_text = '<p>Invalid input!</p>';
            $('.shortUrlInfo').append(error_text);
            return false;
        } else {
            // otherwise sets input to long url value
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
                if (!response)
                    console.log('Error happened :(');
                else
                    func(response.data.url);
            }
        );
    }
    // writes original and short url to infobox
    function writeUrls(long, short) {
        // checks if there is valid short url(otherwise it would print Short url: undefined)
        if(short){
            var shortUrl_text = '<p>Short url: <a href="' + short + '" target="_blank">' + short + '</a></p>';
            $('.shortUrlInfo').append(shortUrl_text);
            $('.url-shortener__qrcode').qrcode({width: 100,height: 100,text: short});
        }
    }
    // clears long and short infobox urls
    function clearUrls() {
        $('.shortUrlInfo').empty();
        $('.url-shortener__qrcode').empty();
    }

    $('#shortenButton').on('click', function () {
        // clear infobox
        clearUrls();
        // check if valid url 
        isUrlValid(long_UrlInput.val());
        // then shorten it
        get_short_url(input, login, api_key, function (short_url) {
            console.log(short_url);
            writeUrls(input, short_url);
        });
        // reset input value
        input = '';
        // reset longurl value
        long_UrlInput.val('');
    })
}

export default readInput;
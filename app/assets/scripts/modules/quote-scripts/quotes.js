/*constructor with attribute definitions*/

export function Quote(slots) {
    this.comment = slots.comment; //isbn
    this.timeStamp = slots.timeStamp;
    this.url = slots.url; //title
    this.quoteText = slots.quoteText; //year
};

//initiate empty array

Quote.instances = {};

// Convert row to object
Quote.convertRow2Obj = function (quoteRow) {
    var quote = new Quote(quoteRow);
    return quote;
  };

//load all quotes
Quote.loadAll = function () {
    var key="", keys=[], quotestring="", quotes={}, i=0;

    //checking if database exists
    try {
        if (localStorage.getItem("quotes")) {
            quotestring = localStorage.getItem("quotes");
        }
    } catch (error) {
        alert("Error while reading from LocalStorage\n" +error);
    }

    if (quotestring) {
        //create obj from string
        quotes = JSON.parse(quotestring);
        //create array of obj's property names - Object.keys method
        keys = Object.keys(quotes);
        console.log(keys.length + " quotes loaded.");
        
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            Quote.instances[key] = Quote.convertRow2Obj(quotes[key]);
        }
    } 
};

//adding methods for Quotes class

Quote.create = function (slots) {
    var newQuote = new Quote(slots);
    //add quote to Quotes table in memory
    Quote.instances[slots.comment] = newQuote;
    console.log("Quote from: \"" + slots.url + "\" added.");
};

//deleting Quote
Quote.destroy = function (comment) {
    if (Book.instances[comment]) {
      console.log("Quote: \"" + comment + "\" deleted.");
      delete Quote.instances[comment];
    } else {
      console.log("There is no Quote with description: \"" + 
          comment + "\" in the database!");
    }
  };

  Quote.saveAll = function () {
    var quoteString="", error=false,
        nmrOfQuotes = Object.keys( Quote.instances).length;  
    try {
      quoteString = JSON.stringify( Quote.instances);
      localStorage.setItem("quotes", quoteString);
    } catch (e) {
      alert("Error when writing to Local Storage\n" + e);
      error = true;
    }
    if (!error) console.log( nmrOfQuotes + " quotes saved.");
  };

  //  Clear database
Quote.clearData = function () {
    if (confirm("Do you really want to delete all quote data?")) {
      //clear memory
      Quote.instances = {};
      //clear local storage
      localStorage.setItem("quotes", "{}");
    }
  };

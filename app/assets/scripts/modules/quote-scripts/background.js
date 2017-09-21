//import * as initialize from './initialize.js';

var ql = { model:{}, view:{}, ctrl:{} };

/*constructor with attribute definitions*/


function Quote(slots) {
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
/***********************************************
***  Methods for the use case createQuote  ******
************************************************/
ql.view.createQuote = {
    setupUserInterface: function () {
      console.log("Reload resources!");
      //location.reload(true);
      console.log("createquote setupuserinterface");
    //   var saveButton = document.getElementById('addQuoteBtn');
      
      Quote.loadAll();
        // Set an event handler for the save/submit button
      var saveButton = document.getElementById('addQuoteBtn');
      saveButton.addEventListener("click", ql.view.createQuote.insertSelection);
    
    
    },
    // save user input data
    insertSelection: function () {
    
      chrome.runtime.onConnect.addListener(function(port) {
        console.assert(port.name == "knockknock");
        port.onMessage.addListener(function(msg) {
          if (msg.joke == "Knock knock")
          {console.log("received response");
          alert(msg.data);}
        
          if (msg.joke == "Knock knock")
          {console.log(msg.joke);
          port.postMessage({question: "Who's there?"});}
          else if (msg.answer == "Madame")
            {console.log(msg.answer);
            port.postMessage({question: "Madame who?"});}
          else if (msg.answer == "Madame... Bovary")
            port.postMessage({question: "I don't get it."}); 
        });
      });
    }

      
        alert("click!");

        var formEl = document.forms['Quote'];
        chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT},
        function(tab){
            chrome.tabs.sendMessage(tab[0].id, {method: "sendingRequest"},
            function(response){
              try {
                if(response){
                  console.log("received response");
                  console.log(response);
                  console.log("Description text: "+ formEl.comment.value);
                  var today = new Date();
                  //create new object 
                  var slots = {comment: formEl.comment.value,
                              timeStamp: today.toLocaleDateString(),
                              url: tab[0].url,
                              quoteText: response.data};
                  //add object as new table instance
                  Quote.create( slots);
                  //remove text from input element
                  formEl.reset();
                  //save new object from memory to local storage
                  Quote.saveAll();
                }  
              } catch (error) {
                alert("No response from selection.js, due to: " + error);
              }
              
            });
        });
        
        
    }
    
  };

  /*******************************************************************
 *                      listQuote use case
 ******************************************************************/

ql.view.listQuotes = {
    setupUserInterface: function () {
      var listButton = document.getElementById('listQuotesBtn');
      listButton.addEventListener("click", ql.view.listQuotes.setupUserInterface);
        var tableBodyEl = document.querySelector("table#quotes>tbody");
      var keys=[], key="", row={}, i=0;
      // load all quote objects
      Quote.loadAll();
      keys = Object.keys( Quote.instances);
      // for each quote, create a table row with a cell for each attribute
      for (i=0; i < keys.length; i++) {
        key = keys[i];
        row = tableBodyEl.insertRow();
        row.insertCell(-1).textContent = Quote.instances[key].comment;      
        row.insertCell(-1).textContent = Quote.instances[key].timeStamp;  
        row.insertCell(-1).textContent = Quote.instances[key].quoteText;
        row.insertCell(-1).textContent = Quote.instances[key].url;
      }
    }
  };



document.addEventListener("DOMContentLoaded", ql.view.createQuote.setupUserInterface);
document.addEventListener("DOMContentLoaded", ql.view.listQuotes.setupUserInterface);
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
/*******************************************************************
 *                      listQuote use case
 ******************************************************************/

import { ql } from "./initialize.js";

ql.view.listQuotes = {
  setupUserInterface: function() {
    var tableBodyEl = document.querySelector("table#quotes>tbody");
    var keys = [],
      key = "",
      row = {},
      i = 0;
    // load all quote objects
    Quote.loadAll();
    keys = Object.keys(Quote.instances);
    // for each quote, create a table row with a cell for each attribute
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      var counter = i + 1;
      Quote.instances[key].quoteIndex = counter;
      row = tableBodyEl.insertRow();
      row.insertCell(-1).textContent = Quote.instances[key].quoteIndex;
      //row.insertCell(-1).textContent = Quote.instances[key].timeStamp;
      row.insertCell(-1).textContent = Quote.instances[key].quoteText;
      //row.insertCell(-1).innerHTML = '<i class="material-icons button delete" id="deleteRow">delete</i>';
      //row.insertCell(-1).textContent = Quote.instances[key].url;
    }
    Quote.saveAll();
  }
};

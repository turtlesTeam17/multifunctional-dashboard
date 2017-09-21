/***********************************************
***  Methods for the use case createQuote  ******
************************************************/
import { ql } from "./initialize.js";

ql.view.createQuote = {
  setupUserInterface: function() {
    console.log("UI set up!");
    var clearButton = document.getElementById("clear-quotes");

    clearButton.addEventListener(
      "click",
      ql.view.createQuote.clearLocalStorage
    );
  },
  // save user input data
  insertSelection: function() {
    var formEl = document.forms["Quote"];
    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      function(tab) {
        console.log("Right about to send message!");
        chrome.tabs.sendMessage(
          tab[0].id,
          { method: "sendingRequest" },
          function(response) {
            try {
              if (response) {
                console.log("received response");
                console.log(response);
                console.log("Description text: " + formEl.comment.value);
                var today = new Date();
                //create new object
                var slots = {
                  comment: formEl.comment.value,
                  timeStamp: today.toLocaleDateString(),
                  url: tab[0].url,
                  quoteText: response.data
                };
                //add object as new table instance
                Quote.create(slots);
                //remove text from input element
                formEl.reset();
                //save new object from memory to local storage
                Quote.saveAll();
              }
            } catch (error) {
              alert("No response from selection.js, due to: " + error);
            }
          }
        );
      }
    );
  },
  clearLocalStorage: function() {
    Quote.clearData();
  }
};

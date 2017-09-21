chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({
    url: chrome.extension.getURL("index.html"),
    selected: true
  });
});

// Open browser popup with key combination Ctrl + Shift + K for Linux
chrome.commands.onCommand.addListener(function(command) {
  console.log("Command:", command);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // notification for colorpicker
  if (message["from"] == "colorPicked") {
    var notificationMsgg = {
      type: "basic",
      title: "Color",
      message:
        "Hex color code copied to clipboard, and it's data sent to color history",
      iconUrl: "icons/128.png"
    };
    chrome.notifications.create("done", notificationMsgg, function() {
      setTimeout(function() {
        chrome.notifications.clear("done", function() {});
      }, 3500);
    });
  }
  return true;
});

var contextMenuItem = {
  id: "addText",
  title: "AddQuote",
  contexts: ["selection"]
};
chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.onClicked.addListener(function(clickData) {
  //return true;
  if (clickData.menuItemId == "addText" && clickData.selectionText) {
    console.log("here");
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
                if (response.data === "") {
                  var notificationMesgg = {
                    type: "basic",
                    title: "Empty data",
                    message: "This site don't allow to copy text. :((",
                    iconUrl: "icons/128.png"
                  };
                  chrome.notifications.create(
                    "boing",
                    notificationMesgg,
                    function() {
                      setTimeout(function() {
                        chrome.notifications.clear("boing", function() {});
                      }, 3000);
                    }
                  );
                  return false;
                }
                var today = new Date();
                var index = today.toTimeString();
                index = index.split(" ")[0];
                console.log("Description text set to: " + index);
                //create new object
                var slots = {
                  comment: index,
                  timeStamp: today.toLocaleDateString(),
                  url: tab[0].url,
                  quoteText: response.data
                };
                var notificationMsgg = {
                  type: "basic",
                  title: "Quote",
                  message:
                    "Added quote to local storage.",
                  iconUrl: "icons/128.png",
                  
                };
                //add object as new table instance
                Quote.create(slots);
                //save new object from memory to local storage
                Quote.saveAll();
                //send notification with timeout
                chrome.notifications.create("bang", notificationMsgg, function() {
                  setTimeout(function() {
                    chrome.notifications.clear("bang", function() {});
                  }, 2800);
                });
              }
            } catch (error) {
              alert("No response from selection.js, due to: " + error);
            }
          }
        );
      }
    );
  }
});

var dataFromSelection = "";
document.addEventListener("mouseup", function(){
  dataFromSelection = window.getSelection().toString();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "sendingRequest") {
      
      sendResponse({data: dataFromSelection});
      return true;
    }
  else
    {
      console.log("No request!");  
      sendResponse({});
      
    } // snub them.
});

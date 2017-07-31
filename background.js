/*
Open a new tab, and load "dashboard.html" into it.
*/
function ext() {
   chrome.tabs.create({
     "url": "/dashboard.html"
   });
}


/*
Add ext() as a listener to clicks on the browser action.
*/
chrome.browserAction.onClicked.addListener(ext);
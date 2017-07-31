

document.addEventListener("click", function(e) {

    var position = {clientX: e.clientX, clientY: e.clientY, width: window.innerWidth, height: window.innerHeight};

    var msg = {"position": position, "from": "position"};

    chrome.runtime.sendMessage(msg);

    console.log(e.clientX);

});
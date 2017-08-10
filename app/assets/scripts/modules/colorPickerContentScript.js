/**
 * Created by Tudor on 8/9/2017.
 * TODO
 * -convert to es6 code
 *
 */

var div, img, colorDiv;

document.addEventListener("click", function(e) {

    var position = {clientX: e.clientX, clientY: e.clientY, width: window.innerWidth, height: window.innerHeight};

    var msg = {"position": position, "from": "position"};

    chrome.runtime.sendMessage(msg);

});


document.addEventListener('scroll', function() {
    chrome.runtime.sendMessage({
        "from": "scroll"
    });
});

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 27) {
        div.parentNode.removeChild(div);
    }
};

document.addEventListener("mousemove", function(e) {
    if (div == null) {
        div = document.createElement("div");
        div.style.width = "110px";
        div.style.height = "43px";
        div.style.position = "absolute";
        //div.style.background = "#232323";
        div.style.backgroundImage = chrome.extension.getURL("eyedropper.png");
        document.body.appendChild(div);




        colorDiv = document.createElement("div");
        colorDiv.style.width = "13px";
        colorDiv.style.height = "13px";
        colorDiv.style.position = "relative";
        colorDiv.style.top = "10px";
        colorDiv.style.left = "10px";
        div.appendChild(colorDiv);


    }

    if (img == null) {
        //document.body.style.cursor = "url(" + chrome.extension.getURL("cursor.png") + ")";
        document.body.style.cursor = "none";
        img = document.createElement("img");
        img.src = chrome.extension.getURL("eyedropper.png");
        img.style.width = "20px";
        img.style.height = "20px";
        img.style.maxHeight = "100%";
        img.style.maxWidth = "100%";
        img.style.position = "absolute";
        document.body.appendChild(img);
    }

    div.style.top = e.pageY - 20 +"px";
    div.style.left = e.pageX + 20 + "px";

    img.style.top = e.pageY +"px";
    img.style.left = e.pageX + "px";


    var position = {clientX: e.clientX, clientY: e.clientY, width: window.innerWidth, height: window.innerHeight};

    var msg = {"position": position, "from": "mousemove"};

    chrome.runtime.sendMessage(msg, function(response) {
        if (response != null) {
            console.log(response);
            colorDiv.style.background = response.hex;
        }

    });

    console.log(img.src);

});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    if (message["from"] == "tab-changed") {
        if (div != undefined || div != null) {
            div.parentNode.removeChild(div);
            console.log("new tab");
        }
    }

    if (message["from"] == "tab-created") {
        if (div != undefined || div != null) {
            div.parentNode.removeChild(div);
        }
    }

});
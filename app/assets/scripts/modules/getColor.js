/**
 * Created by Tudor on 8/9/2017.
 * TODO
 * -convert to es6 code
 */
var clickX, clickY, canvas, context, tabId;

document.addEventListener("DOMContentLoaded", function() {
    //var checkButton = document.getElementById("checkPage");
    var xVal = document.getElementById("x");
    var yVal = document.getElementById("y");
    var hexVal = document.getElementById("hex");

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        if (message["from"] == "position" || message["from"] == "mousemove") {
            console.log(message);
            clickX = message.position.clientX;
            clickY = message.position.clientY;

            xVal.innerHTML = "X: " + clickX;
            yVal.innerHTML = "Y: " + clickY;

            //console.log(context);

            if (context != null) {
                var hex = GetPixel(context, clickX, clickY);
                hexVal.innerHTML = "HEX: " + hex;
                //sendResponse({"hex": hex});
                return true;
            }

        }

        if (message["from"] == "scroll") {
            capture_canvas();
        }




    });

    //checkButton.addEventListener('click', capture_canvas, false);




}, false);

//https://stackoverflow.com/questions/667045/getpixel-from-html-canvas
function GetPixel(context, x, y)
{
    var p = context.getImageData(x, y, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    return hex;
}
//https://stackoverflow.com/questions/667045/getpixel-from-html-canvas
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

//chrome.runtime.sendMessage(msg, function(response) {
//    if (response != null) {
//        console.log(response);
//        colorDiv.style.background = response.hex;
//    }
//
//});

function inject_script_current_tab(file) {

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        console.log("@func -> inject_script_current_tab -> tabs[0].id " + tabs[0].id);
        console.log("@func -> inject_script_current_tab -> file " + file);
        chrome.tabs.executeScript(tabs[0].id, {file: file});

        chrome.tabs.captureVisibleTab(null, {}, function (img) {
            var message;
            //console.log("@func -> inject_script_current_tab -> img " + img);
            message = {
                "from": "color-picker",
                "image": img
            };
            console.log("@func -> inject_script_current_tab -> message.from " + message.from);
            //console.log("@func -> inject_script_current_tab -> message.img " + message.image);
            chrome.tabs.sendMessage(tabs[0].id, {
                "from": "color-picker",
                "image": img
            });
        });

    });
}


function set_tab_id() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        console.log(tabs[0].id);
        return tabs[0].id;
    });
}


function get_tab_id() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        console.log(tabs[0].id);
    });
}

/*

    @func
    -> captures the visible tab
    -> forms a message with the identifier "color-pcker"
    -> sends the message which will be consumed by the content script in "eventpage.js"

 */


function send_image() {

    chrome.tabs.captureVisibleTab({}, function (img) {
        var message;

        message = {
            "from": "color-picker",
            "image": img
        };

        chrome.runtime.sendMessage(message, function(response) {

        });
    });

}


function set_canvas_tab_width(canvas) {
    chrome.tabs.getSelected(null, function(tab) {
        canvas.width = tab.width;
        canvas.height = tab.height;
    });
}

function draw_image_on_canvas(imageSrc, canvas) {
    var im = new Image();

    im.onload = function() {
        context.drawImage(im, 0, 0, canvas.width, canvas.height);
    };

    im.src = imageSrc;
}

chrome.tabs.onActivated.addListener(function() {
    chrome.runtime.sendMessage({"from": "tab-changed"});
});

chrome.tabs.onCreated.addListener(function() {
    chrome.runtime.sendMessage({"from": "tab-created"});
});

function init() {

    console.log(chrome.extension.getURL("color_picker.js"));
    console.log(chrome.runtime.getURL("color_picker.js"));
    inject_script_current_tab("color_picker.js");
}

export default init;
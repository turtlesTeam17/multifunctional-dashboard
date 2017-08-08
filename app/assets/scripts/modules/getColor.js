/**
 * Created by Tudor on 8/9/2017.
 * TODO
 * -convert to es6 code
 */
var clickX, clickY, canvas, context, tabId;

document.addEventListener("DOMContentLoaded", function() {
    var checkButton = document.getElementById("checkPage");
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

            console.log(context);

            if (context != null) {
                var hex = GetPixel(context, clickX, clickY);
                hexVal.innerHTML = "HEX: " + hex;
                sendResponse({"hex": hex});
                return true;
            }

        }

        if (message["from"] == "scroll") {
            capture_canvas();
        }




    });

    checkButton.addEventListener('click', capture_canvas, false);




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

function capture_canvas() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        tabId = tabs[0].id;
        console.log(tabs);
    });

    chrome.tabs.executeScript(tabId, {file: "content_script.js"});
    chrome.tabs.captureVisibleTab(tabId, {}, function (image) {


        if (canvas == null || canvas == undefined) {
            var paragraph = document.createElement("p");
            paragraph.innerHTML = "canvas \\/";
            document.body.appendChild(paragraph);

            canvas = document.createElement("canvas");

            set_canvas_tab_width(canvas);

            context = canvas.getContext("2d");

            draw_image_on_canvas(image, canvas);

            document.body.appendChild(canvas);
        } else {
            draw_image_on_canvas(image, canvas);
        }

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
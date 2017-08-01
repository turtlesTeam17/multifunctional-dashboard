/**
 * Created by Tudor on 7/26/2017.
 */

var clickX, clickY, canvas, context;

document.addEventListener("DOMContentLoaded", function() {
    var checkButton = document.getElementById("checkPage");
    var xVal = document.getElementById("x");
    var yVal = document.getElementById("y");
    var hexVal = document.getElementById("hex");

    //chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    //   if(msg.from = 'click') {
    //       console.log(msg.clientX);
    //   }
    //});

    chrome.tabs.executeScript(null, {file: "content_script.js"});


    console.log("DOM Loaded");

    chrome.runtime.onMessage.addListener(function(message) {
       if (message["from"] == "position") {
           console.log(message);
           clickX = message.position.clientX;
           clickY = message.position.clientY;

           xVal.innerHTML = "X: " + clickX;
           yVal.innerHTML = "Y: " + clickY;

           console.log(context);

           if (context != null) {
               hexVal.innerHTML = "HEX: " + GetPixel(context, clickX, clickY);
           }

       }
    });

    checkButton.addEventListener('click', function() {


        chrome.tabs.captureVisibleTab(null, {}, function (image) {


            var img = document.createElement("img");
            document.body.appendChild(img);
            img.src = image;

            img.id = 'test';

            var paragraph = document.createElement("p");
            paragraph.innerHTML = "canvas \\/";
            document.body.appendChild(paragraph);

            canvas = document.createElement("canvas");

            // https://stackoverflow.com/questions/7932309/add-event-listener-to-only-1-tab-in-chrome-extension
            //chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
            //
            //    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            //        if (tabs[0].id === tabId) {
            //            if (changeInfo && changeInfo.status === 'complete') {
            //                chrome.tabs.sendMessage(tabs[0].id, { data: tab });
            //            }
            //        }
            //        else {
            //            return false;
            //        }
            //    });
            //});

            chrome.tabs.getSelected(null, function(tab) {
                canvas.width = tab.width;
                console.log(tab.width);
                canvas.height = tab.height;
                console.log(tab.height);
            });

            context = canvas.getContext("2d");

            var im = new Image();

            im.onload = function() {
                context.drawImage(im, 0, 0, canvas.width, canvas.height);
            };

            im.src = image;
            document.body.appendChild(canvas);


        });
        
    }, false);




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
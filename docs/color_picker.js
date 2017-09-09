
/* ========== GLOBAL VARIABLES ========== */

/*
 @img tag
 -> image of and eye dropper that moves with the mouse pointer
 -> active when you are picking a color
 */
var eyeDropperImage;

/*
 @div tag
 -> container that wraps around the screenshotCanvas which is an overlay to the webpage and takes it's full width and height
 -> active when you are picking a color
 */
var canvasWrapper;

/*
 @canvas tag
 -> canvas element that is used to draw the screenshot
 -> active when you are picking a color
 */
var screenshotCanvas;

/*
 @span tag
 -> span tag which has the hex color value and the background color at the pointer location
 -> moves with the mouse pointer
 -> active when you are picking a color
 */
var colorText;

/*
 @Object
 @props -> red, green, blue
 -> contains the rgb values of the pixel under the mouse pointer
 */
var rgbVal;


/* ========== EVENT LISTENERS ========== */

/*
 @func registers all event listenres
 => called in the init function
 */
function addEventListeners() {
    document.addEventListener("click", clickListener, true);
    document.addEventListener("scroll", scrollListener, true);
    chromeListeners();
}

/*
 @func called in the "mousemove" event
 -> gets the pixel value at the mouse location and sends it to colorPicker.js to be displayed in the popup
 -> sets-up styles for the colorText and adds it to the document if it doesn't exist else it just updates it's position
 -> sets-up styles for the eyeDropperImage and adds it to the document if it doesn't exist else it just updates it's position
 -> sets the cursor style to "none"
 -> updates the text color in the colorText so that is visible
 */
function mouseMoveListener(e) {

    var pixelValue = getPixel(screenshotCanvas.getContext("2d"), e.clientX, e.clientY);
    var msg = {
        "value": pixelValue,
        "from": "mousemove"
    };
    chrome.runtime.sendMessage(msg);
    if (colorText == null) {
        colorText = document.createElement("span");
        colorText.style.position = "absolute";
        colorText.style.zIndex = "9999";
        colorText.style.width = "100px";
        colorText.style.height = "30px";
        colorText.style.padding = "5px";
        colorText.style.border = "1px solid black";
        document.body.appendChild(colorText);
    }

    if (eyeDropperImage == null || eyeDropperImage == "undefined") {
        eyeDropperImage = document.createElement("img");
        eyeDropperImage.src = chrome.extension.getURL("assets/images/color-picker-black.png");
        eyeDropperImage.style.width = "25px";
        eyeDropperImage.style.height = "25px";
        eyeDropperImage.style.maxHeight = "100%";
        eyeDropperImage.style.maxWidth = "100%";
        eyeDropperImage.style.position = "absolute";
        eyeDropperImage.style.zIndex = "9999";
        document.body.appendChild(eyeDropperImage);
    }

    eyeDropperImage.style.top = e.pageY - 25 +"px";
    eyeDropperImage.style.left = e.pageX + "px";

    colorText.style.visibility = "visible";
    colorText.style.top = e.pageY - 55 + "px";
    colorText.style.left = e.pageX +25 + "px";
    colorText.style.backgroundColor = pixelValue;
    colorText.innerHTML = pixelValue;


    if(document.body.style.cursor != "none") {
        document.body.style.cursor = "none";
    }

    // dynamic change of text color based on background color
    getRGB(colorText.style.backgroundColor);
    var currentColor = Math.round(((parseInt(rgbVal.red) * 299) + (parseInt(rgbVal.green) * 587) + (parseInt(rgbVal.blue) * 114)) / 1000);
    if (currentColor > 125) {
        colorText.style.color = 'black';
    } else {
        colorText.style.color = 'white';

    }
}

/*
 @func called in the "click" event
 -> checks if the canvasWrapper exists
    -> gets the pixel value at the mouse location
    -> calls storeColorPickerData to store the selected color
    -> removes the canvasWrapper and colorText
 -> checks if eyeDropperImage exists
    -> removes eyeDropperImage
 -> removes the mousemove, click, scroll listeners
 */
function clickListener(e) {
    if (document.body.contains(canvasWrapper)) {
        var pixelValue = getPixel(screenshotCanvas.getContext("2d"), e.clientX, e.clientY);
        storeColorPickerData(pixelValue);
        document.body.removeChild(canvasWrapper);
        document.body.removeChild(colorText);
        colorText = null;
        canvasWrapper = null;
        document.body.style.cursor = "auto";
    }

    if (document.body.contains(eyeDropperImage)) {
        document.body.removeChild(eyeDropperImage);
        eyeDropperImage = null;
    }
    document.removeEventListener("mousemove", mouseMoveListener, true);
    document.removeEventListener("click", clickListener, true);
    document.removeEventListener("scroll", scrollListener, true);
}

/*
 @func called in the "scroll" event
 -> checks the canvasWrapper and if it exists it hides it so that is not captured by the screenshot
 -> sends a message to the colorPicker.js module to capture the screen
 -> calls drawScreenShot after the message is received
 */
function scrollListener() {
        if (canvasWrapper != null || canvasWrapper != undefined) {
            canvasWrapper.style.visibility = "hidden";
            colorText.style.visibility = "hidden";
        }

        if(eyeDropperImage != null || eyeDropperImage != undefined) {
            eyeDropperImage.style.visibility = "hidden";
        }

        chrome.runtime.sendMessage({
            "from": "scroll"
        }, function (response) {
            drawScreenShot(response["image"]);
            canvasWrapper.style.visibility = "visible";
            eyeDropperImage.style.visibility = "visible";
            return true;
        });
}

/*
 @func registers chrome message listeners for the color picker
 -> registers "color-picker" message listener fired in colorPicker.js module by capture_screen method
 -> calls drawScreenShot with the received image
 -> registers mouseMoveListener
 */
function chromeListeners() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

        if (message["from"] == "color-picker") {

            drawScreenShot(message["image"]);
            document.addEventListener("mousemove", mouseMoveListener, true);
            return true;
        }

    });
}

/* ========== CANVAS DRAWING FUNCTIONS ========== */

/*
 @func draws the screenshot over the current tab
 @param image -> image source of the screen shot
 -> checks if there is a canvasWapper and if not it creates one
 -> sets up styles for the canvasWrapper
 -> calls draw_image_on_canvas() to draw the screenshot on the canvas
 => the function is called at the start of the script and during scrolling
 */
function drawScreenShot(image) {

    if (canvasWrapper == null || canvasWrapper == undefined) {
        canvasWrapper = document.createElement("div");
        document.body.appendChild(canvasWrapper);
    }

    canvasWrapper.style.visibility = "visible";
    canvasWrapper.style.width = window.innerWidth + "px !important";
    canvasWrapper.style.height = window.innerHeight + "px !important";
    canvasWrapper.style.margin = "0px !important";
    canvasWrapper.style.padding = "0px !important";
    canvasWrapper.style.position = "absolute";
    canvasWrapper.style.top = Math.round(window.pageYOffset) + "px";
    canvasWrapper.style.left = "0px";
    canvasWrapper.style.zIndex = "9998";

    canvasWrapper.innerHTML = "<canvas id='canvas' width='" + window.innerWidth + "' height='" + window.innerHeight + "'></canvas>";

    screenshotCanvas = document.getElementById("canvas");

    draw_image_on_canvas(image, canvas);
}

/*
 @func draws a image on a given canvas
 @param imageSrc -> the image source (in this case in base64) of the image that will be drawn
 @param canvas -> the canvas on which the image will be drawn
 -> creates a new Image object
 -> sets the width and height of the canvas to the window width and height
 -> sets the smoothing to true for better image quality
 -> draws the image onto the canvas
 => used in the drawScreenShot function
 */
function draw_image_on_canvas(imageSrc, canvas) {
    var im = new Image();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var context = canvas.getContext("2d");
    context.mozImageSmoothingEnabled = true;
    context.mzImageSmoothingEnabled = true;
    context.imageSmoothingEnabled = true;
    im.src = imageSrc;
    im.onload = function () {
        context.drawImage(im, 0, 0, canvas.width, canvas.height);
    };

}

/* ========== COLOR MANIPULATION FUNCTIONS ========== */

/*
 @func converts and rgb value to hex
 @param context -> a canvas context
 @param x -> x coordonate of a canvas
 @param y -> y coordonate of a canvas
 SOURCE -> https://stackoverflow.com/questions/667045/getpixel-from-html-canvas
 -> gets image data at a specific x, y coordonate
 -> returns a hex color like "#000000"
 => used in the mousemove and click events
 */
function getPixel(context, x, y) {
    var p = context.getImageData(x, y, 1, 1).data;
    return "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
}

/*
 @func converts and rgb value to hex
 @param r -> red value
 @param g -> green value
 @param b -> blue value
 SOURCE -> https://stackoverflow.com/questions/667045/getpixel-from-html-canvas
 => the function is used to convert rgb values from the canvas to hex values
 */
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

/*
 @func updates the rbgVal variable with the current
 @param str -> hex color
 -> matches hex to rgb values
 => used in the mousemove event to update the rgbVal global variable
 */
function getRGB(str){
    var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    rgbVal = match ? {
        red: match[1],
        green: match[2],
        blue: match[3]
    } : {};
}

/* ========== HELPER FUNCTIONS ========== */

/*
 @func stores the hex color in chrome storage and copies it to the clipboard
 @param color -> hex color
 -> gets the color from chrome storage
 -> checks if the color is a duplicate
    -> if it's not duplicate it adds it to historyColors and updates the chrome storage
    -> calls copyToClipboard to copy the color to the clipboard
 => used in the click event to send the selected color to the storage
 */
function storeColorPickerData(color) {
    chrome.storage.sync.get(null, function (result) {
        // the input argument is ALWAYS an object containing the queried keys
        // so we select the key we need
        var historyColors = result.historyColors || [];

        //add check for duplicates
        var duplicate = historyColors.length !== 0 && historyColors.filter(function (hColor) {
                return hColor == color;
            }).length !== 0;

        if (!duplicate) {

            if (historyColors.length >= 50) {
                historyColors.shift();
            }
            historyColors.push(color);
            // set the new array value to the same key
            chrome.storage.sync.set({
                historyColors: historyColors
            }, function () {
                // copy selected color to clipboard
                copyToClipboard(color);
                // send message to eventpage
                chrome.runtime.sendMessage({
                    "from": "colorPicked"
                }, function (response) {
                    return true;
                });
            });
        }
    });
}

/*
 @func copies a string to the clipboard
 @param item -> the color that will be copied to the clipboard
 -> creates an input element
 -> styles the input to be hidden
 -> sets the value of the input to the item value
 -> selects the input value
 -> copies the selection
 -> removes the input
 => used in storeColorPickerData to copy the color to the clipboard
 */
function copyToClipboard(item) {
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.opacity = 0;
    input.value = item;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    document.body.removeChild(input);
}

/*
 @func initialisation function
 -> initialises the event listeners
 */
function init() {
    addEventListeners();
}

init();
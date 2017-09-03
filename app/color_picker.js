   function storeColorPickerData(color) {

    function copyToClipboard(item) {
        const input = document.createElement("input");
        input.style.position = "fixed";
        input.style.opacity = 0;
        input.value = item;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        document.body.removeChild(input);
    };
        
        chrome.storage.sync.get(null, function (result) {
            // the input argument is ALWAYS an object containing the queried keys
            // so we select the key we need
            var historyColors = result.historyColors || [];
            
            //add check for duplicates    
            var duplicate = historyColors.length !==0 && historyColors.filter(function(hColor){
                return hColor  == color;
            }).length !==0;
           
            if(!duplicate){
                
               if(historyColors.length >= 50){
                    historyColors.shift();
                }
                   historyColors.push(color);
                 // set the new array value to the same key
                 chrome.storage.sync.set({historyColors: historyColors}, function () {
                    console.log(color);
                    // copy selected color to clipboard
                    copyToClipboard(color);
                    // send message to eventpage
                    chrome.runtime.sendMessage({"from": "colorPicked"}, function(response) {
                        return true;
                      });
                 });     
            }
        });
    }

    var div, img, colorDiv, canvasWrapper, canvas, image, debugText;
    document.addEventListener("click", function(e) {
        // check if element exists before trying to remove it
        if(document.body.contains(canvasWrapper)){
            var pixelValue = getPixel(canvas.getContext("2d"), e.clientX, e.clientY);       
            
            storeColorPickerData(pixelValue);
            document.body.removeChild(canvasWrapper);
            document.body.removeChild(debugText);
        } 
    });

    window.onscroll = function() {
        if (canvasWrapper != null || canvasWrapper != undefined) {
            canvasWrapper.style.visibility = "hidden";
        }
        chrome.runtime.sendMessage({
            "from": "scroll"
        }, function(response) {
            drawScreenShot(response["image"]);
            return true;
        });
    };


    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            div.parentNode.removeChild(div);
        }
    };

    document.addEventListener("mousemove", function(e) {
        /*
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
            //document.body.style.cursor = "none";
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

        chrome.runtime.sendMessage(msg);

        */
        var pixelValue = getPixel(canvas.getContext("2d"), e.clientX, e.clientY);
        //console.log(debugText);
         var msg = {"value": pixelValue, "from": "mousemove"};
        chrome.runtime.sendMessage(msg);
        if (debugText == null) {
            debugText = document.createElement("span");
            debugText.style.position = "absolute";
            debugText.style.top = "20px";
            debugText.style.left = "20px";
            debugText.style.zIndex = "9999";
            document.body.appendChild(debugText);

        }


        debugText.innerHTML = getPixel(canvas.getContext("2d"), e.clientX, e.clientY);
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
                return true;
            }
        }

        if(message["from"] == "color-picker") {

            console.log("a");
            drawScreenShot(message["image"]);
            return true;

        }

    });



function set_canvas_tab_width(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw_image_on_canvas(imageSrc, canvas) {
    var im = new Image();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var context = canvas.getContext("2d");
    context.mozImageSmoothingEnabled = true;
    context.mzImageSmoothingEnabled = true;
    context.imageSmoothingEnabled = true;
    im.src = imageSrc;
    im.onload = function() {
        context.drawImage(im, 0, 0, canvas.width, canvas.height);
    };

}

//https://stackoverflow.com/questions/667045/getpixel-from-html-canvas
function getPixel(context, x, y) {
    var p = context.getImageData(x, y, 1, 1).data;
    return "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
}
//https://stackoverflow.com/questions/667045/getpixel-from-html-canvas
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function drawScreenShot(image) {
    if (canvasWrapper != null || canvasWrapper != undefined) {
        //document.body.removeChild(canvas);
    }



    if (canvasWrapper == null || canvasWrapper == undefined) {
        //document.body.removeChild(canvasWrapper);
        canvasWrapper = document.createElement("div");
    }



    canvasWrapper.style.visibility = "visible";
    canvasWrapper.style.width  = window.innerWidth + "px !important";
    canvasWrapper.style.height = window.innerHeight + "px !important";
    canvasWrapper.style.margin = "0px !important";
    canvasWrapper.style.padding = "0px !important";
    canvasWrapper.style.position = "absolute";
    canvasWrapper.style.top = Math.round(window.pageYOffset) + "px";
    canvasWrapper.style.left = "0px";
    canvasWrapper.style.zIndex = "9998";
    document.body.appendChild(canvasWrapper);

    canvasWrapper.innerHTML = "<canvas id='canvas' width='"+ window.innerWidth +"' height='"+  window.innerHeight +"'></canvas>";

    canvas = document.getElementById("canvas");




    //console.log(message["image"]);
    //canvas = document.createElement("canvas");
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    //canvas.style.width  = window.innerWidth + "px !important";
    //canvas.style.height = window.innerHeight + "px !important";
    //canvas.style.margin = "0px !important";
    //canvas.style.padding = "0px !important";
    //canvas.style.position = "absolute";
    //canvas.style.top = Math.round(window.pageYOffset) + "px";
    //canvas.style.left = "0px";
    //canvas.style.zIndex = "9999";

    //var context = canvas.getContext("2d");
    //context.mozImageSmoothingEnabled = true;
    //context.mzImageSmoothingEnabled = true;
    //context.imageSmoothingEnabled = true;
    //document.body.appendChild(canvas);

    //context.drawImage(image, 0, 0, canvas.width, canvas.height);

    draw_image_on_canvas(image, canvas);
}
    var div, img, colorDiv, canvasWrapper, canvas, image, debugText, rgbVal;

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
                    console.log(color);
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

    function mouseMoveListener(e) {
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
        var msg = {
            "value": pixelValue,
            "from": "mousemove"
        };
        chrome.runtime.sendMessage(msg);
        if (debugText == null) {
            debugText = document.createElement("span");
            debugText.style.position = "absolute";
            debugText.style.zIndex = "9999";
            debugText.style.width = "100px";
            debugText.style.height = "30px";
            debugText.style.padding = "5px";
            debugText.style.border = "1px solid black";
            document.body.appendChild(debugText);
        }

        console.log(img);
        if (img == null || img == "undefined") {
            //document.body.style.cursor = "url(" + chrome.extension.getURL("cursor.png") + ")";
            //document.body.style.cursor = "none";
            img = document.createElement("img");
            img.src = chrome.extension.getURL("assets/images/color-picker.png");
            img.style.width = "25px";
            img.style.height = "25px";
            img.style.maxHeight = "100%";
            img.style.maxWidth = "100%";
            img.style.position = "absolute";
            img.style.zIndex = "9999";
            document.body.appendChild(img);
        }

        img.style.top = e.pageY - 25 +"px";
        img.style.left = e.pageX + "px";

        debugText.style.visibility = "visible";
        debugText.style.top = e.pageY - 55 + "px";
        debugText.style.left = e.pageX +25 + "px";
        debugText.style.backgroundColor = pixelValue;
        debugText.innerHTML = pixelValue;


        if(document.body.style.cursor != "none") {
            document.body.style.cursor = "none";
        }

        // dynamic change of text color based on background color
        getRGB(debugText.style.backgroundColor);
        var currentColor = Math.round(((parseInt(rgbVal.red) * 299) + (parseInt(rgbVal.green) * 587) + (parseInt(rgbVal.blue) * 114)) / 1000);
        if (currentColor > 125) {
            debugText.style.color = 'black';
        } else {
            debugText.style.color = 'white';
        }
    }

    function getRGB(str){
        var match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
        rgbVal = match ? {
          red: match[1],
          green: match[2],
          blue: match[3]
        } : {};
      };

    function clickListener(e) {
        if (document.body.contains(canvasWrapper)) {
            var pixelValue = getPixel(canvas.getContext("2d"), e.clientX, e.clientY);
            storeColorPickerData(pixelValue);
            document.body.removeChild(canvasWrapper);
            document.body.removeChild(debugText);
            debugText = null;
            canvasWrapper = null;
            document.body.style.cursor = "auto";
        }

        if (document.body.contains(img)) {
            document.body.removeChild(img);
            img = null;
        }
        document.removeEventListener("mousemove", mouseMoveListener, true);
        document.removeEventListener("click", clickListener, true);
    }

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

    document.addEventListener("click", clickListener, true);

    window.onscroll = function () {
        if (canvasWrapper != null || canvasWrapper != undefined) {
            canvasWrapper.style.visibility = "hidden";
            debugText.style.visibility = "hidden";
        }
        chrome.runtime.sendMessage({
            "from": "scroll"
        }, function (response) {
            drawScreenShot(response["image"]);
            canvasWrapper.style.visibility = "visible";
            return true;
        });
    };


    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            div.parentNode.removeChild(div);
        }
    };

    document.addEventListener("mousemove", mouseMoveListener, true);

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

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

        if (message["from"] == "color-picker") {

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
        im.onload = function () {
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
        canvasWrapper.style.width = window.innerWidth + "px !important";
        canvasWrapper.style.height = window.innerHeight + "px !important";
        canvasWrapper.style.margin = "0px !important";
        canvasWrapper.style.padding = "0px !important";
        canvasWrapper.style.position = "absolute";
        canvasWrapper.style.top = Math.round(window.pageYOffset) + "px";
        canvasWrapper.style.left = "0px";
        canvasWrapper.style.zIndex = "9998";
        document.body.appendChild(canvasWrapper);

        canvasWrapper.innerHTML = "<canvas id='canvas' width='" + window.innerWidth + "' height='" + window.innerHeight + "'></canvas>";

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
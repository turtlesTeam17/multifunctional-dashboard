
(function () {
    var div, img, colorDiv, canvas, image;
    console.log("aas");
    document.addEventListener("click", function(e) {

        var position = {clientX: e.clientX, clientY: e.clientY, width: window.innerWidth, height: window.innerHeight};

        var msg = {"position": position, "from": "position"};

        chrome.runtime.sendMessage(msg);

    });

    window.onscroll = function() {
        console.log("scorll");
        document.body.removeChild(div);
        chrome.runtime.sendMessage({
            "from": "scroll"
        });
    };

    document.addEventListener('onscroll', function() {
        console.log("scorll");
        document.body.removeChild(div);
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

        if(message["from"] == "color-picker") {

            if (canvas != null || canvas != undefined) {
                document.body.removeChild(canvas);
                canvas = null;
            }



            image = document.createElement("img");
            image.style.width =  window.innerWidth + "px";
            image.style.height = window.innerHeight + "px";
            image.src = message["image"];



            //document.body.appendChild(image);

            //console.log(message["image"]);
            canvas = document.createElement("canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.width  = window.innerWidth + "px !important";
            canvas.style.height = window.innerHeight + "px !important";
            canvas.style.margin = "0px !important";
            canvas.style.padding = "0px !important";
            canvas.style.position = "absolute";
            canvas.style.top = Math.round(window.pageYOffset) + "px";
            canvas.style.left = "0px";
            canvas.style.zIndex = "9999";

            var context = canvas.getContext("2d");
            context.mozImageSmoothingEnabled = true;
            context.mzImageSmoothingEnabled = true;
            context.imageSmoothingEnabled = true;

            document.body.appendChild(canvas);

            //context.drawImage(image, 0, 0, canvas.width, canvas.height);

            draw_image_on_canvas(message["image"], canvas);
        }

    });
})();


function set_canvas_tab_width(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw_image_on_canvas(imageSrc, canvas) {
    var im = new Image();
    var context = canvas.getContext("2d");
    im.onload = function() {
        context.drawImage(im, 0, 0, canvas.width, canvas.height);
    };
    im.src = imageSrc;
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
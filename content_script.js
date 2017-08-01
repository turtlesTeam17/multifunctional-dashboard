
var div, img;

document.addEventListener("click", function(e) {

    var position = {clientX: e.clientX, clientY: e.clientY, width: window.innerWidth, height: window.innerHeight};

    var msg = {"position": position, "from": "position"};

    chrome.runtime.sendMessage(msg);

    var p = document.createElement("p");
    //document.body.appendChild(p);
    p.innerHTML = "Test";
    console.log(p);
    //document.body.style.cursor = "none";
    //console.log(chrome.extension.getURL("cursor.cur"));
});

document.addEventListener("mousemove", function(e) {
    if (div == null) {
        div = document.createElement("div");
        div.style.width = "60px";
        div.style.height = "30px";
        div.style.position = "absolute";
        div.style.background = "red";
        document.body.appendChild(div);

        //img = document.createElement("img");
        //img.style.position = "absolute";
        //img.src = chrome.extension.getURL("cursor.png");
        //
        //document.body.appendChild(img);
    }

    div.style.top = e.pageY - 20 +"px";
    div.style.left = e.pageX + 20 + "px";

    img.style.top = e.pageY +"px";
    img.style.left = e.pageX + "px";

});
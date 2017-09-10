/**
 * Created by Tudor on 8/9/2017.

 */

import {COLOR_PICKER_CONTENT_SCRIPT} from './constants.js';
import {showSelectedColor} from '../App.js';
/*

@prop   - insures that the content scrip is ran only once
        -> used in @func inject_script_current_tab
 */

let contentScriptExecuted = false;


/*
 @func -> adds message listeners
 -> message from "scroll" captures and resends the screen to the tab
 => the messages is consumed by the content script
 */

function add_message_listeners() {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        try {
            if (message["from"] == "position" || message["from"] == "mousemove") {
                var selectedColor = message["value"];
                showSelectedColor(selectedColor);
            }
            if (message["from"] == "scroll") {
                console.log("scroll in tab");
                //capture_screen();
                chrome.tabs.captureVisibleTab(null, {"format":"png"}, function (img) {
                    sendResponse(
                        {"image": img}
                    );


                });
                return true;
            }
        } catch (e) {
            console.log("errOR: " + e.message);
        }

        // notification for colorpicker
        if(message["from"] == "colorPicked") {
            var notificationMsgg = {
                type: "basic",
                title: "Color",
                message: "Hex color code copied to clipboard, and it's data sent to color history",
                iconUrl: "icons/icon128.png"
            }
            chrome.notifications.create('done', notificationMsgg, function () {
                setTimeout(function () {
                    chrome.notifications.clear('done', function () {});
                }, 2000);
            });
        }
        return true;
    });
}


/*
 @func adds message for action listeners
 -> listens for tab changes
 -> listens for tabs creates
 => the messages is consumed by the content script
 */
function add_action_listners() {
    chrome.tabs.onActivated.addListener(function() {
        chrome.runtime.sendMessage({"from": "tab-changed"});
    });

    chrome.tabs.onCreated.addListener(function() {
        chrome.runtime.sendMessage({"from": "tab-created"});
    });
}


/*
 @func injects a content script in the current tab
 @param (script) -> name of the file that is to be injected
 if the file is not in the same folder as the manifest, a relative path is needed
 -> gets the id of the current tab
 -> runs the content is script in the current tab
 */
function inject_script_current_tab (script) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        console.log(script);

        if (!contentScriptExecuted) {
            chrome.tabs.executeScript(tabs[0].id, {file: script});
        }

        contentScriptExecuted = true;
    });
}

/*
 @func captures the visible tab and sends it in a message
 -> gets the id of the current tab
 -> captures the visible tab
 -> sends a JSON object with the fields "from": "color-picker" - identifier
 and "image" which is the captured screen
 => the messages is consumed by the content script
 */
function capture_screen() {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        chrome.tabs.captureVisibleTab(null, {}, function (img) {
            chrome.tabs.sendMessage(tabs[0].id, {
                "from": "color-picker",
                "image": img
            });
        });

    });
}


/*
 @func initialises the color picker
 @param (cb) -> function that is called if the protocol is http or https
 -> gets the current tab url
 -> checks if the protocol is http or https
    -> if if the protocol is http or https
        -> adds all the message listners
        -> runs the content script in the current tab
        -> captures the screen and sends it in a message to the current tab
        -> executes the cb function
    -> if not
        -> sends a notification to inform the user and leaves the popup intact
 => this function is used in the main App.js file as an event listner to the click of the color picker button in the popup
 */

function colorPickerInit(cb) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var url = tabs[0].url;
        var urlSplitByColon = url.split(":");
        var protocol = urlSplitByColon[0];
        var urlSplitByPeriod = urlSplitByColon[1].split(".");

        if (urlSplitByPeriod[0] == "//chrome") {
            console.log("denied chrome subdomain");
            var notificationMesageChrome = {
                type: "basic",
                title: "Not allowed",
                message: 'This application cannot be used o a "chrome" subdomain!',
                iconUrl: "icons/icon128.png"
            };
            chrome.notifications.create('done', notificationMesageChrome, function () {
                setTimeout(function () {
                    chrome.notifications.clear('done', function () {});
                }, 4000);
            });
        } else if (protocol == "http" || protocol == "https") {
            console.log(urlSplitByColon);
            console.log(urlSplitByPeriod[0]);
            console.log("allowed");
            add_message_listeners();
            add_action_listners();
            inject_script_current_tab(COLOR_PICKER_CONTENT_SCRIPT);
            capture_screen();
            cb();
        } else {
            console.log("denied protocol");
            var notificationMesageProtocol = {
                type: "basic",
                title: "Not allowed",
                message: "The color picker functionallity is not allowed on this website, try to pick a color on a http or https protocol",
                iconUrl: "icons/icon128.png"
            };
            chrome.notifications.create('done', notificationMesageProtocol, function () {
                setTimeout(function () {
                    chrome.notifications.clear('done', function () {});
                }, 4000);
            });
        }

    });
}

export default colorPickerInit;





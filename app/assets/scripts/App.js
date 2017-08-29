import $ from './vendor/jquery-3.2.1.min';
import './vendor/jquery.qrcode.min';
import './vendor/chrome-extension-async';

import printPalette from './modules/getPalette';
import shortenTabUrl from './modules/shortenTabUrl';
import urlHistory from './modules/urlHistory';
import './modules/tabs';

import colorPickerInit from './modules/colorPicker';
import { storeColorPickerData, printNewHistoryColor, printHistoryColor, printSelectedColor } from './modules/colorHistory';

$(document).ready(function() {
    printHistoryColor(onColorClick);
    $("#eyeDropper").on('click', function() {
        console.log("pick color!");
        colorPickerInit();
    });
    $('#shrinkMe').click(function(){ // or any other event
        $(this).toggleClass('shrink');
    });
});

$("#colorPicker").on("change", function(e) {
    var selectedColor = e.currentTarget.value;
    storeColorPickerData(selectedColor,onColorClick);
    printPalette(selectedColor.substring(1));
    printSelectedColor(selectedColor.substring(1));
});

function onColorClick(selectedColor) {
    printPalette(selectedColor.substring(1));
    printSelectedColor(selectedColor.substring(1));
}

$(document).one('urlShortenerTriggered', function () { 
    shortenTabUrl();
    urlHistory();
 })
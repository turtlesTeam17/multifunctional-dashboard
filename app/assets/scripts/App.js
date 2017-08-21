import $ from './vendor/jquery-3.2.1.min';
import './vendor/jquery.qrcode.min';
import './vendor/chrome-extension-async';

import printPalette from './modules/getPalette';
import shortenTabUrl from './modules/shortenTabUrl';
import urlHistory from './modules/urlHistory';

shortenTabUrl();
urlHistory();

import { storeColorPickerData, printNewHistoryColor, printHistoryColor, printSelectedColor } from './modules/colorHistory';

$(document).ready(function() {
    printHistoryColor(onColorClick);
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

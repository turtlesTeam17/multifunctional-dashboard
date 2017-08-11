import $ from './vendor/jquery-3.2.1.min';

// import readInput from './modules/readInput';
import shortenTabUrl from './modules/shortenTabUrl';
import './vendor/jquery.qrcode.min';
import printPalette from './modules/getPalette';
import { storeColorPickerData, printNewHistoryColor, printHistoryColor } from './modules/colorHistory';
// readInput();
shortenTabUrl();

$(document).ready(function() {
    printHistoryColor(onColorClick);
});

$("#colorPicker").on("change", function(e) {
    var selectedColor = e.currentTarget.value;
    storeColorPickerData(selectedColor);
    printNewHistoryColor(selectedColor, onColorClick);
    printPalette(selectedColor.substring(1));
});

function onColorClick(selectedColor) {
    printPalette(selectedColor.substring(1));
}
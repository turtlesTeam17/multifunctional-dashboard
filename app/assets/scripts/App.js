'use strict';

import $ from './vendor/jquery-3.2.1.min';
import './vendor/jquery.qrcode.min';
import './vendor/chrome-extension-async';

import printPalette from './modules/getPalette';
import shortenTabUrl from './modules/shortenTabUrl';
import urlHistory from './modules/urlHistory';
import './modules/tabs';
import colorInfo from './modules/colorInfoBlock';

import colorPickerInit from './modules/colorPicker';

import * as createQuote from './modules/quote-scripts/createquote.js';
import * as listQuotes from './modules/quote-scripts/listQuotes.js';
import * as setupInterface from './modules/quote-scripts/setupInterface.js';

import { storeColorPickerData, printNewHistoryColor, printHistoryColor, printSelectedColor } from './modules/colorHistory';

$(document).ready(function() {
     printHistoryColor(onColorClick);
     getLastColor().then((selectedColor) => { 
        if(selectedColor){
            printPalette(selectedColor.substring(1));
            printSelectedColor(selectedColor.substring(1));
        }
    });
    
    $("#eyeDropper").on('click', function() {
        console.log("pick color!");
        colorPickerInit();
        $('.options').addClass('invisible');
        $('#colorPickerDiv').addClass('invisible');
        $('.colorInfo').removeClass('invisible');
        colorInfo();
    });
    $('#shrinkMe').click(function(){ // or any other event
        $(this).toggleClass('shrink');
    });
});

export function showSelectedColor(selectedColor){
    printSelectedColor(selectedColor.substring(1));
    printPalette(selectedColor.substring(1));
}

function onColorClick(selectedColor) {
    printPalette(selectedColor.substring(1));
    printSelectedColor(selectedColor.substring(1));
}

$(document).one('urlShortenerTriggered', function () { 
    shortenTabUrl();
    urlHistory();
 })

async function getLastColor(){
    var history = await chrome.storage.sync.get('historyColors');
    if(history.historyColors){
        return history.historyColors[history.historyColors.length-1];    
    }
    else return null;
    
}
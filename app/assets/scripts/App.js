'use strict';

import $ from './vendor/jquery-3.2.1.min';
import './vendor/jquery.qrcode.min';

import printPalette from './modules/getPalette';
import shortenTabUrl from './modules/shortenTabUrl';
import urlHistory from './modules/urlHistory';
import './modules/tabs';
import colorInfo from './modules/colorInfoBlock';

import colorPickerInit from './modules/colorPicker';

import * as createQuote from './modules/quote-scripts/createQuote.js';
import * as listQuotes from './modules/quote-scripts/listQuotes.js';
import * as setupInterface from './modules/quote-scripts/setupInterface.js';


import {
    storeColorPickerData,
    printNewHistoryColor,
    printHistoryColor,
    printSelectedColor
} from './modules/colorHistory';

$(document).ready(function () {
    printHistoryColor(onColorClick);
    getLastColor().then((selectedColor) => {
        if (selectedColor) {
            printPalette(selectedColor.substring(1));
            printSelectedColor(selectedColor.substring(1));
        }
    });

    $("#eyeDropper").on('click', function () {
        console.log("pick color!");
        colorPickerInit(function () {
            $('.options').addClass('invisible');
            $('#colorPickerDiv').addClass('invisible');
            $('.colorInfo').removeClass('invisible');
            console.log("aa");
            colorInfo();
        });
    });
    $('#shrinkMe').click(function () { // or any other event
        $(this).toggleClass('shrink');
    });
    
    $(document).one('urlShortenerTriggered', function () {
        shortenTabUrl();
        urlHistory();
    })
});

export function showSelectedColor(selectedColor) {
    printSelectedColor(selectedColor.substring(1));
    printPalette(selectedColor.substring(1));
}

function onColorClick(selectedColor) {
    printPalette(selectedColor.substring(1));
    printSelectedColor(selectedColor.substring(1));
}

function getLastColor() {
    return new Promise(function (resolve, reject) {
        var history = chrome.storage.sync.get('historyColors', function (history) {
            if (history.historyColors) {
                resolve(history.historyColors[history.historyColors.length - 1]);
            } else {
                resolve(null);
            }
        });
    }).then(function (color) {
        return (color);
    })
}
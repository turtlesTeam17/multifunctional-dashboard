import $ from './vendor/jquery-3.2.1.min';
import './vendor/jquery.qrcode.min';

import './modules/history';
import printPalette from './modules/getPalette';
import shortenTabUrl from './modules/shortenTabUrl';

shortenTabUrl();


$("#colorPicker").on("change",function(e){
    console.log("color",e.currentTarget.value);
     $("#palette").empty();
     var content = printPalette(e.currentTarget.value.substring(1));
});


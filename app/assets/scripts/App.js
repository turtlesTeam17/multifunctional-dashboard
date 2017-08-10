import $ from './vendor/jquery-3.2.1.min';
import './vendor/jquery.qrcode.min';

import printPalette from './modules/getPalette';
import shortenTabUrl from './modules/shortenTabUrl';
import urlHistory from './modules/history';

shortenTabUrl();
urlHistory();


$("#colorPicker").on("change",function(e){
    console.log("color",e.currentTarget.value);
     $("#palette").empty();
     var content = printPalette(e.currentTarget.value.substring(1));
});


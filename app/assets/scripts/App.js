import $ from './vendor/jquery-3.2.1.min';
    
// import readInput from './modules/readInput';
import shortenTabUrl from './modules/shortenTabUrl';
import './vendor/jquery.qrcode.min';
import printPalette from './modules/getPalette';
// readInput();
shortenTabUrl();


$("#colorPicker").on("change",function(e){
    console.log("color",e.currentTarget.value);
     $("#palette").empty();
     var content = printPalette(e.currentTarget.value.substring(1));
});


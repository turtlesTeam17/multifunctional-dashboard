import $ from './vendor/jquery-3.2.1.min';
    
// import readInput from './modules/readInput';
import shortenTabUrl from './modules/shortenTabUrl';
import './vendor/jquery.qrcode.min';
import printPalette from './modules/getPalette';
import {storeColorPickerData,printNewHistoryColor,printHistoryColor} from './modules/colorHistory';
// readInput();
shortenTabUrl();

 $(document).ready(function(){
 	console.log("ready, should print color history here");
 	printHistoryColor();
});

$("#colorPicker").on("change",function(e){

     $("#palette").empty();
     var selectedColor = e.currentTarget.value;
  		storeColorPickerData(selectedColor);
  		printNewHistoryColor(selectedColor);
     	printPalette(selectedColor.substring(1));
});

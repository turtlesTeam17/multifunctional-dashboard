
import {STORAGE_LIMIT, NUM_COLUMNS } from './constants';
import {hexToRgb} from './getPalette';
 export  function storeColorPickerData(color,onColorClick) {
        
        chrome.storage.sync.get(null, function (result) {
            // the input argument is ALWAYS an object containing the queried keys
            // so we select the key we need
            var historyColors = result.historyColors || [];
            
            //add check for duplicates    
            var duplicate = historyColors.length !==0 && historyColors.filter(function(hColor){
                return hColor  == color;
            }).length !==0;
           
            if(!duplicate){
                
               if(historyColors.length >= STORAGE_LIMIT){
                    historyColors.shift();
                }
                   historyColors.push(color);
                 // set the new array value to the same key
                 chrome.storage.sync.set({historyColors: historyColors}, function () {
                    console.log("storedColor",historyColors);
                 }); 
              if(historyColors.length >= STORAGE_LIMIT){
                    printHistoryColor(onColorClick);
               }
               else{

                  printNewHistoryColor(color,onColorClick);
               }
                
            }
            
        });
    }
export  function printHistoryColor(onColorClick){
    //get histoyColors array from chrome storage and print them to #color-history div
        chrome.storage.sync.get('historyColors', function (result) {
            if (result.historyColors) {
                var content = "<table id='color-history-elements'";
                var columns = NUM_COLUMNS;
                for(var i=0;i < result.historyColors.length;i++){
                    if(columns == NUM_COLUMNS){
                        content+="<tr>"
                    }
                    content +="<td  color='"+result.historyColors[i]+"' style='border: 2px solid white; background-color:"+result.historyColors[i]+"'></td>";
                    columns--;
                    if(columns == 0){
                        content+="</tr>";
                        columns = NUM_COLUMNS;
                    }
                    
                }
                content +="</table>";
                $("#color-history").empty();
                $("#color-history").append(content);
                //add click events for every color history td element added to the history table
                $( "#color-history-elements td").on("click",function(e){
                    onColorClick(e.currentTarget.attributes.color.value);
                });
            } else {
                console.log('No colors saved in history!');
            }
        });
   }     

export function printNewHistoryColor(color,onColorClick){
    var content =$("#color-history-elements").length ==0  ?"<table id='color-history-elements'>":"";
    //check if there are two elements in the row, if yes add new row, otherwise add column to existing row
    var checkcolumnSize  = $("#color-history-elements tbody")[0] ?$("#color-history-elements tbody")[0].lastElementChild.children.length:0; 
  
   if(checkcolumnSize == 2 || checkcolumnSize ==0)
        {
            content +="<tr><td color='"+color+"'style='border: 2px solid white; background-color:"+color+"'></td></tr>";
            if($("#color-history-elements").length ==0){
              content+="</table>";
               $("#color-history").append(content);   
            }else{
               $("#color-history-elements").append(content);   
            }
                   
        }
        else if(checkcolumnSize == 1){
            content = "<td color='"+color+"' style=' border: 2px solid white; background-color:"+color+"'></td>";
            $($("#color-history-elements tbody")[0].lastElementChild).append(content);

        }

        //add click handler to display color palette on the added element to the color history table
       $("#color-history-elements tr:last-child td:last-child").on("click",function(e){
                onColorClick(e.currentTarget.attributes.color.value);
        });
   }     
export function printSelectedColor(color){
      $('#selectedColor').css('background-color',"#"+color);
      $('#scHex').text("#"+color);
      var rgbValues = hexToRgb("#"+color);
      $('#scRGB').text("rgb("+parseInt(rgbValues[1],16)+","+parseInt(rgbValues[2],16)+","+parseInt(rgbValues[3],16)+")");
}
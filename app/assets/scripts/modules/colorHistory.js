
const NUM_COLUMNS = 2;
 export  function storeColorPickerData(color) {
        // by passing an object you can define default values e.g.: []
        chrome.storage.sync.get(null, function (result) {
            // the input argument is ALWAYS an object containing the queried keys
            // so we select the key we need
            var historyColors = result.historyColors || [];
            historyColors.push(color);
            // set the new array value to the same key
            chrome.storage.sync.set({historyColors: historyColors}, function () {
                 console.log("storedColor",historyColors);
            });
        });
    }
export  function printHistoryColor(){
        chrome.storage.sync.get('historyColors', function (result) {
            var content = "<table id='color-history-elements'";
            var columns = NUM_COLUMNS;
            for(var i=0;i < result.historyColors.length;i++){
                if(columns == NUM_COLUMNS){
                    content+="<tr>"
                }
                content +="<td style='width:50px; height:50px; background-color:"+result.historyColors[i]+"'></td>";
                columns--;
                if(columns == 0){
                    content+="</tr>";
                    columns = NUM_COLUMNS;
                }
                
            }
            content +="</table>";
            $("#color-history").append(content);
        });
   }     

export function printNewHistoryColor(color){
    var content ="";
    var checkcolumnSize  = $("#color-history-elements tbody")[0] ?$("#color-history-elements tbody")[0].lastElementChild.children.length:0; 
    console.log("checkcolumnSize",checkcolumnSize);
    if(checkcolumnSize == 2 || checkcolumnSize ==0)
        {
            content ="<tr><td style='width:50px; height:50px; background-color:"+color+"'></td></tr>";
             $("#color-history-elements").append(content);           
        }
        else if(checkcolumnSize == 1){
            content = "<td style='width:50px; height:50px; background-color:"+color+"'></td>";
            $($("#color-history-elements tbody")[0].lastElementChild).append(content);
        }
   }     

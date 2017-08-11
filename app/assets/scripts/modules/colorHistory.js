
const NUM_COLUMNS = 2;
 export  function storeColorPickerData(color) {
      
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
                    content +="<td  color='"+result.historyColors[i]+"'style='background-color:"+result.historyColors[i]+"'></td>";
                    columns--;
                    if(columns == 0){
                        content+="</tr>";
                        columns = NUM_COLUMNS;
                    }
                    
                }
                content +="</table>";
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
    var content ="";
    //check if there are two elements in the row, if yes add new row, otherwise add column to existing row
    var checkcolumnSize  = $("#color-history-elements tbody")[0] ?$("#color-history-elements tbody")[0].lastElementChild.children.length:0; 
  
   if(checkcolumnSize == 2 || checkcolumnSize ==0)
        {
            content ="<tr><td color='"+color+"'style='background-color:"+color+"'></td></tr>";
             $("#color-history-elements").append(content);           
        }
        else if(checkcolumnSize == 1){
            content = "<td color='"+color+"' style='background-color:"+color+"'></td>";
            $($("#color-history-elements tbody")[0].lastElementChild).append(content);

        }

        //add click handler to display color palette on the added element to the color history table
       $("#color-history-elements tr:last-child td:last-child").on("click",function(e){
                onColorClick(e.currentTarget.attributes.color.value);
        });
   }     

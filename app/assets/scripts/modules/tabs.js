import $ from '../vendor/jquery-3.2.1.min';

// http://bit.ly/2veWndP
$(document).ready(function () {
    $('ul.tabs li').click(function () {
        var tab_id = $(this).attr('data-tab'); // grab the data-tab attribute and assign the same to tab_id variable
        $('ul.tabs li').removeClass('active'); // remove the current class from all list elements and our DIV.tab-content elements  
        $('.tab-content').removeClass('active');
        $(this).addClass('active'); // add the “active” class to the clicked list element and DIV tab with the grabbed data-tab ID
        $("#" + tab_id).addClass('active');
        
        if($(this).attr('data-tab') == 'urlShortenerDiv'){
            $(document).trigger('urlShortenerTriggered');
        };
    })
});

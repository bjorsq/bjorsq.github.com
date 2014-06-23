/*! Github scripts */
jQuery(function($){

	/* inlinemultiselect */
    /* normal conversion - using all defaults */
    $('select.normal').inlinemultiselect();
    $('select.replaceall').inlinemultiselect({
        replaceForAll:'[All options selected]'
    });
    /* example showing how to limit selection */
    $('select.limit').inlinemultiselect({
        maxSelected:{"thirdSelect": 3},
        showAllLink:false,
        showNoneLink:false
    });
    /* example with images used as links */
    $('select.imagelink').inlinemultiselect({
        triggerPopup:{
            empty:'<span class="add-options">add options</span>',
            nonempty:'<span class="edit-options">edit options</span>',
            disabled:'<span class="disabled-options">disabled</span>'
        }
    });
    /* example using different separators */
    $('select.semicolon').inlinemultiselect({
        separator:'; ',
        endSeparator:'; and ',
        endSeparatorSpecial:{
            tenthSelect:'; and finally'
        }
    });
    /* example showing customisation of button menu */
    $('select.noall').inlinemultiselect({
        'showAllLink':false
    });
    /* example showing use of callback when selection has changed */
    $('select.withcallback').inlinemultiselect({
        showAllLink:false,
        showNoneLink:false,
        changeCallback:function(options){
            var out = '<p><strong>0ption clicked</strong></p><table border="1" cellspacing="1"><tr><th>id</th><th>title</th><th>value</th><th>name</th><th>checked?</th></tr>';
            out += '<tr><td>'+$(this).attr('id')+'</td><td>'+$(this).attr('title')+'</td><td>'+$(this).attr('value')+'</td><td>'+$(this).attr('name')+'</td><td>'+($(this).attr('checked')? 'true':'false')+'</td></tr>';
            out += '</table>';
            if (options.length) {
                out += '<p><strong>All options</strong></p><table border="1" cellspacing="1"><tr><th>id</th><th>title</th><th>value</th><th>name</th><th>checked?</th></tr>';
                for (var i = 0;i < options.length; i++) {
                	out += '<tr><td>'+options[i].id+'</td><td>'+options[i].title+'</td><td>'+options[i].value+'</td><td>'+options[i].name+'</td><td>'+(options[i].checked? 'true':'false')+'</td></tr>';
                }
                out += '</table>';
            } else {
                out += '<p>No options selected</p>';
            }
            $('#optiondump').html(out);
        }
    });
    /* example showing possible use as a filter for other content */
    $('select.tagfilter').inlinemultiselect({
        showAllLink:false,
        showNoneLink:false,
        changeCallback:function(options){
            var allowedClasses = [];
            if (options.length) {
                for (var i = 0;i < options.length; i++) {
                    if (options[i].checked) {
                        allowedClasses.push(options[i].value);
                    }
                }
                $('#thinglist li').each(function(){
                    var hideme = true;
                    for (var j = 0; j < allowedClasses.length; j++) {        
                        if ($(this).hasClass(allowedClasses[j])) {
                            hideme = false;
                        }
                    }
                    if (hideme) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
            }
        }
    });
    $('#thinglist li').hide();
});	

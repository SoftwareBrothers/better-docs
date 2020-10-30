$(window).on('load', () => {
    if(window.location.hash){
        //If the browser doesn't take us to the right place, then manually scroll there.
        let currentPos = $('#main-content-wrapper').scrollTop();
        let anchorPos = $('a.href-link[href="'+window.location.hash+'"]').offset().top;
        let margin = Math.round(anchorPos*0.05);
        let posMin = anchorPos-margin+currentPos;
        let posMax = anchorPos+margin+currentPos;
        if(anchorPos >= posMin && anchorPos <= posMax){
            $('a:not(.href-link)[href="'+window.location.hash+'"]').click();
        }
    }
    if(usePropertyFolding){
        $('table.props .property-opener, table.params .property-opener').on('click', function(e){
            let row = $(this).parents('tr').first();
            togglePropertyFold(row);
            e.preventDefault();
        });
    }
});

function togglePropertyFold(row){
    //let row = $(this).parents('tr').first();
    let table = row.parents('table').first();
    let propName = row.attr('data-prop');
    let level = parseInt(row.attr('data-level'));
    let levelRows = table.find('tr[data-parentprop="'+propName+'"][data-level="'+(level+1)+'"]').toArray();
    
    let toToggle = Object.assign([], levelRows);
    let levelRow;
    while(levelRow = levelRows.pop()){
        propName = $(levelRow).attr('data-prop');
        level = parseInt($(levelRow).attr('data-level'));
        let tempRows = table.find('tr[data-parentprop="'+propName+'"][data-level="'+(level+1)+'"]').toArray();
        tempRows.forEach((elem) => {
            toToggle.push($(elem));
            levelRows.push($(elem));
        });
    }
    //toToggle now contains all the rows that need to be toggled
    let opening = !row.hasClass('is-open');
    if(opening){
        //row.removeClass('was-closed').addClass('was-open');
        row.find('.property-opener i').removeClass('fa-caret-right').addClass('fa-caret-down');
        row.removeClass('is-closed').addClass('is-open');
    }else{
        //row.removeClass('was-open').addClass('was-closed');
        row.find('.property-opener i').removeClass('fa-caret-down').addClass('fa-caret-right');
        row.removeClass('is-open').addClass('is-closed');
    }
    toToggle.forEach(elem => {
        elem = $(elem);
        if(opening){
            //restore previous toggle state
            elem.removeClass('hide is-closed').addClass('show is-open');
            elem.find('.property-opener i').removeClass('fa-caret-right').addClass('fa-caret-down');
        }else{
            elem.removeClass('show is-open').addClass('hide is-closed');
            elem.find('.property-opener i').removeClass('fa-caret-down').addClass('fa-caret-right');
        }
    });
}
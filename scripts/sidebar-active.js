$().ready(() => {
  //If we are using navigation folding, then listen to click events and restore
  //the folded state
  if(useNavFolding){
    initSubcatFolding();
    initMemberFolding();
    restoreSubcatFolding();
    restoreMemberFolding();
  }
  
  //Set the active sidebar link based on the url
  restoreSideNavActiveState();
  //set the scroll position of the sidebar back to where it was
  restoreSideNavScrollState();
  //register scroll event to keep track of the scroll position
  initSideNavScrollState();
});

function initSubcatFolding(){
  $('.use-nav-folding .sidebar .category.nested .subcategories > li > a').on('click', function(){
      var a = $(this);
      var parent = a.parent();
      
      let foldState = window.localStorage.getItem('subcatFoldState');
      if(!foldState){
        foldState = {opened:[], closed:[]};
      }else{
        foldState = JSON.parse(foldState);
      }
      let cat = a.attr('data-subcat');
      //let selector = '.sidebar .category.nested .subcategories a[data-subcat="'+cat+'"]';
      if(parent.hasClass('opened')){
          parent.removeClass('opened').addClass('closed');
          a.find('i').removeClass('fa-caret-down').addClass('fa-caret-right');
          let index = foldState.opened.indexOf(cat);
          if(cat && index >= 0){
            foldState.opened.splice(index,1);
            
          }
          if(cat && foldState.closed.indexOf(cat) < 0){
            foldState.closed.push(cat);
          }
      }else{
          parent.removeClass('closed').addClass('opened');
          a.find('i').removeClass('fa-caret-right').addClass('fa-caret-down');
          let index = foldState.closed.indexOf(cat);
          if(cat && index >= 0){
            foldState.closed.splice(index, 1);
          }
          if(cat && foldState.opened.indexOf(cat) < 0){
            foldState.opened.push(cat);
          }
      }
      window.localStorage.setItem('subcatFoldState', JSON.stringify(foldState));
  });
}

function initMemberFolding(){
  $('.use-nav-folding .sidebar .member-opener').on('click', function(){
    let container = $(this).parents('.member-container').first();
    let icon = $(this).find('i').first();
    
    let memberFoldState = window.localStorage.getItem('memberFoldState');
    if(!memberFoldState){
      memberFoldState = {opened:[], closed:[]};
    }else{
      memberFoldState = JSON.parse(memberFoldState);
    }
    
    let selector = 'a[data-member="'+$(this).attr('data-member')+'"]';
    if(container.parents('.subcategories').length > 0){
      //this is a member in a subcategory
      
      let cat = container.parents('[data-cat]').first();
      let subcat = cat.find('[data-subcat]').first();
      selector = '[data-cat="'+cat.attr('data-cat')+'"] [data-subcat="'+subcat.attr('data-subcat')+'"] '+selector;
    }else{
      selector = '> .member-container > '+selector;
    }
    
    if(container.hasClass('opened')){
      //we are closing
      container.removeClass('opened').addClass('closed');
      icon.removeClass('fa-caret-down').addClass('fa-caret-right');
      let index = memberFoldState.opened.indexOf(selector);
      if(index >= 0){
        memberFoldState.opened.splice(index, 1);
      }

      if(memberFoldState.closed.indexOf(selector) < 0){
        memberFoldState.closed.push(selector);
      }
      
    }else{
      //we are opening
      container.removeClass('closed').addClass('opened');
      icon.removeClass('fa-caret-right').addClass('fa-caret-down');
      
      if(memberFoldState.opened.indexOf(selector) < 0){
        memberFoldState.opened.push(selector);
      }
      let index = memberFoldState.closed.indexOf(selector);
      if(index >= 0){
        memberFoldState.closed.splice(index, 1);
      }
    }
    
    window.localStorage.setItem('memberFoldState', JSON.stringify(memberFoldState));
  });
}

function restoreSubcatFolding(){
  //re-open any nested categories that were open before this page was loaded
  let foldState = window.localStorage.getItem('subcatFoldState');
  if(!foldState){
    foldState = {opened:[], closed:[]};
  }else{
    foldState = JSON.parse(foldState);
  }
  foldState.opened.forEach(subCat => {
    //let the click handler open this element, so everything stays consistent
    $('.sidebar .category.nested .subcategories [data-cat].closed [data-subcat="'+subCat+'"]').click();
  });
  
  foldState.closed.forEach(subCat => {
    //let the click handler close this element, so everything stays consistent
    $('.sidebar .category.nested .subcategories [data-cat].opened [data-subcat="'+subCat+'"]').click();
  });
}

function restoreMemberFolding(){
  let memberFoldState = window.localStorage.getItem('memberFoldState');
    if(!memberFoldState){
      memberFoldState = {opened:[], closed:[]};
    }else{
      memberFoldState = JSON.parse(memberFoldState);
    }
    
    
    memberFoldState.opened.forEach(selector => {
      let member = $('.sidebar .category '+selector);
      //This member should be opened
      if(member.length > 0 && !member.parents('.member-container').first().hasClass('opened')){
        //member is not opened. Trigger a click to let the event handler open it
        member.click();
      }
    });
    
    memberFoldState.closed.forEach(selector => {
      let member = $('.sidebar .category '+selector);
      //This member should be closed
      if(member.length > 0 && !member.parents('.member-container').first().hasClass('closed')){
        //member is not closed. Trigger a click to let the event handler close it
        member.click();
      }
    });
}


function initSideNavScrollState(){
  $('#sidebarNav').on('scroll', function(){
    let scrollState = window.localStorage.getItem('scrollState');
    if(!scrollState){
      scrollState = {};
    }else{
      scrollState = JSON.parse(scrollState);
    }
    if(!scrollState.hasOwnProperty('sidebarNav')){
      scrollState.sidebarNav = 0;
    }
    scrollState.sidebarNav = $('#sidebarNav').scrollTop();
    window.localStorage.setItem('scrollState', JSON.stringify(scrollState));
  });
}

function restoreSideNavScrollState(){
  let scrollState = window.localStorage.getItem('scrollState');
  if(!scrollState){
    scrollState = {};
  }else{
    scrollState = JSON.parse(scrollState);
  }
  if(scrollState.hasOwnProperty('sidebarNav')){
    $('#sidebarNav').scrollTop(scrollState.sidebarNav);
  }else{
    let target = getSideNavActiveElem();
    if(target){
      $('#sidebarNav').scrollTop(target.offset().top - 150);
    }
  }
}

function restoreSideNavActiveState(){
  if($('#sidebarNav a.active').length == 0){
    let target = getSideNavActiveElem();
    if(target && !target.is('.active')){
      target.addClass('active');
    }
  }
}

function getSideNavActiveElem(){
  let currentActive = $('#sidebarNav a.active');
  if(currentActive.length == 0){
    let target = $('#sidebarNav a[href="'+window.location.pathname.replace('/','')+'"]');
    if(!target || target.length == 0 && window.location.hash){
        target = $('#sidebarNav a[href="'+window.location.pathname.replace('/','')+window.location.hash+'"]');
    }
    if(target && target.length > 0){
      return target.first();
    }else{
      return null;
    }
  }else{
    return currentActive.first();
  }
}
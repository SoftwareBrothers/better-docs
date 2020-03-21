$().ready(() => {
  $('#sidebarNav a').each((index, el) => {
    const href = $(el).attr('href');
    if (window.location.pathname.match('/' + href)) {
      $(el).addClass('active')
      $('#sidebarNav').scrollTop($(el).offset().top - 150)
    }
  })
})
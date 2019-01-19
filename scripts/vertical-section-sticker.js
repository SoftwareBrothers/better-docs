$().ready(() => {
  const verticalSections = $('.vertical-section')

  if (verticalSections.length > 0) {
    const leftOffset = verticalSections.offset().left
    $(window).scroll((e) => {
      verticalSections.each((i, el) => {
        const verticalSection = $(el)
        const bottomOfASection = verticalSection.offset().top + verticalSection.height()
        const topOfASection = verticalSection.offset().top
        const sectionTitleHeight = verticalSection.find('.title').height()
        const isSectionCurrentlyViewed = 
          window.pageYOffset > topOfASection &&
          window.pageYOffset < bottomOfASection

        if (isSectionCurrentlyViewed) {
          // verticalSection.addClass('active')
          if (window.pageYOffset > ( bottomOfASection - sectionTitleHeight )) {
            verticalSection.find('.title').css({ left: 0, position: 'absolute', bottom: '0', top: 'auto'})
          } else {
            verticalSection.find('.title').css({ left: leftOffset, bottom: 'auto', position: 'fixed', top: 0})
          }
        } else {
          // verticalSection.removeClass('active')
          verticalSection.find('.title').css({ left: 0, position: 'absolute' })
        }
      })
    })
  }
})
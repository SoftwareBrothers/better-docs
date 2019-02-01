$().ready(() => {
  const verticalSections = $('.vertical-section')

  /**
   * it positions section header that it sticks to the left side of the section and
   * follows scroll position until the end of a section.
   * 
   * @param {JQuery} verticalSection particular section of methods/members in the UI
   *                                 identified by a '.vertical-section' class
   * @param {Number} leftOffset      offset of the header from the left side of the page
   */
  const positionSectionHeader = (verticalSection, leftOffset) => {
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
  }

  if (verticalSections.length > 0) {
    let leftOffset = verticalSections.offset().left
    $(window).resize((e) => {
      leftOffset = verticalSections.offset().left
      verticalSections.each((i, el) => {
        positionSectionHeader($(el), leftOffset)
      })
    })
    $(window).scroll((e) => {
      verticalSections.each((i, el) => {
        positionSectionHeader($(el), leftOffset)
      })
    })
  }
})
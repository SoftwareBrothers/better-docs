const OFFSET = 150

$().ready(() => {
  const wrapper = $('#side-nav')

  /**
   * @type  {Array<{link: El, offset: number}>}
   */
  const links = []

  if (!$('.vertical-section').length) {
    wrapper.hide()
  }
  
  if(subsectionsInSideNav){
    //Add subsections to the side navigation
    $('.subsection').each((i, el) => {
      const subsection = $(el)
      const type=subsection.attr('data-type');
      if(subsectionsInSideNav.indexOf(type) >= 0){
        const subsectionName = subsection.find('> .subsection-title').text();
        if(subsectionName){
          wrapper.append($('<h4/>').text(subsectionName))
          const list = $('<ul></ul>')
          subsection.find('dl dt a').each((i, el) => {
            const navLink = $(el)
            const name = navLink.clone().children().remove().end().text();
            const href = navLink.attr('href')
            const link = $(`<a href="${href}" />`).text(name)
            list.append($('<li></li>').append(link))
            //links.push({ link, offset: navLink.offset().top})
          })
          wrapper.append(list)
        }
      }
    });
  }

  $('.vertical-section').each((i, el) => {
    const section = $(el)
    const sectionName = section.find('> h1').text()
    if (sectionName) {
      wrapper.append($('<h3/>').text(sectionName))
      const list = $('<ul></ul>')
      section.find('.members h4.name').each((i, el) => {
        const navLink = $(el)
        const name = navLink.find('.code-name')
          .clone().children().remove().end().text()
        const href = navLink.find('a').attr('href')
        const link = $(`<a href="${href}" />`).text(name)
        list.append($('<li></li>').append(link))
        links.push({ link, offset: navLink.offset().top, navLink:navLink})
      })
      wrapper.append(list)
    }
    else {
      section.find('.members h4.name').each((i, el) => {
        const navLink = $(el)
        const name = navLink.find('.code-name')
          .clone().children().remove().end().text()
        const href = navLink.find('a').attr('href')
        const link = $(`<a href="${href}" />`).text(name)
        wrapper.append(link)
        links.push({ link, offset: navLink.offset().top, navLink:navLink})
      })
    }
  })
  
  

  if (!$.trim(wrapper.text())) {
    return wrapper.hide()
  }

  const core = $('#main-content-wrapper')
  
  const selectOnScroll = () => {
    const position = core.scrollTop()
    let activeSet = false
    for (let index = (links.length-1); index >= 0; index--) {
      const link = links[index]
      link.link.removeClass('is-active')
      if ((position + OFFSET) >= (core.scrollTop() + link.navLink.offset().top)) {
        if (!activeSet) {
          link.link.addClass('is-active')
          activeSet = true
        } else {
          link.link.addClass('is-past')
        }
      } else {
        link.link.removeClass('is-past')
      }
    }
  }
  core.on('scroll', selectOnScroll)

  selectOnScroll()

  links.forEach(link => {
    link.link.click(() => {
      core.animate({ scrollTop: (core.scrollTop() + link.navLink.offset().top) - OFFSET + 1 }, 500)
    })
  })
})
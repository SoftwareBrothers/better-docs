const availableOgTags = ['image', 'title', 'description', 'url', 'type', 'locale']

exports.defineTags = (dictionary) => {
  dictionary.defineTag('category', {
    onTagged: (doclet, tag) => {
      doclet.category = tag.value
    },
  })
  dictionary.defineTag('subcategory', {
    onTagged: (doclet, tag) => {
      doclet.subCategory = tag.value
    },
  })
  dictionary.defineTag('section', {
    onTagged: (doclet, tag) => {
      doclet.section = tag.value
    },
  })

  dictionary.defineTag('new', {
    onTagged: (doclet, tag) => {
      doclet.new = tag.value
    },
  })

  availableOgTags.forEach((tagName) => {
    dictionary.defineTag(`og${tagName.toUpperCase()}`, {
      onTagged: (doclet, tag) => {
        doclet.ogTags = doclet.ogTags || {}
        doclet.ogTags[tagName] = tag.value
      },
    })
  })

  dictionary.defineTag('debug', {
    onTagged: (doclet, tag) => {
      console.log({ doclet })
    },
  })

  dictionary.defineTag('bundle', {
    onTagged: (doclet) => {
      doclet.bundle = true
    },
  })
}

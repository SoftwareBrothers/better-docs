exports.defineTags = (dictionary) => {
  dictionary.defineTag('category', {
    onTagged: (doclet, tag) => {
      doclet.category = tag.value
    }
  })
  dictionary.defineTag('subcategory', {
    onTagged: (doclet, tag) => {
      doclet.subCategory = tag.value
    }
  })
  dictionary.defineTag('section', {
    onTagged: (doclet, tag) => {
      doclet.section = tag.value
    }
  })
}

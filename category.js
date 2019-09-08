exports.handlers = {
  newDoclet: function({ doclet }) {
    if (doclet.tags && doclet.tags.length > 0) {
      const categoryTag = doclet.tags.find(tag => tag.title === 'category')
      if (categoryTag) {
        doclet.category = categoryTag.value
      }
    }
  }
}

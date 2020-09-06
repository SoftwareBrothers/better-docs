/**
 * Obsolete category plugin - it has been moved to "navigation"
 */
exports.defineTags = function (dictionary) {
  dictionary.defineTag('category', {
    onTagged(doclet, tag) {
      doclet.category = tag.value
    },
  })
  dictionary.defineTag('subcategory', {
    onTagged(doclet, tag) {
      doclet.subCategory = tag.value
    },
  })
}

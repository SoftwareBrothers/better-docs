/* eslint-disable no-param-reassign */
const { load } = require('./lib/load')

exports.defineTags = (dictionary) => {
  dictionary.defineTag('load', {
    /**
     * @param {import('./src/jsdoc.type').DocLet} doclet
     * @param {import('./src/jsdoc.type').JSDocTag} tag
     */
    onTagged: (doclet, tag) => {
      const text = load(tag, doclet.meta.path)

      doclet.loadedDescription = text
    },
  })
}

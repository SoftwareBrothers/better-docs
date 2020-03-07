const path = require('path')
const ts = require('typescript')

const typeConverter = require('./typescript/type-converter')

exports.handlers = {
  newDoclet: function({ doclet }) {
    if (doclet.tags && doclet.tags.length > 0) {
      const categoryTag = doclet.tags.find(tag => tag.title === 'optional')
      if (categoryTag) {
        doclet.optional = true
      }
    }
  },

  beforeParse: function(e) {
    if (['.ts', '.tsx'].includes(path.extname(e.filename))) {
      // adding const a = 1 ensures that the comments always will be copied,
      // even when there is no javascript inside (just interfaces)
      let result = ts.transpileModule('const _____a = 1; \n' + e.source, {
        compilerOptions: {
          target: 'esnext',
          esModuleInterop: true,
          jsx: path.extname(e.filename) === '.tsx' ? 'react' : null,
        }
      })
      
      const types = typeConverter(e.source, e.filename)
      let src = result.outputText
      e.source = src + '\n' + types
    }
  }
}
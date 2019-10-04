var path = require('path')
const ts = require('typescript')

const interfaceConverter = require('./typescript/interface-converter')
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
      const interfaces = interfaceConverter(e.source)
      const types = typeConverter(e.source)
      let result = ts.transpileModule('const _____a = 1; \n' + e.source, {
        compilerOptions: {
          target: 'esnext',
          esModuleInterop: true,
          jsx: 'react',
        }
      });
      let src = result.outputText
      e.source = src + '\n' + interfaces + '\n' + types
    }
  }
}
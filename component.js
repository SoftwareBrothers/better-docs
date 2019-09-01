var reactDocs = require('react-docgen');
var fs = require('fs')
var path = require('path')

exports.handlers = {
  newDoclet: function({ doclet }) {
    if (doclet.tags && doclet.tags.length > 0) {
      const componentTag = doclet.tags.find(tag => tag.title === 'component')
      if (componentTag) {
        var filePath = path.join(doclet.meta.path,doclet.meta.filename)
        var src = fs.readFileSync(filePath, 'UTF-8')
        try {
          var docGen = reactDocs.parse(src)
          doclet.component = {
            props: docGen.props,
            methods: docGen.methods,
            displayName: docGen.displayName,
            filePath: filePath,
          }
        } catch(error) {
          if (error.message === 'No suitable component definition found.') {
            doclet.component = {
              filePath: filePath,
              displayName: doclet.name,
            }
          } else {
            throw error
          }
        }
        doclet.kind = 'class'
      }
    }
  }
};
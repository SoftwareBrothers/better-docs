const { parseBracketBody, appendComment, appendPropsTable } = require("./parse-bracket-body")

const regGlobal = /(export)?\s?(default)?\s?(interface)\s+(?<name>\w+)\s*?{(?<body>.*?)(\n})/sg
const regComments = /(?<comment>\/\*\*.*?(\*\/)\s+(\r?\n|\r)?)/sg

const interfaceConverter = (src) => {
  var result
  let jsDocTypes = ''
  const comments = []
  while((result = regComments.exec(src)) !== null) {
    comments.push({
      end: result.index + result[0].length,
      comment: result[0]
    })
  }
  while((result = regGlobal.exec(src)) !== null) {
    const { name, body } = result.groups
    const comment = comments.find(c => c.end === result.index)
    
    if (!comment) { continue }
    let jsDocInerface = appendComment(comment.comment, `@interface ${name}`)
    
    const elements = parseBracketBody(body)

    elements.forEach(element => {
      if(element.comment) {
        let updatedComment = appendComment(element.comment, [
          `@memberof ${name}`,
          `@name ${element.title.replace('?', '')}`
        ].join('\n'))
        if (element.title.match(/\?/)) {
          updatedComment = appendComment(updatedComment, '@optional')
        }
        if (element.elements.length) {
          updatedComment = appendPropsTable(updatedComment, element.elements)
        } else {
          updatedComment = appendComment(updatedComment, `@type {${element.body}}`)
        }
        jsDocInerface += '\n' + updatedComment
      }
    })
    jsDocTypes += jsDocInerface + '\n'
  }
  return jsDocTypes
}

module.exports = interfaceConverter

const util = require('util')
const { parseBracketBody, appendComment, stripComments, appendPropsTable } = require('./parse-bracket-body')

const regGlobal = /(export)?\s?(default)?\s?(type)\s+(?<name>\w+)\s+=/sg
const regComments = /(?<comment>\/\*\*.*?(\*\/)\s+(\r?\n|\r)?)/sg

const typeConverter = (src) => {
  let result

  let types = []

  const comments = []
  while((result = regComments.exec(src)) !== null) {
    comments.push({
      end: result.index + result[0].length,
      comment: result[0]
    })
  }

  while((result = regGlobal.exec(src)) !== null) {
    const { name } = result.groups
    
    const comment = comments.find(c => c.end === result.index || (c.end - 1) === result.index)

    let type = ''
    let body = ''
    let ret = ''
    let bracketDeep = 0
    let closingBracket = ''
    let openingBracket = ''
    let parsing = 'body'
    for(let i = result.index + result[0].length; i < src.length; i++) {
      if (!closingBracket.length && src[i] === '{') {
        type = 'object'
        openingBracket = '{'
        closingBracket = '}'
        continue
      }

      if (!closingBracket.length && src[i] === '(') {
        type = 'function'
        openingBracket = '('
        closingBracket = ')'
        continue
      }

      if (src[i] === openingBracket) {
        bracketDeep += 1
      }

      if (src[i] === closingBracket) {
        bracketDeep -= 1
      }

      if (bracketDeep < 0) {
        if (type === 'function' && parsing === 'body') {
          body += src[i]
          parsing = 'return'
          bracketDeep = 0
          closingBracket = '\n'
          continue
        } else {
          break
        }
      }
      if (parsing === 'body') {
        body += src[i]
      } else if (parsing === 'return') {
        ret += src[i]
      }
      
    }

    let elements = parseBracketBody(body.trim(), type === 'function' ? ',' : ';')

    types.push({
      type,
      body: body.trim(),
      ret: ret.replace(/.+?=>\s+/, ''),
      elements,
      name,
      comment: comment ? comment.comment: null,
    })
  }
  const docs = types.map((typeDef) => {
    let jsDoc = ''
    if(typeDef.comment) {
      if (typeDef.type === 'function') {
        jsDoc = appendComment(typeDef.comment, `@typedef {function} ${typeDef.name}`)
        if(typeDef.elements.length) {
          const strippedElements = stripComments(typeDef.elements)
          strippedElements.forEach(element => {
            jsDoc = appendComment(jsDoc, `@param {${element.body}} ${element.title}   ${element.comment}`)
          })
        }
        if (typeDef.ret) {
          jsDoc = appendComment(jsDoc, `@return {${typeDef.ret}}`)
        }
      } else if(typeDef.type === 'object') {
        jsDoc = appendComment(typeDef.comment, `@typedef {Object} ${typeDef.name}`)
        if(typeDef.elements.length) {
          jsDoc = appendPropsTable(jsDoc, typeDef.elements)
        }
      }
    }
    return jsDoc
  }).join('\n')
  return docs
}

module.exports = typeConverter

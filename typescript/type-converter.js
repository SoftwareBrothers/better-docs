const util = require('util')
const path = require('path')
const ts = require('typescript')

const appendComment = (commentBlock, toAppend) => {
  return commentBlock.replace(/\n.*\*\//, toAppend.split('\n').map(line => `\n * ${line}`) + '\n */')
}

const getTypeName = (type, src) => {
  if (type.typeName && type.typeName.escapedText) {
    const typeName = type.typeName.escapedText
    if(type.typeArguments && type.typeArguments.length) {
      const args = type.typeArguments.map(subType => getTypeName(subType, src)).join(', ')
      return `${typeName}<${args}>`
    } else {
      return typeName
    }
  }
  if (type.types) {
    return type.types.map(subType => getTypeName(subType, src)).join(' | ')
  }
  if (type.members && type.members.length) {
    return 'object'
  }
  return src.substring(type.pos, type.end).trim()
}

const convertParams = (jsDoc = '', node, src, parentName = null) => {
  node.type.parameters.forEach(parameter => {
    let name = parameter.name && parameter.name.escapedText
               || parameter.parameters && src.substring(parameter.parameters.pos, parameter.parameters.end)
    let comment = parameter.jsDoc && parameter.jsDoc[0] && parameter.jsDoc[0].comment || ''
    if (!!parameter.questionToken) {
      name = ['[', name, ']'].join('')
    }
    let type = getTypeName(parameter.type, src)
    jsDoc = appendComment(jsDoc, `@param {${type}} ${name}   ${comment}`)
  })
  return jsDoc
}

let convertMembers = (jsDoc = '', type, src, parentName = null) => {
  const typesToCheck = [type]
  if (type.types && type.types.length) {
    typesToCheck.push(...type.types)
  }
  typesToCheck.forEach(type => {
    if (type.typeName && type.typeName.escapedText === 'Array') {
      if(type.typeArguments && type.typeArguments.length) {
        type.typeArguments.forEach(subType => {
          jsDoc = convertMembers(jsDoc, subType, src, parentName ? parentName + '[]' : null)
        })
      }
    }
    (type.members || []).filter(m => ts.isTypeElement(m)).forEach(member => {
      let name = getName(member, src)
      let comment = member.jsDoc && member.jsDoc[0] && member.jsDoc[0].comment || ''
      const members = member.type.members || []
      let type = members.length ? 'object' : getTypeName(member.type, src)
      if (parentName) {
        name = [parentName, name].join('.')
      }
      // optional
      if (!!member.questionToken) {
        name = ['[', name, ']'].join('')
      }
      jsDoc = appendComment(jsDoc, `@property {${type}} ${name}   ${comment}`)
      jsDoc = convertMembers(jsDoc, member.type, src, name)
    })
  })
  return jsDoc
}

const getName = (node, src) => {
  return node.name && node.name.escapedText
  || node.parameters && src.substring(node.parameters.pos, node.parameters.end)
}

const typeConverter = (src, filename) => {
  let ast = ts.createSourceFile(
    path.basename(filename),
    src,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  )
  return ast.statements.map(statement => {
    let jsDocNode = statement.jsDoc && statement.jsDoc[0];
    if (jsDocNode) {
      let comment = src.substring(jsDocNode.pos, jsDocNode.end);
      const name = getName(statement, src)
      if (ts.isTypeAliasDeclaration(statement)) {
        if (ts.isFunctionTypeNode(statement.type)) {
          comment = appendComment(comment, `@typedef {function} ${name}`)
          return convertParams(comment, statement, src)
        }
        if (ts.isTypeLiteralNode(statement.type)) {
          comment = appendComment(comment, `@typedef {object} ${name}`)
          return convertMembers(comment, statement.type, src)
        }
      }
      if (ts.isInterfaceDeclaration(statement)) {
        comment = appendComment(comment, `@interface ${name}`)

        statement.members.forEach(member => {
          if (!member.jsDoc) { return }
          let memberComment = src.substring(member.jsDoc[0].pos, member.jsDoc[0].end);
          let memberName = getName(member, src)
          memberComment = appendComment(memberComment, [
            `@name ${name}#${memberName}`
          ].join('\n'))
          if (!!member.questionToken) {
            memberComment = appendComment(memberComment, '@optional')
          }
          memberComment = convertMembers(memberComment, member.type, src, parentName = null)
          let type = getTypeName(member.type, src)
          memberComment = appendComment(memberComment, `@type {${type}}`)
          comment += '\n' + memberComment
        })
        return comment
      }
    }
    return ''
  }).join('\n')
}

module.exports = typeConverter

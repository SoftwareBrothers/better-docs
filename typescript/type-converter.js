const path = require('path')
const ts = require('typescript')

const appendComment = (commentBlock, toAppend) => {
  return commentBlock.replace(/[\n,\s]*\*\//, toAppend.split('\n').map(line => `\n * ${line}`) + '\n */')
}

/**
 * Get type from a node
 * @param {ts.TypeNode} type which should be parsed to string
 * @param {string} src      source for an entire parsed file
 * @returns {string}    node type
 */
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
  if(ts.isFunctionTypeNode(type) || ts.isFunctionLike(type)) {
    // it replaces ():void => {} (and other) to simple function
    return 'function'
  }
  if (ts.isArrayTypeNode(type)) {
    return 'Array'
  }
  if (type.types) {
    return type.types.map(subType => getTypeName(subType, src)).join(' | ')
  }
  if (type.members && type.members.length) {
    return 'object'
  }
  return src.substring(type.pos, type.end).trim()
}

/**
 * Fetches name from a node.
 */
const getName = (node, src) => {
  let name = node.name && node.name.escapedText
  || node.parameters && src.substring(node.parameters.pos, node.parameters.end)
  
  // changing type [key: string] to {...} - otherwise it wont be parsed by @jsdoc
  if (name === 'key: string') { return '{...}' }
  return name
}

/**
 * converts function parameters to @params
 *
 * @param {string} [jsDoc]  existing jsdoc text where all @param comments should be appended
 * @param {ts.FunctionDeclaration} wrapper ts node which has to be parsed
 * @param {string} src      source for an entire parsed file (we are fetching substrings from it)
 * @param {string} parentName     name of a parent element - NOT IMPLEMENTED YET
 * @returns {string} modified jsDoc comment with appended @param tags
 * 
 */
const convertParams = (jsDoc = '', node, src, parentName = null) => {
  node.type.parameters.forEach(parameter => {
    let name = getName(parameter, src)
    let comment = parameter.jsDoc && parameter.jsDoc[0] && parameter.jsDoc[0].comment || ''
    if (parameter.questionToken) {
      name = ['[', name, ']'].join('')
    }
    let type = getTypeName(parameter.type, src)
    jsDoc = appendComment(jsDoc, `@param {${type}} ${name}   ${comment}`)
  })
  return jsDoc
}

/**
 * Convert type properties to @property
 * @param {string} [jsDoc]  existing jsdoc text where all @param comments should be appended
 * @param {ts.TypeNode} wrapper ts node which has to be parsed
 * @param {string} src      source for an entire parsed file (we are fetching substrings from it)
 * @param {string} parentName     name of a parent element
 * @returns {string} modified jsDoc comment with appended @param tags
 */
let convertMembers = (jsDoc = '', type, src, parentName = null) => {
  // type could be an array of types like: `{sth: 1} | string` - so we parse
  // each type separately
  const typesToCheck = [type]
  if (type.types && type.types.length) {
    typesToCheck.push(...type.types)
  }
  typesToCheck.forEach(type => {
    // Handling array defined like this: {alement1: 'something'}[]
    if(ts.isArrayTypeNode(type) && type.elementType) {
      jsDoc = convertMembers(jsDoc, type.elementType, src, parentName ? parentName + '[]' : '[]')
    }

    // Handling Array<{element1: 'somethin'}>
    if (type.typeName && type.typeName.escapedText === 'Array') {
      if(type.typeArguments && type.typeArguments.length) {
        type.typeArguments.forEach(subType => {

          jsDoc = convertMembers(jsDoc, subType, src, parentName
            ? parentName + '[]'
            : '' // when there is no parent - jsdoc cannot parse [].name
          )
        })
      }
    }
    // Handling {property1: "value"}
    (type.members || []).filter(m => ts.isTypeElement(m)).forEach(member => {
      let name = getName(member, src)
      let comment = member.jsDoc && member.jsDoc[0] && member.jsDoc[0].comment || ''
      const members = member.type.members || []
      let typeName = members.length ? 'object' : getTypeName(member.type, src)
      if (parentName) {
        name = [parentName, name].join('.')
      }
      // optional
      const nameToPlace = member.questionToken ? `[${name}]` : name
      jsDoc = appendComment(jsDoc, `@property {${typeName}} ${nameToPlace}   ${comment}`)
      jsDoc = convertMembers(jsDoc, member.type, src, name)
    })
  })
  return jsDoc
}

/**
 * Main function which converts types
 * 
 * @param {string} src           typescript code to convert to jsdoc comments
 * @param {string} [filename]    filename which is required by typescript parser
 * @return {string}              @jsdoc comments generated from given typescript code
 */
module.exports = function typeConverter(src, filename = 'test.ts') {
  let ast = ts.createSourceFile(
    path.basename(filename),
    src,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  )
  
  // iterate through all the statements in global scope
  // we are looking for `interface xxxx` and `type zzz`
  return ast.statements.map(statement => {
    let jsDocNode = statement.jsDoc && statement.jsDoc[0]
    // Parse only statements with jsdoc comments.
    if (jsDocNode) {
      let comment = src.substring(jsDocNode.pos, jsDocNode.end)
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
        if (ts.isIntersectionTypeNode(statement.type)) {
          comment = appendComment(comment, `@typedef {object} ${name}`)
          return convertMembers(comment, statement.type, src)
        }
      }
      if (ts.isInterfaceDeclaration(statement)) {
        comment = appendComment(comment, `@interface ${name}`)

        statement.members.forEach(member => {
          if (!member.jsDoc) { return }
          let memberComment = src.substring(member.jsDoc[0].pos, member.jsDoc[0].end)
          let memberName = getName(member, src)
          memberComment = appendComment(memberComment, [
            `@name ${name}#${memberName}`
          ].join('\n'))
          if (member.questionToken) {
            memberComment = appendComment(memberComment, '@optional')
          }
          if (!member.type && ts.isFunctionLike(member)) {
            let type = getTypeName(member, src)
            memberComment = appendComment(memberComment, `@type {${type}}`)
            memberComment = appendComment(memberComment, `@method`)
          } else {
            memberComment = convertMembers(memberComment, member.type, src, parentName = null)
            let type = getTypeName(member.type, src)
            memberComment = appendComment(memberComment, `@type {${type}}`)
          }
          comment += '\n' + memberComment
        })
        return comment
      }
      if (ts.isClassDeclaration(statement)) {
        comment = ''
        const className = getName(statement, src)
        statement.members.forEach(member => {
          if (!member.jsDoc) { return }
          if (!ts.isPropertyDeclaration(member)) { return }
          let memberComment = src.substring(member.jsDoc[0].pos, member.jsDoc[0].end)
          const modifiers = (member.modifiers || []).map(m => m.getText({text: src}))
          modifiers.forEach(m => {
            if (['private', 'public', 'protected'].includes(m)) {
              memberComment = appendComment(memberComment, `@${m}`)
            }
          })
          if (member.type) {
            memberComment = appendComment(memberComment, `@type {${getTypeName(member.type, src)}}`)
          }
          getTypeName(member, src)
          if (modifiers.find((m => m === 'static'))) {
            memberComment += '\n' + `${className}.${getName(member, src)}`
          } else {
            memberComment += '\n' + `${className}.prototype.${getName(member, src)}`
          }
          comment += '\n' + memberComment
        })
        return comment
      }
    }
    return ''
  }).join('\n')
}

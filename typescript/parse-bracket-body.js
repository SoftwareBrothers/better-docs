const bracketsDeep = [
  {brackets: ['{', '}'], deep: 0},
  {brackets: ['<', '>'], deep: 0},
  // {brackets: ['[', ']'], deep: 0},
  // {brackets: ['(', ')'], deep: 0}
]
bracketsDeep.isZero = function(){ return !this.find((bracket) => bracket.deep !== 0) }
bracketsDeep.update = function (letter){
  this.forEach(bracket => {
    if(letter === bracket.brackets[0]) {
      bracket.deep += 1
    }
    if(letter === bracket.brackets[1]) {
      bracket.deep -= 1
    }
  })
}
const parseBracketBody = (body, delimiter = ';') => {
  const elements = [];
  let current = {
    title: '',
    body: '',
    comment: '',
    currentlyParsing: 'title'
  };

  let moreLessBracketsDeep = 0 // for < and >
  for (var char = 0; char < body.length; char++) {
    const letter = body[char];
    bracketsDeep.update(letter)
    if (letter + body[char + 1] + body[char + 2] === '/**' && bracketsDeep.isZero()) {
      current.currentlyParsing = 'comment';
    }
    if (letter === ':' && bracketsDeep.isZero() && current.currentlyParsing === 'title') {
      current.currentlyParsing = 'body';
      continue;
    }
    if (delimiter.includes(letter)
        && bracketsDeep.isZero()
        && current.currentlyParsing === 'body'
        || char === (body.length -1)
      ) {
      let title = current.title.replace(/(\r\n|\n|\r|(  ))/gm, '')
      const opional = !!title.match(/\?/)
      title = title.replace(/\?/, '')
      if (title.trim().length) {
        elements.push({
          title: title,
          body: current.body.trim(),
          comment: current.comment.trim(),
          elements: [],
          opional
        });
      }
      current = { title: '', body: '', currentlyParsing: 'title', comment: '' };
      continue;
    }
    if (current.currentlyParsing === 'title') {
      current.title += letter;
    }
    else if (current.currentlyParsing === 'body') {
      current.body += letter;
    }
    else if (current.currentlyParsing === 'comment') {
      current.comment += letter;
    }
    if (letter + body[char + 1] === '*/' && bracketsDeep.isZero() && moreLessBracketsDeep === 0 && current.currentlyParsing === 'comment') {
      current.currentlyParsing = 'title';
      current.comment += '/';
      char = char + 1;
      continue;
    }
  }

  elements.forEach((element) => {
    const match = (/{(?<body>.*?)}/sg).exec(element.body)
    if(match){
      element.elements = parseBracketBody(match.groups.body, delimiter)
      element.body = 'object'
      element.elements.forEach(child => {
        let matchSub = (/{(?<body>.*?)}/sg).exec(child.body)
        if (matchSub) {
          child.elements = parseBracketBody(match.groups.body, delimiter)
          child.body = 'object'
        }
      })
    }
  })

  return elements;
}

const appendComment = (commentBlock, toAppend) => {
  return commentBlock.replace(/\n.*\*\//, toAppend.split('\n').map(line => `\n * ${line}`) + '\n */')
}

const strip = (comment) => {
  return comment.replace(/(\/\*\*)/sg, '').replace(/\n\s+\*\/?\s?/sg, ' ').trim()
}

const stripComments = (elements) => {
  return elements.map((el) => ({
    ...el,
    comment: strip(el.comment),
    elements: el.elements.map(child => ({
      ...child,
      comment: strip(child.comment),
    }))
  }))
}

const appendPropsTable = (jsDoc, elements) => {
  const strippedElements = stripComments(elements)
  strippedElements.forEach(element => {
    const title = element.opional ? `[${element.title}]` : element.title
    jsDoc = appendComment(jsDoc, `@property {${element.body}} ${title}   ${element.comment}`)
    if (element.elements.length) {
      element.elements.forEach(child => {
        const title = child.opional ? `[${element.title}.${child.title}]` : `${element.title}.${child.title}`
      jsDoc = appendComment(jsDoc, `@property {${child.body}} ${title}   ${child.comment}`)
      })
    }
  })
  return jsDoc
}

exports.parseBracketBody = parseBracketBody
exports.appendComment = appendComment
exports.stripComments = stripComments
exports.appendPropsTable = appendPropsTable

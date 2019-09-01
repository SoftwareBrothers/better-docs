const fs = require('fs')
const path = require('path')

module.exports = function bundle (Components, out, config) {
  const entry = path.join(out, 'entry.js')
  const absoluteOut = path.resolve(out)
  let init = `
    import React from "react";\n
    import ReactDOM from "react-dom";\n
    window.Components = {};\n

    import Wrapper from '${path.relative(absoluteOut, path.join(__dirname, 'wrapper.jsx'))}';\n
    window.React = React;\n
    window.ReactDOM = ReactDOM;\n
    window.Wrapper = Wrapper;\n
  `
  if (config.betterDocs.wrapperComponent) {
    const absolute = path.resolve(config.betterDocs.wrapperComponent)
    init +=`
    import _CustomWrapper from '${path.relative(absoluteOut, absolute)}';\n
    Components._CustomWrapper = _CustomWrapper;\n
    `
  }
  const entryFile = init + Components.map(c => {
    const { displayName, filePath} = c.component
    const relativePath = path.relative(absoluteOut, filePath)
    return [
      `import ${displayName} from '${relativePath}';`,
      `Components.${displayName} = ${displayName};`,
    ].join('\n')
  }).join('\n\n')

  fs.writeFileSync(entry, entryFile);
}
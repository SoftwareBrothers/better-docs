const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

const VUE_WRAPPER = process.env.IS_DEV ? 'src/vue-wrapper.js' : 'lib/vue-wrapper.js'
const REACT_WRAPPER = process.env.IS_DEV ? 'src/react-wrapper.jsx' : 'lib/react-wrapper.js'

module.exports = function bundle (Components, out, config) {
  if (!Components.length) {
    return
  }
  const vueComponents = Components.filter(c => c.component.type === 'vue')
  const reactComponents = Components.filter(c => c.component.type === 'react')
  const entry = path.join(out, 'entry.js')
  const absoluteOut = path.resolve(out)
  let init = `
    window.Components = {};\n
  `
  if (vueComponents.length) {
    init = init + `
      import Vue from 'vue/dist/vue.js';\n
      window.Vue = Vue;\n

      import Wrapper from '${path.relative(absoluteOut, path.join(__dirname, VUE_WRAPPER))}';\n
      window.Wrapper = Wrapper;\n
    `
  }
  if (reactComponents.length) {
    init = init + `
      import React from "react";\n
      import ReactDOM from "react-dom";\n

      import Wrapper from '${path.relative(absoluteOut, path.join(__dirname, REACT_WRAPPER))}';\n
      window.React = React;\n
      window.ReactDOM = ReactDOM;\n
      window.Wrapper = Wrapper;\n
    `
  }
  if (config.betterDocs.component) {
    if(config.betterDocs.component.wrapper) {
      const absolute = path.resolve(config.betterDocs.component.wrapper)
      init +=`
      import _CustomWrapper from '${path.relative(absoluteOut, absolute)}';\n
      Components._CustomWrapper = _CustomWrapper;\n
      `
    }
    if(config.betterDocs.component.entry
      && config.betterDocs.component.entry.length) {
      init = `${config.betterDocs.component.entry.join('\n')}\n${init}`
    }
  }
  const entryFile = init + Components.map(c => {
    const { displayName, filePath} = c.component
    const relativePath = path.relative(absoluteOut, filePath)
    return [
      `import ${displayName} from '${relativePath}';`,
      `Components.${displayName} = ${displayName};`,
    ].join('\n')
  }).join('\n\n')

  console.log('Generating entry file for "components" plugin')
  fs.writeFileSync(entry, entryFile)
  console.log('Bundling components')
  const outDist = path.join(out, 'build')
  const cmd = `parcel build ${entry} --out-dir ${outDist}`
  console.log(`running: ${cmd}`)
  try {
    execSync(cmd)
  } catch (error) {
    if(error.output && error.output.length){
      console.log(error.output[1].toString())
    }
    throw error
  }
}
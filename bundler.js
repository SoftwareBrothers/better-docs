const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')[process.platform === 'win32' ? 'win32' : 'posix']

const VUE_WRAPPER = process.env.IS_DEV ? 'src/components/vue-wrapper.js' : 'lib/components/vue-wrapper.js'
const REACT_WRAPPER = process.env.IS_DEV ? 'src/components/react-wrapper.jsx' : 'lib/components/react-wrapper.js'

const pathCrossEnv = path => (process.platform !== 'win32' ? path : path.replace(/\\/g, '/'))

module.exports = function bundle(Components, functions, out, config) {
  if (!Components.length) {
    return
  }
  const vueComponents = Components.filter(c => c.component.type === 'vue')
  const reactComponents = Components.filter(c => c.component.type === 'react')
  const entry = path.join(out, 'entry.js')
  const absoluteOut = path.resolve(out)
  let init = `
    window.reactComponents = {};\n
    window.vueComponents = {};\n
    window.Components = {};\n
  `
  if (vueComponents.length) {
    init += `
      import Vue from 'vue/dist/vue.js';\n
      window.Vue = Vue;\n

      import VueWrapper from '${pathCrossEnv(path.relative(absoluteOut, path.join(__dirname, VUE_WRAPPER)))}';\n
      window.VueWrapper = VueWrapper;\n
    `
  }

  if (reactComponents.length) {
    const reactWrapperRelPath = pathCrossEnv(
      path.relative(absoluteOut, path.join(__dirname, REACT_WRAPPER)),
    )

    init += `
      import React from "react";\n
      import ReactDOM from "react-dom";\n

      import ReactWrapper from '${reactWrapperRelPath}';\n
      window.React = React;\n
      window.ReactDOM = ReactDOM;\n
      window.ReactWrapper = ReactWrapper;\n
    `
  }

  // Import css
  init += `
    import './styles/reset.css';\n
    import './styles/iframe.css';\n
  `

  let functionImports = ''

  if (functions && functions.length) {
    functionImports = functions.map((fnDocLet, i) => {
      const { name: displayName, meta } = fnDocLet
      const { path: filePath, filename } = meta
      const relativePath = pathCrossEnv(path.relative(absoluteOut, path.join(filePath, filename)))
      const name = `FnComponent${i}`
      return [
        `import ${name} from '${relativePath}';`,
        `Components['${displayName}'] = ${name};`,
      ].join('\n')
    }).join('\n\n')

    functionImports = `${functionImports}\n\n`
  }

  if (config.betterDocs.component) {
    if (config.betterDocs.component.wrapper) {
      const absolute = path.resolve(config.betterDocs.component.wrapper)
      const relative = pathCrossEnv(path.relative(absoluteOut, absolute))
      init += `
      import _CustomWrapper from '${relative}';\n
      window._CustomWrapper = _CustomWrapper;\n
      `
    }
    if (config.betterDocs.component.entry
      && config.betterDocs.component.entry.length) {
      init = `${config.betterDocs.component.entry.join('\n')}\n${init}`
    }
  }

  const entryFile = init + functionImports + Components.map((c, i) => {
    const { displayName, filePath, type } = c.component
    const relativePath = pathCrossEnv(path.relative(absoluteOut, filePath))
    const name = `Component${i}`
    return [
      `import ${name} from '${relativePath}';`,
      `${type}Components['${displayName}'] = ${name};`,
    ].join('\n')
  }).join('\n\n')

  console.log('Generating entry file for "components" plugin')
  fs.writeFileSync(entry, entryFile)
  console.log('Bundling components')
  const outDist = path.join(out, 'build')
  const cmd = `${process.platform === 'win32' ? 'SET ' : ''}NODE_ENV=development parcel build ${entry} --dist-dir ${outDist}`
  console.log(`running: ${cmd}`)
  try {
    execSync(cmd)
  } catch (error) {
    if (error.output && error.output.length) {
      console.log(error.output[1].toString())
    }
    throw error
  }
}

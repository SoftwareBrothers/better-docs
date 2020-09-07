const doop = require('jsdoc/util/doop')
const env = require('jsdoc/env')
const fs = require('jsdoc/fs')
const helper = require('jsdoc/util/templateHelper')
const logger = require('jsdoc/util/logger')
const path = require('jsdoc/path')
const { taffy } = require('taffydb')
const util = require('util')

const { getParser } = require('jsdoc/util/markdown')
const bundler = require('./bundler')
const { Template } = require('./lib/rendered/template')

const { htmlsafe, linkto, resolveAuthorLinks, tutoriallink, hashToLink, needsSignature } = require('./lib/helpers')
const { buildNav } = require('./lib/navigation/build-nav')


const markdownParser = getParser()

let data
let view

let outdir = path.normalize(env.opts.destination)

function find(spec) {
  return helper.find(data, spec)
}

function getAncestorLinks(doclet) {
  return helper.getAncestorLinks(data, doclet)
}

function getSignatureAttributes(item) {
  const attributes = []

  if (item.optional) {
    attributes.push('opt')
  }

  if (item.nullable === true) {
    attributes.push('nullable')
  } else if (item.nullable === false) {
    attributes.push('non-null')
  }

  return attributes
}

function updateItemName(item) {
  const attributes = getSignatureAttributes(item)
  let itemName = item.name || ''

  if (item.variable) {
    itemName = `&hellip;${itemName}`
  }

  if (attributes && attributes.length) {
    itemName = util.format('%s<span class="signature-attributes">%s</span>', itemName,
      attributes.join(', '))
  }

  return itemName
}

function addParamAttributes(params) {
  return params.filter(param => param.name && param.name.indexOf('.') === -1).map(updateItemName)
}

function buildItemTypeStrings(item) {
  const types = []

  if (item && item.type && item.type.names) {
    item.type.names.forEach((name) => {
      types.push(linkto(name, htmlsafe(name)))
    })
  }

  return types
}

function buildAttribsString(attribs) {
  let attribsString = ''

  if (attribs && attribs.length) {
    attribsString = htmlsafe(util.format('(%s) ', attribs.join(', ')))
  }

  return attribsString
}

function addNonParamAttributes(items) {
  let types = []

  items.forEach((item) => {
    types = types.concat(buildItemTypeStrings(item))
  })

  return types
}

function addSignatureParams(f) {
  const params = f.params ? addParamAttributes(f.params) : []

  f.signature = util.format('%s(%s)', (f.signature || ''), params.join(', '))
}

function addSignatureReturns(f) {
  const attribs = []
  let attribsString = ''
  let returnTypes = []
  let returnTypesString = ''
  const source = f.yields || f.returns

  // jam all the return-type attributes into an array. this could create odd results (for example,
  // if there are both nullable and non-nullable return types), but let's assume that most people
  // who use multiple @return tags aren't using Closure Compiler type annotations, and vice-versa.
  if (source) {
    source.forEach((item) => {
      helper.getAttribs(item).forEach((attrib) => {
        if (attribs.indexOf(attrib) === -1) {
          attribs.push(attrib)
        }
      })
    })

    attribsString = buildAttribsString(attribs)
  }

  if (source) {
    returnTypes = addNonParamAttributes(source)
  }
  if (returnTypes.length) {
    returnTypesString = util.format(' &rarr; %s{%s}', attribsString, returnTypes.join('|'))
  }

  f.signature = `<span class="signature">${f.signature || ''}</span>`
        + `<span class="type-signature">${returnTypesString}</span>`
}

function addSignatureTypes(f) {
  const types = f.type ? buildItemTypeStrings(f) : []

  f.signature = `${f.signature || ''}<span class="type-signature">${
    types.length ? ` :${types.join('|')}` : ''}</span>`
}

function addAttribs(f) {
  const attribs = helper.getAttribs(f)
  const attribsString = buildAttribsString(attribs)

  f.attribs = util.format('<span class="type-signature">%s</span>', attribsString)
  f.rawAttribs = attribs
}

function shortenPaths(files, commonPrefix) {
  Object.keys(files).forEach((file) => {
    files[file].shortened = files[file].resolved.replace(commonPrefix, '')
    // always use forward slashes
      .replace(/\\/g, '/')
  })

  return files
}

function getPathFromDoclet(doclet) {
  if (!doclet.meta) {
    return null
  }

  return doclet.meta.path && doclet.meta.path !== 'null'
    ? path.join(doclet.meta.path, doclet.meta.filename)
    : doclet.meta.filename
}

function generate(title, subtitle, docs, filename, resolveLinks) {
  let docData
  let html
  let outpath

  resolveLinks = resolveLinks !== false

  docData = {
    env,
    title,
    subtitle,
    docs,
  }

  outpath = path.join(outdir, filename)
  html = view.render('container.tmpl', docData)

  if (resolveLinks) {
    html = helper.resolveLinks(html) // turn {@link foo} into <a href="foodoc.html">foo</a>
  }

  fs.writeFileSync(outpath, html, 'utf8')
}

function generateSourceFiles(sourceFiles, encoding) {
  encoding = encoding || 'utf8'
  Object.keys(sourceFiles).forEach((file) => {
    let source
    // links are keyed to the shortened path in each doclet's `meta.shortpath` property
    const sourceOutfile = helper.getUniqueFilename(sourceFiles[file].shortened)

    helper.registerLink(sourceFiles[file].shortened, sourceOutfile)

    try {
      source = {
        kind: 'source',
        code: helper.htmlsafe(fs.readFileSync(sourceFiles[file].resolved, encoding)),
      }
    } catch (e) {
      logger.error('Error while generating source file %s: %s', file, e.message)
    }

    generate(sourceFiles[file].shortened, 'Source', [source], sourceOutfile,
      false)
  })
}

/**
 * Look for classes or functions with the same name as modules (which indicates that the module
 * exports only that class or function), then attach the classes or functions to the `module`
 * property of the appropriate module doclets. The name of each class or function is also updated
 * for display purposes. This function mutates the original arrays.
 *
 * @private
 * @param {Array.<module:jsdoc/doclet.Doclet>} doclets - The array of classes and functions to
 * check.
 * @param {Array.<module:jsdoc/doclet.Doclet>} modules - The array of module doclets to search.
 */
function attachModuleSymbols(doclets, modules) {
  const symbols = {}

  // build a lookup table
  doclets.forEach((symbol) => {
    symbols[symbol.longname] = symbols[symbol.longname] || []
    symbols[symbol.longname].push(symbol)
  })

  modules.forEach((module) => {
    if (symbols[module.longname]) {
      module.modules = symbols[module.longname]
      // Only show symbols that have a description. Make an exception for classes, because
      // we want to show the constructor-signature heading no matter what.
        .filter(symbol => symbol.description || symbol.kind === 'class')
        .map((symbol) => {
          symbol = doop(symbol)

          if (symbol.kind === 'class' || symbol.kind === 'function') {
            symbol.name = `${symbol.name.replace('module:', '(require("')}"))`
          }

          return symbol
        })
    }
  })
}

/**
    @param {TAFFY} taffyData See <http://taffydb.com/>.
    @param {object} opts
    @param {Tutorial} tutorials
 */
exports.publish = function (taffyData, opts, tutorials) {
  let classes
  let conf
  let externals
  let files
  let fromDir
  let globalUrl
  let indexUrl
  let interfaces
  let components
  let members
  let mixins
  let modules
  let namespaces
  let outputSourceFiles
  let packageInfo
  let packages
  const sourceFilePaths = []
  let sourceFiles = {}
  let staticFileFilter
  let staticFilePaths
  let staticFiles
  let staticFileScanner
  let templatePath

  data = taffyData

  conf = env.conf.templates || {}
  conf.default = conf.default || {}
  conf.betterDocs = conf.betterDocs || conf['better-docs'] || {}

  templatePath = path.normalize(opts.template)
  view = new Template(path.join(templatePath, 'tmpl'))

  // claim some special filenames in advance, so the All-Powerful Overseer of Filename Uniqueness
  // doesn't try to hand them out later
  indexUrl = helper.getUniqueFilename('index')
  // don't call registerLink() on this one! 'index' is also a valid longname

  globalUrl = helper.getUniqueFilename('global')
  helper.registerLink('global', globalUrl)

  // set up templating
  view.layout = conf.default.layoutFile
    ? path.getResourcePath(path.dirname(conf.default.layoutFile),
      path.basename(conf.default.layoutFile))
    : 'layout.tmpl'

  // set up tutorials for helper
  helper.setTutorials(tutorials)

  data = helper.prune(data)
  data.sort('longname, version, since')
  helper.addEventListeners(data)

  data().each((doclet) => {
    let sourcePath

    doclet.attribs = ''

    if (doclet.examples) {
      doclet.examples = doclet.examples.map((example) => {
        let caption
        let code

        if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
          caption = RegExp.$1
          code = RegExp.$3
        }

        return {
          caption: caption || '',
          code: code || example,
        }
      })
    }
    if (doclet.see) {
      doclet.see.forEach((seeItem, i) => {
        doclet.see[i] = hashToLink(doclet, seeItem)
      })
    }

    // build a list of source files
    if (doclet.meta) {
      sourcePath = getPathFromDoclet(doclet)
      sourceFiles[sourcePath] = {
        resolved: sourcePath,
        shortened: null,
      }
      if (sourceFilePaths.indexOf(sourcePath) === -1) {
        sourceFilePaths.push(sourcePath)
      }
    }
  })

  // update outdir if necessary, then create outdir
  packageInfo = (find({ kind: 'package' }) || [])[0]
  if (packageInfo && packageInfo.name) {
    outdir = path.join(outdir, packageInfo.name, (packageInfo.version || ''))
  }
  fs.mkPath(outdir)

  // copy the template's static files to outdir
  fromDir = path.join(templatePath, 'static')
  staticFiles = fs.ls(fromDir, 3)

  staticFiles.forEach((fileName) => {
    const toDir = fs.toDir(fileName.replace(fromDir, outdir))

    fs.mkPath(toDir)
    fs.copyFileSync(fileName, toDir)
  })

  // copy user-specified static files to outdir
  if (conf.default.staticFiles) {
    // The canonical property name is `include`. We accept `paths` for backwards compatibility
    // with a bug in JSDoc 3.2.x.
    staticFilePaths = conf.default.staticFiles.include
            || conf.default.staticFiles.paths
            || []
    staticFileFilter = new (require('jsdoc/src/filter')).Filter(conf.default.staticFiles)
    staticFileScanner = new (require('jsdoc/src/scanner')).Scanner()

    staticFilePaths.forEach((filePath) => {
      let extraStaticFiles

      filePath = path.resolve(env.pwd, filePath)
      extraStaticFiles = staticFileScanner.scan([filePath], 10, staticFileFilter)

      extraStaticFiles.forEach((fileName) => {
        const sourcePath = fs.toDir(filePath)
        const toDir = fs.toDir(fileName.replace(sourcePath, outdir))

        fs.mkPath(toDir)
        fs.copyFileSync(fileName, toDir)
      })
    })
  }

  if (sourceFilePaths.length) {
    sourceFiles = shortenPaths(sourceFiles, path.commonPrefix(sourceFilePaths))
  }
  data().each((doclet) => {
    let docletPath
    const url = helper.createLink(doclet)

    helper.registerLink(doclet.longname, url)

    // add a shortened version of the full path
    if (doclet.meta) {
      docletPath = getPathFromDoclet(doclet)
      docletPath = sourceFiles[docletPath].shortened
      if (docletPath) {
        doclet.meta.shortpath = docletPath
      }
    }
  })

  data().each((doclet) => {
    const url = helper.longnameToUrl[doclet.longname]

    if (url.indexOf('#') > -1) {
      doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop()
    } else {
      doclet.id = doclet.name
    }

    if (needsSignature(doclet)) {
      addSignatureParams(doclet)
      addSignatureReturns(doclet)
      addAttribs(doclet)
    }
  })

  // do this after the urls have all been generated
  data().each((doclet) => {
    doclet.ancestors = getAncestorLinks(doclet)

    if (doclet.kind === 'member') {
      addSignatureTypes(doclet)
      addAttribs(doclet)
    }

    if (doclet.kind === 'constant') {
      addSignatureTypes(doclet)
      addAttribs(doclet)
      doclet.kind = 'member'
    }
  })

  view.smallHeader = !conf.betterDocs.navButtons

  members = helper.getMembers(data)
  if (opts.tutorials) {
    // sort tutorials
    try {
      const tutorialsFile = JSON.parse(fs.readFileSync(`${opts.tutorials}/tutorials.json`))
      members.tutorials = Object.keys(tutorialsFile).map(key => tutorials._tutorials[key])
      view.smallHeader = false
    } catch (error) {
      // tutorials.json doesn't exist
      if (error.code !== 'ENOENT') {
        throw error
      }
      members.tutorials = tutorials.children
    }
  } else {
    members.tutorials = tutorials.children
  }
  view.tutorials = members.tutorials
  members.components = helper.find(data, { kind: 'class', component: { isUndefined: false } })
  members.classes = helper.find(data, { kind: 'class', component: { isUndefined: true } })

  // output pretty-printed source files by default
  outputSourceFiles = conf.default && conf.default.outputSourceFiles !== false

  // add template helpers
  view.find = find
  view.linkto = linkto
  view.resolveAuthorLinks = resolveAuthorLinks
  view.tutorialToUrl = helper.tutorialToUrl
  view.tutoriallink = tutoriallink
  view.htmlsafe = htmlsafe
  view.outputSourceFiles = outputSourceFiles

  const sectionHref = sectionName => ['section-', sectionName, '.html'].join('')

  // once for all
  const { global: nav, sections } = buildNav(members, null, conf.betterDocs, env)
  view.nav = nav
  view.sections = sections

  view.tutorialsNav = buildNav(members, ['tutorials'], conf.betterDocs, env).global

  bundler(members.components, outdir, conf)
  attachModuleSymbols(find({ longname: { left: 'module:' } }), members.modules)

  // generate the pretty-printed source files first so other pages can link to them
  if (outputSourceFiles) {
    generateSourceFiles(sourceFiles, opts.encoding)
  }

  if (members.globals.length) { generate('Global', 'Title', [{ kind: 'globalobj' }], globalUrl) }

  // index page displays information from package.json and lists files
  files = find({ kind: 'file' })
  packages = find({ kind: 'package' })

  generate('Home', '',
    packages.concat(
      [{
        kind: 'mainpage',
        readme: opts.readme,
        longname: (opts.mainpagetitle) ? opts.mainpagetitle : 'Main Page',
      }],
    ).concat(files), indexUrl)

  // set up the lists that we'll use to generate pages
  classes = taffy(members.classes)
  modules = taffy(members.modules)
  namespaces = taffy(members.namespaces)
  mixins = taffy(members.mixins)
  externals = taffy(members.externals)
  interfaces = taffy(members.interfaces)
  components = taffy(members.components)

  Object.keys(helper.longnameToUrl).forEach((longname) => {
    const myClasses = helper.find(classes, { longname })
    const myExternals = helper.find(externals, { longname })
    const myInterfaces = helper.find(interfaces, { longname })
    const myMixins = helper.find(mixins, { longname })
    const myModules = helper.find(modules, { longname })
    const myNamespaces = helper.find(namespaces, { longname })
    const myComponents = helper.find(components, { longname })

    if (myModules.length) {
      generate(myModules[0].name, 'Module', myModules, helper.longnameToUrl[longname])
    }

    if (myClasses.length) {
      generate(myClasses[0].name, 'Class', myClasses, helper.longnameToUrl[longname])
    }

    if (myNamespaces.length) {
      generate(myNamespaces[0].name, 'Namespace', myNamespaces, helper.longnameToUrl[longname])
    }

    if (myMixins.length) {
      generate(myMixins[0].name, 'Mixin', myMixins, helper.longnameToUrl[longname])
    }

    if (myExternals.length) {
      generate(myExternals[0].name, 'External', myExternals, helper.longnameToUrl[longname])
    }

    if (myInterfaces.length) {
      generate(myInterfaces[0].name, 'Interface', myInterfaces, helper.longnameToUrl[longname])
    }

    if (myComponents.length) {
      generate(myComponents[0].name, 'Components', myComponents, helper.longnameToUrl[longname])
    }
  })

  // TODO: move the tutorial functions to templateHelper.js
  function generateTutorial(title, subtitle, tutorial, filename) {
    const tutorialData = {
      title,
      subtitle,
      header: tutorial.title,
      content: tutorial.parse(),
      children: tutorial.children,
    }
    const tutorialPath = path.join(outdir, filename)
    let html = view.render('tutorial.tmpl', tutorialData)

    // yes, you can use {@link} in tutorials too!
    html = helper.resolveLinks(html) // turn {@link foo} into <a href="foodoc.html">foo</a>

    fs.writeFileSync(tutorialPath, html, 'utf8')
  }

  // tutorials can have only one parent so there is no risk for loops
  function saveChildren(node) {
    node.children.forEach((child) => {
      generateTutorial(child.title, 'Tutorial', child, helper.tutorialToUrl(child.name))
      saveChildren(child)
    })
  }

  saveChildren(tutorials)

  function saveLandingPage() {
    const content = fs.readFileSync(conf.betterDocs.landing, 'utf8')

    const landingPageData = {
      title: 'Home',
      content,
    }

    const homePath = path.join(outdir, 'index.html')
    const docsPath = path.join(outdir, 'docs.html')

    fs.renameSync(homePath, docsPath)

    view.layout = 'landing.tmpl'
    let html = view.render('content.tmpl', landingPageData)

    // yes, you can use {@link} in tutorials too!
    html = helper.resolveLinks(html) // turn {@link foo} into <a href="foodoc.html">foo</a>

    fs.writeFileSync(homePath, html, 'utf8')
  }

  if (conf.betterDocs.landing) {
    saveLandingPage()
  }

  /**
   *
   * @param {Array<import('./src/sections/decorate').SectionInStore>} decoratedSections
   */
  const renderSections = (decoratedSections) => {
    Object.values(decoratedSections).forEach((section) => {
      if (section.homeBody) {
        let readme = markdownParser(section.homeBody)
        readme = helper.resolveLinks(readme)
        const sectionPageData = {
          title: section.title,
          readme,
          subtitle: '',
          sections: decoratedSections,
          docs: [section],
        }

        view.layout = 'layout.tmpl'
        const html = view.render('mainpage.tmpl', sectionPageData, section.name)
        fs.writeFileSync(path.join(outdir, section.href), html, 'utf8')
      }
    })
  }

  renderSections(sections)
}

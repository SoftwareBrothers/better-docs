'use strict'

var doop = require('jsdoc/util/doop')
var env = require('jsdoc/env')
var fs = require('jsdoc/fs')
var helper = require('jsdoc/util/templateHelper')
var logger = require('jsdoc/util/logger')
var path = require('jsdoc/path')
var taffy = require('taffydb').taffy
var template = require('jsdoc/template')
var util = require('util')
const { getParser } = require('jsdoc/util/markdown')

var bundler = require('./bundler')
const markdownParser = getParser()

var htmlsafe = helper.htmlsafe
var linkto = helper.linkto
var resolveAuthorLinks = helper.resolveAuthorLinks
var hasOwnProp = Object.prototype.hasOwnProperty

var data
var view

var outdir = path.normalize(env.opts.destination)

function find(spec) {
  return helper.find(data, spec)
}

function tutoriallink(tutorial) {
  return helper.toTutorial(tutorial, null, {
    tag: 'em',
    classname: 'disabled',
    prefix: 'Tutorial: '
  })
}

function getAncestorLinks(doclet) {
  return helper.getAncestorLinks(data, doclet)
}

function hashToLink(doclet, hash) {
  var url

  if ( !/^(#.+)/.test(hash) ) {
    return hash
  }

  url = helper.createLink(doclet)
  url = url.replace(/(#.+|$)/, hash)

  return '<a href="' + url + '">' + hash + '</a>'
}

function needsSignature(doclet) {
  var needsSig = false

  // function and class definitions always get a signature
  if (doclet.kind === 'function' || doclet.kind === 'class') {
    needsSig = true
  }
  // typedefs that contain functions get a signature, too
  else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names &&
        doclet.type.names.length) {
    for (var i = 0, l = doclet.type.names.length; i < l; i++) {
      if (doclet.type.names[i].toLowerCase() === 'function') {
        needsSig = true
        break
      }
    }
  }
  // and namespaces that are functions get a signature (but finding them is a
  // bit messy)
  else if (doclet.kind === 'namespace' && doclet.meta && doclet.meta.code &&
        doclet.meta.code.type && doclet.meta.code.type.match(/[Ff]unction/)) {
    needsSig = true
  }

  return needsSig
}

function getSignatureAttributes(item) {
  var attributes = []

  if (item.optional) {
    attributes.push('opt')
  }

  if (item.nullable === true) {
    attributes.push('nullable')
  }
  else if (item.nullable === false) {
    attributes.push('non-null')
  }

  return attributes
}

function updateItemName(item) {
  var attributes = getSignatureAttributes(item)
  var itemName = item.name || ''

  if (item.variable) {
    itemName = '&hellip;' + itemName
  }

  if (attributes && attributes.length) {
    itemName = util.format( '%s<span class="signature-attributes">%s</span>', itemName,
      attributes.join(', ') )
  }

  return itemName
}

function addParamAttributes(params) {
  return params.filter(function(param) {
    return param.name && param.name.indexOf('.') === -1
  }).map(updateItemName)
}

function buildItemTypeStrings(item) {
  var types = []

  if (item && item.type && item.type.names) {
    item.type.names.forEach(function(name) {
      types.push( linkto(name, htmlsafe(name)) )
    })
  }

  return types
}

function buildAttribsString(attribs) {
  var attribsString = ''

  if (attribs && attribs.length) {
    attribsString = htmlsafe( util.format('(%s) ', attribs.join(', ')) )
  }

  return attribsString
}

function addNonParamAttributes(items) {
  var types = []

  items.forEach(function(item) {
    types = types.concat( buildItemTypeStrings(item) )
  })

  return types
}

function addSignatureParams(f) {
  var params = f.params ? addParamAttributes(f.params) : []

  f.signature = util.format( '%s(%s)', (f.signature || ''), params.join(', ') )
}

function addSignatureReturns(f) {
  var attribs = []
  var attribsString = ''
  var returnTypes = []
  var returnTypesString = ''
  var source = f.yields || f.returns

  // jam all the return-type attributes into an array. this could create odd results (for example,
  // if there are both nullable and non-nullable return types), but let's assume that most people
  // who use multiple @return tags aren't using Closure Compiler type annotations, and vice-versa.
  if (source) {
    source.forEach(function(item) {
      helper.getAttribs(item).forEach(function(attrib) {
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
    returnTypesString = util.format( ' &rarr; %s{%s}', attribsString, returnTypes.join('|') )
  }

  f.signature = '<span class="signature">' + (f.signature || '') + '</span>' +
        '<span class="type-signature">' + returnTypesString + '</span>'
}

function addSignatureTypes(f) {
  var types = f.type ? buildItemTypeStrings(f) : []

  f.signature = (f.signature || '') + '<span class="type-signature">' +
        (types.length ? ' :' + types.join('|') : '') + '</span>'
}

function addAttribs(f) {
  var attribs = helper.getAttribs(f)
  var attribsString = buildAttribsString(attribs)

  f.attribs = util.format('<span class="type-signature">%s</span>', attribsString)
  f.rawAttribs = attribs
}

function shortenPaths(files, commonPrefix) {
  Object.keys(files).forEach(function(file) {
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

  return doclet.meta.path && doclet.meta.path !== 'null' ?
    path.join(doclet.meta.path, doclet.meta.filename) :
    doclet.meta.filename
}

function generate(title, subtitle, docs, filename, resolveLinks) {
  var docData
  var html
  var outpath

  resolveLinks = resolveLinks !== false

  docData = {
    env: env,
    title: title,
    subtitle: subtitle,
    docs: docs
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
  Object.keys(sourceFiles).forEach(function(file) {
    var source
    // links are keyed to the shortened path in each doclet's `meta.shortpath` property
    var sourceOutfile = helper.getUniqueFilename(sourceFiles[file].shortened)

    helper.registerLink(sourceFiles[file].shortened, sourceOutfile)

    try {
      source = {
        kind: 'source',
        code: helper.htmlsafe( fs.readFileSync(sourceFiles[file].resolved, encoding) )
      }
    }
    catch (e) {
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
  var symbols = {}

  // build a lookup table
  doclets.forEach(function(symbol) {
    symbols[symbol.longname] = symbols[symbol.longname] || []
    symbols[symbol.longname].push(symbol)
  })

  modules.forEach(function(module) {
    if (symbols[module.longname]) {
      module.modules = symbols[module.longname]
      // Only show symbols that have a description. Make an exception for classes, because
      // we want to show the constructor-signature heading no matter what.
        .filter(function(symbol) {
          return symbol.description || symbol.kind === 'class'
        })
        .map(function(symbol) {
          symbol = doop(symbol)

          if (symbol.kind === 'class' || symbol.kind === 'function') {
            symbol.name = symbol.name.replace('module:', '(require("') + '"))'
          }

          return symbol
        })
    }
  })
}

function buildMemberNav(items, itemHeading, itemsSeen, linktoFn) {
  const subCategories = items.reduce((memo, item) => {
    const subCategory = item.subCategory || ''
    memo[subCategory] = memo[subCategory] || []
    return {
      ...memo,
      [subCategory]: [...memo[subCategory], item]
    }
  }, {})

  const subCategoryNames = Object.keys(subCategories)
    
  var nav = ''

  subCategoryNames.forEach((subCategoryName) => {
    const subCategoryItems = subCategories[subCategoryName]
    if (subCategoryItems.length) {
      var itemsNav = ''
    
      subCategoryItems.forEach(function(item) {
        var displayName
    
        if ( !hasOwnProp.call(item, 'longname') ) {
          itemsNav += '<li>' + linktoFn('', item.name) + '</li>'
        }
        else if ( !hasOwnProp.call(itemsSeen, item.longname) ) {
          if (env.conf.templates.default.useLongnameInNav) {
            displayName = item.longname
          } else {
            displayName = item.name
          }
          itemsNav += '<li>' + linktoFn(item.longname, displayName.replace(/\b(module|event):/g, ''))

          if (item.children && item.children.length) {
            itemsNav += '<ul>'
            item.children.forEach(child => {
              if (env.conf.templates.default.useLongnameInNav) {
                displayName = child.longname
              } else {
                displayName = child.name
              }
              itemsNav += '<li>' + linktoFn(child.longname, displayName.replace(/\b(module|event):/g, '')) + '</li>'
            })
            itemsNav += '</ul>'
          }

          itemsNav += '</li>'
    
          itemsSeen[item.longname] = true
        }
      })
            
      if (itemsNav !== '') {
        var heading = itemHeading
        if (subCategoryName) {
          heading = heading + ' / ' + subCategoryName
        }
        nav += '<h3>' + heading + '</h3><ul>' + itemsNav + '</ul>'
      }
    }
  })

  return nav
}

function linktoTutorial(longName, name) {
  return tutoriallink(name)
}

function linktoExternal(longName, name) {
  return linkto(longName, name.replace(/(^"|"$)/g, ''))
}

function buildGroupNav (members, title) {
  var globalNav
  var seenTutorials = {}
  var nav = ''
  var seen = {}
  nav += '<div class="category">'
  if (title) {
    nav += '<h2>' + title + '</h2>'
  }
  nav += buildMemberNav(members.tutorials || [], 'Tutorials', seenTutorials, linktoTutorial)
  nav += buildMemberNav(members.modules || [], 'Modules', {}, linkto)
  nav += buildMemberNav(members.externals || [], 'Externals', seen, linktoExternal)
  nav += buildMemberNav(members.namespaces || [], 'Namespaces', seen, linkto)
  nav += buildMemberNav(members.classes || [], 'Classes', seen, linkto)
  nav += buildMemberNav(members.interfaces || [], 'Interfaces', seen, linkto)
  nav += buildMemberNav(members.events || [], 'Events', seen, linkto)
  nav += buildMemberNav(members.mixins || [], 'Mixins', seen, linkto)
  nav += buildMemberNav(members.components || [], 'Components', seen, linkto)
    
  if (members.globals && members.globals.length) {
    globalNav = ''

    members.globals.forEach(function(g) {
      if ( g.kind !== 'typedef' && !hasOwnProp.call(seen, g.longname) ) {
        globalNav += '<li>' + linkto(g.longname, g.name) + '</li>'
      }
      seen[g.longname] = true
    })

    if (!globalNav) {
      // turn the heading into a link so you can actually get to the global page
      nav += '<h3>' + linkto('global', 'Global') + '</h3>'
    }
    else {
      nav += '<h3>Global</h3><ul>' + globalNav + '</ul>'
    }
  }
  nav += '</div>'
  return nav
}

/**
 * Create the navigation sidebar.
 * @param {object} members The members that will be used to create the sidebar.
 * @param {array<object>} members.classes
 * @param {array<object>} members.components
 * @param {array<object>} members.externals
 * @param {array<object>} members.globals
 * @param {array<object>} members.mixins
 * @param {array<object>} members.modules
 * @param {array<object>} members.namespaces
 * @param {array<object>} members.tutorials
 * @param {array<object>} members.events
 * @param {array<object>} members.interfaces
 * @return {string} The HTML for the navigation sidebar.
 */
function buildNav(members, navTypes = null, betterDocs) {
  const href = betterDocs.landing ? 'docs.html' : 'index.html'
  var nav = navTypes ? '' : `<h2><a href="${href}">Documentation</a></h2>`

  var categorised = {}
  var rootScope = {}

  var types = navTypes || ['modules', 'externals', 'namespaces', 'classes',
    'components', 'interfaces', 'events', 'mixins', 'globals']
  types.forEach(function(type) {
    if (!members[type]) { return }
    members[type].forEach(function(element) {
      if (element.access && element.access === 'private') {
        return
      }
      if (element.category) {
        if (!categorised[element.category]){ categorised[element.category] = [] }
        if (!categorised[element.category][type]){ categorised[element.category][type] = [] }
        categorised[element.category][type].push(element)
      } else {
        rootScope[type] ? rootScope[type].push(element) : rootScope[type] = [element]
      }
    })
  })
    
  nav += buildGroupNav(rootScope)
  Object.keys(categorised).sort().forEach(function (category) {
    nav += buildGroupNav(categorised[category], category)
  })

  return nav
}

/**
    @param {TAFFY} taffyData See <http://taffydb.com/>.
    @param {object} opts
    @param {Tutorial} tutorials
 */
exports.publish = function(taffyData, opts, tutorials) {
  var classes
  var conf
  var externals
  var files
  var fromDir
  var globalUrl
  var indexUrl
  var interfaces
  var components
  var members
  var mixins
  var modules
  var namespaces
  var outputSourceFiles
  var packageInfo
  var packages
  var sourceFilePaths = []
  var sourceFiles = {}
  var staticFileFilter
  var staticFilePaths
  var staticFiles
  var staticFileScanner
  var templatePath

  data = taffyData

  conf = env.conf.templates || {}
  conf.default = conf.default || {}
  conf.betterDocs = conf.betterDocs || conf['better-docs'] || {}

  templatePath = path.normalize(opts.template)
  view = new template.Template( path.join(templatePath, 'tmpl') )

  // claim some special filenames in advance, so the All-Powerful Overseer of Filename Uniqueness
  // doesn't try to hand them out later
  indexUrl = helper.getUniqueFilename('index')
  // don't call registerLink() on this one! 'index' is also a valid longname

  globalUrl = helper.getUniqueFilename('global')
  helper.registerLink('global', globalUrl)

  // set up templating
  view.layout = conf.default.layoutFile ?
    path.getResourcePath(path.dirname(conf.default.layoutFile),
      path.basename(conf.default.layoutFile) ) :
    'layout.tmpl'

  // set up tutorials for helper
  helper.setTutorials(tutorials)

  data = helper.prune(data)
  data.sort('longname, version, since')
  helper.addEventListeners(data)

  data().each(function(doclet) {
    var sourcePath

    doclet.attribs = ''

    if (doclet.examples) {
      doclet.examples = doclet.examples.map(function(example) {
        var caption
        var code

        if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i)) {
          caption = RegExp.$1
          code = RegExp.$3
        }

        return {
          caption: caption || '',
          code: code || example
        }
      })
    }
    if (doclet.see) {
      doclet.see.forEach(function(seeItem, i) {
        doclet.see[i] = hashToLink(doclet, seeItem)
      })
    }

    // build a list of source files
    if (doclet.meta) {
      sourcePath = getPathFromDoclet(doclet)
      sourceFiles[sourcePath] = {
        resolved: sourcePath,
        shortened: null
      }
      if (sourceFilePaths.indexOf(sourcePath) === -1) {
        sourceFilePaths.push(sourcePath)
      }
    }
  })

  // update outdir if necessary, then create outdir
  packageInfo = ( find({kind: 'package'}) || [] )[0]
  if (packageInfo && packageInfo.name) {
    outdir = path.join( outdir, packageInfo.name, (packageInfo.version || '') )
  }
  fs.mkPath(outdir)

  // copy the template's static files to outdir
  fromDir = path.join(templatePath, 'static')
  staticFiles = fs.ls(fromDir, 3)

  staticFiles.forEach(function(fileName) {
    var toDir = fs.toDir( fileName.replace(fromDir, outdir) )

    fs.mkPath(toDir)
    fs.copyFileSync(fileName, toDir)
  })

  // copy user-specified static files to outdir
  if (conf.default.staticFiles) {
    // The canonical property name is `include`. We accept `paths` for backwards compatibility
    // with a bug in JSDoc 3.2.x.
    staticFilePaths = conf.default.staticFiles.include ||
            conf.default.staticFiles.paths ||
            []
    staticFileFilter = new (require('jsdoc/src/filter')).Filter(conf.default.staticFiles)
    staticFileScanner = new (require('jsdoc/src/scanner')).Scanner()

    staticFilePaths.forEach(function(filePath) {
      var extraStaticFiles

      filePath = path.resolve(env.pwd, filePath)
      extraStaticFiles = staticFileScanner.scan([filePath], 10, staticFileFilter)

      extraStaticFiles.forEach(function(fileName) {
        var sourcePath = fs.toDir(filePath)
        var toDir = fs.toDir( fileName.replace(sourcePath, outdir) )

        fs.mkPath(toDir)
        fs.copyFileSync(fileName, toDir)
      })
    })
  }

  if (sourceFilePaths.length) {
    sourceFiles = shortenPaths( sourceFiles, path.commonPrefix(sourceFilePaths) )
  }
  data().each(function(doclet) {
    var docletPath
    var url = helper.createLink(doclet)

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

  data().each(function(doclet) {
    var url = helper.longnameToUrl[doclet.longname]

    if (url.indexOf('#') > -1) {
      doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop()
    }
    else {
      doclet.id = doclet.name
    }

    if ( needsSignature(doclet) ) {
      addSignatureParams(doclet)
      addSignatureReturns(doclet)
      addAttribs(doclet)
    }
  })

  // do this after the urls have all been generated
  data().each(function(doclet) {
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
  members.components = helper.find(data, {kind: 'class', component: {isUndefined: false}})
  members.classes = helper.find(data, {kind: 'class', component: {isUndefined: true}})

  // output pretty-printed source files by default
  outputSourceFiles = conf.default && conf.default.outputSourceFiles !== false

  // add template helpers
  view.find = find
  view.linkto = linkto
  view.resolveAuthorLinks = resolveAuthorLinks
  view.tutorialToUrl = helper.tutorialToUrl
  view.tutoriallink = tutoriallink;
  view.htmlsafe = htmlsafe
  view.outputSourceFiles = outputSourceFiles

  // once for all
  view.nav = buildNav(members, null, conf.betterDocs)
  
  view.tutorialsNav = buildNav(members, ['tutorials'], conf.betterDocs)

  bundler(members.components, outdir, conf)
  attachModuleSymbols( find({ longname: {left: 'module:'} }), members.modules )

  // generate the pretty-printed source files first so other pages can link to them
  if (outputSourceFiles) {
    generateSourceFiles(sourceFiles, opts.encoding)
  }

  if (members.globals.length) { generate('Global', 'Title', [{kind: 'globalobj'}], globalUrl) }

  // index page displays information from package.json and lists files
  files = find({kind: 'file'})
  packages = find({kind: 'package'})

  generate('Home', '',
    packages.concat(
      [{
        kind: 'mainpage',
        readme: opts.readme,
        longname: (opts.mainpagetitle) ? opts.mainpagetitle : 'Main Page'
      }]
    ).concat(files), indexUrl)

  // set up the lists that we'll use to generate pages
  classes = taffy(members.classes)
  modules = taffy(members.modules)
  namespaces = taffy(members.namespaces)
  mixins = taffy(members.mixins)
  externals = taffy(members.externals)
  interfaces = taffy(members.interfaces)
  components = taffy(members.components)

  Object.keys(helper.longnameToUrl).forEach(function(longname) {
    var myClasses = helper.find(classes, {longname: longname})
    var myExternals = helper.find(externals, {longname: longname})
    var myInterfaces = helper.find(interfaces, {longname: longname})
    var myMixins = helper.find(mixins, {longname: longname})
    var myModules = helper.find(modules, {longname: longname})
    var myNamespaces = helper.find(namespaces, {longname: longname})
    var myComponents = helper.find(components, {longname: longname})

    if (myModules.length) {
      generate(myModules[0].name, 'Module', myModules,  helper.longnameToUrl[longname])
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
    var tutorialData = {
      title: title,
      subtitle: subtitle,
      header: tutorial.title,
      content: tutorial.parse(),
      children: tutorial.children
    }
    var tutorialPath = path.join(outdir, filename)
    var html = view.render('tutorial.tmpl', tutorialData)

    // yes, you can use {@link} in tutorials too!
    html = helper.resolveLinks(html) // turn {@link foo} into <a href="foodoc.html">foo</a>

    fs.writeFileSync(tutorialPath, html, 'utf8')
  }

  // tutorials can have only one parent so there is no risk for loops
  function saveChildren(node) {
    node.children.forEach(function(child) {
      generateTutorial(child.title, 'Tutorial', child, helper.tutorialToUrl(child.name))
      saveChildren(child)
    })
  }

  saveChildren(tutorials)

  function saveLandingPage() {
    const content = fs.readFileSync(conf.betterDocs.landing, 'utf8')
        
    var landingPageData = {
      title: 'Home',
      content,
    }

    var homePath = path.join(outdir, 'index.html')
    var docsPath = path.join(outdir, 'docs.html')

    fs.renameSync(homePath, docsPath)
        
    view.layout = 'landing.tmpl'
    var html = view.render('content.tmpl', landingPageData)

    // yes, you can use {@link} in tutorials too!
    html = helper.resolveLinks(html) // turn {@link foo} into <a href="foodoc.html">foo</a>

    fs.writeFileSync(homePath, html, 'utf8')

  }

  if (conf.betterDocs.landing) {
    saveLandingPage()
  }
}

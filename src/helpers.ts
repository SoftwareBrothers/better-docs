// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import helper from 'jsdoc/util/templateHelper'

function tutoriallink(tutorial) {
  return helper.toTutorial(tutorial, null, {
    tag: 'em',
    classname: 'disabled',
    prefix: 'Tutorial: ',
  })
}

function hashToLink(doclet, hash) {
  let url

  if (!/^(#.+)/.test(hash)) {
    return hash
  }

  url = helper.createLink(doclet)
  url = url.replace(/(#.+|$)/, hash)

  return `<a href="${url}">${hash}</a>`
}

function needsSignature(doclet) {
  let needsSig = false

  // function and class definitions always get a signature
  if (doclet.kind === 'function' || doclet.kind === 'class') {
    needsSig = true
  }
  // typedefs that contain functions get a signature, too
  else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names
        && doclet.type.names.length) {
    for (let i = 0, l = doclet.type.names.length; i < l; i++) {
      if (doclet.type.names[i].toLowerCase() === 'function') {
        needsSig = true
        break
      }
    }
  }
  // and namespaces that are functions get a signature (but finding them is a
  // bit messy)
  else if (doclet.kind === 'namespace' && doclet.meta && doclet.meta.code
        && doclet.meta.code.type && doclet.meta.code.type.match(/[Ff]unction/)) {
    needsSig = true
  }

  return needsSig
}

const { htmlsafe } = helper
const { linkto } = helper
const { resolveAuthorLinks } = helper

export {
  tutoriallink,
  htmlsafe,
  linkto,
  resolveAuthorLinks,
  hashToLink,
  needsSignature,
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.needsSignature = exports.hashToLink = exports.resolveAuthorLinks = exports.linkto = exports.htmlsafe = exports.tutoriallink = void 0;
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const templateHelper_1 = __importDefault(require("jsdoc/util/templateHelper"));
function tutoriallink(tutorial) {
    return templateHelper_1.default.toTutorial(tutorial, null, {
        tag: 'em',
        classname: 'disabled',
        prefix: 'Tutorial: ',
    });
}
exports.tutoriallink = tutoriallink;
function hashToLink(doclet, hash) {
    let url;
    if (!/^(#.+)/.test(hash)) {
        return hash;
    }
    url = templateHelper_1.default.createLink(doclet);
    url = url.replace(/(#.+|$)/, hash);
    return `<a href="${url}">${hash}</a>`;
}
exports.hashToLink = hashToLink;
function needsSignature(doclet) {
    let needsSig = false;
    // function and class definitions always get a signature
    if (doclet.kind === 'function' || doclet.kind === 'class') {
        needsSig = true;
    }
    // typedefs that contain functions get a signature, too
    else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names
        && doclet.type.names.length) {
        for (let i = 0, l = doclet.type.names.length; i < l; i++) {
            if (doclet.type.names[i].toLowerCase() === 'function') {
                needsSig = true;
                break;
            }
        }
    }
    // and namespaces that are functions get a signature (but finding them is a
    // bit messy)
    else if (doclet.kind === 'namespace' && doclet.meta && doclet.meta.code
        && doclet.meta.code.type && doclet.meta.code.type.match(/[Ff]unction/)) {
        needsSig = true;
    }
    return needsSig;
}
exports.needsSignature = needsSignature;
const { htmlsafe } = templateHelper_1.default;
exports.htmlsafe = htmlsafe;
const { linkto } = templateHelper_1.default;
exports.linkto = linkto;
const { resolveAuthorLinks } = templateHelper_1.default;
exports.resolveAuthorLinks = resolveAuthorLinks;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Wrapper for underscore's template utility to allow loading templates from files.
 * @module jsdoc/template
 */
const underscore_1 = __importDefault(require("underscore"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const decorate_1 = require("../sections/decorate");
/**
 * Underscore template helper.
 */
class Template {
    /**
       * @param {string} filepath - Templates directory.
       */
    constructor(filepath) {
        this.path = filepath;
        this.layout = null;
        this.cache = {};
        // override default template tag settings
        this.settings = {
            evaluate: /<\?js([\s\S]+?)\?>/g,
            interpolate: /<\?js=([\s\S]+?)\?>/g,
            escape: /<\?js~([\s\S]+?)\?>/g,
        };
    }
    /**
       * Loads template from given file.
       * @param {string} file - Template filename.
       * @return {RenderFunction} Returns template closure.
       */
    load(file) {
        return underscore_1.default.template(fs_1.default.readFileSync(file, 'utf8'), null, this.settings);
    }
    /**
       * Renders template using given data.
       *
       * This is low-level function, for rendering full templates use {@link Template.render()}.
       *
       * @param {string} file - Template filename.
       * @param {object} data - Template variables (doesn't have to be object, but passing variables dictionary is best way and most common use).
       * @return {string} Rendered template.
       */
    partial(file, data) {
        file = path_1.default.resolve(this.path, file);
        // load template into cache
        if (!(file in this.cache)) {
            this.cache[file] = this.load(file);
        }
        // keep template helper context
        return this.cache[file].call(this, data);
    }
    /**
       * Renders template with given data.
       *
       * This method automatically applies layout if set.
       *
       * @param {string} file - Template filename.
       * @param {object} data - Template variables (doesn't have to be object, but passing variables dictionary is best way and most common use).
       * @return {string} Rendered template.
       */
    render(file, data, section) {
        // main content
        let content = this.partial(file, data);
        // apply layout
        if (this.layout) {
            data.content = content;
            data.section = section || data.docs && data.docs[0] && data.docs[0].section || null;
            data.section = data.section && decorate_1.buildKey(data.section);
            data.doc = data.docs && data.docs[0];
            content = this.partial(this.layout, data);
        }
        return content;
    }
}
exports.Template = Template;

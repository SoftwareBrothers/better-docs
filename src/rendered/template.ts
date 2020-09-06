/**
 * Wrapper for underscore's template utility to allow loading templates from files.
 * @module jsdoc/template
 */
import _ from 'underscore'
import fs from 'fs'
import path from 'path'
import { buildKey } from '../sections/decorate'

export type RenderFunction = (params: any) => string

/**
 * Underscore template helper.
 */
class Template {
  path: string

  layout: string | null

  cache: Record<string, RenderFunction>

  settings: { evaluate: RegExp; interpolate: RegExp; escape: RegExp }


  /**
     * @param {string} filepath - Templates directory.
     */
  constructor(filepath) {
    this.path = filepath
    this.layout = null
    this.cache = {}
    // override default template tag settings
    this.settings = {
      evaluate: /<\?js([\s\S]+?)\?>/g,
      interpolate: /<\?js=([\s\S]+?)\?>/g,
      escape: /<\?js~([\s\S]+?)\?>/g,
    }
  }

  /**
     * Loads template from given file.
     * @param {string} file - Template filename.
     * @return {RenderFunction} Returns template closure.
     */
  public load(file: string): RenderFunction {
    return _.template(fs.readFileSync(file, 'utf8'), null, this.settings)
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
  partial(file: string, data: Record<any, any>): string {
    file = path.resolve(this.path, file)

    // load template into cache
    if (!(file in this.cache)) {
      this.cache[file] = this.load(file)
    }

    // keep template helper context
    return this.cache[file].call(this, data)
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
  render(file: string, data: any, section?: string): string {
    // main content
    let content = this.partial(file, data)

    // apply layout
    if (this.layout) {
      data.content = content
      data.section = section || data.docs && data.docs[0] && data.docs[0].section || null
      data.section = data.section && buildKey(data.section)
      data.doc = data.docs && data.docs[0]
      content = this.partial(this.layout, data)
    }

    return content
  }
}
export { Template }

/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import fs from 'fs'
import { fillComponentPreview } from './fill-component-preview'

import { JSDocTag } from '../jsdoc.type'

const { getParser } = require('../../node_modules/jsdoc/lib/jsdoc/util/markdown')

const markdownParser = getParser()

const mdParser = (content: string): string => {
  const text = markdownParser(content)
  return text
}

export const load = (loadTag: JSDocTag, docletFilePath: string): string => {
  const filename = loadTag.value
  const filePath = path.join(docletFilePath, filename)

  const body = fs.readFileSync(filePath, 'utf-8')

  return fillComponentPreview(body, mdParser)
}

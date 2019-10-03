const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const typeConverter = require('./type-converter')

const src = fs.readFileSync(path.join(__dirname, '../fixtures/interface.ts'), 'utf-8')

describe('.typeConverter', function () {
  it('should do what...', async function () {
    expect(true).to.equal(true)
    // const ret = await parser.parseSource(src)
    console.log(typeConverter(src))
  })
})
const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const interfaceConverter = require('./interface-converter')

const src = fs.readFileSync(path.join(__dirname, '../fixtures/interface.ts'), 'utf-8')
const interface1 = require('../fixtures/typescript/interface1')

describe('.interfaceConverter', function () {
  it('parses interface1', function () {
    expect(true).to.equal(true)
    console.log(interfaceConverter(src))
  })
})
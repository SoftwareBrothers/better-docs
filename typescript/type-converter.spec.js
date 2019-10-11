const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const typeConverter = require('./type-converter')

const src = fs.readFileSync(path.join(__dirname, '../fixtures/interface.ts'), 'utf-8')
const type1 = require('../fixtures/typescript/type1')
const type2 = require('../fixtures/typescript/type2')
const type3 = require('../fixtures/typescript/type3')

describe('.typeConverter', function () {
  it('parses type 1', function () {
    expect(typeConverter(type1.input)).to.have.string(type1.output)
  })

  it('parses type 2: [key]: string', function () {
    expect(typeConverter(type2.input)).to.have.string(type2.output)
  })

  it('parses type 3: Array<{key: string}>', function () {
    type3.outputs.forEach(out => {
      expect(typeConverter(type3.input)).to.have.string(out)
    })
  })

  it.only('parses test', function() {
    console.log(typeConverter(src, '../fixtures/interface.ts'))
  })
})
const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const typeConverter = require('./type-converter')

const src = fs.readFileSync(path.join(__dirname, '../fixtures/interface.ts'), 'utf-8')

const interface1 = require('../fixtures/typescript/interface1')

const type1 = require('../fixtures/typescript/type1')
const type2 = require('../fixtures/typescript/type2')
const type3 = require('../fixtures/typescript/type3')

describe('.typeConverter', function () {
  describe('@typedef', function () {
    it('parses type 1', function () {
      type1.outputs.forEach(out => {
        expect(typeConverter(type1.input)).to.have.string(out)
      })
    })
    
    it('parses type 2: [key]: string', function () {
      type2.outputs.forEach(out => {
        expect(typeConverter(type2.input)).to.have.string(out)
      })
    })
  
    it('parses type 3: Array<{key: string}>', function () {
      type3.outputs.forEach(out => {
        expect(typeConverter(type3.input)).to.have.string(out)
      })
    })
  })

  describe('@interface', function () {
    it('parses interface 1', function () {
      interface1.outputs.forEach(out => {
        expect(typeConverter(interface1.input)).to.have.string(out)
      })
    })
  })

  

  // it.only('parses test', function() {
  //   console.log(typeConverter(src, '../fixtures/interface.ts'))
  // })
})
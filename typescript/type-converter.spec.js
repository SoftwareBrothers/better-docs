const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const typeConverter = require('./type-converter')

const src = fs.readFileSync(path.join(__dirname, '../fixtures/typescript/entity.ts'), 'utf-8')

const interface1 = require('../fixtures/typescript/interface1')
const interface2 = require('../fixtures/typescript/interface2')
const interface3 = require('../fixtures/typescript/interface3')

const type1 = require('../fixtures/typescript/type1')
const type2 = require('../fixtures/typescript/type2')
const type3 = require('../fixtures/typescript/type3')
const type4 = require('../fixtures/typescript/type4')
const type5 = require('../fixtures/typescript/type5')
const type6 = require('../fixtures/typescript/type6')
const type7 = require('../fixtures/typescript/type7')
const staticMember = require('../fixtures/typescript/static-member')
const protectedMember = require('../fixtures/typescript/protected-member')

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

    it('parses type 4: inline function', function () {
      type4.outputs.forEach(out => {
        expect(typeConverter(type4.input)).to.have.string(out)
      })
    })

    it('parses type 5: one line comment', function () {
      type5.outputs.forEach(out => {
        expect(typeConverter(type5.input)).to.have.string(out)
      })
    })

    it('parses type 6: joined by && types', function () {
      type6.outputs.forEach(out => {
        expect(typeConverter(type6.input)).to.have.string(out)
      })
    })

    it('parses type 7: object types', function () {
      type7.outputs.forEach(out => {
        expect(typeConverter(type7.input)).to.have.string(out)
      })
    })
  })

  describe('@interface', function () {
    it('parses interface 1', function () {
      interface1.outputs.forEach(out => {
        expect(typeConverter(interface1.input)).to.have.string(out)
      })
    })

    it('parses interface 2 - with nested array defined as []', function () {
      interface2.outputs.forEach(out => {
        expect(typeConverter(interface2.input)).to.have.string(out)
      })
    })

    it('parses interface 3 - with methods', function () {
      interface3.outputs.forEach(out => {
        expect(typeConverter(interface3.input)).to.have.string(out)
      })
    })
  })

  describe('class members', function () {
    it('parses static member', function () {
      staticMember.outputs.forEach(out => {
        expect(typeConverter(staticMember.input)).to.have.string(out)
      })
    })

    it('parses protected', function () {
      protectedMember.outputs.forEach(out => {
        expect(typeConverter(protectedMember.input)).to.have.string(out)
      })
    })
  })
  

  // it.only('parses test', function() {
  //   console.log(typeConverter(src, '../fixtures/interface.ts'))
  // })
})
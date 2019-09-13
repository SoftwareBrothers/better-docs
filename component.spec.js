const path = require('path')
const { expect } = require('chai')

const { parseVue, parseReact } = require('./component')

const VUE_PATH = path.join(__dirname, 'fixtures/component.vue')
const REACT_PATH = path.join(__dirname, 'fixtures/component.jsx')

describe('@component', function () {
  describe('.parseVue', function () {
    beforeEach(function () {
      this.doclet = {}
      this.output = parseVue(VUE_PATH, this.doclet)
    })

    it('returns displayName', function () {
      expect(this.output.displayName).to.equal('grid')
    })
    
    it('returns prop types', function () {
      expect(this.output.props).to.have.lengthOf(5)
      expect(this.output.props[0]).to.deep.equal({
        description: 'object/array defaults should be returned from a factory function',
        name: 'msg',
        required: true,
        type: 'string|number',
        defaultValue: 'function()'
      })
      expect(this.output.props[1]).to.have.property('defaultValue', '\'something\'')
    })

    it('returns slots', function () {
      expect(this.output.slots).to.have.lengthOf(2)
      expect(this.output.slots[0]).to.deep.equal({
        name: 'header',
        description: 'Use this slot header',
      })
    })
  })

  describe('.parseReact', function () {
    beforeEach(function () {
      this.doclet = {}
      this.output = parseReact(REACT_PATH, this.doclet)
    })

    it('returns displayName', function () {
      expect(this.output.displayName).to.equal('Documented')
    })

    it('returns prop types', function () {
      expect(this.output.props).to.have.lengthOf(2)
      expect(this.output.props[0]).to.deep.equal({
        description: 'Text is a text',
        name: 'text',
        required: false,
        type: 'string',
        defaultValue: '\'Hello World\''
      })
    })
  })
})

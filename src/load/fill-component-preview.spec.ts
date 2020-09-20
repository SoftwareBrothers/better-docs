import { expect } from 'chai'
import { fillComponentPreview } from './fill-component-preview'


const text = [
  'My Patterns.',
  '',
  'Explore results with the Tools below. Replace & List output custom results. Details lists capture groups. Explain describes your expression in plain English.',
  '',
  '```reactComponent',
  '',
  'const a = 1;',
  'return (',
  '  <div>ala</div>',
  ')',
  '',
  '```',
  'asdasdas',
  'da',
  'sda',
  '```reactComponent',
  '',
  'const a = 2;',
  'return (',
  '  <div>ala</div>',
  ')',
  '',
  '```',
  'sdasd',
  'asd',
].join('\n')


describe.only('.fillComponentPreview', () => {
  it('chanes ```reactComponent ``` to react code', () => {
    expect(fillComponentPreview(text)).to.contain('sth')
  })
})

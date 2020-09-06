import { expect } from 'chai'
import path from 'path'

import { decorateSections, SectionNav, SectionInStore } from './decorate'

const pathWithoutConfig = path.join(__dirname, '../../fixtures/sections')
const pathWithConfig = path.join(__dirname, '../../fixtures/sections-json')

describe('.decorateSections', () => {
  const firstHref = 'ala-ma-cat.html'
  let sections: Record<string, SectionNav>
  let decorated: Record<string, SectionInStore>

  beforeEach(() => {
    sections = {
      DesignSystem: {
        nav:
        `<li>
          <a href="${firstHref}">sth</a>
          <a href="/second/href">sth else</a>
        </li>`,
      },
      other: {
        nav:
        `<li>
          <a href="/other/href">sth else</a>
        </li>`,
      },
    }
  })

  context('no settings are given', () => {
    const name = 'designsystem'
    let decoratedElement: SectionInStore

    beforeEach(() => {
      decorated = decorateSections(sections)
      decoratedElement = decorated[name]
    })

    it('adds name and downcase it', () => {
      expect(decoratedElement.name).to.equal(name)
    })

    it('adds title', () => {
      expect(decoratedElement.title).to.equal('DesignSystem')
    })

    it('adds href as the first link', () => {
      expect(decoratedElement.href).to.equal(firstHref)
    })

    it('does not change the nav', () => {
      expect(decoratedElement.nav).to.equal(sections.DesignSystem.nav)
    })
  })

  context('config folder is given without json', () => {
    beforeEach(() => {
      decorated = decorateSections(sections, pathWithoutConfig)
    })

    it('adds home to the navigation for given element', () => {
      const { designsystem } = decorated
      expect(designsystem.nav).to.include(
        `<h2><a href="${designsystem.href}">${designsystem.title}</a></h2>`,
      )
    })

    it('does not add home to element which is not in the folder ', () => {
      const { other } = decorated
      expect(decorated.other.nav).to.equal(other.nav)
    })

    it('changes href of the section for given element', () => {
      const { designsystem } = decorated

      expect(designsystem.href).to.eq('section-designsystem.html')
    })

    it('adds home path for given element', () => {
      const { designsystem } = decorated

      expect(designsystem.homePath).to.eq(path.join(pathWithoutConfig, 'designsystem.md'))
      expect(designsystem.homeBody).not.to.be.undefined
    })
  })

  context('config folder is given with sections.json', () => {
    beforeEach(() => {
      sections = {
        DesignSystem: {
          nav:
          `<li>
            <a href="${firstHref}">sth</a>
            <a href="/second/href">sth else</a>
          </li>`,
        },
        other: { nav: '<li><a href="/other/href">sth else</a></li>' },
        firstOne: { nav: '<li><a href="/other/href">sth else</a></li>' },
      }

      decorated = decorateSections(sections, pathWithConfig)
    })

    it('maintains the number of keys', () => {
      // title from fixtures
      expect(Object.keys(decorated).length).to.equal(3)
    })

    it('changes title', () => {
      // title from fixtures
      expect(decorated.designsystem.title).to.equal('Design System')
    })
  })
})

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const path_1 = __importDefault(require("path"));
const decorate_1 = require("./decorate");
const pathWithoutConfig = path_1.default.join(__dirname, '../../fixtures/sections');
const pathWithConfig = path_1.default.join(__dirname, '../../fixtures/sections-json');
describe('.decorateSections', () => {
    const firstHref = 'ala-ma-cat.html';
    let sections;
    let decorated;
    beforeEach(() => {
        sections = {
            DesignSystem: {
                nav: `<li>
          <a href="${firstHref}">sth</a>
          <a href="/second/href">sth else</a>
        </li>`,
            },
            other: {
                nav: `<li>
          <a href="/other/href">sth else</a>
        </li>`,
            },
        };
    });
    context('no settings are given', () => {
        const name = 'designsystem';
        let decoratedElement;
        beforeEach(() => {
            decorated = decorate_1.decorateSections(sections);
            decoratedElement = decorated[name];
        });
        it('adds name and downcase it', () => {
            chai_1.expect(decoratedElement.name).to.equal(name);
        });
        it('adds title', () => {
            chai_1.expect(decoratedElement.title).to.equal('DesignSystem');
        });
        it('adds href as the first link', () => {
            chai_1.expect(decoratedElement.href).to.equal(firstHref);
        });
        it('does not change the nav', () => {
            chai_1.expect(decoratedElement.nav).to.equal(sections.DesignSystem.nav);
        });
    });
    context('config folder is given without json', () => {
        beforeEach(() => {
            decorated = decorate_1.decorateSections(sections, pathWithoutConfig);
        });
        it('adds home to the navigation for given element', () => {
            const { designsystem } = decorated;
            chai_1.expect(designsystem.nav).to.include(`<h2><a href="${designsystem.href}">${designsystem.title}</a></h2>`);
        });
        it('does not add home to element which is not in the folder ', () => {
            const { other } = decorated;
            chai_1.expect(decorated.other.nav).to.equal(other.nav);
        });
        it('changes href of the section for given element', () => {
            const { designsystem } = decorated;
            chai_1.expect(designsystem.href).to.eq('section-designsystem.html');
        });
        it('adds home path for given element', () => {
            const { designsystem } = decorated;
            chai_1.expect(designsystem.homePath).to.eq(path_1.default.join(pathWithoutConfig, 'designsystem.md'));
            chai_1.expect(designsystem.homeBody).not.to.be.undefined;
        });
    });
    context('config folder is given with sections.json', () => {
        beforeEach(() => {
            sections = {
                DesignSystem: {
                    nav: `<li>
            <a href="${firstHref}">sth</a>
            <a href="/second/href">sth else</a>
          </li>`,
                },
                other: { nav: '<li><a href="/other/href">sth else</a></li>' },
                firstOne: { nav: '<li><a href="/other/href">sth else</a></li>' },
            };
            decorated = decorate_1.decorateSections(sections, pathWithConfig);
        });
        it('maintains the number of keys', () => {
            // title from fixtures
            chai_1.expect(Object.keys(decorated).length).to.equal(3);
        });
        it('changes title', () => {
            // title from fixtures
            chai_1.expect(decorated.designsystem.title).to.equal('Design System');
        });
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNav = void 0;
const helpers_1 = require("../helpers");
const decorate_1 = require("../sections/decorate");
const { hasOwnProperty } = Object.prototype;
function buildMemberNav(items, itemHeading, itemsSeen, linktoFn, env) {
    const subCategories = items.reduce((memo, item) => {
        const subCategory = item.subCategory || '';
        memo[subCategory] = memo[subCategory] || [];
        return Object.assign(Object.assign({}, memo), { [subCategory]: [...memo[subCategory], item] });
    }, {});
    const subCategoryNames = Object.keys(subCategories);
    let nav = '';
    subCategoryNames.forEach((subCategoryName) => {
        const subCategoryItems = subCategories[subCategoryName];
        if (subCategoryItems.length) {
            let itemsNav = '';
            subCategoryItems.forEach((item) => {
                let displayName;
                if (!hasOwnProperty.call(item, 'longname')) {
                    itemsNav += `<li>${linktoFn('', item.name)}</li>`;
                }
                else if (!hasOwnProperty.call(itemsSeen, item.longname)) {
                    if (env.conf.templates.default.useLongnameInNav) {
                        displayName = item.longname;
                    }
                    else {
                        displayName = item.name;
                    }
                    itemsNav += `<li>${linktoFn(item.longname, displayName.replace(/\b(module|event):/g, ''))}`;
                    if (item.children && item.children.length) {
                        itemsNav += '<ul>';
                        item.children.forEach((child) => {
                            if (env.conf.templates.default.useLongnameInNav) {
                                displayName = child.longname;
                            }
                            else {
                                displayName = child.name;
                            }
                            itemsNav += `<li>${linktoFn(child.longname, displayName.replace(/\b(module|event):/g, ''))}</li>`;
                        });
                        itemsNav += '</ul>';
                    }
                    itemsNav += '</li>';
                    itemsSeen[item.longname] = true;
                }
            });
            if (itemsNav !== '') {
                let heading = itemHeading;
                if (subCategoryName) {
                    heading = `${heading} / ${subCategoryName}`;
                }
                nav += `<h3>${heading}</h3><ul>${itemsNav}</ul>`;
            }
        }
    });
    return nav;
}
function linktoTutorial(longName, name) {
    return helpers_1.tutoriallink(name);
}
function linktoExternal(longName, name) {
    return helpers_1.linkto(longName, name.replace(/(^"|"$)/g, ''));
}
function buildGroupNav(members, title, env) {
    let globalNav;
    const seenTutorials = {};
    let nav = '';
    const seen = {};
    nav += '<div class="category">';
    if (title) {
        nav += `<h2>${title}</h2>`;
    }
    nav += buildMemberNav(members.tutorials || [], 'Tutorials', seenTutorials, linktoTutorial, env);
    nav += buildMemberNav(members.modules || [], 'Modules', {}, helpers_1.linkto, env);
    nav += buildMemberNav(members.externals || [], 'Externals', seen, linktoExternal, env);
    nav += buildMemberNav(members.namespaces || [], 'Namespaces', seen, helpers_1.linkto, env);
    nav += buildMemberNav(members.classes || [], 'Classes', seen, helpers_1.linkto, env);
    nav += buildMemberNav(members.interfaces || [], 'Interfaces', seen, helpers_1.linkto, env);
    nav += buildMemberNav(members.events || [], 'Events', seen, helpers_1.linkto, env);
    nav += buildMemberNav(members.mixins || [], 'Mixins', seen, helpers_1.linkto, env);
    nav += buildMemberNav(members.components || [], 'Components', seen, helpers_1.linkto, env);
    if (members.globals && members.globals.length) {
        globalNav = '';
        members.globals.forEach((g) => {
            if (g.kind !== 'typedef' && !hasOwnProperty.call(seen, g.longname)) {
                globalNav += `<li>${helpers_1.linkto(g.longname, g.name)}</li>`;
            }
            seen[g.longname] = true;
        });
        if (!globalNav) {
            // turn the heading into a link so you can actually get to the global page
            nav += `<h3>${helpers_1.linkto('global', 'Global')}</h3>`;
        }
        else {
            nav += `<h3>Global</h3><ul>${globalNav}</ul>`;
        }
    }
    nav += '</div>';
    return nav;
}
/**
 *
 * @param {Members} members
 * @param {Array<string>} navTypes
 * @param {*} betterDocs
 * @param {*} env
 */
function buildNav(members, navTypes = null, betterDocs, env) {
    const href = betterDocs.landing ? 'docs.html' : 'index.html';
    let nav = navTypes ? '' : `<h2><a href="${href}">Documentation</a></h2>`;
    const rootScope = { global: {}, categories: {} };
    const sectionsScope = {};
    const types = navTypes || ['modules', 'externals', 'namespaces', 'classes',
        'components', 'interfaces', 'events', 'mixins', 'globals'];
    let scope = rootScope;
    types.forEach((type) => {
        if (!members[type]) {
            return;
        }
        members[type].forEach((element) => {
            if (element.section) {
                if (!sectionsScope[element.section]) {
                    sectionsScope[element.section] = { global: {}, categories: {} };
                }
                scope = sectionsScope[element.section];
            }
            else {
                scope = rootScope;
            }
            if (element.access && element.access === 'private') {
                return;
            }
            if (element.category) {
                if (!scope.categories[element.category]) {
                    scope.categories[element.category] = [];
                }
                if (!scope.categories[element.category][type]) {
                    scope.categories[element.category][type] = [];
                }
                scope.categories[element.category][type].push(element);
            }
            else {
                scope.global[type] ? scope.global[type].push(element) : scope.global[type] = [element];
            }
        });
    });
    nav += buildGroupNav(rootScope.global, null, env);
    Object.keys(rootScope.categories).sort().forEach((category) => {
        nav += buildGroupNav(rootScope.categories[category], category, env);
    });
    const allSections = {};
    Object.keys(sectionsScope).sort().forEach((section) => {
        // let sectionNav = `<h2><a href="${href}">${section}</a></h2>`
        scope = sectionsScope[section];
        let sectionNav = buildGroupNav(scope.global, null, env);
        Object.keys(scope.categories).sort().forEach((category) => {
            sectionNav += buildGroupNav(scope[category], category, env);
        });
        allSections[section] = { nav: sectionNav };
    });
    const decoratedSections = decorate_1.decorateSections(allSections, env.opts.sections);
    return {
        global: nav,
        sections: decoratedSections,
    };
}
exports.buildNav = buildNav;

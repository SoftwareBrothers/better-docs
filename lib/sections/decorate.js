"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.SECTIONS_CONFIG_FILE_NAME = 'sections.json';
/**
 * Builds file name for given section
 * @param section
 */
function buildFileName(section) {
    return `section-${section.toLowerCase()}.html`;
}
exports.buildFileName = buildFileName;
/**
 * Normalizes section name so it can be used as a key to search for files
 *
 * @param section
 */
function buildKey(section) {
    return section.toLowerCase();
}
exports.buildKey = buildKey;
const loadConfig = (sectionConfigPath) => {
    if (!sectionConfigPath) {
        return null;
    }
    const files = fs_1.default.readdirSync(sectionConfigPath);
    const configFile = files.find(file => file === exports.SECTIONS_CONFIG_FILE_NAME);
    const jsonConfig = configFile
        ? JSON.parse(fs_1.default.readFileSync(path_1.default.join(sectionConfigPath, configFile), 'utf8'))
        : {};
    return files.filter(file => path_1.default.parse(file).ext === '.md').reduce((memo, file) => {
        const name = buildKey(path_1.default.parse(file).name);
        const config = jsonConfig[name];
        const { title } = config || {};
        const homePath = path_1.default.join(sectionConfigPath, file);
        const homeBody = fs_1.default.readFileSync(homePath);
        return Object.assign(Object.assign({}, memo), { [name]: {
                title,
                homePath,
                homeBody,
            } });
    }, {});
};
/**
 *
 * @param {Record<string, SectionNav>} sections
 * @param {string} [sectionConfigPath]
 */
function decorateSections(sections = {}, sectionConfigPath) {
    const config = loadConfig(sectionConfigPath) || {};
    return Object.keys(sections).reduce((memo, sectionName, index) => {
        var _a, _b;
        const name = buildKey(sectionName);
        const originalSection = sections[sectionName];
        const configSection = config[name] || null;
        // setup default values
        let title = sectionName;
        // first href in the navigation by default will be the link
        const hrefMatch = originalSection.nav.match(/href="(.*?)"/);
        let href = hrefMatch && hrefMatch[1];
        let { nav } = originalSection;
        // on which place should it go to navigation. By default some big number
        let order = 1000 + index;
        if (configSection) {
            href = buildFileName(sectionName);
            nav = `<h2><a href="${href}">${title}</a></h2>${nav}`;
            if (configSection.title) {
                ({ title } = configSection);
            }
            order = Object.keys(config).indexOf(name);
        }
        return Object.assign(Object.assign({}, memo), { [name]: {
                name,
                nav,
                title,
                href,
                order,
                homeBody: (_a = configSection) === null || _a === void 0 ? void 0 : _a.homeBody,
                homePath: (_b = configSection) === null || _b === void 0 ? void 0 : _b.homePath,
            } });
    }, {});
}
exports.decorateSections = decorateSections;

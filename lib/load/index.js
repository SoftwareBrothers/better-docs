"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fill_component_preview_1 = require("./fill-component-preview");
const { getParser } = require('../../node_modules/jsdoc/lib/jsdoc/util/markdown');
const markdownParser = getParser();
const mdParser = (content) => {
    const text = markdownParser(content);
    return text;
};
const load = (loadTag, docletFilePath) => {
    const filename = loadTag.value;
    const filePath = path_1.default.join(docletFilePath, filename);
    const body = fs_1.default.readFileSync(filePath, 'utf-8');
    return (0, fill_component_preview_1.fillComponentPreview)(body, mdParser);
};
exports.load = load;

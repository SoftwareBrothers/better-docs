"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillComponentPreview = void 0;
const regex = /^```reactComponent[\r\n]+(.*?)[\r\n]+```$/gms;
const fillComponentPreview = (text, mdParser) => {
    let number = 0;
    const components = {};
    const result = text.replace(regex, (match, group) => {
        const uniqId = ['BetterDocsPreviewComponent', number += 1].join('');
        components[uniqId] = `
      <div id="${uniqId}"></div>

      <script>
        ReactDOM.render(ReactWrapper({
          example: ${JSON.stringify(group)},
          uniqId: ${JSON.stringify(uniqId)},
        }), document.getElementById('${uniqId}'));
      </script>
    `;
        return uniqId;
    });
    let markdown = mdParser(result);
    Object.keys(components).forEach((componentId) => {
        markdown = markdown.replace(componentId, components[componentId]);
    });
    return markdown;
};
exports.fillComponentPreview = fillComponentPreview;

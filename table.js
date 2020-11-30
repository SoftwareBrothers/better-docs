exports.defineTags = function (dictionary) {
    dictionary.defineTag('table', {
        mustHaveValue: false,
        mustNotHaveDescription: true,
        canHaveType: false,
        canHaveName: false,
        onTagged: function(doclet, tag) {
          doclet.table=true;
          doclet.tags = (doclet.tags || []);
          doclet.tags.push({
            title: 'Table',
            originalTitle: 'Table',
            text: '',
          });
        }
    });
};
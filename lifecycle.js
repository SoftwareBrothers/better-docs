exports.defineTags = function (dictionary) {
    dictionary.defineTag('lifecycle', {
        mustHaveValue: false,
        mustNotHaveDescription: true,
        canHaveType: false,
        canHaveName: true,
        onTagged: function(doclet, tag) {
          doclet.lifecycle=true;
          
          doclet.tags = (doclet.tags || []);
          doclet.tags.push({
            title: 'React Lifecycle',
            originalTitle: 'React Lifecycle',
            text: '',
          });
        }
    });
    
    dictionary.defineTag('renders', {
        mustHaveValue: false,
        mustNotHaveDescription: true,
        canHaveType: false,
        canHaveName: true,
        onTagged: function(doclet, tag) {
          doclet.renders=true;
          
          doclet.tags = (doclet.tags || []);
          doclet.tags.push({
            title: 'Causes Render',
            originalTitle: 'Causes Render',
            text: '',
          });
        }
    });
};
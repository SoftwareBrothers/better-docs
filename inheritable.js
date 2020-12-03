exports.defineTags = function (dictionary) {
    dictionary.defineTag('inheritDesc', {
        canHaveType: false,
        canHaveName: false,
        isNamespace: false,
        mustHaveValue: false,
        mustNotHaveDescription: false,
        mustNotHaveValue:false,
        onTagged: function(doclet, tag) {
            if(!doclet.inheritable || !doclet.inheritable.types || !doclet.inheritable.types.desc){
                doclet.inheritable = doclet.inheritable ? doclet.inheritable : {};
                doclet.inheritable.types = doclet.inheritable.types ? doclet.inheritable.types : {};
                
                doclet.inheritable.types.desc={
                    position: doclet.description ? 'append' : 'prepend',
                    append: tag.text ? tag.text : ''
                };
            }
        }
    });
     
    dictionary.defineTag('inheritSummary', {
        canHaveType: false,
        canHaveName: false,
        isNamespace: false,
        mustHaveValue: false,
        mustNotHaveDescription: false,
        mustNotHaveValue:false,
        onTagged: function(doclet, tag) {
            if(!doclet.inheritable || !doclet.inheritable.types || !doclet.inheritable.types.summary){
                doclet.inheritable = doclet.inheritable ? doclet.inheritable : {};
                doclet.inheritable.types = doclet.inheritable.types ? doclet.inheritable.types : {};

                doclet.inheritable.types.summary={
                    position: doclet.summary ? 'append' : 'prepend',
                    append: tag.text ? tag.text : '',
                };
            }
         }
    });
     
    dictionary.defineTag('inheritParams', {
        canHaveType: false,
        canHaveName: false,
        isNamespace: false,
        mustHaveValue: false,
        mustNotHaveDescription: false,
        mustNotHaveValue:false,
        onTagged: function(doclet, tag) {
            if(!doclet.inheritable || !doclet.inheritable.types || !doclet.inheritable.types.params){
                doclet.inheritable = doclet.inheritable ? doclet.inheritable : {};
                doclet.inheritable.types = doclet.inheritable.types ? doclet.inheritable.types : {};

                doclet.inheritable.types.params=doclet.params && doclet.params.length>0 ? 'append' : 'prepend';
            }
        }
    });
     
    dictionary.defineTag('inheritProperties', {
        canHaveType: false,
        canHaveName: false,
        isNamespace: false,
        mustHaveValue: false,
        mustNotHaveDescription: false,
        mustNotHaveValue:false,
        onTagged: function(doclet, tag) {
            if(!doclet.inheritable || !doclet.inheritable.types || !doclet.inheritable.types.properties){
                doclet.inheritable = doclet.inheritable ? doclet.inheritable : {};
                doclet.inheritable.types = doclet.inheritable.types ? doclet.inheritable.types : {};

                doclet.inheritable.types.properties=doclet.properties && doclet.properties.length>0 ? 'append' : 'prepend';
            }
        }
    });
};

exports.handlers = {
    parseComplete: function(e){
        let all = {};
        let byMemberof = {};
        let toProcess = [];
        e.doclets.forEach((doclet) => {
            
            let name = getInheritableName(doclet);
            let memberName = getDocletName(doclet);
            
            all[name] = doclet;
            let memberof='none';
            if(doclet.memberof){
                memberof = getInheritableNameByLongname(e.doclets, doclet.memberof);
            }
            byMemberof[memberof] = byMemberof[memberof] || {};
            byMemberof[memberof][memberName] = doclet;
            let isInheritable = false;
            
            if(doclet.inheritable){
                let keys = Object.keys(doclet.inheritable.types);
                for(var i=0;i<keys.length; i++){
                    if(doclet.inheritable.types[keys[i]]){
                        isInheritable=true;
                        break;
                    }
                }
            }

            if(isInheritable && memberof != 'none'){
                if(doclet.comment.indexOf('@summary') < 0 && doclet.inheritable.types.summary){
                    doclet.summary = '';
                }
                toProcess.unshift(doclet);
            }
        });
        
        let processed = [];
        toProcess.forEach(inherited => {
            
            let description = '';
            let summary = '';
            let params = [];
            let properties = [];
            let inheritedMemberofName = getInheritableNameByLongname(e.doclets, inherited.memberof);
            let inheritedName = getInheritableName(inherited);
            let inheritedMemberName = getDocletName(inherited);
            let inheritedParent = all.hasOwnProperty(inheritedMemberofName) ? all[inheritedMemberofName] : null;
            let parents = inheritedParent ? [inheritedParent] : [];
            let orderedParents = [];
            
            while(parents.length > 0){
                let parent = parents.shift();
                if(parent.augments && parent.augments.length > 0){
                    for(var j=0; j<parent.augments.length; j++){
                        let augmentMemberofName = getInheritableNameByLongname(e.doclets, parent.augments[j]);
                        augment = all.hasOwnProperty(augmentMemberofName) ? all[augmentMemberofName] : null;
                        if(augment){
                            orderedParents.unshift(augment);
                            parents.unshift(augment);
                        }
                    }
                }
            }
            if(inheritedParent){
                orderedParents.push(inheritedParent);
            }
            
            while(orderedParents.length > 0){
                let parent = orderedParents.pop();
                
                if(parent.augments && parent.augments.length > 0){
                    for(var x=0; x<parent.augments.length; x++){
                        let augmentMemberofName = getInheritableNameByLongname(e.doclets, parent.augments[x]);
                        augment = all.hasOwnProperty(augmentMemberofName) ? all[augmentMemberofName] : null;
                        
                        if(augment){
                            let augmentName = getInheritableName(augment);
                            //We have the augment class doclet
                            if(byMemberof.hasOwnProperty(augmentName) && byMemberof[augmentName].hasOwnProperty(inheritedMemberName)){
                                let inheritFrom = byMemberof[augmentName][inheritedMemberName];
                                let inheritFromName = getInheritableName(inheritFrom);
                                if(processed.indexOf(inheritFromName) < 0){
                                    processed.push(inheritFromName);
                                    if(inheritFrom.description){
                                        description += inheritFrom.description+"\n";
                                    }
                                    if(inheritFrom.summary){
                                        summary += inheritFrom.summary+"\n";
                                    }
                                    
                                    if(inheritFrom.params && inheritFrom.params.length > 0){
                                        params = mergeProps(params, inheritFrom.params, inherited.inheritable.types.params == 'append');
                                    }
   
                                    if(inheritFrom.properties && inheritFrom.properties.length > 0){
                                        properties = mergeProps(properties, inheritFrom.properties, inherited.inheritable.types.properties == 'append');
                                    }
                                }
                            }
                        }
                    }
                }
            }
            //We should have a description from the closest augments, if one exists
            if(inherited.inheritable.types.desc && (description || inherited.inheritable.types.desc.append)){
                description = stripOuterParagraph(description);
                inherited.inheritable.types.desc.append = stripOuterParagraph(inherited.inheritable.types.desc.append);
                inherited.description = stripOuterParagraph(inherited.description);
                if(inherited.inheritable.types.desc.position == 'append'){
                    inherited.description = "<p>"+(inherited.description ? inherited.description+"<br />" : '')+
                        description+
                        (inherited.inheritable.types.desc.append ? "<br />"+inherited.inheritable.types.desc.append : '')+"</p>";
                }else{
                    inherited.description = "<p>"+description+
                        (inherited.inheritable.types.desc.append ? "<br />"+inherited.inheritable.types.desc.append : '')+
                        (inherited.description ? "<br />"+inherited.description : '')+"</p>";
                }
            }
           
            if(inherited.inheritable.types.summary && (summary || inherited.inheritable.types.summary.append)){
                summary = stripOuterParagraph(summary);
                inherited.summary = stripOuterParagraph(inherited.summary);
                inherited.inheritable.types.summary.append = stripOuterParagraph(inherited.inheritable.types.summary.append);
                if(inherited.inheritable.types.summary.position == 'append'){
                    inherited.summary = "<p>"+(inherited.summary ? inherited.summary+"<br>" : '')+
                        summary+
                        (inherited.inheritable.types.summary.append ? "<br>"+inherited.inheritable.types.summary.append : '')+"</p>";
                }else{
                    inherited.summary = "<p>"+summary+
                        (inherited.inheritable.types.summary.append ? "<br>"+inherited.inheritable.types.summary.append : '')+
                        (inherited.summary ? "<br>"+inherited.summary : '')+"</p>";
                }
            }
           
            if(inherited.inheritable.types.params && params){
                inherited.params = mergeProps(params, inherited.params, inherited.inheritable.types.params == 'append');
            }
        
            if(inherited.inheritable.types.properties && properties){
                console.log(inherited.inheritable.types.properties);
                inherited.properties = mergeProps(properties, inherited.properties, inherited.inheritable.types.properties == 'append');
            }
        });
    }
};

function stripOuterParagraph(string){
    string = string ? string : '';
    string = string.trim();
    if(string.substring(0, 3) == '<p>'){
        string = string.substring(3);
    }
    if(string.substring(string.length-4) == '</p>'){
        string = string.substring(0, string.length-4);
    }
    return string;
}

function mergeProps(first, second, prepend){
    second = second ? second : [];
    first = first ? first : [];
    
    if(first.length == 0 && second.length == 0){
        //both are empty
        return [];
    }else if(first.length == 0 && second.length > 0){
        //first is empty, second is not
        return second;
    }else if(first.length > 0 && second.length == 0){
        //second is empty, first is not
        return first;
    }else{
        //first and second have elements
        let merged=[];
        //put any elements in first that are not in second into merged
        //leave second alone, and we will append/prepend afterwards
        //this way we can keep the params grouped by where they are defined
        for(var x=0; x<first.length; x++){
            let index = second.findIndex((elem) => {
                return elem.name == first[x].name;
            });
            if(index < 0){
                merged.push(first[x]);
            }
        }
        if(second.length > 0){
            if(!prepend){
                merged = [
                    ...merged,
                    ...second
                ];
            }else{
                merged = [
                    ...second,
                    ...merged,
                ];
            }
        }
        return merged;
    }
}

function getInheritableName(doclet){
    let name = doclet.inheritable && doclet.inheritable.name ? doclet.inheritable.name : null;
    let update = false;
    if(!name){
        if(doclet.meta && doclet.meta.code && doclet.meta.code.id){
            name = doclet.meta.code.id;
            update=!!doclet.inheritable;
        }else{
            if(doclet.longname){
                name = doclet.longname;
                update=!!doclet.inheritable;
            }else{
                //doclet doesn't have a longname, so we'll try to use the ID
                
            }
        }
    }
    if(name && update){
        doclet.inheritable.name = name;
    }
    return name;
}

let idMap = {};
function getInheritableNameByLongname(list, searchName){
    if(!list || list.length == 0 || !searchName){
        return null;
    }
    if(idMap.hasOwnProperty(searchName)){
        return idMap[searchName];
    }
    
    let index = list.findIndex(search => {
        return search.longname == searchName;
    });
    if(index >= 0){
        idMap[searchName] = getInheritableName(list[index]);
    }else{
        return null;
        idMap[searchName] = null;
    }
    
    return idMap[searchName];
}

function getDocletName(doclet){
    if(!doclet){
        return null;
    }
    return (doclet.kind ? doclet.kind+'.' : '')+
        (doclet.scope ? doclet.scope+'.' : '')+
        (doclet.name ? doclet.name : '');
}
exports.defineTags = function (dictionary) {
    dictionary.defineTag('inheritDesc', {
          canHaveType: false,
          canHaveName: false,
          isNamespace: false,
          mustHaveValue: false,
          mustNotHaveDescription: false,
          mustNotHaveValue:false,
          onTagged: function(doclet, tag) {
               if(!doclet.inheritDesc){
                    doclet.inheritDesc={
                         position: doclet.description ? 'append' : 'prepend',
                         append: tag.text ? tag.text : ''
                    };
                    //doclet.comment = doclet.comment.replace("@inheritDesc\n",'').replace("@inheritDesc",'');
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
               if(!doclet.inheritSummary){
                    
                    doclet.inheritSummary={
                         position: doclet.summary ? 'append' : 'prepend',
                         append: tag.text ? tag.text : '',
                    };
                    //doclet.comment = doclet.comment.replace("@inheritSummary\n",'').replace("@inheritSummary",'');
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
               if(!doclet.inheritParams){
                    doclet.inheritParams=doclet.params && doclet.params.length>0 ? 'append' : 'prepend';
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
               
               all[doclet.longname] = doclet;
               let memberof='none';
               if(doclet.memberof){
                    memberof = doclet.memberof;
               }
               byMemberof[memberof] = byMemberof[memberof] || {};
               byMemberof[memberof][doclet.name] = doclet;
               if((doclet.inheritDesc || doclet.inheritSummary && doclet.inheritParams) && doclet.memberof){
                    if(doclet.comment.indexOf('@summary') < 0 && doclet.summary){
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
             let inheritedParent = all.hasOwnProperty(inherited.memberof) ? all[inherited.memberof] : null;
             let parents = inheritedParent ? [inheritedParent] : [];
             let orderedParents = [];
             
             while(parents.length > 0){
                  let parent = parents.shift();
                  if(parent.augments && parent.augments.length > 0){
                       for(var x=0; x<parent.augments.length; x++){
                            augment = all.hasOwnProperty(parent.augments[x]) ? all[parent.augments[x]] : null;
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
                            
                            augment = all.hasOwnProperty(parent.augments[x]) ? all[parent.augments[x]] : null;
                            
                            if(augment){
                                 //We have the augment class doclet
                                 if(byMemberof.hasOwnProperty(augment.longname) && byMemberof[augment.longname].hasOwnProperty(inherited.name)){
                                      let inheritFrom = byMemberof[augment.longname][inherited.name];
                                      if(processed.indexOf(inheritFrom.longname) < 0){
                                           processed.push(inheritFrom.longname);
                                           if(inheritFrom.description){
                                                description += inheritFrom.description+"\n";
                                           }
                                           if(inheritFrom.summary){
                                                summary += inheritFrom.summary+"\n";
                                           }
                                           
                                           if(inheritFrom.params && inheritFrom.params.length > 0){
                                                params = mergeProps(params, inheritFrom.params, inherited.inheritParams == 'append');
                                           }
                                      }
                                 }
                                 //parents.push(augment);
                            }
                       }
                  }
             }
             //We should have a description from the closest augments, if one exists
             if(inherited.inheritDesc && (description || inherited.inheritDesc.append)){
                  description = stripOuterParagraph(description);
                  inherited.inheritDesc.append = stripOuterParagraph(inherited.inheritDesc.append);
                  inherited.description = stripOuterParagraph(inherited.description);
                  if(inherited.inheritDesc.position == 'append'){
                       inherited.description = "<p>"+(inherited.description ? inherited.description+"<br />" : '')+
                            description+
                            (inherited.inheritDesc.append ? "<br />"+inherited.inheritDesc.append : '')+"</p>";
                  }else{
                       inherited.description = "<p>"+description+
                            (inherited.inheritDesc.append ? "<br />"+inherited.inheritDesc.append : '')+
                            (inherited.description ? "<br />"+inherited.description : '')+"</p>";
                  }
             }
             
             if(inherited.inheritSummary && (summary || inherited.inheritSummary.append)){
                  summary = stripOuterParagraph(summary);
                  inherited.summary = stripOuterParagraph(inherited.summary);
                  inherited.inheritSummary.append = stripOuterParagraph(inherited.inheritSummary.append);
                  if(inherited.inheritSummary.position == 'append'){
                       inherited.summary = "<p>"+(inherited.summary ? inherited.summary+"<br>" : '')+
                            summary+
                            (inherited.inheritSummary.append ? "<br>"+inherited.inheritSummary.append : '')+"</p>";
                  }else{
                       inherited.summary = "<p>"+summary+
                            (inherited.inheritSummary.append ? "<br>"+inherited.inheritSummary.append : '')+
                            (inherited.summary ? "<br>"+inherited.summary : '')+"</p>";
                  }
             }
             
             if(inherited.inheritParams && params){
                    inherited.params = mergeProps(params, inherited.params, inherited.inheritParams == 'append');
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
               if(prepend){
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
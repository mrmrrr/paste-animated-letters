function getItem(itemName){
    for(var i=1; i<=app.project.numItems; i++){
        if(app.project.item(i).name.indexOf(itemName) !=-1){
            return app.project.item(i);
        };
    };  
    return null;
}
;

function getItemInFolder(itemName, folder){
    for(var i = 1; i<= folder.numItems; i++){
        if(folder.item(i).name.indexOf(itemName) !=-1){
            return folder.item(i);
        };
    };
    return null;
}
;

var comp = app.project.activeItem;
var myWindow = new Window ("palette", "Text Placer");
var myInputGroup = myWindow.add("group");
myInputGroup.alignment = "left";
var myText = myInputGroup.add ("edittext", undefined);
myText.text = 'Your text';
myText.characters = 10;
myText.active = true;

var myFolder = myInputGroup.add ("edittext", undefined);
myFolder.text = 'Folder name with letters';
myFolder.characters = 10;

var myPrefix = myInputGroup.add ("edittext", undefined);
myPrefix.text = 'Prefix in comp name';
myPrefix.characters = 10;

var myButtonGroup = myWindow.add("group");
myButtonGroup.alignment = "left";
var btnOk = myButtonGroup.add ("button", undefined, "OK");
var btnCancel = myButtonGroup.add ("button", undefined, "Cancel");
var btnBreak = myButtonGroup.add ("button", undefined, "Break");
var INDEX_ARR = [];
var count=0;

btnBreak.onClick = function(){
        app.beginUndoGroup("BREAK EXPRESSION");
        var myTextString = myText.text.toString().toUpperCase();
        var selectedNull = comp.selectedLayers[0];
        
        for(i=1;i<comp.numLayers;i++){
            if(i==selectedNull.index){
                continue;
            }
            if(comp.layer(i).parent==comp.layer(selectedNull.index)){
                    INDEX_ARR.push(i);
            }
        }
    
        var nullScale = selectedNull.property("ADBE Transform Group").property("ADBE Scale").value;
        
        if(nullScale>100 || nullScale<100){
            for(i=0; i<INDEX_ARR.length;i++){
                var letterLayer = INDEX_ARR[i];
                var posX = comp.layer(letterLayer).property("ADBE Transform Group").property("ADBE Position").value[0].toString();
                var posY = comp.layer(letterLayer).property("ADBE Transform Group").property("ADBE Position").value[1].toString();
                comp.layer(letterLayer).property("ADBE Transform Group").property("ADBE Position").expression='';
                comp.layer(letterLayer).property("ADBE Transform Group").property("ADBE Position").setValue([posX,posY]);
                comp.layer(letterLayer).parent = null;
                comp.layer(letterLayer).property("ADBE Transform Group").property("ADBE Scale").setValue(nullScale);
            };
        }else{
            for(i=0; i<INDEX_ARR.length;i++){
                var letterLayer = INDEX_ARR[i];
                var posX = comp.layer(letterLayer).property("ADBE Transform Group").property("ADBE Position").value[0].toString();
                var posY = comp.layer(letterLayer).property("ADBE Transform Group").property("ADBE Position").value[1].toString();
                comp.layer(letterLayer).property("ADBE Transform Group").property("ADBE Position").expression='';
                comp.layer(letterLayer).property("ADBE Transform Group").property("ADBE Position").setValue([posX,posY]);
                comp.layer(letterLayer).parent = null;
                comp.layer(letterLayer).property("ADBE Transform Group").property("ADBE Scale").setValue(nullScale);
            };
        };
        INDEX_ARR=[];
        app.endUndoGroup();
}
;

btnOk.onClick = function(){
    app.beginUndoGroup("PASTE LETTERS");
    if(count==0){
        count=count+1;
        
        var nullLayer = comp.layers.addNull(app.project.activeItem.duration);
        var myTextString = myText.text.toString().toUpperCase();
        var nullName = myTextString;
        var b = 200;
        nullLayer.transform.position.setValue([b,300+(getItemInFolder (myTextString.charAt(1) , getItem (myFolder.text)).height/2)]);
        nullLayer.source.name =nullName;
        comp.layer(myTextString).property("ADBE Effect Parade").addProperty("ADBE Slider Control");
        var mW = 0;
        var gapBefore = 0;
        
        for (var i = 0; i<myTextString.length; i++){
            
            if(i==0){
                var selectedComp = getItemInFolder(myPrefix.text+myTextString.charAt(i), getItem (myFolder.text));
                var compWidth = selectedComp.width;
                var gapComp = (compWidth/2)

                var posComp = getItem (comp.name).layers.add(selectedComp);
                posComp.transform.position.setValue([gapComp+mW, 300]);
                posComp.parent = nullLayer;
                mW=mW+(selectedComp.width/4);
                gapBefore = gapBefore+gapComp;   
                continue;
            }
            var firstLayer = myPrefix.text+myTextString.charAt(0);
            
            var FirstX = comp.layer(firstLayer).property("ADBE Transform Group").property("ADBE Position").value[0];
            
            var selectedComp = getItemInFolder(myPrefix.text+myTextString.charAt(i), getItem (myFolder.text));
            var compWidth = selectedComp.width;
            var gapComp = (compWidth/2)
            var posComp = getItem (comp.name).layers.add(selectedComp);
            
            posComp.transform.position.setValue([gapComp+mW, 300]);
            posComp.parent = nullLayer;
            posComp.property("ADBE Transform Group").property("ADBE Position").expression = 
                'temp = thisComp.layer("'+nullName+'").effect("Slider Control")("Slider");['+FirstX+'+(temp*'+i+'), value[1]];'
            mW=mW+(selectedComp.width/4);
            gapBefore = gapBefore+gapComp;
        };
        
    }else{
        count=count+1;
        
        var nullLayer = comp.layers.addNull(app.project.activeItem.duration);
        var myTextString = myText.text.toString().toUpperCase();
        var nullName = myTextString+count;
        var b = 200;
        nullLayer.transform.position.setValue([b,300+(getItemInFolder (myTextString.charAt(1) , getItem (myFolder.text)).height/2)]);
        nullLayer.source.name =myTextString+count;
        comp.layer(nullName).property("ADBE Effect Parade").addProperty("ADBE Slider Control");
        var mW = 0;
        var gapBefore = 0;
        
        for (var i = 0; i<myTextString.length; i++){
            
            if(i==0){
                var selectedComp = getItemInFolder(myPrefix.text+myTextString.charAt(i), getItem (myFolder.text));
                var compWidth = selectedComp.width;
                var gapComp = (compWidth/2)

                var posComp = getItem (comp.name).layers.add(selectedComp);
                posComp.transform.position.setValue([gapComp+mW, 300]);
                posComp.parent = nullLayer;
                mW=mW+(selectedComp.width/4);
                gapBefore = gapBefore+gapComp;   
                continue;
            }
            var firstLayer = myPrefix.text+myTextString.charAt(0);
            
            var FirstX = comp.layer(firstLayer).property("ADBE Transform Group").property("ADBE Position").value[0];
            
            var selectedComp = getItemInFolder(myPrefix.text+myTextString.charAt(i), getItem (myFolder.text));
            var compWidth = selectedComp.width;
            var gapComp = (compWidth/2)
            var posComp = getItem (comp.name).layers.add(selectedComp);
            
            posComp.transform.position.setValue([gapComp+mW, 300]);
            posComp.parent = nullLayer;
            posComp.property("ADBE Transform Group").property("ADBE Position").expression = 
                'temp = thisComp.layer("'+nullName+'").effect("Slider Control")("Slider");['+FirstX+'+(temp*'+i+'), value[1]];'
            mW=mW+(selectedComp.width/4);
            gapBefore = gapBefore+gapComp;
        };
    }
    app.endUndoGroup();
}
;

btnCancel.onClick = function(){ myWindow.close() };
myWindow.show();
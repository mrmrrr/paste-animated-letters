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
var folderNames = [];
var comp = app.project.activeItem;
var myWindow = new Window ("palette", "Text Placer");

myWindow.orientation = "column";
var mainGroup = myWindow.add("group");
mainGroup.orientation = "row";

var col1 = mainGroup.add("group");
col1.orientation = "column";
col1.alignChildren = ["left","center"];
var col2 = mainGroup.add("group");
col2.orientation = "column";
col2.alignChildren = ["left","center"];
var col3 = mainGroup.add("group");
col3.orientation = "column";
col3.alignChildren = ["left","center"];

var staticText1 = col1.add("statictext", undefined, undefined, {name: "statictext1"});
staticText1.text = "Your Text :";
staticText1.justify ="left";
var myText = col1.add ("edittext", undefined);
myText.characters = 10;
myText.active = true;

var staticText2 = col2.add("statictext", undefined, undefined, {name: "statictext2"});
staticText2.text = "Comp Prefix :";
staticText2.justify ="left";
var myPrefix = col2.add ("edittext", undefined);
myPrefix.characters = 10;

var staticText3 = col3.add("statictext", undefined, undefined, {name: "statictext3"});
staticText3.text = "Folder :";
staticText3.justify ="left";
dropdownList();
var myDropdown = col3.add ("dropdownlist", undefined, folderNames);

function dropdownList(){
    for(i=1;i<app.project.numItems;i++){
        if(app.project.items[i] instanceof FolderItem)
            folderNames.push(app.project.items[i].name);
    };
}
;

var myButtonGroup = myWindow.add("group");
myButtonGroup.alignment = "left";
var btnOk = myButtonGroup.add ("button", undefined, "Paste");
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
        nullLayer.transform.position.setValue([0, getItemInFolder(myTextString.charAt(1), getItem(myDropdown.selection.text)).height]);
        nullLayer.source.name =nullName;
        comp.layer(myTextString).property("ADBE Effect Parade").addProperty("ADBE Slider Control");
        
        for (var i = 0; i<myTextString.length; i++){
            
            if(i==0){
                var selectedComp = getItemInFolder(myPrefix.text+myTextString.charAt(i), getItem(myDropdown.selection.text));
                var posComp = getItem(comp.name).layers.add(selectedComp);
                posComp.transform.position.setValue([selectedComp.width/2, selectedComp.height/2]);
                posComp.parent = nullLayer;
                continue;
            }
            var firstLayer = myPrefix.text+myTextString.charAt(0);
            var FirstX = comp.layer(firstLayer).property("ADBE Transform Group").property("ADBE Position").value[0];
            var selectedComp = getItemInFolder(myPrefix.text+myTextString.charAt(i), getItem(myDropdown.selection.text));
            var posComp = getItem(comp.name).layers.add(selectedComp);
            
            posComp.transform.position.setValue([selectedComp.width/2, selectedComp.height/2]);
            posComp.parent = nullLayer;
            posComp.property("ADBE Transform Group").property("ADBE Position").expression = 
                'temp = thisComp.layer("'+nullName+'").effect("Slider Control")("Slider");['+FirstX+'+(temp*'+i+'), value[1]];'
        };
        
    }else{
        count=count+1;
        var nullLayer = comp.layers.addNull(app.project.activeItem.duration);
        var myTextString = myText.text.toString().toUpperCase();
        var nullName = myTextString+count;
        nullLayer.transform.position.setValue([0, getItemInFolder(myTextString.charAt(1), getItem(myDropdown.selection.text)).height]);
        nullLayer.source.name =myTextString+count;
        comp.layer(nullLayer.name).property("ADBE Effect Parade").addProperty("ADBE Slider Control");
        
        for (var i = 0; i<myTextString.length; i++){
            if(i==0){
                var selectedComp = getItemInFolder(myPrefix.text+myTextString.charAt(i), getItem(myDropdown.selection.text));
                var posComp = getItem(comp.name).layers.add(selectedComp);
                posComp.transform.position.setValue([selectedComp.width/2, selectedComp.height/2]);
                posComp.parent = nullLayer;
                continue;
            }
            var firstLayer = myPrefix.text+myTextString.charAt(0);
            
            var FirstX = comp.layer(firstLayer).property("ADBE Transform Group").property("ADBE Position").value[0];
            
            var selectedComp = getItemInFolder(myPrefix.text+myTextString.charAt(i), getItem(myDropdown.selection.text));
            var posComp = getItem(comp.name).layers.add(selectedComp);
            
            posComp.transform.position.setValue([selectedComp.width/2, selectedComp.height/2]);
            posComp.parent = nullLayer;
            posComp.property("ADBE Transform Group").property("ADBE Position").expression = 
                'temp = thisComp.layer("'+nullName+'").effect("Slider Control")("Slider");['+FirstX+'+(temp*'+i+'), value[1]];'
        };
    }
    app.endUndoGroup();
}
;

myWindow.show();


	var selectOfPath = $('select.paths')[0];
	
        
        
	var paths;
        paths = loadPaths("mypaths");
	if(!paths) paths = new collecPaths();
        
	var pathView = new CollecToSelect({
		el : selectOfPath,
		collection : paths
	});
        
	pathView.render();
	var selectOfNote = $('select.notes')[0];
        var noteView;
        
        
        var currentPath;
        //var infos = [];
        
function getPathFromSelect(){
    var id = selectOfPath.selectedIndex;
    var model = paths.at(id);
    if(model){
     //   alert(model.get("notes"));
        document.getElementById("parcournameinput").value = model.get("name");
        document.getElementById("parcourbodyinput").value = model.get("body");
        currentPath = model;
        //alert(model.get("notes"));//
        if(!noteView) noteView = new CollecToSelect({
            
            collection : model.get("notes"),
            el : selectOfNote
                
	});
        noteView.collection = model.get("notes");
        noteView.render();
        var notesCol =  model.get("notes");
        showNotesOnMap(notesCol);
        calculateDistanceAndTime();
    } else{
        alert("parcours n'est pas valide");
    }
}
function newPath(){
    var p = new Path({ 
        name : "Nouveau parcour",
        notes : new collecNotes()
    });
    
    paths.add(p);
    saveCollectionToLocal("mypaths",paths);
    pathView.render();
    var indexOf = paths.indexOf(p);
    selectOfPath.selectedIndex = indexOf;
    getPathFromSelect();
}
function updatePath(){
    currentPath.set("name", $('#parcournameinput')[0].value);
    currentPath.set("body", $('#parcourbodyinput')[0].value);
    saveCollectionToLocal("mypaths",paths);
    pathView.render();
}
function goToNewNote(){
    localStorage["currentpath"] = paths.indexOf(currentPath);
    window.location.href="notecreate.html";
}
function deleteNote(){
    if(currentPath){
        if(selectOfNote.selectedIndex >= 0){
            currentPath.get("notes").remove(currentPath.get("notes").at(selectOfNote.selectedIndex));
            noteView.render();
            saveCollectionToLocal("mypaths",paths);
            getPathFromSelect();
        } else{
            alert("Il n'y a pas de note selectionne");
        }
    }
}
function swapNotes(index1, index2){
    if(currentPath){
        var c =noteView.collection; 
        if(index1 >= 0 && index2>= 0 && index1 < c.length && index2 < c.length){
            var a = c.models[index2];
            c.models[index2] = c.models[index1];
            c.models[index1] = a;
            saveCollectionToLocal("mypaths",paths);
            noteView.render();
            selectOfNote.selectedIndex = index2;
        }
    }
}
function bringNoteUp(){
    var index1 = selectOfNote.selectedIndex;
    var index2 = selectOfNote.selectedIndex-1;
    swapNotes(index1, index2);
}
function bringNoteDown(){
    var index1 = selectOfNote.selectedIndex;
    var index2 = selectOfNote.selectedIndex+1;
    swapNotes(index1, index2);
}
function editNote(){
    if(currentPath){
        
        if(selectOfNote.selectedIndex >= 0){
            localStorage["currentnote"] = selectOfNote.selectedIndex;
            localStorage["currentpath"] = paths.indexOf(currentPath);
            window.location.href="modifiernote.html";
        } else{
            alert("Il n'y a pas de note selectionnée");
        }
    }
}
function sendToServer(){
    var dataJSON = JSON.stringify(paths);
    var result = $.ajax({
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            url: 'http://localhost:8080/NetbeansProject/webresources/aministratorSave', //'http://localhost:8080/WebServiceInvocation/webresources/generic/',//'webresources/generic',
            type: 'PUT', //webresources/generic
            data: dataJSON,
            mimeType: 'text/JSON',
            success: function() { alert('Envoye au serveur!'); }
        });
        result.fail(function(jqXHR, textStatus) {
            alert( "Request failed: " + textStatus );
        });
}
function calculateDistanceAndTime(){
    var model = currentPath;
    var outputDiv = document.getElementById('distancetime');
    if(model){
        var notesCol = model.get("notes");
        alert(notesCol.length);
        if(notesCol.length > 1)
            getFullDistance(notesCol, distanceCallBack);
        else
            outputDiv.innerHTML = '';
  //          alert("Notes no good");
        
    } else{
        outputDiv.innerHTML = '';
//        alert("NO PATH");
        
    }
}
    function distanceCallBack(response, status) {
        if (status != google.maps.DistanceMatrixStatus.OK) {
          alert('Error was: ' + status);
        } else {
          var origins = response.originAddresses;
          var destinations = response.destinationAddresses;
          var outputDiv = document.getElementById('distancetime');
          
          var totalD = 0;
          var totalT = 0;

          for (var i = 0; i < origins.length-1; i++) {
            var results = response.rows[i].elements;
            totalD += results[i+1].distance.value;
            totalT += results[i+1].duration.value;
          }
          outputDiv.innerHTML = "Distance totale " + totalD + " meters. Duration totale " + (totalT/60).toFixed(2)+" minutes.";
        }
    }
$('select.paths').on("change", getPathFromSelect);
$('#parcournameinput').on("change", updatePath);
$('#parcourbodyinput').on("change", updatePath);
$('#parcournameinput').on("keyup", updatePath);
$('#parcourbodyinput').on("keypress", updatePath);
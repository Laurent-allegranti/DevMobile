
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


function activer(){
	document.getElementById("parcournameinput").disabled=false;
	document.getElementById("parcourbodyinput").disabled=false;
};

function newPath(){

	var name = document.getElementById("parcournameinput").value;
	var body = document.getElementById("parcourbodyinput").value;
	
    var p = new Path({ 
        name : name,
		body: body,
        notes : new collecNotes()
    });
    
	


	
    paths.add(p);
    saveCollectionToLocal("mypaths",paths);
	alert("le parcours a été ajouté avec succès");
		window.location.href="Home.html";
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



$('select.paths').on("change", getPathFromSelect);
$('#parcournameinput').on("change", updatePath);
$('#parcourbodyinput').on("change", updatePath);
$('#parcournameinput').on("keyup", updatePath);
$('#parcourbodyinput').on("keypress", updatePath);
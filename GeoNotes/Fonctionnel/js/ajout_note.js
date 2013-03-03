	var marker
	var selectOfPath = $('select.notes')[0];
	
        paths = loadPaths("mypaths");
	
        
	var noteView = new CollecToSelect({
		el : selectOfPath,
		collection : paths
	});
	noteView.render();
        
        selectOfPath.selectedIndex = localStorage["currentpath"];
		
function enregistrernote()
{
	var p = paths.at(selectOfPath.selectedIndex);
	
	var name = document.getElementById("nomnote").value;
	var body = document.getElementById("commentairenote").value;

	var n = new Note({
		name: name,
		body: body,
	
	});
	p.get("notes").add(n);
        saveCollectionToLocal("mypaths", paths);
		alert("la Note a été ajoutée avec succès");
		window.location.href="Home.html";
}

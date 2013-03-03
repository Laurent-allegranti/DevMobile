	var marker;
	function testGeoloc() {
	
		var div = document.getElementById("demoGeoloc");
		if (!navigator.geolocation) {
			div.innerHTML = 'Erreur : votre navigateur ne supporte pas Geolocalisation';
			return;
		}			
		div.style.height = '500px';
		div.style.width = '570px';
		var options = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(div, options);
		marker = new google.maps.Marker();
		marker.setMap(map);
		marker.setDraggable(true);
		google.maps.event.addListener(map, 'click', function(event) {
			marker.setPosition(event.latLng);
			marker.setCenter(event.latLng);
		});
		
		navigator.geolocation.getCurrentPosition(
			// Succ�s
			function (position) {
			
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				map.setCenter(new google.maps.LatLng(lat, lng));
				marker.setPosition(new google.maps.LatLng(lat, lng));
			},
			// Erreur
			function (error) {
				div.innerHTML = 'Erreur : ' + error.message;
			},
			// Configuration
			{
				maximumAge: 60000,
				timeout: 2000
			}
		);
	}
	var paths = loadPaths("mypaths");
        var note = paths.at(localStorage["currentpath"]).get("notes").at(localStorage["currentnote"]);
        if(!note) window.location.href="parcour.html";
        document.getElementById("notenameinput").value = note.get("name");
        document.getElementById("notebodyinput").value = note.get("body");
function registerChanges()
{
	var name = document.getElementById("notenameinput").value;
	var body = document.getElementById("notebodyinput").value;
	
	var a = marker.getPosition().lat();
	var b = marker.getPosition().lng();
	
	
	if(note){
		note.set({name: name, body: body, lat: a, lng: b});
                saveCollectionToLocal("mypaths", paths);
                window.location.href="editparcours.html";
	}

	
}


	function testGeoloc() {
                
		var div = document.getElementById("demoGeoloc");
		if (!navigator.geolocation) {
			div.innerHTML = 'Erreur : votre navigateur ne supporte pas la Geolocation';
			return;
		}			
		div.style.height = '500px';
		div.style.width = '570px';
		var options = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(div, options);
                var infowindow = new google.maps.InfoWindow();
                geocoder = new google.maps.Geocoder();
		marker = new google.maps.Marker();
		marker.setMap(map);
		marker.setDraggable(true);
                function geoCodingReverse(latLng){
                    geocoder.geocode({'latLng': latLng}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                          if (results[0]) {
                            $("#adresslabel")[0].innerHTML = results[1].formatted_address;
                            infowindow.setContent("ADRESSE: "+results[1].formatted_address);
                            infowindow.open(map, marker);
                          } else {
                              $("#adresslabel")[0].innerHTML = 'Adresse pas bonne';
                          }
                        } else {
                          alert('Geoloc ne marche pas: ' + status);
                        }
                    });
                }
		google.maps.event.addListener(map, 'click', function(event) {
			marker.setPosition(event.latLng);
                        geoCodingReverse(event.latLng);
                      
		});
		
		navigator.geolocation.getCurrentPosition(
			// Succ�s
			function (position) {
			
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				map.setCenter(new google.maps.LatLng(lat, lng));
				marker.setPosition(new google.maps.LatLng(lat, lng));
                                geoCodingReverse(new google.maps.LatLng(lat, lng));
			},
			// Erreur
			function (error) {
				div.innerHTML = 'Erreur geoloc: ' + error.message;
			},
			// Configuration
			{
				maximumAge: 60000,
				timeout: 2000
			}
		);
	}

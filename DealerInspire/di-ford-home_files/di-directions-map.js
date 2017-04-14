(function(settings) {
	document.addEventListener('DOMContentLoaded', function() {
		var map, 
			searchBox,
			directionsService,
			directionsDisplay,
			markers = [],
			place,
			dealerDropdown;

		map = initGoogleMap(document.querySelector('.di-map-directions .map-container .map'));

		directionsService = new google.maps.DirectionsService;
  		directionsDisplay = new google.maps.DirectionsRenderer;
		directionsDisplay.setMap(map);

		directionsDisplay.setPanel(document.querySelector('.di-map-directions .directions-text'));

		markers = createMarkers(map, settings.dealers);
		fitMarkersInMap(map, markers);
		searchBox = initSearch(map);
		dealerDropdown = initDealerDropdown(map);

		initInfoWindows(map, markers, settings.dealers);
		initDirections(map, searchBox, dealerDropdown, directionsService, directionsDisplay, markers);
	});

	function initDirections(map, searchBox, dealerDropdown, directionsService, directionsDisplay, markers) {
		var place,
			currentMarker = markers[0];
			
		dealerDropdown.element.addEventListener('change', function() {			
			currentMarker = markers[dealerDropdown.element.value];
			calculateAndDisplayRoute(directionsService, directionsDisplay, place, currentMarker);
		});

		searchBox.addListener('places_changed', function() {
			var places = searchBox.getPlaces();
			place = places[0];
			
			document.querySelector('.di-map-directions .map-container').classList.add('open');
			google.maps.event.trigger(map, 'resize');

			calculateAndDisplayRoute(directionsService, directionsDisplay, place, currentMarker);

			fitMarkersInMap(map, markers);
		});
	}

	function calculateAndDisplayRoute(directionsService, directionsDisplay, place, marker) {
		if ( typeof place === 'undefined' ) {
			return;
		}

		var origin = place.formatted_address;
		var destination = marker.position;
		
		directionsService.route({
			origin: origin,
			destination: destination,
			travelMode: google.maps.TravelMode.DRIVING
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			} else {
				window.alert('Directions request failed due to ' + status);
			}
		});
	}

	function initSearch(map) {
		var input, searchBox, markers = [], dealerDiv, elements;
		
		elements = document.getElementsByClassName('search-field');
		
		if ( elements.length > 0 ) {
			input = elements[0];
		}
		
		searchBox = new google.maps.places.SearchBox(input);
		input.index = 1;
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		return searchBox;
	}

	function initDealerDropdown(map) {
		var dealerComponent, elements, dealerDiv;
		
		elements = document.getElementsByClassName('dealer-dropdown');
		
		if ( elements.length > 0 ) {
			dealerDiv = elements[0];
		}
		
		dealerComponent = new DealerControl(dealerDiv);
		dealerDiv.index = 2;
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(dealerDiv);

		return dealerComponent;
	}

	function initGoogleMap(element) {
		return new google.maps.Map(element, {
			streetViewControl: false,
			mapTypeControl: false,
			scrollwheel: false,
			draggable: (window.innerWidth > 1024) ? true : false
		});
	}

	function createMarkers(map, dealers) {
		var marker,
			markers = [];

		dealers.forEach(function(dealer) {
			marker = createMarker(map, dealer);

			if ( marker ) {
				markers.push(marker);
			}
		});

		return markers;
	}

	function createMarker(map, dealer) {
		var marker, coord;

		if ( ! dealer.location ) {
			return false;
		}

		coord = {lat: parseFloat(dealer.location.lat), lng: parseFloat(dealer.location.lng)};

		marker = new google.maps.Marker({
		    position: coord,
		    map: map,
		});

		return marker;
	}

	function fitMarkersInMap(map, markers) {
		registerBoundsChangeEvent(map);

		var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < markers.length; i++) {
			bounds.extend(markers[i].getPosition());
		}

		map.fitBounds(bounds);		
	}

	function registerBoundsChangeEvent(map) {
		google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
			this.setZoom(map.getZoom()-2);

			if (this.getZoom() > 15) {
				this.setZoom(15);
			}
		});
	}

	function initInfoWindows(map, markers, dealers) {
		var infoWindow;

		infoWindow = new google.maps.InfoWindow();

		markers.forEach(function(marker, i) {
			marker.addListener('click', function() {
				content = getInfoWindowContent(dealers[i]);
				infoWindow.setContent(content);
				infoWindow.open(map, marker);
			});
		});
	}

	function getInfoWindowContent(location) {

	    var locationContent = '<div class="dealerMapInfo">';
	      locationContent += '<h3>' + location.title + '</h3>';
	      locationContent += '<p class="address">' + location.location.address + '</p>';
	      locationContent += '<p class="phone">Phone: <a href="tel:' + location.dealer_phone + '">' + location.dealer_phone + '</a></p>';
	      locationContent += ' <a class="button primary-button small" target="_blank" href="' + location.dealer_website_url + '">Visit Website</a>';
	      locationContent += '</div>';

		return locationContent;
	}

	function DealerControl(dealerDiv) {
		var control = this;

		this.element = dealerDiv;

	}
}(di_dealer_directions));

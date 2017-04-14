$(function() {
	MobileLeadDriver.initialize();
	
	var submitOptions = {
		endpoint: "/api/lead/mobileLeadDriver/#TOKEN#",
		successCallback: function(data){
			var response = JSON.parse(data)
			DealerOnTrack.event('Mobile Lead Driver', 'Lead - ' + MobileLeadDriver.fenceName + ' (fence)', MobileLeadDriver.dropdownTitle);
			var eventValue;
			DealerOnTrack.event('Lead',
		    response.leadId,
		    response.leadSource,
		    eventValue,
		    function (leadId) {
		      window.location = "/thankyou.aspx?lid=" + leadId;
		    });
		},
		leadType: MobileLeadDriver.leadType,
		leadSource: MobileLeadDriver.leadSource,
		additionalData: function() { 
			var fenceId = $('#mobileLeadDriverFenceId').val() == '' ? null : $('#mobileLeadDriverFenceId').val();
			var lat = null;
			var lng = null;
			if(DealeronCookie.hasItem(MobileLeadDriver.COORDS)){
				var coord = DealeronCookie.getItem(MobileLeadDriver.COORDS).split('|');
				lat = coord[0];
				lng = coord[1];
			}
			
			return { 
				OfferId: $('#mobileLeadDriverOfferId').val(),
				FenceId: fenceId,
				Latitude: lat,
				Longitude: lng
			}; 
		}
	};
	
	DealeronLead.addSubmissionMethod('mobileLeadDriverSubmitOptions', submitOptions);
	DealeronLead.initialize('#mobileLeadDriverForm', 'mobileLeadDriverSubmitOptions');
	$("#mobileLeadDriverFirstName").on("focusout", DealeronLead.begin);
	
});


var MobileLeadDriver = {
	GEOFENCE : 'DLRON_geofences',
	COORDS: 'DLRON_coordinate',
	
	DriverType: { IMAGE: 1, TEXT: 2},
	
	timeoutId: null,
	deviceType: null,
	leadSource: null,
	leadType: 4,
	rendered: false,
	fenceName: null,
	dropdownTitle: null,
	
	initialize: function(){
		
		if(window['mldDataObject'] == undefined){
			this.log("mldDataObject not found");
			return;
		}
		
		if(window['DealeronCookie'] == undefined){
			this.log("DealeronCookie not found, is dealeron.static.js loaded?");
			return;
		}
		
		if(jQuery.browser.mobile){
			this.deviceType = 'Mobile';
			this.leadSource = 244;
		}else{
			this.deviceType = 'Desktop';
			this.leadSource = 243;
		}
		
		if(mldDataObject.deviceType === 1 && this.deviceType == 'Desktop'){
			return;
		}
		
		if(mldDataObject.deviceType === 2 && this.deviceType == 'Mobile'){
			return;
		}
		
		//consturct fenced offers
		var restrictedOffers = []
		$.each(mldDataObject.fences, function(index, value){
			if($.inArray(value.offerId, restrictedOffers) < 0){
				restrictedOffers.push(value.offerId);
			}
		});
		
		mldDataObject.fencedOffers = mldDataObject.offers.filter(function(element, index, array){
			return $.inArray(element.offerId, restrictedOffers) > -1;
		});
		
		mldDataObject.generalOffers = mldDataObject.offers.filter(function(element, index, array){
			return $.inArray(element.offerId, restrictedOffers) == -1;
		});
		
		if(mldDataObject.fencedOffers.length == 0 || DealeronCookie.hasItem(this.GEOFENCE)){
			this.render(false);
		}else{
			this.getLocation();
		}
	},
	
	getLocation: function(){
		if ("geolocation" in navigator) {
		  navigator.geolocation.getCurrentPosition(MobileLeadDriver.gotLocation, MobileLeadDriver.failLocation, { enableHighAccuracy: true});
		  //user may not respond: see https://bugzilla.mozilla.org/show_bug.cgi?id=675533
		  MobileLeadDriver.timeoutId = window.setTimeout(MobileLeadDriver.render, 30000, true);
		} else {
		  this.failLocation();
		}
	},
	
	failLocation: function(){
		//means user said no, geolocation not supported, or it took too long to get a fix
		MobileLeadDriver.render(true);
	},
	
	gotLocation: function(position){		
		var applicableFences = [];
		
		$.each(mldDataObject.fences, function(index, value){
			if(geolib.isPointInCircle({latitude: position.coords.latitude, longitude: position.coords.longitude}, value, value.radius)){
				if(applicableFences.indexOf(value.offerId) == -1){
					applicableFences.push(value.offerId + '-' + value.fenceId + '-' + value.fenceName);
				}
			}
		});
		
		DealeronCookie.setItem(MobileLeadDriver.GEOFENCE, applicableFences.join('|'), null, "/");
		DealeronCookie.setItem(MobileLeadDriver.COORDS, position.coords.latitude + '|' + position.coords.longitude, null, "/");
		MobileLeadDriver.render(true);
	},
	
	render: function(animate){
		window.clearTimeout(MobileLeadDriver.timeoutId);
		
		if(MobileLeadDriver.rendered){
			return;
		}
		MobileLeadDriver.rendered = true;
		
		var cookieValue = DealeronCookie.getItem(MobileLeadDriver.GEOFENCE);
		var applicableFences = cookieValue == null ? [] : cookieValue.split("|");
		var offerToRender = null;
		var fenceId = null;
		
		if(applicableFences.length > 0){
			//pick first geofence for now
			var matchingOffer = mldDataObject.fencedOffers.filter(function(element, index, array){
				return element.offerId == applicableFences[0].split('-')[0];
			});
			
			offerToRender = matchingOffer[0];
			fenceId = applicableFences[0].split('-')[1];
			this.fenceName = applicableFences[0].split('-')[2] || "No Fence Name";
		}else if(mldDataObject.generalOffers.length > 0){
			offerToRender = mldDataObject.generalOffers[0];
			this.fenceName = "None";
		}
		
		if(offerToRender != null){		
			this.dropdownTitle = offerToRender.dropdownTitle || "No Title";
			var barContents = '';
			
			switch(offerToRender.driverType){
				case MobileLeadDriver.DriverType.IMAGE:
						barContents = '<div href="#offerDropdown" data-toggle="collapse" id="offerBar" class="row"></div>';
						
						//add style tag
						var imageURL = mldDataObject.imageRoot + offerToRender.image;
						var styleContents = "#offerBar {\
												background-image: url('" + imageURL +"');\
												min-height: 100px;\
												cursor: pointer;\
											}";
							styleContents += " @media (min-width: 992px) and (max-width: 1199px) {\
												  #offerBar {\
													  background: url('"+ imageURL +"')no-repeat 0px -100px;\
												  }\
											  }";
						styleContents += "@media (min-width: 768px) and (max-width: 991px) {\
											#offerBar {\
												background: url('"+ imageURL +"')no-repeat 0px -200px;\
											}\
										}\
										@media (max-width: 767px) {\
											#offerBar {\
												background: url('"+ imageURL +"')no-repeat center -300px;\
											}\
										}";
						$("<style>").prop("type", "text/css").html(styleContents).appendTo("head");
					break;
				case MobileLeadDriver.DriverType.TEXT:
						barContents =   '<div id="offerBar" class="row">\
											  <div class="col-sm-12">\
												  <ul class="list-inline vert-middle">\
													   <li class="">\
														   <span id="offerBarTitle" class="h1">'+offerToRender.barTitle+'</span>\
														   <span id="offerBarSubtitle">'+offerToRender.barSubtitle+'</span>\
													   </li>\
													   <li>\
														   <a data-parent="#offerContainer" data-toggle="collapse" class="btn btn-cta btn-lg" href="#offerDropdown">'+offerToRender.barButtonText+'</a>\
													   </li>\
												  </ul>\
											  </div>\
										</div>';
					break;
				default:
						barContents = 'INVALID MOBILE LEAD DRIVER TYPE';
					break;
			}
			$('#offerContainer').prepend(barContents);
			
			//populate dropdown
			$('#mobileLeadDriverOfferId').val(offerToRender.offerId);
			if(fenceId != null){
				$('#mobileLeadDriverFenceId').val(fenceId);
			}
			if(offerToRender.dropdownTitle != null && offerToRender.dropdownTitle.trim() !== ""){
				$('#offerDropdownTitle').text(offerToRender.dropdownTitle);
			}else{
				$('#offerDropdownTitle').hide();
			}
			if(offerToRender.dropdownSubtitle != null && offerToRender.dropdownSubtitle.trim() !== ""){
				$('#offerDropdownSubtitle').text(offerToRender.dropdownSubtitle);
			}else{
				$('#offerDropdownSubtitle').hide();
			}
			if(offerToRender.description != null && offerToRender.description.trim() !== ""){
				$('#offerDescription').html(offerToRender.description);
			}else{
				$('#offerDescription').hide();
			}
			if(offerToRender.formTitle != null && offerToRender.formTitle.trim() !== ""){
				$('#offerFormInstruction').text(offerToRender.formTitle);
			}else{
				$('#offerFormInstruction').text('Fill out the form below to receive this special offer.');
			}
			if(offerToRender.submitButtonText != null && offerToRender.submitButtonText.trim() !== ""){
				$('#mobileLeadDriverSubmit').text(offerToRender.submitButtonText);
			}
			
			//finally show
			if(animate){
				$('#offerContainer').slideDown();
			}else{
				$('#offerContainer').show();
			}

			$('#offerContainer').on('show.bs.collapse', function() {
			  DealerOnTrack.event('Mobile Lead Driver', 'Open - ' + MobileLeadDriver.fenceName + ' (fence)', MobileLeadDriver.dropdownTitle);
		    });
		}
	},
	
	log: function(message){
		try{
			console.log("MobileLeadDriver: "+message);
		} catch(e){}
	}
}
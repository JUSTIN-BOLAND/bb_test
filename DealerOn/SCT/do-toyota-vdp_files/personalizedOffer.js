var poActivePageIndex = 1;
var poOfferNumber = '';
var poComment = '';

function poInit() {
  var myFormSubmitOptions = {
    leadSource: $.browser.mobile ? 273 : 272,
    leadType: 1,
    additionalData: contactData,
    successCallback: function(data) {
      var response = JSON.parse(data);
      var eventValue;
      DealerOnTrack.event('Lead',
        response.leadId,
        response.leadSource,
        eventValue,
        function(leadId) {
          $('#po-print-btn').attr('href', $('#po-print-btn').attr('href') + poOfferNumber);
          poComment += 'Offer Number: ' + poOfferNumber + ','
          $('.po-number').text(poOfferNumber);
          $('#po-close-btn').text('close');
          $('#po-next-btn').hide();
          $('#po-print-btn').show();
          poAdvancePage();
        });
    },
    errorCallback: function (request, status, error) {
      alert("There was a problem creating your offer. Please try again.");
    }
  };
  DealeronLead.addSubmissionMethod('contactFormSubmit', myFormSubmitOptions);
  DealeronLead.initialize("#po-contact-form", 'contactFormSubmit');
  $('#po-fname-input').on('focusout', DealeronLead.begin);
}

function contactData(form) {
  poOfferNumber = Math.random().toString(36).substring(2, 8).toUpperCase();
  poComment = 'Offer Number: ' + poOfferNumber;
  return { 
    VehicleYear: vehicleYear,
    VehicleMake: vehicleMake,
    VehicleModel: vehicleModel,
    VehicleTrim: vehicleTrim,
    StockNum: vehicleStock,
    VIN: vehicleVin,
    Comments: poComment
  }
}
function poAdvancePage() {
	poActivePageIndex++;
	$('.po-page').removeClass('po-page-active');
	$('#po-page-' + poActivePageIndex).addClass('po-page-active');
}



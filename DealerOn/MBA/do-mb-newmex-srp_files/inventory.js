// IE 8
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

if (!String.prototype.includes) {
     String.prototype.includes = function() {
         'use strict';
         return String.prototype.indexOf.apply(this, arguments) !== -1;
     };
 }

jQuery(document).ready(function() {
  jQuery('[data-toggle=offcanvas]').click(function() {
      jQuery('.row-offcanvas').toggleClass('active');
      if(jQuery('.row-offcanvas').hasClass('active'))
        jQuery('.contentWrapper .container').css('overflow-x','hidden');
  });

  jQuery('[id|="videoBtn"]').each(function() {
      var src = jQuery(this).attr('show');
      ActivateMagnific(jQuery(this), 'video', src);
  });

  jQuery('[id|="srpVehicleSpecial"] a').each(function() {
      var src = jQuery(this).attr('href');
      src += specialLeadSource;
      jQuery(this).attr('href', src);
      ActivateMagnific(jQuery(this), 'special', src);
  });

  jQuery('body').on('hidden.bs.modal','.page-modal', function () {
    jQuery(this).find('iframe').removeAttr('src');
    jQuery(this).removeData('bs.modal');
  });
  
   var myFormSubmitOptions = {
	  overrideApiSubmission : function(form) { searchByDistance('vehiclelocation', 'distance', 'zipCode'); }
   };
   DealeronLead.addSubmissionMethod('mySubmitOption', myFormSubmitOptions);
   DealeronLead.initialize('#searchbydistance', 'mySubmitOption');
});

// Update search
function refineSearch()
{
  var appliedFilters = function(){
    var keyValues = {};
    jQuery("input:checkbox[id^='refine-search']:checked").each(function(i, e){
      var key = this.name;
      var value = encodeURIComponent(this.value);
      if(key in keyValues){
        keyValues[key].push(value);
      }
      else
      {
        keyValues[key] = [value];
      }
    });
    return keyValues
  }

  // DEV-14659 - Changing location.href will not reload the window if there is a fragment
  // If there is a # then remove that portion of the URL starting at the # (just need to take care of fragments)
  var currentUrl = location.href;
  if (currentUrl.includes("#")) {
      currentUrl = currentUrl.substring(0, currentUrl.indexOf("#"));
  }

  location.href = updateQueryStringParameters(currentUrl, appliedFilters());
}

function updateQueryStringParameters(uri, keyValueDict) 
{
  jQuery.each(keyValueDict, function(key, value){
    uri = updateQueryStringParameter(uri, key, value);
  })
  return (uri);
}

function updateQueryStringParameter(uri, key, value) 
{
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2').replace(/pt=\d+&?/i,"");
  }
  else {
    return (uri + separator + key + "=" + value).replace(/pt=\d+&?/i,"");
  }
}

function toggleBooleanFilter(checkbox) 
{
  var filter = checkbox.getAttribute("for");
  if (checkbox.checked) {
    location.href = location.href.replace(/(pt=\d+&*)/, '').replace(/&$/, '') + ((location.href.indexOf('?') === -1) ? '?' + filter + '=1' : '&' + filter + '=1');
    return;
  }
  var regex = new RegExp("[&\\?]" + filter + "=\\d", "i");
  console.log("source:" + regex.source);
  location.href = location.href.replace(regex,'').replace(/(pt=\d+&*)/, '').replace(/&$/, '');
}


// Text input search (Vin or Stock)
function submitInventorySearch(searchKey, searchElementId)
{
  var vinOrStockElement = jQuery("#" + searchElementId);
  if (vinOrStockElement != undefined)
  {    
    var value = vinOrStockElement.val().trim();
    if (value == '')
    {
      alert('Please enter a Vin or Stock number.');
      vinOrStockElement.focus();
      return false;
    }
    if (!value.match(/^[0-9a-zA-Z\-]+$/))
    {
      alert('Please enter a valid Vin or Stock number.');
      vinOrStockElement.focus();
      return false;
    }
    value = '~' + value;
    var page = baseUrl + "?" + searchKey + "=" + value;
    location.href = page;
  }
}

// Search vehicles by distance
function searchByDistance(searchKey, distanceElementId, zipCodeElementId)
{
  var baseUrlForNewFilter = location.pathname  +(location.search.length > 1 ? location.search + "&" : "?");
  
  var distanceElement = jQuery("#" + distanceElementId);
  var zipCodeElement = jQuery("#" + zipCodeElementId);
  var errorMessage =  jQuery("#errorMessage");
  errorMessage.toggle();
  if (distanceElement != undefined && zipCodeElement != undefined)
  {
    var distance = distanceElement.val().trim();
    if (distance == '')
    {
	    alert("Please select a distance.");
      distanceElement.focus();
      return false;
    }
    //Get only the first five digits if the zip code provided is of format 11111-1111
	var zipCode = zipCodeElement.val().trim().split("-")[0];
    var newDistanceFilter = searchKey + "=" + zipCode + "-" + distance;
    var page = "";
    var startIndexOfDistanceSearchKey = baseUrlForNewFilter.indexOf(searchKey + "=");
    if (startIndexOfDistanceSearchKey == -1)
    {
      page = baseUrlForNewFilter + newDistanceFilter;
    }
    else
    {
      var currentDistanceFilter = baseUrlForNewFilter.substring(startIndexOfDistanceSearchKey, baseUrlForNewFilter.indexOf("&", startIndexOfDistanceSearchKey));
      page = baseUrlForNewFilter.replace(currentDistanceFilter, newDistanceFilter);
    }
    location.href = page;
	
  }
 




}

function ActivateMagnific(that, type, src) {
  if (src === '') {
    return;
  } 
  switch(type) {
    case 'iframe':
      jQuery(that).magnificPopup({
        type:'iframe',
        midClick: true,
        items: {
          src: src
        }
      }); 
      break;
    case 'special':
      jQuery(that).magnificPopup({
        items: {
          type:'iframe',
          src: src
        },
        iframe: {
         markup: '<div class="mfp-iframe-scaler specialMagnific">'+
                          '<div class="mfp-close"></div>'+
                          '<iframe class="mfp-iframe" frameborder="0" allowfullscreen>            </iframe>'+
                      '</div>'
        },
        callbacks: { 
          open: function() {
            ResetTracker();
            trackerHook(specialLinkTrackerEvent,'click'); 
          }
        }
      });
      break;
    case 'video':
      jQuery(that).magnificPopup({
        items: {
          type:'iframe',
          midClick: true,
          src: src
        },
        iframe: {
         markup: '<div class="mfp-iframe-scaler vehicleVidMagnific">'+
                          '<div class="mfp-close"></div>'+
                          '<iframe class="mfp-iframe" frameborder="0" allowfullscreen scrolling="no">            </iframe>'+
                      '</div>'
        },
        mainClass: "vehicleVidMagnificContainer"
      });
  }
}

jQuery('.modal-link').click(function(e) {
    e.preventDefault();
    var modal = jQuery('#rebateModal');
    modal
        .on('show.bs.modal', function () {
      jQuery('iframe#rebateIframe').removeAttr('src');
            jQuery('iframe#rebateIframe').attr("src",e.currentTarget.href);
        })
        .modal();
});





// DEV-4627
jQuery(".commentsExpand").click(function(e) {

  jQuery(e.target).parent().prev().toggleClass("vehicleCommentsCollapsed");
  
    if (jQuery(this).find("i").hasClass("fa-plus")) {
        jQuery(this).find("i").removeClass("fa-plus").addClass("fa-minus");
    } else {
        jQuery(this).find("i").removeClass("fa-minus").addClass("fa-plus");
    }
});



//Responsive SRP Gallery
function srpResponsiveGallery(vin,dealerId) {
  Galleria.loadTheme("//cdn.jsdelivr.net/galleria/1.3.3/themes/classic/galleria.classic.js");
  if (jQuery !== 'undefined') {
     $ = jQuery;
  } 
  else {
     return false;
  }
  var params =  '?vin=' + vin + '&dealerId=' + dealerId;  
  var getUrl = "/api/InventoryWidget/Galleria/" + params;

  var targetedID = '#photoGalleria';
  var parentContainer = '#srpRow-' + vin;
  
  if ($(targetedID).parent().attr('id') != parentContainer.split('#').pop()) {
    $(targetedID).collapse('show');
    $(targetedID).detach().appendTo(parentContainer);
    $.ajax({
      url: getUrl,
      type: "GET",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(response) {
        var data = JSON.parse(response);
        Galleria.run( targetedID, {
          dataSource: data,
          transition: 'slide',
          transitionSpeed: 750,
          autoplay: 2500,
          imageCrop: true,
          maxScaleRatio: 1,
          overlayBackground: '#39561D',
          height: 500
        });
        window.location.hash = parentContainer;
      }
    });
  } 
  else {
    $(targetedID).collapse('toggle');
  }
} 
Galleria.ready(function() {
  this.addElement('exit').appendChild('container','exit');
  var btn = this.$('exit').text('× ').click(function(e) {
    $('#photoGalleria').collapse('toggle');
  });
});

function openWindowSticker(url, make) {
  var makesWithPasswords = ["mitsubishi"];
  var makeApiCall = $.inArray(make.toLowerCase(), makesWithPasswords) > -1;
  screen_width = window.screen.availWidth;
  screen_height = window.screen.availHeight;
  left_point = parseInt(screen_width / 2) - (500);
  var params = "?url=" + encodeURIComponent(url) + "&make=" + make;
  var link = makeApiCall ? "api/inventory/GetStickers/" + params : url;
  brochureWindow = window.open(link, "", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=1,resizable=yes,copyhistory=yes,width=1000,height=1500");
  brochureWindow.moveTo(left_point, 0);
}

jQuery(function($) {
    $('div[rel]').each(function() {
        $(this).click(function() {
            if (openDetailsNew)
                window.open(jQuery(this).attr('rel'));
            else
                location.href = jQuery(this).attr('rel');
        });
    });

    $('div ul[rel]').each(function() {
        $(this).click(function() {
            if (openDetailsNew)
                window.open(jQuery(this).attr('rel'));
            else
                location.href = jQuery(this).attr('rel');
        });
    });

    $('a[data-toggle="popover"]').each(function(){
      var container = $(this).closest('[id^="srpRow"]').attr('id');
        if (jQuery.browser.mobile) {
            $(this).popover({
                html: true,
                trigger: 'click',
                animation: false,
                container: '#' + container,
                placement: 'right'
            });
        } else {
            var _this = this;
            $(this).popover({
                html: true,
                trigger: 'manual',
                animation: false,
                container: '#' + container,
                placement: 'left'
            }).on("mouseenter", function() {
                $(_this).popover("show");
                $('#' + container + ' .popover').on("mouseleave", function() {
                    $(_this).popover('hide');
                });
            }).on("mouseleave", function() {
                setTimeout(function() {
                    if (!$(".popover:hover").length) {
                        $(_this).popover("hide");
                    }
                }, 5);
            });
        }
    });

    $('body').on("shown.bs.popover", function() {
        $('.modal-link').click(function(e) {
            e.preventDefault();
            var modal = jQuery('#rebateModal');
            modal
                .on('show.bs.modal', function() {
                    jQuery('iframe#rebateIframe').removeAttr('src');
                    jQuery('iframe#rebateIframe').attr("src", e.currentTarget.href);
                })
                .modal();
        });
    });
});

$("#closeSRP_refine").on('click touch', function() {
    $('.row-offcanvas-left').removeClass('active');
    jQuery('.contentWrapper .container').css('overflow-x','visible');
});

function ResetTracker() {
  eventFired = 0;
}
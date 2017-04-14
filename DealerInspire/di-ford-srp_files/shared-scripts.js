jQuery(document).ready(function($) {         
 
  jQuery(function() {
	  var models = jQuery(".homepage-advanced-search-models").owlCarousel({
      autoPlay: 7000,
      navigation: false,
      navigationText: [
	      "",""
      ],      
      items: 6,
      itemsDesktop: [1399, 5],
      itemsDesktopSmall: [1024, 4],
      itemsTablet: [767, 3],
      itemsMobile: [360, 2]
    });
    
	  $(".next").click(function(){
	    models.trigger('owl.next');
	  })
	  $(".prev").click(function(){
	    models.trigger('owl.prev');
	  })    

  });
  
  $('.slide-swiper .jumboSlide').matchHeight({
    byRow: false,
		property: 'height',
  });
  
  $('.contact-us-lightbox-trigger').fancybox({
	  wrapCSS: 'contact-us-fancybox',
  });

  $('.search-lightbox-trigger').fancybox({
	  wrapCSS: 'search-fancybox',
  });
  
	$(function(){
	  $('a.scroll').click(function(){
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname){
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        },1000);
	        return false;
	      }
	    }
	  });
	});
	
	$("#menu-toggle .menu-toggle-button").click(function(){
		$("#menu-toggle").toggleClass('active');
		$("#search-toggle").removeClass('active');
	});
	$("#search-toggle .search-toggle-button").click(function(){
		$("#search-toggle").toggleClass('active');
		$("#menu-toggle").removeClass('active');
	});
	
    //Fix for VRP pagination
    vrp_vehicles_container_selector = function(default_selector){
        if(DealerInspireBrowserDetection.isMobile.phone() === true)
            return "#results-page .listings-column";

        return '#results-page .results_table';
    }

    jQuery("body").on("vrp-ready vrp-ajax-complete",function(){
        jQuery(".load-more-results").remove();
        jQuery("#results-page .listings-column").parent().after('<div class="load-more-results"></div>');
    });

    jQuery("body").on("vrp-ajax-pre-render-results",function(){
        if(DealerInspireBrowserDetection.isMobile.phone() === false)
        {
            jQuery(".listings-column").find('.vehicle,.vehicle-xs').remove();
        }
    });


    //Fix for VRP CTA buttons
    jQuery("body").on("click",".results-action a",function(){
        var data = jQuery(this).data();

        if(data.form)
        {
            for(var key in DealerInspireInventory.options.gf_forms[data.form])
            {
                if (key in data.vehicle)
                    jQuery('.modal-content #input_' + data.form + '_' + DealerInspireInventory.options.gf_forms[data.form][key]).val(data.vehicle[key]);
            }
        }

    });


	if ($('#results-page').length > 0) {
		$('body').on('vrp-ready vrp-ajax-complete', function (e) {
			$('.vehicle.new-vehicle').each(function () {
				var container = $(this).find('.price-disclaimer');
				modifyDisclaimerText(container);
			});
		});
	}

	if ($('.page-vehicle-display-page .new-vehicle').length > 0) {
		var collection = $('.price-disclaimer');

		$(collection).each(function (index, elem) {
			modifyDisclaimerText(elem);
		});
	}

	function modifyDisclaimerText (container) {
		var disclaimerContent = $(container).attr('data-content');

		if (disclaimerContent) {
			var matchIndex = disclaimerContent.indexOf("Price includes all applicable rebates");
			
			if (matchIndex >= 0) {
				var newDisclaimer = disclaimerContent.slice(matchIndex);
			} else {
				var newDisclaimer = "Prices do not include government fees and taxes, any finance charges, any dealer document processing charge, any electronic filing charge, and any emission testing charge.";
			}
			$(container).attr('data-content', newDisclaimer);
			
		}
		
	}

	// $("#mobile-search").click(function(){
	// 	$('.mobile-tab-content.open').removeClass('open');
	// 	$('body').css('overflow', 'hidden');
	// 	$('.mobile-tab.search .mobile-tab-content').addClass('open');
	// });
	// 
	// $("#mobile-contact").click(function(){
	// 	$('.mobile-tab-content.open').removeClass('open');
	// 	$('body').css('overflow', 'hidden');
	// 	$('.mobile-tab.search .mobile-tab-content').addClass('open');
	// });
	
  $("#email-input").click(function(){
		$('#emailmodal').modal('show');
	  var email = jQuery('#email-value').val();
		jQuery('#input_17_3').val(email);
  });
		  
});
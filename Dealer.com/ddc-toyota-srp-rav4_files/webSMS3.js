var thisPageUsingOtherJSLibrary;

// Only do anything if jQuery isn't defined
if (typeof jQuery == 'undefined') {

	if (typeof $ == 'function') {
		// warning, global var
		thisPageUsingOtherJSLibrary = true;
	}
	
	function getScript(url, success) {
	
		var script     = document.createElement('script');
		     script.src = url;
		
		var head = document.getElementsByTagName('head')[0],
		done = false;
		
		// Attach handlers for all browsers
		script.onload = script.onreadystatechange = function() {
		
			if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
			
			done = true;
				
				// callback function provided as param
				success();
				
				script.onload = script.onreadystatechange = null;
				head.removeChild(script);
				
			};
		
		};
		
		head.appendChild(script);
	
	};
	
	getScript('https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js', function() {
	
		if (typeof jQuery=='undefined') {
		
			// Super failsafe - still somehow failed...
		
		} else {
		
			// jQuery loaded! Make sure to use .noConflict just in case
				
			
			if (thisPageUsingOtherJSLibrary) {

				var $j = jQuery.noConflict();
				// $j is now an alias to the jQuery function; creating the new alias is optional.
				
				// script that uses Jquery no conflict mode. To prevent the $ sign from clashing with other JS in their site, this will make turn the $ sign  to another variable, $j.
				
				
				// $j(document).ready(function() {
					console.log('st');
				   $j(document).on('click','.webSMS-header-step-1', function(){
				   		$j('.webSMS-container').toggleClass('webSMS-container-step-2');
				   		$j('.webSMS-main').toggleClass('webSMS-main-invisible');
						$j('.webSMS-header').toggleClass('webSMS-header-step-2');
						$j('.webSMS-header').toggleClass('webSMS-header-step-1');
						$j('.webSMS-header-close').show();
						console.log('click');
				   });
				   $j(document).on('click','.webSMS-header-step-2', function(){
				   		$j('.webSMS-main').toggleClass('webSMS-main-invisible');
				   		$j('.webSMS-container').toggleClass('webSMS-container-step-2');
				   		$j('.webSMS-header').toggleClass('webSMS-header-step-2');
						$j('.webSMS-header').toggleClass('webSMS-header-step-1');
						$j('.webSMS-header-close').hide();
				   });
				   $j(document).on('click','.webSMS-choose-btn', function(){
				   		$j('.webSMS-main-choose').hide();
				   		$j('.webSMS-main-text').fadeIn();
				   });
				   $j(document).on('keyup','.webSMS-input', function(){
						
							if ($j('.webSMS-input-number').val().match(/[0-9]/g) && $j('.webSMS-input-number').val().match(/[0-9]/g).length >= 10) {
							    $j('.webSMS-input-number').addClass('webSMS-valid');
							} else {
							    $j('.webSMS-input-number').removeClass('webSMS-valid');
							}
							
							var message = $j('.webSMS-input-message').val();
				  				 if ( message.length > 0){
				  				 	 $j('.webSMS-input-message').addClass('webSMS-valid');
				  				 }
								else{
									$j('.webSMS-input-message').removeClass('webSMS-valid');
							};
				
							if ( $j('.webSMS-input').length == $j('.webSMS-valid').length ){
								$j('.webSMS-input-submit').addClass('webSMS-input-submit-valid');
								$j('.webSMS-input-submit').prop('disabled', false);
							} else {
								$j('.webSMS-input-submit').removeClass('webSMS-input-submit-valid');
								$j('.webSMS-input-submit').prop('disabled', true);
							}
				   });
				   $j(document).on('click','.webSMS-input-submit-valid', function(){
				   		$j('.webSMS-main-text').hide();
				   		$j('.webSMS-main-thanks').fadeIn();
				   	});
				// });


			} else {

				
				// $(document).ready(function() {
					console.log('st');
				   $(document).on('click','.webSMS-header-step-1', function(){
				   		$('.webSMS-container').toggleClass('webSMS-container-step-2');
				   		$('.webSMS-main').toggleClass('webSMS-main-invisible');
						$('.webSMS-header').toggleClass('webSMS-header-step-2');
						$('.webSMS-header').toggleClass('webSMS-header-step-1');
						$('.webSMS-header-close').show();
						console.log('click');
				   });
				   $(document).on('click','.webSMS-header-step-2', function(){
				   		$('.webSMS-main').toggleClass('webSMS-main-invisible');
				   		$('.webSMS-container').toggleClass('webSMS-container-step-2');
				   		$('.webSMS-header').toggleClass('webSMS-header-step-2');
						$('.webSMS-header').toggleClass('webSMS-header-step-1');
						$('.webSMS-header-close').hide();
				   });
				   $(document).on('click','.webSMS-choose-btn', function(){
				   		$('.webSMS-main-choose').hide();
				   		$('.webSMS-main-text').fadeIn();
				   });
				   $(document).on('keyup','.webSMS-input', function(){
						
							if ($('.webSMS-input-number').val().match(/[0-9]/g) && $('.webSMS-input-number').val().match(/[0-9]/g).length >= 10) {
							    $('.webSMS-input-number').addClass('webSMS-valid');
							} else {
							    $('.webSMS-input-number').removeClass('webSMS-valid');
							}
							
							var message = $('.webSMS-input-message').val();
				  				 if ( message.length > 0){
				  				 	 $('.webSMS-input-message').addClass('webSMS-valid');
				  				 }
								else{
									$('.webSMS-input-message').removeClass('webSMS-valid');
							};
				
							if ( $('.webSMS-input').length == $('.webSMS-valid').length ){
								$('.webSMS-input-submit').addClass('webSMS-input-submit-valid');
								$('.webSMS-input-submit').prop('disabled', false);
							} else {
								$('.webSMS-input-submit').removeClass('webSMS-input-submit-valid');
								$('.webSMS-input-submit').prop('disabled', true);
							}
				   });
				   $(document).on('click','.webSMS-input-submit-valid', function(){
				   		$('.webSMS-main-text').hide();
				   		$('.webSMS-main-thanks').fadeIn();
				   	});
				// });


			}
		
		}
	
	});
	
} else { // jQuery was already loaded
	
	// Run your jQuery Code
	 $(document).on('click','.webSMS-header-step-1', function(){
	   		$('.webSMS-container').toggleClass('webSMS-container-step-2');
	   		$('.webSMS-main').toggleClass('webSMS-main-invisible');
			$('.webSMS-header').toggleClass('webSMS-header-step-2');
			$('.webSMS-header').toggleClass('webSMS-header-step-1');
			$('.webSMS-header-close').show();
			console.log('click');
	   });
	   $(document).on('click','.webSMS-header-step-2', function(){
	   		$('.webSMS-main').toggleClass('webSMS-main-invisible');
	   		$('.webSMS-container').toggleClass('webSMS-container-step-2');
	   		$('.webSMS-header').toggleClass('webSMS-header-step-2');
			$('.webSMS-header').toggleClass('webSMS-header-step-1');
			$('.webSMS-header-close').hide();
	   });
	   $(document).on('click','.webSMS-choose-btn', function(){
	   		$('.webSMS-main-choose').hide();
	   		$('.webSMS-main-text').fadeIn();
	   });
	   $(document).on('keyup','.webSMS-input', function(){
			
				if ($('.webSMS-input-number').val().match(/[0-9]/g) && $('.webSMS-input-number').val().match(/[0-9]/g).length >= 10) {
				    $('.webSMS-input-number').addClass('webSMS-valid');
				} else {
				    $('.webSMS-input-number').removeClass('webSMS-valid');
				}
				
				var message = $('.webSMS-input-message').val();
	  				 if ( message.length > 0){
	  				 	 $('.webSMS-input-message').addClass('webSMS-valid');
	  				 }
					else{
						$('.webSMS-input-message').removeClass('webSMS-valid');
				};
	
				if ( $('.webSMS-input').length == $('.webSMS-valid').length ){
					$('.webSMS-input-submit').addClass('webSMS-input-submit-valid');
					$('.webSMS-input-submit').prop('disabled', false);
				} else {
					$('.webSMS-input-submit').removeClass('webSMS-input-submit-valid');
					$('.webSMS-input-submit').prop('disabled', true);
				}
	   });
	   $(document).on('click','.webSMS-input-submit-valid', function(){
	   		$('.webSMS-main-text').hide();
	   		$('.webSMS-main-thanks').fadeIn();
	   	});

};


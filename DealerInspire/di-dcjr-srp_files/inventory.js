/**
* 
 * UWM VIN Integration
 * UnityWorks 2017 
 * no jQuery
 *
 * params:
 *  ctx or ( used_ctx and new_ctx ) 
 *  *	logic string (optional)
 * 	log (optional)
 *
 *	Should work with Async SRP pages
 *
 */

;( function(){

	/**/
	if(typeof window.uwmVinIntegration !== 'undefined'){
		console.log('warning: only one instance of uwm video integration should exist on the page, uwm products will not display properly');
	}
	
	/**
	 * UWM Integration object
	 */
	window.uwmVinIntegration = {
		
		/**
		 * Integration settings object
		 */
		settings : {

			used_ctx: '',
			new_ctx: '',
			ctx: '', 

			script_id: 'uwscript',
			css_id: "unityworks_integration_css",

			css_url: "uwm_integration.css",
			playerRoot: "https://delivery.dealervideos.com/v1/",
			integrationRoot: "https://delivery.dealervideos.com/v1/scripts/integration/",
			logicRoot: "https://delivery.dealervideos.com/v1/scripts/integration/providerlogic/",
			svcRoot: "https://www.dealervideos.com/integration.svc/",

			vid_url: "",
			availability_url: "",

			vin_id_prefix : 'uwm_',
			modal_id: "unityworks_modal",
			modal_overlay_id: "unityworks_modal_overlay",
			modal_container_id: "unityworks_modal_container",
			modal_x_id: "unityworks_modal_x",
			modal_anim_class: "unityworks_anim_in",		
			log: false,
			logic : {},
			elemData : {}

		},

		/**
		 * Integration vins array
		 */
		uwmVins : new Array(),

		/**
		 * Integration interval id
		 */
		interval_id : undefined,

		/**
		 * Modal object to handle pop out
		 */
		modal : {
			/**
		     * Create modal pop up and populate it
		     * 
		     * @param String url
		     *
		     * @return void
		     */
			create : function(url){

				if(document.querySelectorAll("#" + uwmVinIntegration.settings.modal_id).length > 0){
					return false;
				}

				//console.log('uwm_inventory: creating modal',url);

				// create and add dom element
				var overlayDiv = document.createElement("div"); 
				overlayDiv.id = uwmVinIntegration.settings.modal_overlay_id; 
				overlayDiv.style.position = "fixed";
				overlayDiv.style.opacity = "1";
				overlayDiv.style.top = "0";
				overlayDiv.style.left = "0";
				overlayDiv.style.bottom = "0";
				overlayDiv.style.right = "0";
				overlayDiv.style.zIndex = "2147483646";
				overlayDiv.style.height = "100%";
				overlayDiv.style.minHeight = "100%";
				overlayDiv.style.width = "100%";
				overlayDiv.style.minWidth = "100%";
				overlayDiv.style.overflow = "hidden";
				overlayDiv.onclick = uwmVinIntegration.modal.destroy;
				document.body.appendChild(overlayDiv);

				var doc = document.documentElement;
				var modalDiv_top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

				// create and add containerDiv dom element
				var containerDiv = document.createElement("div"); 
				containerDiv.id = uwmVinIntegration.settings.modal_container_id; 
				containerDiv.style.position = "fixed";
				containerDiv.style.opacity = "1";
				containerDiv.style.top = modalDiv_top+"px";
				containerDiv.style.left = "0";
				containerDiv.style.bottom = "0";
				containerDiv.style.right = "0";
				containerDiv.style.zIndex = "2147483647";
				containerDiv.style.height = "100%";
				containerDiv.style.minHeight = "100%";
				containerDiv.style.width = "100%";
				containerDiv.style.minWidth = "100%";
				containerDiv.style.lineHeight = "1.2";
				containerDiv.onclick = uwmVinIntegration.modal.destroy;
				document.body.appendChild(containerDiv);

				// create and add aspecttopDiv dom element
				var aspecttopDiv = document.createElement("div"); 
				aspecttopDiv.id = "modal_video";
				aspecttopDiv.style.width = "100%";
				aspecttopDiv.style.display = "block";
				aspecttopDiv.style.padding = "0 0 0 0";
				aspecttopDiv.style.position = "relative";
				containerDiv.appendChild(aspecttopDiv);

				// create and add modal div dom element
				var modalDiv = document.createElement("div"); 
				modalDiv.id = uwmVinIntegration.settings.modal_id;
				modalDiv.style.position = "relative";
				modalDiv.style.padding = "0 0 0 0";
				modalDiv.style.width = '100%';
				modalDiv.style.maxWidth = '900px';
				containerDiv.appendChild(modalDiv);

				// unityworks_modal_aspect_bg
				var bgDiv = document.createElement("div"); 
				bgDiv.id = 'unityworks_modal_aspect_bg';
				bgDiv.style.position = "relative";
				bgDiv.style.zIndex = -1;
				bgDiv.style.top = "0";
				bgDiv.style.padding = "56.25% 0 0 0";
				bgDiv.style.width = '100%';
				bgDiv.style.backgroundColor = "black";
				

				// close button
				var closeDiv = document.createElement('div');
				closeDiv.id = 'close_uwm';
				closeDiv.style.position = 'absolute';
				closeDiv.style.display = "block";
				closeDiv.style.top = "-22px";
				closeDiv.style.cursor = 'pointer';
				closeDiv.style.right = '-2px';
				closeDiv.innerHTML = '<svg width="20" height="20" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490,1367c0,26.667-9.333,49.333-28,68l-136,136c-18.667,18.667-41.333,28-68,28s-49.333-9.333-68-28l-294-294l-294,294 c-18.667,18.667-41.333,28-68,28s-49.333-9.333-68-28l-136-136c-18.667-18.667-28-41.333-28-68s9.333-49.333,28-68l294-294L330,711 c-18.667-18.667-28-41.333-28-68s9.333-49.333,28-68l136-136c18.667-18.667,41.333-28,68-28s49.333,9.333,68,28l294,294l294-294 c18.667-18.667,41.333-28,68-28s49.333,9.333,68,28l136,136c18.667,18.667,28,41.333,28,68s-9.333,49.333-28,68l-294,294l294,294 C1480.667,1317.667,1490,1340.333,1490,1367z"/><path fill="#EEEEEE" d="M1488,1277c0,26.667-9.333,49.333-28,68l-136,136c-18.667,18.667-41.333,28-68,28s-49.333-9.333-68-28 l-294-294l-294,294c-18.667,18.667-41.333,28-68,28s-49.333-9.333-68-28l-136-136c-18.667-18.667-28-41.333-28-68 s9.333-49.333,28-68l294-294L328,621c-18.667-18.667-28-41.333-28-68s9.333-49.333,28-68l136-136c18.667-18.667,41.333-28,68-28 s49.333,9.333,68,28l294,294l294-294c18.667-18.667,41.333-28,68-28s49.333,9.333,68,28l136,136c18.667,18.667,28,41.333,28,68 s-9.333,49.333-28,68l-294,294l294,294C1478.667,1227.667,1488,1250.333,1488,1277z"/></svg>';
				
				modalDiv.appendChild(closeDiv);
				modalDiv.appendChild(bgDiv);

			var iframe = document.createElement("iframe");
				iframe.style.position = "absolute";
				iframe.style.border = "0";
				iframe.frameBorder = "0";
				iframe.style.top = "0";
				iframe.style.left = "0";
				iframe.style.width = "100%";
				iframe.style.height = "100%";
				iframe.setAttribute('seemless', 'seemless');
				iframe.setAttribute('allowfullscreen', '');
				iframe.src = url;


				modalDiv.appendChild(iframe);
				
				event.stopPropagation();

				window.setTimeout(function(){ 
					uwmVinIntegration.addClass(overlayDiv , uwmVinIntegration.settings.modal_anim_class);
					uwmVinIntegration.addClass(containerDiv , uwmVinIntegration.settings.modal_anim_class); 
				}, 1 );
				
			},

			/**
		     * Destroy the modal pop up
		     * 
		     * @param void
		     *
		     * @return void
		     */
			destroy : function(){
				if(document.querySelectorAll("#" + uwmVinIntegration.settings.modal_overlay_id).length < 0){
					return false;
				}

				if(document.querySelectorAll("#" + uwmVinIntegration.settings.modal_container_id).length < 0){
					return false;
				}

				var overlay = document.getElementById(uwmVinIntegration.settings.modal_overlay_id);
				var container = document.getElementById(uwmVinIntegration.settings.modal_container_id);

				uwmVinIntegration.removeClass(overlay , uwmVinIntegration.settings.modal_anim_class);
				uwmVinIntegration.removeClass(container , uwmVinIntegration.settings.modal_anim_class);

				try{
					container.parentNode.removeChild(container);
				}catch(e){}

				window.setTimeout(function(){ 
					try{
						overlay.parentNode.removeChild(overlay);
					}catch(e){}
				}, 250 ); //duration
			}
		},


		//embed methods
		embed : {
			/**
		    * Create embed iframe and populate it for DDC
		    * 
		    * @param String url, html element
		    *
		    * @return void
		    */
		    create : function(url , element){
		    	
		    	//console.log('uwm_inventory: creating embed',url , element);

		    	var embedcontainer = document.createElement("div"); 
				embedcontainer.style.position = "relative";
				embedcontainer.style.width = "100%";
				embedcontainer.style.minWidth = "100%";
				embedcontainer.style.lineHeight = "1";

				element.appendChild(embedcontainer);

				var aspectDiv = document.createElement("div"); 
				aspectDiv.style.position = "relative";
				aspectDiv.style.zIndex = -1;
				aspectDiv.style.top = "0";
				aspectDiv.style.padding = "56.25% 0 0 0";
				aspectDiv.style.width = '100%';
				aspectDiv.style.backgroundColor = "black";
				embedcontainer.appendChild(aspectDiv); 

				var iframe = document.createElement("iframe");
					iframe.style.position = "absolute";
					iframe.style.border = "0";
					iframe.frameBorder = "0";
					iframe.style.top = "0";
					iframe.style.left = "0";
					iframe.style.width = "100%";
					iframe.style.height = "100%";
					iframe.setAttribute('seemless', 'seemless');
					iframe.setAttribute('allowfullscreen', '');
					iframe.src = url;

				embedcontainer.appendChild(iframe); 

		    },
		    destroy : function(){
		    	//maybe later
		    }

		},
		//embed methods

		/**
	     * Integration initialization function
	     * 
	     * @param void
	     *
	     * @return void
	     */
		integration_init : function(){


			/**/
			//ENVIRONMENT OVERRIDES	
			if ( typeof uwmPlayerRoot !== 'undefined' ) { // override from window if exist
				uwmVinIntegration.settings.playerRoot = uwmPlayerRoot;
				console.log('overwritten playerRoot: ',uwmVinIntegration.settings.playerRoot);
			}

			if ( typeof uwmIntegrationRoot !== 'undefined' ) { // override from window if exist

				uwmVinIntegration.settings.integrationRoot = uwmIntegrationRoot;
				uwmVinIntegration.settings.logicRoot = uwmIntegrationRoot+'providerlogic/';

				console.log('overwritten IntegrationRoot: ',uwmVinIntegration.settings.integrationRoot);
				console.log('overwritten Provider Logic Location: ',uwmVinIntegration.settings.logicRoot);
			}

			if ( typeof uwmSvcRoot !== 'undefined' ) { // override from window if exist
				uwmVinIntegration.settings.svcRoot = uwmSvcRoot;
				console.log('overwritten svcRoot: ',uwmVinIntegration.settings.svcRoot);
			}
			/**/

			uwmVinIntegration.settings.vid_url = uwmVinIntegration.settings.playerRoot+'video?ctx='; //What URL is used in Iframe
			uwmVinIntegration.settings.availability_url = uwmVinIntegration.settings.svcRoot+'availability?ctx='; //svc url

			//retrieve ctx and other params from script tag
			var tscript = document.getElementById(uwmVinIntegration.settings.script_id);
			var parsed_src = uwmVinIntegration.parseQuery(tscript.src.split(/[?#]/)[1]);
			var parentUrl = uwmVinIntegration.parseQuery(window.location.href.split(/[?#]/)[1]);

			if(typeof parentUrl['log'] != 'undefined'){ // log stuff for debugging
				uwmVinIntegration.settings.log = true;
			}

			//handle behavior of single multiple ctx
			if ( typeof parsed_src['ctx'] != 'undefined' ) { // ctx found

					uwmVinIntegration.settings.ctx = parsed_src['ctx'];

				} else { 
					
					if(typeof parsed_src['new_ctx'] != 'undefined'){ // new ctx found
						uwmVinIntegration.settings.new_ctx = parsed_src['new_ctx'];
					}
					if(typeof parsed_src['used_ctx'] != 'undefined'){ // used ctx found
						uwmVinIntegration.settings.used_ctx = parsed_src['used_ctx'];
					}

				}

				if( uwmVinIntegration.settings.ctx === ''){//ctx blank
				
					if( uwmVinIntegration.settings.new_ctx === '' &&  uwmVinIntegration.settings.used_ctx !== ''){
							
						uwmVinIntegration.settings.ctx =  uwmVinIntegration.settings.used_ctx; //only use used ctx
						//
					}else if( uwmVinIntegration.settings.new_ctx !== '' &&  uwmVinIntegration.settings.used_ctx === ''){
						
						uwmVinIntegration.settings.ctx =  uwmVinIntegration.settings.new_ctx; //only use new ctx
						//
					}else if( uwmVinIntegration.settings.new_ctx !== '' &&  uwmVinIntegration.settings.used_ctx !== ''){
						uwmVinIntegration.settings.multipleCtxTypes = true; // use both used_ctx and new_ctx
						console.log('uwm combined integration');	
					} 

				}

				if( uwmVinIntegration.settings.ctx !== ''){
					console.log('uwm single integration');
				}		
				//handle behavior of single multiple ctx

				//Ready To Load Provider Logic
				uwmVinIntegration.load_provider_logic( ((''+parsed_src['logic']).toLowerCase()).trim() );
				//Ready To Load Provider Logic

		},


		/*
		* LOAD PROVIDER CUSTOM LOGIC
		/**/
		load_provider_logic : function(providerstring){
					
			// logic = website provider specific integration behavior //
			var url = '';

			console.log('uwm_inventory: providerstring = ' , providerstring);
			
			switch(providerstring){

		  			case 'cobalt_srp': //COBALT SEARCH RESULT PAGE PROVIDER LOGIC

		  				/* Cobalt Standard SRP*/
		  				/* The First Version of Cobalt CDK sites have hidden input fields*/
		  				url = uwmVinIntegration.settings.logicRoot+'cobalt_srp.js';	

		  				/* Cobalt CDK NextGen SRP */
		  				/* Cobalt CDK NextGen Probably Do not have Cobalt.Core */
		  				 if(typeof(Cobalt) !== "undefined"){
		  					if(typeof(Cobalt.Core) === "undefined"){
		  						url = uwmVinIntegration.settings.logicRoot+'cobalt_srp_nextgen.js';
		  					}
		  				}
		  			
 
		  			break;
		  			case 'cobalt':
		  			case 'cobalt_vdp': //COBALT VEHICLE DETAIL PAGE PROVIDER LOGIC

		  				/* Cobalt Standard VDP*/
		  				/* The First Version of Cobalt CDK sites have hidden input fields*/
		  				url = uwmVinIntegration.settings.logicRoot+'cobalt_vdp.js';	

		  				/* Cobalt CDK NextGen VDP*/
		  				/* Cobalt CDK NextGen Probably Do not have Cobalt.Core */
		  				if(typeof(Cobalt) !== "undefined"){
		  					if(typeof(Cobalt.Core) === "undefined"){
		  						url = uwmVinIntegration.settings.logicRoot+'cobalt_vdp_nextgen.js';
		  					}
		  				}
		  		
	
		  			break;

			}
			
			console.log('uwm_inventory: loading provider' , providerstring);

			if(url !== ''){
				/*Write Custom Provider JS*/
				uwmVinIntegration.getScript(url,function(){ 

					if(typeof uwmcustomproviderlogic !== 'undefined'){
						if( 
							uwmcustomproviderlogic.hasOwnProperty('elems_collection_fn') &&
							uwmcustomproviderlogic.hasOwnProperty('vins_collection_fn') &&
							uwmcustomproviderlogic.hasOwnProperty('new_pattern_fn') &&
							uwmcustomproviderlogic.hasOwnProperty('used_pattern_fn') &&
							uwmcustomproviderlogic.hasOwnProperty('element_activation_fn') &&
							uwmcustomproviderlogic.hasOwnProperty('element_deactivation_fn')
						){

							//console.log('uwm provider : ',providerstring);
							uwmVinIntegration.settings.logic = {};
							uwmVinIntegration.extend( uwmVinIntegration.settings.logic, uwmcustomproviderlogic ); //USE CUSTOM LOADED LOGIC AND CONTINUE

							uwmcustomproviderlogic = {};
							uwmVinIntegration.provider_logic_ready();//GO

							return false;
						}
					}

					uwmVinIntegration.settings.logic = uwmVinIntegration.default_logic;//USE DEFAULT LOGIC AND CONTINUE
					uwmVinIntegration.provider_logic_ready();//GO

					return false;	

				});
				/*Write Custom Provider JS*/
			}else{
				console.log('uwm using default_logic');
				uwmVinIntegration.settings.logic = uwmVinIntegration.default_logic;//USE DEFAULT LOGIC AND CONTINUE
				uwmVinIntegration.provider_logic_ready();//GO
			}

			return false;	

		},

		 /*
		 * PROVIDER CUSTOM LOGIC LOADED
		 /**/
		 provider_logic_ready : function(){



				// add css sheet
				uwmVinIntegration.css_setup();
				// add css sheet

				/////////////////////////////////////////////////////////////////////////////

			
				// collect vin elements using website provider logic

				/* INITIAL VIN OBJ PROCESS*/
				uwmVinIntegration.settings.elemData = uwmVinIntegration.collect_uwm_vin_elements(uwmVinIntegration.settings.logic); 
				uwmVinIntegration.handle_vin_avail_checks(uwmVinIntegration.settings.elemData);
				/* INITIAL VIN OBJ PROCESS*/

				try{
					window.clearInterval(uwmVinIntegration.interval_id);
				}catch(e){}


				if(true){ //* INTERVAL TO PERIODICALLY REPROCESS VINS *//

					uwmVinIntegration.interval_id = window.setInterval(function(){ 

						var newelemData = uwmVinIntegration.collect_uwm_vin_elements(uwmVinIntegration.settings.logic); //collect
						var oldLength = uwmVinIntegration.settings.elemData.length;
						var newLength = newelemData.length;


						//spot check changes in vin elements, might be good enough
						//in case of re-order or new set - sometimes event listeners will persist, sometimes not.
						//safer to strip and reprocess on re-order

						var newfirst = '';
						if(typeof  newelemData[0] !== 'undefined' ){
							if(newelemData[0].hasOwnProperty('elem')){
								newfirst = newelemData[0].elem;
							}
						}

						var oldfirst = '';
						if(typeof uwmVinIntegration.settings.elemData[0] !== 'undefined'){
							if(	uwmVinIntegration.settings.elemData[0].hasOwnProperty('elem') ){
								oldfirst = uwmVinIntegration.settings.elemData[0].elem;
							}
						}

						var newmid = '';
						if(typeof  newelemData[ Math.floor(newelemData.length / 2) ] !== 'undefined' ){
							if(	newelemData[ Math.floor(newelemData.length / 2) ].hasOwnProperty('elem') ){
								newmid = newelemData[ Math.floor(newelemData.length / 2) ].elem;
							}
						}

						var oldmid = '';
						if(typeof  uwmVinIntegration.settings.elemData[ Math.floor(uwmVinIntegration.settings.elemData.length /2) ] !== 'undefined' ){
							if(	uwmVinIntegration.settings.elemData[ Math.floor(uwmVinIntegration.settings.elemData.length /2) ].hasOwnProperty('elem') ){
								oldmid = uwmVinIntegration.settings.elemData[ Math.floor(uwmVinIntegration.settings.elemData.length /2) ].elem;
							}
						}

						var newlast	= '';
						if(typeof   newelemData[ newelemData.length ] !== 'undefined' ){
							if(	 newelemData[ newelemData.length ].hasOwnProperty('elem') ){
								 newlast	= newelemData[ newelemData.length ].elem;
							}
						}

						var oldlast = '';
						if(typeof uwmVinIntegration.settings.elemData[ uwmVinIntegration.settings.elemData.length ] !== 'undefined' ){
							if(	uwmVinIntegration.settings.elemData[ uwmVinIntegration.settings.elemData.length ].hasOwnProperty('elem') ){
								oldlast = uwmVinIntegration.settings.elemData[ uwmVinIntegration.settings.elemData.length ].elem;
							}
						}

						//console.log( '(',oldLength,' != ',newLength,' ) ||  ',newfirst,' != ',oldfirst,' || 	',newmid,' != ',oldmid,' || ',newlast,' != ',oldlast,' ' );
						//console.log( (oldLength != newLength ) ||  newfirst != oldfirst || 	newmid != oldmid || 	newlast != oldlast );

						/**/
						if( ( oldLength != newLength ) ||  newfirst != oldfirst || 	newmid != oldmid || 	newlast != oldlast  ){

								console.log('uwm_inventory: reprocessing vin objects');
								uwmVinIntegration.settings.elemData = newelemData;
								uwmVinIntegration.handle_vin_avail_checks(newelemData);
						}
						/**/

					}  , 1000); 
					//* INTERVAL TO PERIODICALLY REPROCESS VINS *//

				}
				/////////////////////////////////////////

		},
 		/*
		 * PROVIDER CUSTOM LOGIC LOADED
		 /**/



 		/*
		 * USE LOADED LOGIC TO COLLECT VIN ELEMENTS
		 /**/
		collect_uwm_vin_elements : function(logic){
			/* uwmVinIntegration.settings.logic */
			var vinsdata = [];

			var elems = logic.elems_collection_fn(); //matched elems
			var vinsdata = logic.vins_collection_fn(elems); //vins_collection

			return vinsdata;
		},



 		/*
		 * SEPARATE VINS BETWEEN NEW AND USED BEFORE PASSING TO SERVICE
		 /**/
		separate_vins_for_service : function( data ){

			var results = { vins:[], usedvins:[], newvins:[] };
			var vins = [];
			var usedvins = [];
			var newvins =  [];


			for (var e = 0; e < data.length; e++) {
				
				if(uwmVinIntegration.settings.multipleCtxTypes === true ){

					if( data[e].isnew === true && data[e].isused === false ){
						newvins.push(data[e]);
					}
					else if( data[e].isnew === false && data[e].isused === true){
						usedvins.push(data[e]);
					}else{
						console.log('uwm warning : vin element not identified as new or used... assuming used');
						usedvins.push(data[e]);
					}

				}else{
					vins.push(data[e]);
				}

			};//for data.length

			if(!vins.length){
				//console.log('no vins');
			}else{
				results.vins = vins;
			}

			if(!newvins.length){
				//console.log('no new vins');
			}else{
				results.newvins =  newvins;
			}

			if(!usedvins.length){
				//console.log('no used vins');
			}else{
				results.usedvins = usedvins;
			}

			return results;
		},


		handle_vin_avail_checks : function(elemData){

			console.log('handle_vin_avail_checks',elemData);

			//separate vins into generic or new/used
			for (var i = 0; i < elemData.length; i++) {
				elemData[i].isnew = uwmVinIntegration.settings.logic.new_pattern_fn(elemData[i].elem, elemData[i].vin);
				elemData[i].isused = uwmVinIntegration.settings.logic.used_pattern_fn(elemData[i].elem, elemData[i].vin);
			};

			var vinData = uwmVinIntegration.separate_vins_for_service( elemData );

				if( vinData.vins.length && uwmVinIntegration.settings.ctx != '' ){

					uwmVinIntegration.check_vin_availability( uwmVinIntegration.settings.ctx , vinData.vins ,'single ctx' ); //check generic vins using generic ctx

				}else{

					if( vinData.newvins.length && uwmVinIntegration.settings.new_ctx != '' ){

						uwmVinIntegration.check_vin_availability( uwmVinIntegration.settings.new_ctx , vinData.newvins ,'new ctx'); //check new vins with new ctx

					}
					if( vinData.usedvins.length && uwmVinIntegration.settings.used_ctx != '' ){

						uwmVinIntegration.check_vin_availability(uwmVinIntegration.settings.used_ctx, vinData.usedvins ,'used ctx'); //check used vins with used ctx

					}

				}
			//

			

		},


		check_vin_availability : function( ctx, vinData, astring){

			if(!vinData.length){
				return false;
			}

			var avurl = uwmVinIntegration.settings.availability_url+ctx + '&vin=' + vinData[0].vin;

			for (var i = 1; i < vinData.length; i++) {
				avurl += ','+vinData[i].vin;
			};

			//console.log('avurl:',avurl);



			uwmVinIntegration.ajax({ 
				'url': avurl,
				'callback' : function(results){ 

					//console.log('availability_check_completed', results );
					// assumes that vinData will return in the same order as results - seems to be the case
					for (var i = 0; i < results.length; i++) {

						if( results[i].available === true ){

							if( results[i].vin !== vinData[i].vin ){ console.log(' error : availablity svc return malformed or out of sync '); continue; }

							try{ //ENABLE USING logic.element_activation_fn
								uwmVinIntegration.settings.logic.element_activation_fn( vinData[i].elem , results[i] );
							}catch(e){ console.log(e); }

						}else{
							try{ //DISABLE USING logic.element_deactivation_fn
								uwmVinIntegration.settings.logic.element_deactivation_fn( vinData[i].elem , results[i] );
							}catch(e){ console.log(e); }
						}

					}

				 },
				'error': function(e){ try{ console.error('ajax error: ',e); }catch(ex){} },
				'method': 'GET'
			});

		},





		/**/
		//DEFAULT SET OF PROVIDER LOGIC FUNCTIONS
		/**/
		//default_logic
		default_logic : {

				//elems_collection_fn
				elems_collection_fn: function(){
					var elems = document.querySelectorAll('[id^="uwm_"]');//old way
					return elems;
				}, 

				// collect vins from page elements and add to object
				vins_collection_fn: function(elems){
					var elemsandvins = []; //[{'elem':{}, 'vin':'XXX'}]

					if(elems.length > 0){
						for (var i = 0; i < elems.length ; i++) {
							var v = '';
							elemsandvins.push({});
							elemsandvins[i].vin  = elems[i].id.split('_')[1];
							elemsandvins[i].elem = elems[i];
						}
					}
					return elemsandvins;
				},

				// make a guess of new / used status of car and add to object
				new_pattern_fn: function(elem, vin){ 
				/*Return True if element has new in its class name */
					
					var result = false;

					if(typeof elem != 'undefined'){

						var classstring = (elem.className+'').toLowerCase().trim();
						if( classstring.indexOf('new') !== -1 ){
							result = true;
						}

					}
					return result;
				},

				used_pattern_fn: function(elem, vin){ 
				/*Return True if element has used or "pre-owned" certified in its class name */

					var result = false;

					if(typeof elem != 'undefined'){

						var classstring = (elem.className+'').toLowerCase().trim();

						if( classstring.indexOf('used') !== -1
							|| classstring.indexOf('pre-owned') !== -1
							|| classstring.indexOf('pre owned') !== -1
							|| classstring.indexOf('pre_owned') !== -1
							|| classstring.indexOf('certified') !== -1
						   ){

							result = true;

						}

					}
					return result;
				},

				//attach video modal window function 
				element_activation_fn: function(elem,data){

							try{//just in case

								if(elem.getAttribute('title') === "embed"){
									uwmVinIntegration.embed_video(elem,data);
									return false; 
								}

							}catch(e){ 
								console.log(e);
							}

							uwmVinIntegration.activate_modal_button(elem,data);

				},
				//remove video modal window function 
				element_deactivation_fn: function(elem,data){

					uwmVinIntegration.deactivate_modal_button(elem,data);

				}

		},//default_logic


		activate_modal_button: function(elem,data){

						if((typeof data.ctx != undefined) &&  (typeof data.contentId != undefined)){

							var url = uwmVinIntegration.settings.vid_url+data.ctx+'&cid='+data.contentId;

							uwmVinIntegration.removeEventListener( elem,'click', function(){  uwmVinIntegration.modal.create(url);} );
							uwmVinIntegration.addClass(elem,'uwm-enabled');		

							//if Element has Inner HTML add uwm-has-contents class, preventing default background image behavior
							var button_contents = (elem.innerHTML+'').trim();
								button_contents = button_contents.replace('&nbsp;', '');


							if( button_contents !== '' ){
								uwmVinIntegration.addClass(elem,'uwm-has-contents');		
							}

							//add Click Event to open Modal

							uwmVinIntegration.addEventListener( elem,'click', function(){  uwmVinIntegration.modal.create(url); } );

						}else{
								uwmVinIntegration.addClass(elem,'uwm-disabled');
								elem.style.display = 'none';
						}

		}, 

		deactivate_modal_button: function(elem,data){

						uwmVinIntegration.addClass(elem,'uwm-disabled');
						elem.style.display = 'none';
			
		},

		embed_video: function(elem,data){

					console.log('embed_video',elem, data);

					if((typeof data.ctx != undefined) &&  (typeof data.contentId != undefined)){

							var url = uwmVinIntegration.settings.vid_url+data.ctx+'&cid='+data.contentId;

							//if Element has Inner HTML, do not embed
							if( (elem.innerHTML+'').trim() !== '' ){
								console.log('uwm : tried to embed in non empty element',elem);	
							}else{
								uwmVinIntegration.embed.create(url,elem);	
							}

					}else{

					}
		},


		/**
	     * Setup CSS for integration to use
	     * 
	     * @param void
	     *
	     * @return void
	     */
		css_setup : function(){
			if(document.querySelectorAll("#" + uwmVinIntegration.settings.css_id).length > 0){
				return false;
			}

			// create and add css stylesheet to the DOM
			var newCSS = document.createElement("link"); 
			newCSS.href = uwmVinIntegration.settings.integrationRoot + uwmVinIntegration.settings.css_url; 
			newCSS.id = uwmVinIntegration.settings.css_id; 
			newCSS.rel = 'stylesheet'; 
			newCSS.media = 'all';
			/**/
			try{
				document.body.appendChild(newCSS);
			}catch(e){
				try{ document.head.appendChild(newCSS); }catch(e){
					console.log('uwm css embed failure!');
				}	
			}/**/

		},


		/*UWM UTILS*/

		/**
	     * Add class to element
	     * 
	     * @param Object el
	     * @param String className
	     *
	     * @return void
	     */
		addClass : function(el,className){
			try{
				if(typeof el !== undefined && typeof el.classList !== undefined && typeof className !== undefined){
					if (el.classList){
					 	el.classList.add(className);
					}else{
						el.className += ' ' + className;	
					}
				}
			}catch(e){}
		},

		/**
	     * Remove class from element
	     * 
	     * @param Object el
	     * @param String className
	     *
	     * @return void
	     */
		removeClass : function(el,className){
			try{
				if(typeof el !== undefined && typeof el.classList !== undefined && typeof className !== undefined){
					if (el.classList){
						el.classList.remove(className);
					}else{
						el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
					}
				}
			}catch(e){}
		},

		/**
	     * Ajax call
	     * 
	     * @param Object obj {url,method,callback,error,data}
	     *
	     * @return void
	     */
		ajax : function(obj){
		    var isIE8 = window.XDomainRequest ? true : false;
		    var url = obj.url;
		    var method = obj.method;
			var callback = obj.callback;
			var error = obj.error;
			var data = obj.data;

			if(method === "POST"){ 
				method = "POST";
			}else{
				method = "GET";
			}

			if(typeof obj.url === 'undefined'){ return false; }
			if(typeof obj.error === 'undefined'){ error = function(){}; }
			if(typeof obj.callback === 'undefined'){ callback = function(){}; }

			var request = initRequest();

			function initRequest(url, handler) {
				var request;

				if(method === "GET"){ 
					if (isIE8) {
						request = new window.XDomainRequest();
					} else {
						request = new XMLHttpRequest();
					}
				}else if(method === "POST"){
					request = new XMLHttpRequest();
				}

				return request;
			}

			function openRequest() {
				uwmVinIntegration.settings.log && console.log('openRequest' , url);

				if (request) {
					if(method === "GET"){ 
						if(isIE8) {
							request.onload = output;
							request.open("GET", url, true);
							request.send();
						} else {
							request.open('GET', url, true);
							request.onreadystatechange = handler;
							request.send();
						}
					}else if(method === "POST"){
						 request.open('POST', url, true);
						 request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
						 request.onreadystatechange = handler;
						 request.send(data);
					}
				} else {
					try{
						error(request);
					}catch(e){}
				}

			}

		    function handler(evtXHR) {
				if (request.readyState == 4) {
			        if (request.status >= 200 && request.status < 400) { 
		            	output();
			        } else {
			        	try{
			            	error(request);
			            }catch(e){}
			        }
				}
		    }

		    function output() {
				var response = request.responseText;

	            try{// Success!
	            	var data = JSON.parse(response);
	            	callback(data);
	           	}catch(e){
	           		uwmVinIntegration.settings.log && console.log('error json parse',e,response);
	           	}
		    }

		    openRequest();
		},


		/**
		 * getScript Asynchronously add script tag with callback
		 * fails silently... hmm
		 *
		 * @param String src
		 * @param Function callback
		 * @return void
		 *
		 */
		getScript : function(src, callback, element){

			    var script = document.createElement('script');
			    script.src = src; 
			    script.id = "uwproviderscript";
			    
			    if(callback !== null){
			        if (script.readyState) { // IE, incl. IE9
			            script.onreadystatechange = function(e) {
			                if (script.readyState == "loaded" || script.readyState == "complete") {
			                    script.onreadystatechange = null;
			                    callback(null, e);
			                }
			            };
			        } else {
			            script.onload = function(e) { // Other browsers
			                callback(null, e);
			            };
			        }
			    }

				/**/
				try{
					document.body.appendChild(script);
				}catch(e){
					try{ document.head.appendChild(script); }catch(e){
						console.log('uwm js embed failure!');
					}	
				}/**/
	
		},

		/**
	     * Add an event listener to an element
	     * 
	     * @param Object el
	     * @param String eventName
	     * @param String handler
	     *
	     * @return void
	     */
		addEventListener : function(el, eventName, handler) {

		 	if(typeof el !== 'undefined' && typeof eventName !== 'undefined' && typeof handler !== 'undefined'){
				if (el.addEventListener) {
		    		el.addEventListener(eventName, handler);
				} else {
				    el.attachEvent('on' + eventName, function(){
			      		handler.call(el);
				    });
				}
			}
		},

		/**
	     * Remove an event listener from an element
	     * 
	     * @param Object el
	     * @param String eventName
	     * @param String handler
	     *
	     * @return void
	     */
		removeEventListener : function(el, eventName, handler) {
			if(typeof el !== 'undefined' && typeof eventName !== 'undefined'){
				if (el.removeEventListener){
				    el.removeEventListener(eventName, handler);
				}else{
					try{
						el.detachEvent('on' + eventName, handler);
					}catch(e){}
				}
			}
		},

		/**
	     * Parse a query
	     * 
	     * @param String query
	     *
	     * @return params
	     */
		parseQuery : function(query){
			var params = {};

			if(!query || !query.length) return params;

			var pairs = query.split(/[;&#]/);

			for(var i = 0; i < pairs.length; i++){
				var keyVal = pairs[i].split('=');
				if(!keyVal || keyVal.length != 2) continue;
				var key = unescape(keyVal[0]);
				var val = unescape(keyVal[1]);
				val = val.replace(/\+/g, ' ');
				params[key] = val.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			};

			return params;
		},

		/**
	     * Get uniques
	     * 
	     * @param Array arr
	     *
	     * @return array of uniques
	     */
		getUniques : function(arr) {
		    var a = [];

		    for (var i=0, l=arr.length; i<l; i++){
		        if (a.indexOf(arr[i]) === -1 && arr[i] !== ''){
		            a.push(arr[i]);
		        }
		    }

		    return a;
		},

	
		/**
		  * Extend Object Recursively
		  * uwmutils.extend({}, objA, objB);
		  *
		  * @param {}
		  * @param n objects 	
		  *
		  * @return void
		  *
		  */
		extend : function(output) {
		  output = output || {};

		  for (var i = 1; i < arguments.length; i++) {
		    var obj = arguments[i];

		    if (!obj){
		      continue;
		  	}

		    for (var key in obj) {
		      if (obj.hasOwnProperty(key)) {
		        if (typeof obj[key] === 'object')
		          output[key] = uwmutils.extend(output[key], obj[key]);
		        else
		          output[key] = obj[key];
		      }
		    }
		  }

		  return output;
		}

	};

	document.onkeydown = function(evt) {
		evt = evt || window.event;
		var isEscape = false;
		if ("key" in evt) {
			isEscape = evt.key == "Escape";
		} else {
			isEscape = evt.keyCode == 27;
		}
		if (isEscape) {
			uwmVinIntegration.modal.destroy();
		}
	};

	/**
	 * Array indexOf polyfill - maybe bad to stomp on this?
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Compatibility
	 */
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(elt /*, from*/) {
			var len = this.length >>> 0;
			var from = Number(arguments[1]) || 0;
			from = (from < 0)
			     ? Math.ceil(from)
			     : Math.floor(from);
			if (from < 0)
			  	from += len;

			for (; from < len; from++){
			  	if (from in this &&
			      this[from] === elt)
			    return from;
			}
			return -1;
		};
	}

	/**
	 * Initialize UWM Integration
	 */
	uwmVinIntegration.integration_init();
})();



//DDC Hook
window["uwmInitVideoService"] = function(){
	console.log('DDC Hook activated');
	uwmVinIntegration.settings.logic = uwmVinIntegration.default_logic;//USE DEFAULT LOGIC AND CONTINUE
	uwmVinIntegration.provider_logic_ready();//GO
}
//DDC Hook

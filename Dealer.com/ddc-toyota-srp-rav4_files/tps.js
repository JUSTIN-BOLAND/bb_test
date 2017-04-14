/*!
 * jsUri
 * https://github.com/derek-watson/jsUri
 *
 * Copyright 2013, Derek Watson
 * Released under the MIT license.
 *
 * Includes parseUri regular expressions
 * http://blog.stevenlevithan.com/archives/parseuri
 * Copyright 2007, Steven Levithan
 * Released under the MIT license.
 */
(function(global){var re={starts_with_slashes:/^\/+/,ends_with_slashes:/\/+$/,pluses:/\+/g,query_separator:/[&;]/,uri_parser:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/};if(!Array.prototype.forEach){Array.prototype.forEach=function(fn,scope){for(var i=0,len=this.length;i<len;++i){fn.call(scope||this,this[i],i,this)}}}function decode(s){if(s){s=decodeURIComponent(s);s=s.replace(re.pluses,' ')}return s}function parseUri(str){var parser=re.uri_parser;var parserKeys=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];var m=parser.exec(str||'');var parts={};parserKeys.forEach(function(key,i){parts[key]=m[i]||''});return parts}function parseQuery(str){var i,ps,p,n,k,v;var pairs=[];if(typeof(str)==='undefined'||str===null||str===''){return pairs}if(str.indexOf('?')===0){str=str.substring(1)}ps=str.toString().split(re.query_separator);for(i=0;i<ps.length;i++){p=ps[i];n=p.indexOf('=');if(n!==0){k=decodeURIComponent(p.substring(0,n));v=decodeURIComponent(p.substring(n+1));pairs.push(n===-1?[p,null]:[k,v])}}return pairs}function Uri(str){this.uriParts=parseUri(str);this.queryPairs=parseQuery(this.uriParts.query);this.hasAuthorityPrefixUserPref=null}['protocol','userInfo','host','port','path','anchor'].forEach(function(key){Uri.prototype[key]=function(val){if(typeof val!=='undefined'){this.uriParts[key]=val}return this.uriParts[key]}});Uri.prototype.hasAuthorityPrefix=function(val){if(typeof val!=='undefined'){this.hasAuthorityPrefixUserPref=val}if(this.hasAuthorityPrefixUserPref===null){return(this.uriParts.source.indexOf('//')!==-1)}else{return this.hasAuthorityPrefixUserPref}};Uri.prototype.query=function(val){var s='',i,param;if(typeof val!=='undefined'){this.queryPairs=parseQuery(val)}for(i=0;i<this.queryPairs.length;i++){param=this.queryPairs[i];if(s.length>0){s+='&'}if(param[1]===null){s+=param[0]}else{s+=param[0];s+='=';if(param[1]){s+=encodeURIComponent(param[1])}}}return s.length>0?'?'+s:s};Uri.prototype.getQueryParamValue=function(key){var param,i;for(i=0;i<this.queryPairs.length;i++){param=this.queryPairs[i];if(key===param[0]){return param[1]}}};Uri.prototype.getQueryParamValues=function(key){var arr=[],i,param;for(i=0;i<this.queryPairs.length;i++){param=this.queryPairs[i];if(key===param[0]){arr.push(param[1])}}return arr};Uri.prototype.deleteQueryParam=function(key,val){var arr=[],i,param,keyMatchesFilter,valMatchesFilter;for(i=0;i<this.queryPairs.length;i++){param=this.queryPairs[i];keyMatchesFilter=decode(param[0])===decode(key);valMatchesFilter=param[1]===val;if((arguments.length===1&&!keyMatchesFilter)||(arguments.length===2&&(!keyMatchesFilter||!valMatchesFilter))){arr.push(param)}}this.queryPairs=arr;return this};Uri.prototype.addQueryParam=function(key,val,index){if(arguments.length===3&&index!==-1){index=Math.min(index,this.queryPairs.length);this.queryPairs.splice(index,0,[key,val])}else if(arguments.length>0){this.queryPairs.push([key,val])}return this};Uri.prototype.replaceQueryParam=function(key,newVal,oldVal){var index=-1,i,param;if(arguments.length===3){for(i=0;i<this.queryPairs.length;i++){param=this.queryPairs[i];if(decode(param[0])===decode(key)&&decodeURIComponent(param[1])===decode(oldVal)){index=i;break}}this.deleteQueryParam(key,oldVal).addQueryParam(key,newVal,index)}else{for(i=0;i<this.queryPairs.length;i++){param=this.queryPairs[i];if(decode(param[0])===decode(key)){index=i;break}}this.deleteQueryParam(key);this.addQueryParam(key,newVal,index)}return this};['protocol','hasAuthorityPrefix','userInfo','host','port','path','query','anchor'].forEach(function(key){var method='set'+key.charAt(0).toUpperCase()+key.slice(1);Uri.prototype[method]=function(val){this[key](val);return this}});Uri.prototype.scheme=function(){var s='';if(this.protocol()){s+=this.protocol();if(this.protocol().indexOf(':')!==this.protocol().length-1){s+=':'}s+='//'}else{if(this.hasAuthorityPrefix()&&this.host()){s+='//'}}return s};Uri.prototype.origin=function(){var s=this.scheme();if(s=='file://'){return s+this.uriParts.authority}if(this.userInfo()&&this.host()){s+=this.userInfo();if(this.userInfo().indexOf('@')!==this.userInfo().length-1){s+='@'}}if(this.host()){s+=this.host();if(this.port()){s+=':'+this.port()}}return s};Uri.prototype.addTrailingSlash=function(){var path=this.path()||'';if(path.substr(-1)!=='/'){this.path(path+'/')}return this};Uri.prototype.toString=function(){var path,s=this.origin();if(this.path()){path=this.path();if(!(re.ends_with_slashes.test(s)||re.starts_with_slashes.test(path))){s+='/'}else{if(s){s.replace(re.ends_with_slashes,'/')}path=path.replace(re.starts_with_slashes,'/')}s+=path}else{if(this.host()&&(this.query().toString()||this.anchor())){s+='/'}}if(this.query().toString()){if(this.query().toString().indexOf('?')!==0){s+='?'}s+=this.query().toString()}if(this.anchor()){if(this.anchor().indexOf('#')!==0){s+='#'}s+=this.anchor()}return s};Uri.prototype.clone=function(){return new Uri(this.toString())};if(typeof define==='function'&&define.amd){define(function(){return Uri})}else if(typeof module!=='undefined'&&typeof module.exports!=='undefined'){module.exports=Uri}else{global.Uri=Uri}}(this));

(function () {

	var	tpsOmniRunOnce = true, // US56413: Stop Trade Driver from firing multiple events
		tpsomData = $('#tpsom-data'),
		vars = {
			// tmspdomProgram: tpsomData.data('program'),
			oToyotProgram: (tpsomData.data('program') == 'toyota'),
			oScionProgram: (tpsomData.data('program') == 'scion'),
			param_tost: (tpsomData.data('param-tost') == true),
			// pdoPageType: tpsomData.data('pdo-page-type'),
			pdoYear: tpsomData.data('pdo-year'),
			// pdoMake: tpsomData.data('pdo-make'),
			// pdoTrim: tpsomData.data('pdo-trim'),
			// pdoUserSearching: tpsomData.data('pdo-user-searching'),
			pdoModel: tpsomData.data('pdo-model'),
			// pdoVin: tpsomData.data('pdo-vin'),
			pdoType: tpsomData.data('pdo-type'),
			// pdoTypeS: tpsomData.data('pdo-type-s'),
			// debug: (tpsomData.data('debug') == true),
			pdoEvents: '',
			pdoExtraVars: ''
		},
		savedTmsomni = {};

	vars.pdoNoValue = vars.oToyotProgram ? 'no value' : 'all';

	// function called when a user clicks on a form element
	function formFocusTracking(event){

		var currentFormDialog = $('.ui-dialog[style*="block"]'), // set to the visible dialog
			trackingokay = true, // variable can be set to false if tracking shouldn't run
			form = $(event.delegateTarget), // form that was clicked
			formId = form.find('input[name="custom.form.id"]').length > -1 ? form.find('input[name="custom.form.id"]').val() : form.find('input[name="form.id"]').val(), // US56413: Added for cases were custom.form.Id was not appropriate
			customFormId = form.find('input[name="custom.form.id"]').val(), // US56413 original implementation of custom.form.Id in form hidden fields
			windowURI = new Uri(window.location.href), // put page into Uri object
			containsPartsInURL = windowURI.path().indexOf('parts') > -1, // if page contains parts, it's a parts page
			containsServiceInURL = windowURI.path().indexOf('service') > -1, // if page contains service, it's a service page
			getPageSpecificVars = DDC['third-party-integrations']['omniture']['getPageSpecificVars'],
			pageAlias = DDC.siteSettings.pageAlias;


		if(currentFormDialog != undefined){
			// Don't want to run this on the payment calc
			if($('.calculator-payment,.comments-form,.hours-default',currentFormDialog).length > 0){
				trackingokay = false;
			}
		}

		// // US56413 - Don't want to run on first form on Trade Driver page
		// if(pageAlias.indexOf('TRADE_DRIVER_TRADE_IN') > -1 && formId != "TRADE_IN") {
		// 	trackingokay = false;
		// }

		// if the user has not clicked on a form element yet
		if(form.data('clicked') != 'true' && trackingokay){
			if(form.parents('.price-alerts').size() > 0) {
				tmsomni.prop2 = vars.pdoNoValue;
				tmsomni.prop9 = vars.pdoNoValue;
				tmsomni.prop10 = vars.pdoNoValue;
				tmsomni.prop64 = "vehicle";
				tmsomni.prop6 = "mycars-lead";
				tmsomni.eVar2 = "D=c2";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar9 = "D=c9";
				tmsomni.eVar16 = "D=c10";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event54";
				vars.pdoExtraVars = "prop2,prop9,prop10,eVar2,eVar9,eVar16,";
				vars.pdoEvents = "event54";
			}
			else if((pageAlias.indexOf('ACCESSORIES') > -1 && pageAlias.indexOf('PARTS') == -1 && !containsPartsInURL) && vars.oScionProgram) {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,"accessories-lead");
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"accessories");
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event98";
				vars.pdoEvents = "event98";
			}
			else if(pageAlias.indexOf('SERVICE') > -1 || containsServiceInURL) {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,"service-lead");
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"service");
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event48";
				vars.pdoEvents = "event48";
			}
			else if(pageAlias.indexOf('INDEX') > -1 && customFormId == "service-lead") {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,"service-lead");
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"service");
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event48";
				vars.pdoEvents = "event48";
			}
			else if(pageAlias.indexOf('PARTS') > -1 || containsPartsInURL) {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,"parts-lead");
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"parts");
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event50";
				vars.pdoEvents = "event50";
			}
			else if(pageAlias.indexOf('FINANCE') > -1 || pageAlias.indexOf('FINANCING') > -1) {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,"finance-application");
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"finance");
				tmsomni.events = "event52";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				vars.pdoEvents = "event52";
			}
			else if(pageAlias.indexOf('FINDER') > -1) {
				tmsomni.prop2 = vars.pdoNoValue;
				tmsomni.prop9 = vars.pdoNoValue;
				tmsomni.prop10 = "all";
				tmsomni.prop64 = "vehicle";
				tmsomni.prop6 = "inventory-lead";
				tmsomni.eVar2 = "D=c2";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar9 = "D=c9";
				tmsomni.eVar16 = "D=c10";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event54";
				vars.pdoExtraVars = "prop2,prop9,prop10,eVar2,eVar9,eVar16,";
				vars.pdoEvents = "event54";
			}
			else if(formId == "finance-driver-application") {
				tmsomni.prop2 = vars.pdoYear;
				tmsomni.prop6 = "D=v6"
				tmsomni.prop9 = vars.pdoModel;
				tmsomni.prop10 = vars.pdoType;
				tmsomni.prop64 = "D=v64"
				tmsomni.eVar2 = "D=c2";
				tmsomni.eVar6 = getPageSpecificVars('prop6',pageAlias,formId);
				tmsomni.eVar9 = "D=c9";
				tmsomni.eVar16 = "D=c10";
				tmsomni.eVar64 = getPageSpecificVars('prop64',pageAlias,"vehicle");
				tmsomni.events = "event52";
				vars.pdoExtraVars = "prop2,prop6,prop9,prop10,eVar2,eVar9,eVar16,";
				vars.pdoEvents = "event52";
			}
			else if(pageAlias.indexOf('DETAILS') > -1) {
				tmsomni.prop2 = vars.pdoYear;
				tmsomni.prop6 = "D=v6"
				tmsomni.prop9 = vars.pdoModel;
				tmsomni.prop10 = vars.pdoType;
				tmsomni.prop64 = "D=v64"
				tmsomni.eVar2 = "D=c2";
				tmsomni.eVar6 = getPageSpecificVars('prop6',pageAlias,formId);
				tmsomni.eVar9 = "D=c9";
				tmsomni.eVar16 = "D=c10";
				tmsomni.eVar64 = getPageSpecificVars('prop64',pageAlias,"vehicle");
				tmsomni.events = "event54";
				vars.pdoExtraVars = "prop2,prop6,prop9,prop10,eVar2,eVar9,eVar16,";
				vars.pdoEvents = "event54";
			}
			else if(pageAlias.indexOf('CONTACT_DEFAULT') > -1 && vars.oScionProgram) {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,"other");
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"other");
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event94";
				vars.pdoEvents = "event94";
			}
			else if((pageAlias.indexOf('NEW_VEHICLE_DEPARTMENT') > -1 || pageAlias.indexOf('PRE_OWNED_VEHICLE_DEPARTMENT')) > -1 && vars.oScionProgram ) {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,"other");
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"other");
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event94";
				vars.pdoEvents = "event94";
			}
			else if(pageAlias.indexOf('CONTACT_FORM') > -1 && vars.oScionProgram) {
				tmsomni.prop6 = "other";
				tmsomni.prop64 = "other";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event94";
				vars.pdoEvents = "event94";
			}
			else if(pageAlias.indexOf('CONTACT_DEFAULT') > -1) {
				tmsomni.prop6 = formId;
				tmsomni.prop64 = "other";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event67";
				vars.pdoEvents = "event67";
			}
			else if(pageAlias.indexOf('DIRECTIONS_DEFAULT') > -1) {
				tmsomni.prop6 = "other";
				tmsomni.prop64 = "other";
				if(oToyotProgram){
					tmsomni.events = "event67";
				}
				vars.pdoEvents = "event67";
			}
			else if(pageAlias.indexOf('REQUEST_EPRICE') > -1 || pageAlias.indexOf('PURELEASE') > -1) {
				tmsomni.prop6 = "other";
				tmsomni.prop64 = "other";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event67";
				vars.pdoEvents = "event67";
			}
			// US56413: Trade Driver form needs to fire trade-in event
			else if(pageAlias.indexOf('INVENTORY_LEAD_TRADE_IN') > -1 || pageAlias.indexOf('TRADE_DRIVER_TRADE_IN') > -1) {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,customFormId);
				tmsomni.prop10 = 'used';
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"vehicle");
				tmsomni.eVar2 = "D=c2";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar16 = "D=c10";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event54";
				vars.pdoExtraVars = "prop10,eVar16";
				vars.pdoEvents = "event54";
				tpsOmniRunOnce = false; // US56413: Stop Trade Driver from firing multiple events
			}
			else if(pageAlias.indexOf('SHOWROOM') > -1) {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,"showroom-lead");
				tmsomni.prop10 = "new";
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"vehicle");
				tmsomni.eVar2 = "D=c2";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar9 = "D=c9";
				tmsomni.eVar16 = "D=c10";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event54";
				vars.pdoExtraVars = "prop2,prop9,prop10,eVar2,eVar9,eVar16,";
				vars.pdoEvents = "event54";
			}
			else if(pageAlias.indexOf('INCENTIVES_LEAD') > -1) {
				tmsomni.prop2 = vars.pdoYear;
				tmsomni.prop9 = vars.pdoModel;
				tmsomni.prop6 = "incentives-lead";
				tmsomni.prop10 = "new";
				tmsomni.prop64 = "vehicle";
				tmsomni.eVar2 = "D=c2";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar9 = "D=c9";
				tmsomni.eVar16 = "D=c10";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event67";
				vars.pdoExtraVars = "prop2,prop9,prop10,eVar2,eVar9,eVar16,";
				vars.pdoEvents = "event68";
			}
			else if(pageAlias.indexOf('MODEL_SPECIFIC') > -1) {
				var	tpsomDataMSLP = $('#tpsom-data-mslp'),
					year = tpsomDataMSLP.data('year') || '',
					model = tpsomDataMSLP.data('model') || '';

				// pass data for confirm page
				form.find('.hidden:last').after('<input class="hidden" type="hidden" name="mslpYear" value="' + year + '"/><input class="hidden" type="hidden" name="mslpModel" value="' + model + '"/>');

				tmsomni.prop2 = year;
				tmsomni.prop6 = customFormId;
				tmsomni.prop9 = model;
				tmsomni.prop10 = "new";
				tmsomni.prop64 = "vehicle";
				tmsomni.eVar2 = "D=c2";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar9 = "D=c9";
				tmsomni.eVar16 = "D=c10";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event54";
				vars.pdoEvents = "event54";
				vars.pdoExtraVars = "prop2,prop9,prop10,eVar2,eVar9,eVar16,";
			}
			else if(pageAlias.indexOf('RENTAL_LEAD') > -1) {
				tmsomni.prop6 = customFormId;
				tmsomni.prop64 = "other";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event67";
				vars.pdoEvents = "event67";
			}
			else if(pageAlias.indexOf('QUICK_QUOTE_DEFAULT') > -1) {
				var formYear = form.find('select[name="year"]').val(),
					formModel = form.find('select[name="model"]').val();
				tmsomni.prop2 = !isNaN(formYear) ? formYear : vars.pdoNoValue;
				tmsomni.prop6 = customFormId;
				tmsomni.prop9 = formModel === '' ? vars.pdoNoValue : formModel;
				tmsomni.prop10 = "all";
				tmsomni.prop64 = "vehicle";
				tmsomni.eVar2 = "D=c2";
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar9 = "D=c9";
				tmsomni.eVar16 = "D=c10";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event54";
				vars.pdoEvents = "event54";
				vars.pdoExtraVars = "prop2,prop9,prop10,eVar2,eVar9,eVar16,";
			}
			else if(customFormId == "contact-footer") {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,"contact us general inquiry");
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"contact us");
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event94";
				vars.pdoEvents = "event94";
			}
			else if(customFormId == "inventory-lead-eprice") {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,formId);
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"other");
				tmsomni.eVar6 = formId;
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event54";
				vars.pdoEvents = "event54";
			}
			else {
				tmsomni.prop6 = getPageSpecificVars('prop6',pageAlias,customFormId);
				tmsomni.prop64 = getPageSpecificVars('prop64',pageAlias,"other");
				tmsomni.eVar6 = "D=c6";
				tmsomni.eVar64 = "D=c64";
				tmsomni.events = "event67";
				vars.pdoEvents = "event67";
			}

			form.data('clicked','true'); // Set to true since the user has started using the form on the page
			tmsomni.trackExternalLinks = false;
			tmsomni.linkTrackVars = vars.pdoExtraVars + 'prop6,prop64,eVar6,eVar64,events';
			// console.log(tmsomni.linkTrackVars)
			// var tLTVs = tmsomni.linkTrackVars.split(',');
			// for(i in tLTVs) {
			// 	var tLTV = tLTVs[i];
			// 	console.log(tLTV + ':' + tmsomni[tLTV])
			// }
			tmsomni.linkTrackEvents = tmsomni.events = vars.pdoEvents;
			console.log(tmsomni)
			tmsomni.tl(true, 'o', $('.content-page-title h1').text() + " - Form Start");
		}
	}

	function saveVariables(variables) {
		for(variable in variables) {
			savedTmsomni[variable] = tmsomni[variable];
		}
	}

	function restoreVariables(variables) {
		for(variable in variables) {
			tmsomni[variable] = savedTmsomni[variable];
		}		
	}

	// e = event
	// o = object

	$(document).bind('trackEvent',function(e,o){
		// created to handle mycars events
		// had to use trackEvent and test on the object passed to know if mycars was successfully signed in
		if(o.widgetName == 'mycars-register') {
			tmsomni.eVar6 = "mycars-lead";
			tmsomni.eVar64 = "vehicle";
			tmsomni.events = "event55";
			tmsomni.tl(true,'o','Form Complete Event');
			// US56413: created for custom Autonation SmartChoice confirm event
			// had to use trackEvent and test on the object passed to know if SmartChoice was submitted
		}else if(o.widgetName == 'SmartChoice'){
			tmsomni.prop2 = "D=v2";
			tmsomni.prop6 = "D=v6";
			tmsomni.prop9 = "D=v9";
			tmsomni.prop10 = "D=v16";
			tmsomni.prop64 = "D=v64";
			tmsomni.eVar2 = o.year;
			tmsomni.eVar6 = DDC['third-party-integrations'].omniture.getPageSpecificVars('prop6',"inventory","inventory-lead-default");
			tmsomni.eVar9 = o.model;
			tmsomni.eVar16 = o.type;
			tmsomni.eVar64 = DDC['third-party-integrations'].omniture.getPageSpecificVars('prop64',"inventory","vehicle");
			tmsomni.events = "event55";
			tmsomni.tl(true,'o', o.eventName);
		}
	});

	// used by sonicautomotiveprofilev9/components/shared-price.vm as they have forms that submit via ajax
	// takes 'event' which is a jquery event from the 'on' function
	DDC['third-party-integrations']['omniture']['trackAjaxSubmission'] = function(event) {
		var form = $(event.target).parents('form'),
			formId = form.find('input[name="form.id"]').val();
			customFormId = form.find('input[name="custom.form.id"]').val();

		// saveVariables(['prop2,prop6,prop9,prop10,prop64,eVar6,evar64,events,linkTrackVars,linkTrackEvents']); // save old variables

		if($(event.delegateTarget).data('widget-name') == 'contact-form') {
			tmsomni.prop6 = customFormId;
			tmsomni.prop64 = "other";
			tmsomni.eVar6 = "D=c6";
			tmsomni.eVar64 = "D=c64";
			tmsomni.events = "event68";
			vars.pdoEvents = "event68";
			tmsomni.linkTrackVars='prop6,prop64,eVar6,eVar64,events';
		}
		else {
			tmsomni.prop2 = vars.pdoYear;
			tmsomni.prop6 = customFormId;
			tmsomni.prop9 = vars.pdoModel;
			tmsomni.prop10 = vars.pdoType;
			tmsomni.prop64 = "vehicle";
			tmsomni.eVar6 = "D=c6";
			tmsomni.eVar64 = "D=c64";
			tmsomni.events = "event55";
			vars.pdoEvents = "event55";
			tmsomni.linkTrackVars = "prop2,prop6,prop9,prop10,prop64,eVar6,eVar64,events";
		}

		tmsomni.linkTrackEvents = tmsomni.events = vars.pdoEvents;
		tmsomni.tl(true,'o','ajax dialog complete');

		// restoreVariables(['prop2,prop6,prop9,prop10,prop64,eVar6,evar64,events,linkTrackVars,linkTrackEvents']); // save old variables
	}

	function formFocus() {
		// don't track if link was clicked from footer
		$('form').on("click","textarea,select,input",function(event){
			var runFocusTracking = true;
			if($(this).parents('form[action*="confirm"]').length > 0){
				runFocusTracking = true;
			}
			else if($(this).parents('form[action*="CALCULATOR_PAYMENT"]').length > 0){
				runFocusTracking = false;
			}
			else if($(this).parents('[data-widget-id*="template-inventory-search1"]').length > 0){
				runFocusTracking = false;
			}
			else if($(this).parents('form[id*="compareForm"]').length > 0){  // Not tracking compare check box
				runFocusTracking = false;
			}
			else if($(this).parents('form[action*="inventory"]').length > 0){  // Not tracking search inv forms
				runFocusTracking = false;
			}
			else if($(this).parents('form[class*="tradedriver-form"]').length > 0) { // US56413: Not tracking initial form on Trade Driver
				runFocusTracking = false;
			}
			else if($(event.delegateTarget).find('label[class*="listingConfigId"]').length == 1){ // don't track interacting with inventory search drop downs on listing page
				runFocusTracking = false;
			}
			else if(DDC.siteSettings.pageAlias.indexOf('NO_RESULTS') > -1) { // not teacking no results page searches
				runFocusTracking = false;
			}
			if(!$(this).parent().hasClass('blogSearch') && runFocusTracking && tpsOmniRunOnce){ // US56413: tpsOmniRunOnce stops Trade Driver from firing multiple events
				formFocusTracking(event);
			}
		});
	}

	$(document).bind('ajaxComplete',function() {
		formFocus()
	});

	if(vars.param_tost) {
		// track on page load if you click footer directions link
		formFocusTracking(event);
	}
	else {
		formFocus()
	}
}());

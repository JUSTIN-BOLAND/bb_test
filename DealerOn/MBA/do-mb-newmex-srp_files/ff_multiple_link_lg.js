function WriteScript(scriptUrl)
{
	var oHead = document.getElementsByTagName('HEAD').item(0);  
	var oScript= document.createElement("script");  
	oScript.type = "text/javascript";  
	oScript.src=scriptUrl;
	oHead.appendChild( oScript); 	
}

function getRefDomain()
{
	var ref= '';
	if (location.href) 
	{
	   url = location.href; 
	   ref = url.match(/:\/\/(.[^/]+)/)[1];
	}
	return ref;
}

function GetValue(divElement,divAttr,default_value)
{
	var retValue = divElement.getAttribute(divAttr);
	
	if( retValue == null || retValue =='' )
		retValue = default_value;
		
 	retValue = retValue.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

	//console.log(divAttr+ " " + default_value + " -"+retValue+"- ");
	
	return retValue;
}

function getDomain(url,domain_referer,ref_domain)
{
	
	var domainname = url.match(/:\/\/(www\.)?(.[^/:]+)/)[2];
	
	
	if( domain_referer == '' )
		{domain_param = "&domain="+domainname; ref = domainname; }
	else
		{domain_param = "&domain="+domain_referer; ref = domain_referer; }
		
	var referrer_url = document.referrer;
	if (document.referrer) 
	{
	   url = document.referrer; 
	   ref = url.match(/:\/\/(.[^/]+)/)[1];
	   
	   if( ref == 'resources.flickfusion.net' && domain_referer!='')
	   	ref = domain_referer;
	   
	   domain_param = "&domain="+domainname+"&ref="+ref;
  	}
  	
  	if( ref_domain )
  	{
	  	domain_param = ref;	
  	}
 
	return domain_param;
}

function DelayedLoad()
{
	referer = "&referer="+getRefDomain();
	var elem = document.getElementById("ff_link");
	var ff_client = elem.getAttribute("ff_client");
	var ff_vin = elem.getAttribute("ff_vin");
	var url = "http://23.253.123.199/verify_vin.php?vin="+ff_vin+"&client_id="+ff_client+"&jsoncallback=?";
	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'jsonp',
		success: function (data) 
		{
		    if( data.vehicle_fkey.length > 0 )
		    {
			var url = "//media.flickfusion.net/videos/basic/player.php?vehicle_fkey=" + data.vehicle_fkey + referer;
			var imageUrl = "//media.flickfusion.net/videos/global/images/square_play.png";
			elem.innerHTML="<a href=\"#\" onClick=\"LoadWindow('"+url+"'); return false;\"><img src='" + imageUrl + "' border='0' /></a>" ;
		    }
		}     
	});
	
}



function LoadVideosEC() //LoadVideosExternalCall
{
	window.ff_link_global_var = '';
	LoadJS();
}

var vinMap = new Object();

function LoadJS()
{
 		 var divID = 'ff_link';
		
		// if( window.ff_link_global_var === 'loaded' )
		// 	return;
		 
		 window.ff_link_global_var = 'loaded'; 
			
		 LoadStyles();
		 
		 window.ff_link_cnt = $("[id=ff_link]").length;
		 
		var domain_param =  getDomain(location.href,'',0);
		var v_dealer_name =  getDomain(location.href,'',1);
		 
		 $("[id=ff_link]").each(function (i) 
		{
				var ff_link_div = this;
				var ff_client = ff_link_div.getAttribute("ff_client");
				var ff_vin = ff_link_div.getAttribute("ff_vin");
				var ff_cust_img = ff_link_div.getAttribute("ff_img");
				var ff_overlay = ff_link_div.getAttribute("ff_overlay");
				var ff_lp = ff_link_div.getAttribute("ff_lp");
				var ff_text_link = ff_link_div.getAttribute("ff_text_link");
				var yt_url = ff_link_div.getAttribute("yt_url");
				var ff_inline = ff_link_div.getAttribute("ff_inline");
				var disable_auto_play = ff_link_div.getAttribute("disable_auto_play");
				
				var href_url = window.location.host;
				window.video_size = 640;
				
				if( ff_lp == null )
				ff_lp = '';
				
				if( ff_overlay == null )
				ff_overlay = '';
				
				if( ff_inline == null )
				ff_inline = '';					
				
				if( yt_url == null )
				yt_url = '';				
				
				if( ff_client == null )
				vehicle_fkey = "";

				if( ff_vin == null )
				ff_vin = "";	
				
				if( ff_cust_img == null )
				ff_cust_img = "";
				
				if( ff_cust_img != '' )
				{
					if( !ff_cust_img.match(/\.(jpg|jpeg|png|gif)$/) )
					{ff_cust_img = ''; console.log("Not Image");}
				}
				
				referer = "&referer="+getRefDomain();
				
				ff_vin_client_key = ff_client+"_"+ff_vin;
				//var url = "http://resources.flickfusion.net/videos/global/verify_vin.php?vin="+ff_vin+"&client_id="+ff_client+"&";
				
				var url = "http://23.253.123.199/verify_vin.php?vin="+ff_vin+"&client_id="+ff_client+"&yt="+yt_url+"&";
				//var url = "http://media.flickfusion.net/videos/global/verify_vin.php?vin="+ff_vin+"&client_id="+ff_client+"&yt="+yt_url+"&href_url="+href_url+"&";
 
				if( window.location.protocol == 'https:' )
				var url = "https://media.flickfusion.net/videos/global/verify_vin.php?vin="+ff_vin+"&client_id="+ff_client+"&yt="+yt_url+"&href_url="+href_url+"&";
				
				if(vinMap[ff_vin_client_key] == null)
				{
					 //console.log(url);
					 //This is not working if you're calling from serverA.com
					 jQuery.getJSON(url+"&jsoncallback=?",   function(data)
					 {
							 if( data.vehicle_fkey.length > 0 )
							 {
							 
								 v_year=data.veh_year;
								 v_make=data.veh_make;
								 v_model=data.veh_model;
								 v_trim=data.veh_trim;
								 v_color=data.veh_color;
								 v_price=data.veh_price;
								 v_zip = data.client_zip;
								 v_vin = data.veh_vin;
								 v_body = data.veh_body;
								 var img_tag = '';
								 var img_track_url="//track.trafficscore.com/itrack/?account_id=CqCRLPwN&event=VDP_BUTTON&zipcode="+v_zip+"&v_year="+v_year+"&v_make="+v_make+"&v_model="+v_model+"&v_trim="+v_trim+"&v_color="+v_color+"&v_price="+v_price+"&v_vin="+v_vin+"&v_body="+v_body+"&v_dealer_name="+v_dealer_name;
								 
								 if( window.ff_link_cnt == 1 )
								 {
								 	//console.log(img_track_url);
								 	img_tag="<img src='"+img_track_url+"'  border='0' width='0' height='0' style='height:0px;width:0px;'/>";
								 }
							 
								var url = "//media.flickfusion.net/videos/basic/player.php?vehicle_fkey=" + data.vehicle_fkey + referer;
								imageUrl = "//media.flickfusion.net/videos/global/images/ff_play.png";
								
								if( ff_lp == '1' )
									url = "http://resources.flickfusion.net/LP/?vehicle_fkey=" + data.vehicle_fkey + referer;
								

								if( ff_cust_img != null && ff_cust_img != '' )
								imageUrl = ff_cust_img;

								if( data.video_size == '960' )
								{
									url = "http://media.flickfusion.net/videos/basic/player.php?auto_resize=1&vehicle_fkey=" + data.vehicle_fkey + referer;	
									window.video_size = 960;
								}

								//ff_link_div.html("<a href=\"" + url + "\" target='_blank'><img src='" + imageUrl + "' border='0' /></a>" );
								var anchor_tag = "<img src='" + imageUrl + "' border='0' />";

								if( ff_text_link != null && ff_text_link != '' )
								anchor_tag = ff_text_link;

								//if( yt_url == 1 && data.yt != '' ) url = data.yt;

								url = url+"&yt_url="+yt_url;
								
								//console.log(url);

								jQuery("[id=ff_link]").each(function (i) 
								{ 

									var ff_link_div = this;
									var ff_vin = GetValue(this,"ff_vin","");
									var ff_client =GetValue(this,"ff_client","");
									//console.log(data.vehicle_fkey + " " + data.vin + " " + ff_vin  + " " + data.client_fk + " - " + data.dg_fk + " " + ff_client);
									if( ff_vin == data.vin && ( ff_client == data.client_fk || ff_client == data.dg_fk ) )
									{
										var loadMethod='LoadUrl';
										if( ff_lp == '1' )
										{
											loadMethod='LoadUrlExpanded';
											//ff_overlay = '';
										}
										
										//console.log("Method " + loadMethod );
										
										if( ff_overlay == '' )
											this.innerHTML="<a  href=\"#\" onClick=\""+loadMethod+"('"+url+"'); return false;\">" + anchor_tag + "</a>"+img_tag ;
										else
											this.innerHTML="<a href=\"#\"  onClick=\""+loadMethod+"('"+url+"'); return false;\">" + anchor_tag + "</a>"+img_tag ;

										//console.log("ff_inline :"+ff_inline+":");
										if( ff_inline == "1" )
										{
											if(disable_auto_play == "1")
											url = url+"&disable_auto_play=1";
											this.innerHTML='<iframe id="ff_link_iframe" style="min-width: 400px; max-width: 640px;" src="'+ url +'" frameborder="0" scrolling="no" align="center" width="640px" height="426px"></iframe>';
										}
									}
								});						 
							 }

					 }
					 ); 
					vinMap[ff_vin_client_key]=1;
				 }
		});


		//jQuery.noConflict(); 

 }
 
 
 function LoadStyles()
 {
 	//window.$ = jQuery;
 	 
 	if( $ === undefined) 
 	{
 		window.$ = jQuery;
 	}
 	
 	/*$("<link/>", {
 		 rel: "stylesheet",
 		 type: "text/css",
 		 href: "//media.flickfusion.net/videos/slides/scripts/style.css"
	}).appendTo("head"); */
  
 }
 
 function LoadWindow(url)
 {
   var window_size = "width=641, height=400";
   if( window.video_size == 960 )
   {
   	var window_size = "width=961, height=615";
   }
 	window.open(url, "Video", window_size); 
 	return false;
 } 
 
 function LoadUrl(url)
 { 
   var window_w = 640; 
   var window_h = 395;
   iframeurl = url + "&auto_resize=1&KeepThis=true&TB_iframe=true&width=630&height=385";
   if( window.video_size == 960 )
   {
   	iframeurl = url + "&auto_resize=1&KeepThis=true&TB_iframe=true&width=955&height=575";
   	
	   var window_w = 960; 
	   var window_h = 575;
   	
   }
   
 	//tb_show("Video", iframeurl);
 	 console.log("showInlineVideo");
   showInlineVideo(iframeurl, window_w, '160', window_h, '98', 'Video', 0);
   console.log("return false showInlineVideo");
 }
 
function LoadUrlExpanded(url)
{ 
	   var window_w = window.innerWidth * 0.90; 
	   var window_h = 900;
	   
	   var window_size = "width=1020, height=900";
	   if(window_w < 410 )
	  	 window.open(url, "Video", window_size); 
	   else
  		showInlineVideo(url, window_w, '160', window_h, '98', 'Video', 0,'');
  	
}
 
 
function loadScript(url, callback) 
{
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	var done = false;
	script.onload = script.onreadystatechange = function () 
	{
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
					done = true;
					callback();
					script.onload = script.onreadystatechange = null;
					head.removeChild(script);
			}
	};
	head.appendChild(script);
}

function LoadOverlay()
{
 	//loadScript("//media.flickfusion.net/videos/global/overlay_box.js", function () { LoadJS() } );
 	loadScript("//media.flickfusion.net/videos/global/show_window.js", function () { LoadJS() } );
 	
 	
 	//LoadJS();
}

function InitScript()
{
	loadScript("//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function () { LoadOverlay() } );
}


if (typeof jQuery == 'undefined') 
{
	window.onload = function(){  InitScript(); }
}
else
	LoadOverlay();		 
_satellite.pushAsyncScript(function(event, target, $variables){
  $("a").click(function(){
	var l = $(this);
	var dh = "";
	if(typeof l.attr("data-href") !== "undefined"){dh = l.attr("data-href");}
	else if(typeof l.attr("href") !== "undefined")dh = l.attr("href");
	else{dh = "nodata";}
	if(typeof DDC.dataLayer !== 'undefined'){
		if(DDC.dataLayer.page.pageInfo.pageName.indexOf('AUTO_') == 0 && DDC.dataLayer.page.pageInfo.pageName.indexOf('_DETAILS') > 0){
			if(dh.indexOf('/vehiclelead-form.htm?') == 0){
				var dID = "unset";
				if(DDC.dataLayer.dealership.dealerCode){
					for(i = 0; i < DDC.dataLayer.dealership.dealerCode.length; i++){
		            if(DDC.dataLayer.dealership.dealerCode[i].cllc){dID = DDC.dataLayer.dealership.dealerCode[i].cllc.toLowerCase();}
		            if(DDC.dataLayer.dealership.dealerCode[i].fiat){dID = DDC.dataLayer.dealership.dealerCode[i].fiat.toLowerCase();}
		            if(DDC.dataLayer.dealership.dealerCode[i].alfa){dID = DDC.dataLayer.dealership.dealerCode[i].alfa.toLowerCase();}
					}
				}

				var mdl = "none";
				if(DDC.dataLayer.vehicles[0]){mdl = DDC.dataLayer.vehicles[0].model;}

				var cb = Math.round(new Date().getTime() / 1000);
        		var av3 = "";
		if(_satellite.getToolsByType('sc')[0].getS() !== null && typeof _satellite.getToolsByType('sc')[0].getS().eVar26 !== 'undefined'){var av3 = _satellite.getToolsByType('sc')[0].getS().eVar26.replace(/\s/g, '').toLowerCase();}
				var b = "https://a01.korrelate.net/a/e/d2a.ads?r="+cb+"&et=a&ago=447&ao=513&px=377&pt=s&lvl="+mdl+"&av1=rqst_info_strt&av2="+dID+"&av3="+av3;
				var sct = document.createElement('script');
				sct.src = b;
				sct.async = false;
				document.body.appendChild(sct);
			}
		}
	}
});
});

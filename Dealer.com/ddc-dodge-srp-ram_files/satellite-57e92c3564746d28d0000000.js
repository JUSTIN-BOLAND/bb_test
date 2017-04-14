_satellite.pushAsyncScript(function(event, target, $variables){
  if(typeof DDC.dataLayer !== 'undefined'){
  var len = DDC.dataLayer.topics.dataFormTrackingId.length;
  var check = 'false';
  for(var i = 0; i < len; i++){
    if(DDC.dataLayer.topics.dataFormTrackingId[i].action.indexOf('showroom') >= 0){check = 'true';}
  }

	if(DDC.dataLayer.page.pageInfo.pageName == 'SHOWROOM' && check === 'true'){
		var dID = "unset";
		if(DDC.dataLayer.dealership.dealerCode){
		  for(i = 0; i < DDC.dataLayer.dealership.dealerCode.length; i++){
            if(DDC.dataLayer.dealership.dealerCode[i].cllc){dID = DDC.dataLayer.dealership.dealerCode[i].cllc.toLowerCase();}
            if(DDC.dataLayer.dealership.dealerCode[i].fiat){dID = DDC.dataLayer.dealership.dealerCode[i].fiat.toLowerCase();}
            if(DDC.dataLayer.dealership.dealerCode[i].alfa){dID = DDC.dataLayer.dealership.dealerCode[i].alfa.toLowerCase();}
		  }
		}

		var cb = Math.round(new Date().getTime() / 1000);
    var av3 = "";
		if(_satellite.getToolsByType('sc')[0].getS() !== null && typeof _satellite.getToolsByType('sc')[0].getS().eVar26 !== 'undefined'){var av3 = _satellite.getToolsByType('sc')[0].getS().eVar26.replace(/\s/g, '').toLowerCase();}
		var b = "https://a01.korrelate.net/a/e/d2a.ads?r="+cb+"&et=a&ago=447&ao=513&px=377&pt=s&lvl=nomodel&av1=shwrm_strt&av2="+dID+"&av3="+av3;
		var sct = document.createElement('script');
		sct.src = b;
		sct.async = false;
		document.body.appendChild(sct);
	}
}
});

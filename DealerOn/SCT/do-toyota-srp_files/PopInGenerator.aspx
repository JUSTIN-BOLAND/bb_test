var popinBottomOffset = 0;var xCloseCookieName = 'xClose8421198818';function popIn(){if (GetCookie('xClose8421198818') != null) { return; }var target=document.getElementById("agent_info");target.innerHTML='<table style="width:100%;height:100%" cellpadding="0" cellspacing="0" border="0" bgcolor="black"><tr><td >  <table style="width:100%" cellpadding="0" cellspacing="0" border="0" bgcolor="white"><tr valign="top"> <td colspan=2 ><table style="width:100%"><tr><td><img src="http://CAO-US1PRES7.contactatonce.com/images/label.gif" border=0 /></td><td id="messageCell" sytle="font-weight: bold">Naomi Kirkland of Scott Clark Toyota is available to answer your questions now!</td><td valign="top" align="right"><a href="javascript:iPop1141877261_close()" style="color: black; font-family: Verdana; font-style: normal; font-variant: normal; font-weight: normal; font-size: 10pt; line-height: normal; font-stretch: normal; font-size-adjust: none; text-decoration: none;">[&times;]</a></td></tr></table></td></tr>  <tr valign="top">   <td align=center><img id="agentImage" src="http://cdn.contactatonce.com/agent/vsa/caovsa_055.jpg" border="0" /></td>   <td>     <table cellpadding="0" cellspacing="5">       <tr><td valign="center" align="center" /> <strong></strong>  </td></tr>       <tr><td><a onclick="javascript:var nullStr=\'\'; window.open(\'http://CAO-US1PRES7.contactatonce.com/CaoClientContainer.aspx?MerchantId=198818&ProviderId=8421&PlacementId=0&OriginationUrl=http%3a%2f%2fwww.scottclarkstoyota.com%2ftoyota-matthews-nc.html\',\'\',\'resizable=yes,toolbar=no,menubar=no,location=no,scrollbars=no,status=no,height=660,width=375\');return false; "href="#"><img id="imButton" src="http://CAO-US1PRES7.contactatonce.com/images/button3.jpg" border="0" /></a></td></tr>     </table>   </td></tr></table></td></tr></table>';var launchDelay = 500;
document.getElementById("iCoder_POP1141877261").style.backgroundColor = "transparent";
document.getElementById("iCoder_POP1141877261").style.backgroundRepeat = "no-repeat";
document.getElementById("iCoder_POP1141877261").style.border = "none"
document.getElementById("iCoder_POP1141877261").style.lineHeight = "normal";
document.getElementById("iCoder_POP1141877261").style.cursor="default";

objPopIn.f.popInCustomInitFunction = function() {
	var elem = document.getElementById('caoBusinessCardTextContainer');
	if (elem) {
		objPopIn.f.setMaxHeightToElement(elem, 30, 24);
	}
};

var noAgentImg = "";

if (noAgentImg == "1")
{
	objPopIn.v.agentImageUrl = "";
}else{
	objPopIn.v.agentImageUrl = "http://cdn.contactatonce.com/agent/vsa/caovsa_055.jpg";
}



objPopIn.v.hasCoupon = "false";

objPopIn.v.clickToCallAction = "";


objPopIn.v.ProviderID = 8421;
objPopIn.v.MerchantId = 198818;


objPopIn.v.ShowMtc = "";

objPopIn.v.ShowMtc = 1;



var cQuery = document.createElement("script");
cQuery.setAttribute("type", "text/javascript");
cQuery.setAttribute("src", "//cdn.contactatonce.com/application/toolbar/js/jquery.cao.js");
document.getElementsByTagName("head")[0].appendChild(cQuery);
		


function htmlDecode(input)
{
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

var and = htmlDecode("&amp;&amp;");
var lessThan = htmlDecode("&lt;");

objPopIn.v.agentDisplayName = "Naomi Kirkland";
objPopIn.v.imAction = "javascript:var nullStr=\'\'; window.open(\'http://CAO-US1PRES7.contactatonce.com/CaoClientContainer.aspx?MerchantId=198818&amp;ProviderId=8421&amp;PlacementId=0&amp;OriginationUrl=http%3a%2f%2fwww.scottclarkstoyota.com%2ftoyota-matthews-nc.html\',\'\',\'resizable=yes,toolbar=no,menubar=no,location=no,scrollbars=no,status=no,height=660,width=375\');return false; ";
objPopIn.v.phoneNumber = "";


usesAnimationScript = true;
  var dropinBody = document.createElement("script");
  dropinBody.setAttribute("type", "text/javascript");
  dropinBody.setAttribute("src", "//cdn.contactatonce.com/scripts/CAOBRSlideUp_Animation.js");
    dropinBody.onreadystatechange= function ()
	{
		if ((this.readyState == 'complete') || (this.readyState == 'loaded'))
		{
			animationScriptLoaded = true;
		}
	};

	dropinBody.onload= function()
	{
		animationScriptLoaded = true;
	};
  document.getElementsByTagName("head")[0].appendChild(dropinBody);
  
  var dropinBodyStyle = document.createElement("link");
  dropinBodyStyle.setAttribute("rel", "stylesheet");
  dropinBodyStyle.setAttribute("type", "text/css");
  dropinBodyStyle.setAttribute("href", "//css.contactatonce.com/css/CAOBRSlideUp_Red_SalesSpecific_Style.css");
  document.getElementsByTagName("head")[0].appendChild(dropinBodyStyle);  


var launchDelay = 4000;document.getElementById("iCoder_POP1141877261").setAttribute("pos","br");document.getElementById("iCoder_POP1141877261").onselectstart = function(){return false;};setTimeout("iPop1141877261_init1()", launchDelay);}
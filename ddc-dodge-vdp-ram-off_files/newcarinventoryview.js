function _jsMakeNewCarInventoryTag() {
    var activityTag = JumpstartActivityTag();

    activityTag.setGoalId('5');
    activityTag.setGoogleGoal('/Goals/nc_inventory');

    //To put a DFP Activity XSP ID tag, uncomment and fill in the values below.
    var DFPxsp = "590306";
    activityTag.setDfpXspTag(DFPxsp);

    //To activate the DFA Floodlight Tag, uncomment the next four lines and fill in src, type, and cat info.
    //var DFAsrc = "XXXXXX";
    //var DFAtype = "XXXXXX";
    //var DFAcat = "XXXXXX";
    //activityTag.setDfaTag(DFAsrc, DFAtype, DFAcat);

    //To activate the DFP Spotlight Tag, uncomment the next four lines and fill in src, type, and cat info.
    //var DFPsrc = "XXXXXX";
    //var DFPtype = "XXXXXX";
    //var DFPcat = "XXXXXX";
    //activityTag.setDfpTag(DFPsrc, DFPtype, DFPcat);

    return activityTag;

}

_jsNewCarInventoryTag = _jsMakeNewCarInventoryTag();
_jsNewCarInventoryTag.writeTags();

function JumpstartActivityTag()
{
    var private = {
        sslLocation: 'insecure',
        goalId: null,
        googleGoal: null,
        dfpXspId: null,
        dfaTagSrc: null,
        dfaTagType: null,
        dfaTagCat: null,
        dfpTagSrc: null,
        dfpTagType: null,
        dfpTagCat: null,

        detectSsl: function()
        {
            try {
                var loc = parent.location.protocol;
                if(loc == "http:") {
                    loc = "insecure";
                } else {
                    loc = "secure";
                }
            } catch(err) {
                loc = "insecure";
            }
            return loc;
        },

        getCookie: function(c_name)
        {
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(c_name + "=");
                if (c_start!=-1) {
                    c_start = c_start + c_name.length+1;
                    var c_end = document.cookie.indexOf(";",c_start);
                    if (c_end == -1) {
                        c_end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(c_start,c_end));
                }
            }
            return "";
        },

        createDfpXspTag: function(sslLocation, dfpXspId, dfpXspOrd)
        {
            if(sslLocation == 'secure') {
                var dfpXspPrefix = 'https://';
            } else {
                var dfpXspPrefix = 'http://';
            }
            var dfpXspId = dfpXspId;
            var dfpXspOrd = dfpXspOrd;
			var dfpXspTag=document.createElement('img');
			dfpXspTag.width = '1';
			dfpXspTag.height = '1';
			dfpXspTag.border = '0';
			dfpXspTag.src = dfpXspPrefix + 'pubads.g.doubleclick.net/activity;xsp=' + dfpXspId + ';ord=' + dfpXspOrd + '?';

			if (document.getElementsByTagName('body')[0] !== undefined) {
				document.getElementsByTagName('body')[0].appendChild(dfpXspTag);
			} else if (document.getElementsByTagName('head')[0] !== undefined) {
				document.getElementsByTagName('head')[0].appendChild(dfpXspTag);
			} else {
				var dfpXspTagW = '<im' + 'g src="' + dfpXspPrefix + 'pubads.g.doubleclick.net/activity;';
				dfpXspTagW = dfpXspTagW + 'xsp=' + dfpXspId + ';ord=' + dfpXspOrd;
				dfpXspTagW = dfpXspTagW + '?"  width=1 height=1 border=0 />';
				document.write(dfpXspTagW);
			}
        },

        createDfaTag: function(sslLocation, dfaSrc, dfaType, dfaCat, dfaOrd)
        {
            if(sslLocation == 'secure') {
                var dfaPrefix = 'https://';
            } else {
                var dfaPrefix = 'http://';
            }
            var dfaSrc = dfaSrc;
            var dfaType = dfaType;
            var dfaCat = dfaCat;
            var dfaOrd = dfaOrd;
			var dfaTag=document.createElement('iframe');
			dfaTag.width = '1';
			dfaTag.height = '1';
			dfaTag.frameBorder = '0';
			dfaTag.style.display = 'none';
			dfaTag.src = dfaPrefix + dfaSrc + '.fls.doubleclick.net/activityi;src=' + dfaSrc + ';type=' + dfaType + ';cat=' + dfaCat + ';dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=' + dfaOrd + '?';
			
			if (document.getElementsByTagName('body')[0] !== undefined) {
				document.getElementsByTagName('body')[0].appendChild(dfaTag);
			} else if (document.getElementsByTagName('head')[0] !== undefined) {
				document.getElementsByTagName('head')[0].appendChild(dfaTag);
			} else {
				var dfaTagW = '<ifr' + 'ame src="' + dfaPrefix + dfaSrc + '.fls.doubleclick.net/activityi;';
				dfaTagW = dfaTagW + 'src=' + dfaSrc + ';type=' + dfaType + ';cat=' + dfaCat + ';';
				dfaTagW = dfaTagW + 'dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=' + dfaOrd;
				dfaTagW = dfaTagW + '?" width="1" height="1" frameborder="0" style="display:none"></ifr' + 'ame>';
				document.write(dfaTagW);
			}
        },

        createDfpTag: function(sslLocation, dfpSrc, dfpType, dfpCat, dfpOrd)
        {
            if(sslLocation == 'secure') {
                var dfpPrefix = 'https://';
            } else {
                var dfpPrefix = 'http://';
            }
            var dfpSrc = dfpSrc;
            var dfpType = dfpType;
            var dfpCat = dfpCat;
            var dfpOrd = dfpOrd;
			var dfpTag=document.createElement('img');
			dfpTag.width = '1';
			dfpTag.height = '1';
			dfpTag.border = '0';
			dfpTag.src = dfpPrefix + 'ad.doubleclick.net/activity;src=' + dfpSrc + ';type=' + dfpType + ';cat=' + dfpCat + ';ord=' + dfpOrd + '?';

			if (document.getElementsByTagName('body')[0] !== undefined) {
				document.getElementsByTagName('body')[0].appendChild(dfpTag);
			} else if (document.getElementsByTagName('head')[0] !== undefined) {
				document.getElementsByTagName('head')[0].appendChild(dfpTag);
			} else {
				var dfpTagW = '<IM' + 'G SRC="' + dfpPrefix + 'ad.doubleclick.net/activity;src=';
				dfpTagW = dfpTagW + dfpSrc + ';type=' + dfpType + ';cat=' + dfpCat + ';ord=' + dfpOrd;
				dfpTagW = dfpTagW + '?" WIDTH=1 HEIGHT=1 BORDER=0 />';
				document.write(dfpTagW);
			}
        },

        goalPixel: function(sslLocation, goalId, jsSession)
        {
	        try {
		        if(sslLocation == 'secure') {
			        var prefix = 'https://';
		        } else {
			        var prefix = 'http://';
		        }
	        } catch(err) {
		        var prefix = 'http://';
	        }
	        var jssession = jsSession;
	        var goal = goalId;
	        var urlparams = 'jssession=' + jssession + '&';
	        urlparams = urlparams + 'goal=' + goal;
	        try {
		        var apptag=document.createElement('img');
		        apptag.width='0';
		        apptag.height='0';
		        apptag.src= prefix + 'www.jumpstarttaggingsolutions.com/tracking/goals.php?' + urlparams + '&' + Math.random();
		        document.getElementsByTagName('head')[0].appendChild(apptag);
	        } catch(err) {
		        document.write('<im' + 'g width=0 height=0 src="' + prefix + 'www.jumpstarttaggingsolutions.com/tracking/goals.php?' + urlparams + '&' + Math.random() + '" />');
	        }
        },

        setSslLocation: function(loc)
        {
            this.sslLocation = loc;
        }

    };

    var public = {

        setDfpXspTag: function(dfpXspId)
        {
            private.dfpXspId = dfpXspId;
        },

        setDfaTag: function(dfaTagSrc, dfaTagType, dfaTagCat)
        {
            private.dfaTagSrc = dfaTagSrc;
            private.dfaTagType = dfaTagType;
            private.dfaTagCat = dfaTagCat;
        },

        setDfpTag: function(dfpTagSrc, dfpTagType, dfpTagCat)
        {
            private.dfpTagSrc = dfpTagSrc;
            private.dfpTagType = dfpTagType;
            private.dfpTagCat = dfpTagCat;
        },

        setGoalId: function(goalId)
        {
            private.goalId = goalId;
        },

        setGoogleGoal: function(googleGoal)
        {
            private.googleGoal = googleGoal;
        },

        writeTags: function()
        {
            var location = private.sslLocation;
            var goalId = private.goalId;
            var googleGoal = private.googleGoal;
            var dfpXspId = private.dfpXspId;
            var dfaTagSrc = private.dfaTagSrc;
            var dfaTagType = private.dfaTagType;
            var dfaTagCat = private.dfaTagCat;
            var dfpTagSrc = private.dfpTagSrc;
            var dfpTagType = private.dfpTagType;
            var dfpTagCat = private.dfpTagCat;
            var axel = Math.random()+"";
            var ord = axel * 10000000000000;
            var jsSession = private.getCookie("jstrack");

            if (jsSession != null && jsSession != "") {
            	private.goalPixel(location, goalId, jsSession);
            }

            if (dfpXspId) {
                private.createDfpXspTag(location, dfpXspId, ord);
            }

            if (dfaTagSrc, dfaTagType, dfaTagCat) {
                private.createDfaTag(location, dfaTagSrc, dfaTagType, dfaTagCat, ord);
            }

            if (dfpTagSrc, dfpTagType, dfpTagCat) {
                private.createDfpTag(location, dfpTagSrc, dfpTagType, dfpTagCat, ord);
            }

            if (typeof _jsGeneralTag == 'object') {
                var googleAccount = _jsGeneralTag.getGoogleAccount();
                if (googleAccount) {
                    try {
                        pageTracker._trackPageview(googleGoal);
                    } catch(err) {
                    }
                }
            }
        }

    };

    private.setSslLocation(private.detectSsl());

    return public;

}

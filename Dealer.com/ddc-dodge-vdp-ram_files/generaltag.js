function _jsMakeGeneralTag() {
    var generalTag = JumpstartGeneralTag();

    //To activate Jumpstart Tracking, uncomment the next two lines and fill in the Dealer ID.
    var dealerId = "2091";
    generalTag.setDealerId(dealerId);

    //To activate the Google Analytics Tag, uncomment the next two lines and fill in the Analytics Account ID.
    //var googleAccount = "UA-XXXXXXX-X";
    //generalTag.setGoogleAccount(googleAccount);

    //To activate the VoiceStar JavaScript Number Rewriter, uncomment the next two lines and fill in the VoiceStar account ID.
    //var voiceStarAccount = "XXXXXXXXXXXXXXXX";
    //generalTag.setVoiceStarAccount(voiceStarAccount);

    //To activate the Revenue Science Tag, uncomment the next two lines and fill in the Revenue Science Category Name
    //var revSciName = "XXXXXXXXXXX";
    //generalTag.setRevSciName(revSciName);

    //To activate the AdX BFP Tag, uncomment the next two lines and fill in the AdX BFP Segment ID
    //var adXBfpSegmentId = "XXXXXX";
    //generalTag.setAdXBfpSegmentId(adXBfpSegmentId);

    //To put a DFP Activity XSP ID General tag, uncomment and fill in the values below.
    var dfpGeneralXsp = "590186";
    generalTag.setDfpGeneralXspTag(dfpGeneralXsp);

    //To put a DFP Activity XSP ID Dealer tag, uncomment and fill in the values below.
    //var dfpDealerXsp = "XXXXXXX";
    //generalTag.setDfpDealerXspTag(dfpDealerXsp);

    //To activate DFA Floodlight tag that measures uniques, uncomment and fill in the values below.
    //var dfaUniqueTagSrc = "XXXXXX";
    //var dfaUniqueTagType = "XXXXXX";
    //var dfaUniqueTagCat = "XXXXXX";
    //generalTag.setDfaUniqueTag(dfaUniqueTagSrc, dfaUniqueTagType, dfaUniqueTagCat);

    //To put a normal DFA Floodlight tag in the general tag, uncomment and fill in the values below.
    //var dfaCustomTagSrc = "XXXXXX";
    //var dfaCustomTagType = "XXXXXX";
    //var dfaCustomTagCat = "XXXXXX";
    //generalTag.setDfaCustomTag(dfaCustomTagSrc, dfaCustomTagType, dfaCustomTagCat);

    //To activate DFP Spotlight tag that measures uniques, uncomment and fill in the values below.
    //var dfpUniqueTagSrc = "XXXXXX";
    //var dfpUniqueTagType = "XXXXXX";
    //var dfpUniqueTagCat = "XXXXXX";
    //generalTag.setDfpUniqueTag(dfpUniqueTagSrc, dfpUniqueTagType, dfpUniqueTagCat);

    //To put a normal DFP Spotlight tag in the general tag, uncomment and fill in the values below.
    //var dfpCustomTagSrc = "XXXXXX";
    //var dfpCustomTagType = "XXXXXX";
    //var dfpCustomTagCat = "XXXXXX";
    //generalTag.setDfpCustomTag(dfpCustomTagSrc, dfpCustomTagType, dfpCustomTagCat);

    return generalTag;
}

_jsGeneralTag = _jsMakeGeneralTag();
vs_account_id = _jsGeneralTag.getVoiceStarAccount();
_jsGeneralTag.writeTags();

function JumpstartGeneralTag()
{
    var private = {
        sslLocation: "insecure",
        dealerId: null,
        googleAccount: null,
        voiceStarAccount: null,
        revSciName: null,
        adXBfpSegmentId: null,
        dfpGeneralXsp: null,
        dfpDealerXsp: null,
        dfaUserId: null,
        dfaUniqueTagSrc: null,
        dfaUniqueTagType: null,
        dfaUniqueTagCat: null,
        dfaCustomTagSrc: null,
        dfaCustomTagType: null,
        dfaCustomTagCat: null,
        dfpUserId: null,
        dfpUniqueTagSrc: null,
        dfpUniqueTagType: null,
        dfpUniqueTagCat: null,
        dfpCustomTagSrc: null,
        dfpCustomTagType: null,
        dfpCustomTagCat: null,
        searchUserId: null,
        searchSource: null,
        searchMedium: null,
        searchKeyword: null,

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

        setCookie: function(c_name, value, days)
        {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = ' ;expires=' + date.toGMTString();
            var path = ' ;path=/';
            document.cookie = c_name + '=' + value + expires + path;
        },
        
        getUrlParameter: function(name)
        {
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\?&]"+name+"=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if(results == null) {
                return "";
            } else {
                return results[1];
            }
        },

        createUniqueString: function()
        {
            var mydate = new Date;
            var myday = mydate.getDate();
            var mymonth = mydate.getMonth()+1;
            var myyear = ((mydate.getYear() < 100) ? "19" : "") + mydate.getYear();
            var myyear = myyear.substring(2,4);
            var myhour = mydate.getHours();
            var myminutes = mydate.getMinutes();
            var myseconds = mydate.getSeconds();
            if(myday < 10) myday = "0" + myday;
            if(mymonth < 10) mymonth = "0" + mymonth;
            if(myhour < 10) myhour = "0" + myhour;
            if(myminutes < 10) myminutes = "0" + myminutes;
            if(myseconds < 10) myseconds = "0" + myseconds;
            var datearray = new Array(mymonth,myday,myyear,myhour,myminutes,myseconds);
            var uniq = "";
            for(i=0;i<datearray.length;i++){
                for(z=0;z<2;z++){
                    var which = Math.round(Math.random()*1);
                    if(which==0){
                        x = String.fromCharCode(64 + (Math.round(Math.random()*25)+1));
                    } else {
                        x = String.fromCharCode(47 + (Math.round(Math.random()*9)+1));
                    }
                    uniq += x;
                }
                uniq += datearray[i];
            }
            return uniq;
        },

        createGoogleTag: function(sslLocation)
        {
            if(sslLocation == 'secure') {
                var gprefix = 'https://ssl.';
                var prefix = 'https://';
            } else {
                var gprefix = 'http://www.';
                var prefix = 'http://';
            }
            try {
                var gtag=document.createElement('script');
                gtag.src= gprefix + 'google-analytics.com/ga.js';
                document.getElementsByTagName('head')[0].appendChild(gtag);
                activateGoogleTag();
            } catch(err) {       
                document.write('<scr' + 'ipt type="text/javascript" language="Javascript" src="'+ gprefix +'google-analytics.com/ga.js"></scr' + 'ipt>');
                document.write('<scr' + 'ipt type="text/javascript" language="Javascript" src="' + prefix + 'www.jumpstarttaggingsolutions.com/tags/oogaactivate.js"></scr' + 'ipt>');
            }
        },

        activateGoogleTag: function(sslLocation)
        {
            if (sslLocation == 'secure') {
                var prefix = 'https://';
            } else {
                var prefix = 'http://';
            }
            var gact=document.createElement('script');
            gact.src= prefix + 'www.jumpstarttaggingsolutions.com/tags/oogaactivate.js';
            document.getElementsByTagName('head')[0].appendChild(gact);
        },

        createVoicestarTag: function(sslLocation)
        {
            if (sslLocation == 'secure') {
                var vsprefix = 'https://www.';
            } else {
                var vsprefix = 'http://jumpstartautomotive.';
            }
            try {
				var vstag=document.createElement('script');
				vstag.src= vsprefix + 'voicestar.com/euinc/number-changer.js';
				document.getElementsByTagName('head')[0].appendChild(vstag);
            } catch(err){
                document.write('<scr' + 'ipt type="text/javascript" src="' + vsprefix + 'voicestar.com/euinc/number-changer.js"></scr' + 'ipt>');
            }
        },

        createRevsciTag: function(sslLocation)
        {
            if (sslLocation == 'secure') {
                var prefix = 'https://';
            } else {
                var prefix = 'http://';
            }
            try {
            	// New csid = H05525 -- old csid = H06572 (still redirects)
                var rstag=document.createElement('script');
                rstag.src= prefix + 'js.revsci.net/gateway/gw.js?csid=H05525';
                document.getElementsByTagName('head')[0].appendChild(rstag);
                activateRevsciTag();
            } catch(err) {
            	document.write('<scr' + 'ipt type="text/javascript" language="Javascript" src="' + prefix + 'js.revsci.net/gateway/gw.js?csid=H05525"></scr' + 'ipt>');
                document.write('<scr' + 'ipt type="text/javascript" language="Javascript" src="' + prefix + 'www.jumpstarttaggingsolutions.com/tags/oorevsciactivate.js"></scr' + 'ipt>');
            }
        },

        activateRevsciTag: function(sslLocation)
        {
            if (sslLocation == 'secure') {
                var prefix = 'https://';
            } else {
                var prefix = 'http://';
            }
            var rsact=document.createElement('script');
            rsact.src= prefix + 'www.jumpstarttaggingsolutions.com/tags/oorevsciactivate.js';
            document.getElementsByTagName('head')[0].appendChild(rsact);
        },

        createAdXBfpTag: function(sslLocation, segid, ord)
        {
            if(sslLocation == 'secure') {
                var prefix = 'https://';
            } else {
                var prefix = 'http://';
            }
            var segid = segid;
            var ord = ord;
			var adxBfpImg=document.createElement('img');
			adxBfpImg.width = '1';
			adxBfpImg.height = '1';
			adxBfpImg.border = '0';
			adxBfpImg.src = prefix + 'pubads.g.doubleclick.net/activity;dc_iu=/2909/bfppix.dfp;dc_seg=' + segid + ';ord=' + ord + '?';

			if (document.getElementsByTagName('body')[0] !== undefined) {
				document.getElementsByTagName('body')[0].appendChild(adxBfpImg);
			} else if (document.getElementsByTagName('head')[0] !== undefined) {
				document.getElementsByTagName('head')[0].appendChild(adxBfpImg);
			} else {
				var adxBfpImgW = '<im' + 'g src="' + prefix + 'pubads.g.doubleclick.net/activity;dc_iu=/2909/bfppix.dfp;';
				adxBfpImgW = adxBfpImgW + 'dc_seg=' + segid + ';ord=' + ord;
				adxBfpImgW = adxBfpImgW + '?" width="1" height="1" border="0" alt="" />';
				document.write(adxBfpImgW);
			}
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

        jsPixel: function(sslLocation, dealerId, session, source, medium, keyword)
        {
            if (sslLocation == 'secure') {
                var prefix = 'https://';
            } else {
                var prefix = 'http://';
            }
            var urlparams = 'jssession=' + session + '&';
            urlparams = urlparams + 'jsdealer=' + dealerId + '&';
            urlparams = urlparams + 'jssource=' + source + '&';
            urlparams = urlparams + 'jsmedium='  + medium + '&';
            urlparams = urlparams + 'jskeyword=' + keyword;
            try {
                var appgen=document.createElement('img');
                appgen.width='0';
                appgen.height='0';
                appgen.src= prefix + 'www.jumpstarttaggingsolutions.com/tracking/general.php?' + urlparams;
                document.getElementsByTagName('head')[0].appendChild(appgen);
            } catch(err) {
                document.write('<im' + 'g width=0 height=0 src="' + prefix + 'www.jumpstarttaggingsolutions.com/tracking/general.php?' + urlparams + '">');
            }
        },

        setSslLocation: function(loc)
        {
            this.sslLocation = loc;
        }

    };

    var public = {

        setDealerId: function(dealerId)
        {
            private.dealerId = dealerId;
        },

        getGoogleAccount: function()
        {
            return private.googleAccount;
        },

        setGoogleAccount: function(googleAccount)
        {
            private.googleAccount = googleAccount;
        },

        getVoiceStarAccount: function()
        {
            return private.voiceStarAccount;
        },

        setVoiceStarAccount: function(voiceStarAccount)
        {
            private.voiceStarAccount = voiceStarAccount;
        },

        getRevSciName: function()
        {
            return private.revSciName;
        },

        setRevSciName: function(revSciName)
        {
            private.revSciName = revSciName;
        },

        getAdXBfpSegmentId: function()
        {
            return private.adXBfpSegmentId;
        },

        setAdXBfpSegmentId: function(adXBfpSegmentId)
        {
            private.adXBfpSegmentId = adXBfpSegmentId;
        },

        setDfpGeneralXspTag: function(dfpGeneralXsp)
        {
            private.dfpGeneralXsp = dfpGeneralXsp;
        },

        setDfpDealerXspTag: function(dfpDealerXsp)
        {
            private.dfpDealerXsp = dfpDealerXsp;
        },

        setDfaUniqueTag: function(dfaUniqueTagSrc, dfaUniqueTagType, dfaUniqueTagCat)
        {
            private.dfaUniqueTagSrc = dfaUniqueTagSrc;
            private.dfaUniqueTagType = dfaUniqueTagType;
            private.dfaUniqueTagCat = dfaUniqueTagCat;
        },

        setDfaCustomTag: function(dfaCustomTagSrc, dfaCustomTagType, dfaCustomTagCat)
        {
            private.dfaCustomTagSrc = dfaCustomTagSrc;
            private.dfaCustomTagType = dfaCustomTagType;
            private.dfaCustomTagCat = dfaCustomTagCat;
        },

        setDfpUniqueTag: function(dfpUniqueTagSrc, dfpUniqueTagType, dfpUniqueTagCat)
        {
            private.dfpUniqueTagSrc = dfpUniqueTagSrc;
            private.dfpUniqueTagType = dfpUniqueTagType;
            private.dfpUniqueTagCat = dfpUniqueTagCat;
        },

        setDfpCustomTag: function(dfpCustomTagSrc, dfpCustomTagType, dfpCustomTagCat)
        {
            private.dfpCustomTagSrc = dfpCustomTagSrc;
            private.dfpCustomTagType = dfpCustomTagType;
            private.dfpCustomTagCat = dfpCustomTagCat;
        },

        getSslLocation: function()
        {
            return private.sslLocation;
        },

        getSearchSourceFromCookie: function()
        {
            var searchSource = private.getCookie('jssource');
            return searchSource;
        },

        getSearchMediumFromCookie: function()
        {
            var searchMedium = private.getCookie('jsmedium');
            return searchMedium;
        },

        getSearchKeywordFromCookie: function()
        {
            var searchKeyword = private.getCookie('jskeyword');
            return searchKeyword;
        },

        getSearchSessionFromCookie: function()
        {
            var searchSession = private.getCookie('jstrack');
            return searchSession;
        },

        goalSubmit: function(goalNumber)
        {
            var location = private.sslLocation;
            if(location == 'secure') {
                var prefix = 'https://';
            } else {
                var prefix = 'http://';
            }
            var jsSession = private.getCookie('jstrack');
            if (jsSession != null && jsSession != '') {
                var goal = goalNumber;
                var urlparams = 'jssession=' + jsSession + '&';
                urlparams = urlparams + "goal=" + goal;
                var apptag=document.createElement('img');
                apptag.width='0';
                apptag.height='0';
                apptag.src= prefix + 'www.jumpstarttaggingsolutions.com/tracking/goals.php?' + urlparams + '&' + Math.random();
                document.getElementsByTagName('head')[0].appendChild(apptag);
            }
        },

        linkValues: function(linkurl)
        {
	        var testurl = linkurl;
	        var questionMarkResult = testurl.search(/\?/);
	        if (questionMarkResult != -1) {
		        var questionOrAmpersand = '&';
	        } else {
		        var questionOrAmpersand = '?';
	        }
	        var jsSourceCookie = private.getCookie('jssource');
	        var jsMediumCookie = private.getCookie('jsmedium');
            var jsKeywordCookie = private.getCookie('jskeyword');
	        if (jsSourceCookie != null && jsSourceCookie != "") {
			        window.open(linkurl + questionOrAmpersand + "_jssource=" + jsSourceCookie + "&_jsmedium=" + jsMediumCookie + "&_jskeyword=" + jsKeywordCookie);
	        }
	        else {
		        window.open(linkurl);
	        }
        },

        linkSession: function(linkurl)
        {
	        var testurl = linkurl;
	        var questionMarkResult = testurl.search(/\?/);
	        if (questionMarkResult != -1) {
		        var questionOrAmpersand = '&';
	        } else {
		        var questionOrAmpersand = '?';
	        }
	        var jsCookie = private.getCookie('jstrack');
	        if (jsCookie != null && jsCookie != "") {
		        window.open(linkurl + questionOrAmpersand + "_jscookie=" + jsCookie);
	        }
	        else {
		        window.open(linkurl);
	        }
        },

        writeTags: function()
        {
            var location = private.sslLocation;
            var dealerId = private.dealerId;
            var googleAccount = private.googleAccount;
            var voiceStarAccount = private.voiceStarAccount;
            var revSciName = private.revSciName;
            var adXBfpSegmentId = private.adXBfpSegmentId;
            var dfpGeneralXsp = private.dfpGeneralXsp
            var dfpDealerXsp = private.dfpDealerXsp
            var dfaUniqueTagSrc = private.dfaUniqueTagSrc
            var dfaUniqueTagType = private.dfaUniqueTagType
            var dfaUniqueTagCat = private.dfaUniqueTagCat
            var dfaCustomTagSrc = private.dfaCustomTagSrc
            var dfaCustomTagType = private.dfaCustomTagType
            var dfaCustomTagCat =  private.dfaCustomTagCat
            var dfpUniqueTagSrc = private.dfpUniqueTagSrc
            var dfpUniqueTagType = private.dfpUniqueTagType
            var dfpUniqueTagCat = private.dfpUniqueTagCat
            var dfpCustomTagSrc = private.dfpCustomTagSrc
            var dfpCustomTagType = private.dfpCustomTagType
            var dfpCustomTagCat =  private.dfpCustomTagCat

            var jumpstartSource = private.getUrlParameter('_jssource');
            var jumpstartMedium = private.getUrlParameter('_jsmedium');
            var jumpstartKeyword = private.getUrlParameter('_jskeyword');
            var linkedCookie = private.getUrlParameter('_jscookie');
            
            if (linkedCookie != null && linkedCookie != '') {
                private.setCookie('jstrack', linkedCookie, 365);
            }

            if (jumpstartSource != null && jumpstartSource != '' && dealerId != null) {
                var jumpstartSession = private.createUniqueString();
                private.searchUserId = jumpstartSession;
                private.setCookie('jstrack', jumpstartSession, 365);
                private.setCookie('jssource', jumpstartSource, 365);
                private.setCookie('jsmedium', jumpstartMedium, 365);
                private.setCookie('jskeyword', jumpstartKeyword, 365);
                private.jsPixel(location, dealerId, jumpstartSession, jumpstartSource, jumpstartMedium, jumpstartKeyword);
            }

            if (googleAccount) {
                private.createGoogleTag(location);
            }

            if (voiceStarAccount) {
                private.createVoicestarTag(location);
            }

            if (revSciName) {
                private.createRevsciTag(location);
            }

            if (adXBfpSegmentId) {
               var randomString = private.createUniqueString();
               private.createAdXBfpTag(location, adXBfpSegmentId, randomString);
            }

            if (dfpGeneralXsp) {
                var randomString = private.createUniqueString();
                private.createDfpXspTag(location, dfpGeneralXsp, randomString);
            }

            if (dfpDealerXsp) {
                var randomString = private.createUniqueString();
                private.createDfpXspTag(location, dfpDealerXsp, randomString);
            }

            if (dfaUniqueTagSrc, dfaUniqueTagType, dfaUniqueTagCat) {
                var dfaUserId = private.getCookie('jsunique');
                if (!dfaUserId) {
                    dfaUserId = private.createUniqueString();
                    private.setCookie('jsunique', dfaUserId, 365);
                }
                private.dfaUserId = dfaUserId;
                private.createDfaTag(location, dfaUniqueTagSrc, dfaUniqueTagType, dfaUniqueTagCat, dfaUserId);
            }

            if (dfaCustomTagSrc, dfaCustomTagType, dfaCustomTagCat) {
                var randomString = private.createUniqueString();
                private.createDfaTag(location, dfaCustomTagSrc, dfaCustomTagType, dfaCustomTagCat, randomString);
            }

            if (dfpUniqueTagSrc, dfpUniqueTagType, dfpUniqueTagCat) {
                var dfpUserId = private.getCookie('jsunique');
                if (!dfpUserId) {
                    dfpUserId = private.createUniqueString();
                    private.setCookie('jsunique', dfpUserId, 365);
                }
                private.dfpUserId = dfpUserId;
                private.createDfpTag(location, dfpUniqueTagSrc, dfpUniqueTagType, dfpUniqueTagCat, dfpUserId);
            }

            if (dfpCustomTagSrc, dfpCustomTagType, dfpCustomTagCat) {
                var randomString = private.createUniqueString();
                private.createDfpTag(location, dfpCustomTagSrc, dfpCustomTagType, dfpCustomTagCat, randomString);
            }
        }

    };

    private.setSslLocation(private.detectSsl());

    return public;

}

function jsGoalSubmit(goalnumber)
{
    var loc = _jsGeneralTag.getSslLocation();
    if(loc == 'secure') {
        var prefix = 'https://';
    } else {
        var prefix = 'http://';
    }
    var jsSession = _jsGeneralTag.getSearchSessionFromCookie();
    if (jsSession != null && jsSession != '') {
        var goal = goalnumber;
        var urlparams = 'jssession=' + jsSession + '&';
        urlparams = urlparams + "goal=" + goal;
        var apptag=document.createElement('img');
        apptag.width='0';
        apptag.height='0';
        apptag.src= prefix + 'www.jumpstarttaggingsolutions.com/tracking/goals.php?' + urlparams + '&' + Math.random();
        document.getElementsByTagName('head')[0].appendChild(apptag);
    }
}

function jsLinkValues(linkurl)
{
	var testurl = linkurl;
	var questionMarkResult = testurl.search(/\?/);
	if (questionMarkResult != -1) {
		var questionOrAmpersand = '&';
	} else {
		var questionOrAmpersand = '?';
	}
	var jsSourceCookie = _jsGeneralTag.getSearchSourceFromCookie();
	var jsMediumCookie = _jsGeneralTag.getSearchMediumFromCookie();
    var jsKeywordCookie = _jsGeneralTag.getSearchKeywordFromCookie();
	if (jsSourceCookie != null && jsSourceCookie != "") {
			window.open(linkurl + questionOrAmpersand + "_jssource=" + jsSourceCookie + "&_jsmedium=" + jsMediumCookie + "&_jskeyword=" + jsKeywordCookie);
	}
	else {
		window.open(linkurl);
	}
}

function jsLink(linkurl)
{
	var testurl = linkurl;
	var questionMarkResult = testurl.search(/\?/);
	if (questionMarkResult != -1) {
		var questionOrAmpersand = '&';
	} else {
		var questionOrAmpersand = '?';
	}
	var jsCookie = _jsGeneralTag.getSearchSessionFromCookie();
	if (jsCookie != null && jsCookie != "") {
		window.open(linkurl + questionOrAmpersand + "_jscookie=" + jsCookie);
	}
	else {
		window.open(linkurl);
	}
}

function gup(name)
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if(results == null) {
        return "";
    } else {
        return results[1];
    }
}

var _vls = _vls || {};

var _vinLens = (function() {

    var siteType = { noType: -1, vinAdvanced: 0, vinCms: 1, DDC: 2 };
    var vinLensError = new Error();
    var vinLensStoredAamHash = "vlStoredAamHash";
    var vinLensPixel = "vinLensPixel";
    var vinLensCookieName = "lmc";
    var vinLensVisitCreatedUtc = "vlVisitCreatedUtc";

    function logAudienceManagerObject(vinLensAccountId, visitTrackingToken, aamObj) {
        if (!vinLensAccountId || !visitTrackingToken || !aamObj) return;

        var xmlhttp;

        if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.open("POST", "http://vinlens.com/Services/AudienceManager.asmx/LogObject", true);
        xmlhttp.setRequestHeader("Content-type", "application/json");

        xmlhttp.send(JSON.stringify({
            vinLensAccountId: vinLensAccountId,
            visitTrackingToken: visitTrackingToken,
            aamObject: aamObj
        }));
    };

    function getStoredHash() {
        return readCookie(vinLensStoredAamHash) || "";
    };

    function setStoredHash(hash) {
        if (hash == null || hash === "") return;

        createCookie(vinLensStoredAamHash, hash);
    }

    function getAamObjToSend(aamObj) {
        // clone object
        var newAamObj = JSON.parse(JSON.stringify(aamObj));

        // reorder arrays
        if (newAamObj.traits) newAamObj.traits = newAamObj.traits.sort();
        if (newAamObj.stuff) newAamObj.stuff = newAamObj.stuff.sort();
        if (newAamObj.segments) newAamObj.segments = newAamObj.segments.sort();
        if (newAamObj.dpm) newAamObj.dpm = newAamObj.dpm.sort();

        // hash aamObj
        var newHash = md5(JSON.stringify(newAamObj));

        // Get stored hash
        var storedHash = getStoredHash();

        // Do they match? Return null
        if (storedHash === newHash) return null;

        // Store new hash
        setStoredHash(newHash);

        return JSON.stringify(aamObj);
    };

    function readCookie(name) {
        var nameEq = name + "=";

        var ca = document.cookie.split(";");

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) === " ") c = c.substring(1, c.length);

            if (c.indexOf(nameEq) === 0) return c.substring(nameEq.length, c.length);
        }
        return null;
    }

    function createCookie(name, value, days) {
        var expires = "";

        if (days) {
            var date = new Date();

            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

            expires = "; expires=" + date.toGMTString();
        }

        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function createPixel(url, id) {
        var oImg = document.createElement("img");

        if (id != null && id !== "") oImg.setAttribute("ID", id);

        oImg.setAttribute("src", url);
        oImg.setAttribute("height", "1px");
        oImg.setAttribute("width", "1px");

        document.body.appendChild(oImg);
    }

    function vlTracker() {
        window.vinLensFired = true;
        try {

            var host = determineWebHostSiteType();
            if (host === siteType.noType) {
                vinLensError.message = "Could not determine Website Provider (e.g. VinSolutions VAW/CMS, DDC, etc).";
                throw vinLensError;
            }

            _vls.vinLensAccountId = gatherVinLensAccountId(host);
            if (!_vls.vinLensAccountId) {
                vinLensError.message = "Could not determine VinLens Account Id.";
                throw vinLensError;
            }

            //get or build magic cookie
            _vls.magic = getVisitTrackingToken(_vls.vinLensAccountId);
            if (_vls.magic == null || _vls.magic === "") {
                vinLensError.message = "Could not set/read Visit Tracking Token.";
                throw vinLensError;
            }

            //get and sanitize document title
            _vls.title = removeHtmlTagsFromTitle(document.title);

            //get google cookie
            _vls.gaUmtc = getGoogleCookie();

            //get websiteformid if _vls.wlfid is not already valued
            if (window.wlfid && typeof _vls.wlfid === "undefined") _vls.wlfid = window.wlfid;

            //get autoid if _vls.ai/vin is not already valued
            if (host === siteType.DDC) _vls.vin = _vls.vin || gatherAutoId(host);
            else _vls.ai = _vls.ai || gatherAutoId(host);


            //get referrer
            _vls.referrer = _vls.referrer || window.referrerO || document.referrer;

            var url = buildVinLensCallUrl();

            //notify if debug is active
            verifyDebugMode(url);

            //create and add to the document the 1 pixel capture element/
            //set to VinLens.com/raw.ashx and include parameters
            //url built above
            createPixel(url, vinLensPixel);


            // Call our trait tracking function
            traitTracker(_vls.magic, _vls.vinLensAccountId);
        } catch (e) {
            if (typeof _vls !== "undefined" && _vls.debug && window.console) console.error("error", e);
        }
    }

    function traitTracker(visitTrackingToken, vinLensAccountId) {
        _vls.traitCallback = function(aamObj) {
            // If there is no visit magic, or traits, we can't process anything.
            // If the browser is not ECMA-262 compatible (IE8 and below), this will not run.
            if (!aamObj) return;

            _vls.uuid = aamObj.uuid;

            aamObj.VisitTrackingToken = visitTrackingToken;

            var aamObjToSend = getAamObjToSend(aamObj);

            if (aamObjToSend) logAudienceManagerObject(vinLensAccountId, visitTrackingToken, aamObjToSend);
        };

        (function(i, s, o, g, r, a, m) {
            a = document.createElement(o);
            m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window,
            document,
            "script",
            "//cam.demdex.net/event?d_stuff=1&d_rtbd=json&d_cts=1&d_cb=_vls.traitCallback");
    }

    function determineWebHostSiteType() {
        if (typeof window.DealerSiteConfig !== "undefined") return siteType.vinAdvanced;
        else if (typeof window._di !== "undefined") return siteType.vinCms;
        else if (typeof window.DDC !== "undefined") return siteType.DDC;
        else return siteType.noType;
    }

    function gatherVinLensAccountId(websiteHostType) {
        //get vinLensAccountId if _vls does not already have one
        if (typeof _vls.vinLensAccountId !== "undefined") return _vls.vinLensAccountId;

        switch (websiteHostType) {
        case siteType.vinAdvanced:
            if (window.DealerSiteConfig) return window.DealerSiteConfig.WebSiteID;
            break;
        case siteType.vinCms:
            if (typeof window._di !== "undefined" && typeof window._di.websiteSettings !== "undefined") {
                return window._di.websiteSettings.vinSiteId;
            }
            break;
        case siteType.DDC:
            if (typeof window.DDC !== "undefined" &&
                typeof window.DDC.dataLayer !== "undefined" &&
                typeof window.DDC.dataLayer.site !== "undefined" &&
                typeof window.DDC.dataLayer.site.siteInfo !== "undefined") {
                return window.DDC.dataLayer.site.siteInfo.vinLensAccountId;
            }
            break;
        case siteType.noType:
        default:
            return null;
        }

        return undefined;
    }

    //VisitMagic == MagicCookie == lmc == VinLens Id == Visit Tracking Token
    function getVisitTrackingToken(vinLensAccountId) {

        function setVisitCreatedUtcCookie() {
            var date = new Date();

            // max visit duration = 12 hours from now
            date.setTime(date.getTime() + 12 * 60 * 60 * 1000);

            var expires = "; expires=" + date.toGMTString();

            document.cookie = vinLensVisitCreatedUtc + "=" + date.toGMTString() + expires + "; path=/;";
        }

        function setVisitTrackingToken(trackingToken) {
            var date = new Date();

            date.setTime(date.getTime() + 30 * 60 * 1000);

            var midnight = new Date();

            midnight.setHours(24, 0, 0, 0);

            if (date > midnight) date = midnight;

            var expires = "; expires=" + date.toGMTString();

            document.cookie = vinLensCookieName + "=" + trackingToken + expires + "; path=/;";
        }

        var visitCreatedUtc = readCookie(vinLensVisitCreatedUtc);

        var visitTrackingToken = readCookie(vinLensCookieName);

        if (visitTrackingToken == null ||
            visitTrackingToken === "" ||
            visitCreatedUtc == null ||
            visitCreatedUtc === "") {
            // give visitor new Visit Tracking Token
            visitTrackingToken = vinLensAccountId + "." + new Date().getTime() + "." + parseInt(Math.random() * 5000);

            // record visit created utc
            setVisitCreatedUtcCookie();
        }

        setVisitTrackingToken(visitTrackingToken);

        return readCookie(vinLensCookieName);
    }

    function removeHtmlTagsFromTitle() {
        // remove these comments once tests have been built
        // Regex: Remove xml/.Net headers from the title (ex. <this>, <that>, </other> etc.
        // Regex: brackets <> can span multiple lines
        return document.title.replace(/<(?:.|\n)*?>/gm, "");
    }

    function getGoogleCookie() {
        if (window.location.protocol === "https:") return null;

        var cookie = document.cookie.toString();
        var gaUmtc = "";

        if (cookie.indexOf("__utmc") !== -1) {
            var s = cookie.indexOf("__utmc=") + 7;
            var e = cookie.indexOf(";", s);
            if (e === -1) e = cookie.length;
            gaUmtc = cookie.substring(s, e);
        }

        return gaUmtc;
    };

    function gatherAutoId(websiteHostType) {
        switch (websiteHostType) {
        case siteType.vinAdvanced:
            if (window.ai) return window.ai;
            else if (window.DealerSiteConfig) return window.DealerSiteConfig.AutoID;
            break;
        case siteType.vinCms:
            if (window._di && window._di.auto) return window._di.auto.OldAutoId;
            break;
        case siteType.DDC:
            //page.attributes is to assure the user is not on an SRP
            if (window.DDC &&
                window.DDC.dataLayer &&
                window.DDC.dataLayer.vehicles &&
                window.DDC.dataLayer.vehicles.length > 0 &&
                window.DDC.dataLayer.page &&
                window.DDC.dataLayer.page.attributes &&
                window.DDC.dataLayer.page.attributes.vehicleResultCount == null) {
                return window.DDC.dataLayer.vehicles[0].vin;
            }
            break;
        case siteType.noType:
        default:
            break;
        }
        return undefined;
    }

    function buildVinLensCallUrl() {
        var url = "https:" === document.location.protocol ? "https://" : "http://";

        url += "vinlens.com/raw.ashx?vl_acct=" + _vls.vinLensAccountId;

        if (_vls.ai) url += "&vl_ai=" + encodeURIComponent(_vls.ai);
        if (_vls.referrer) url += "&vl_ref=" + encodeURIComponent(_vls.referrer); //referrer
        if (_vls.title) url += "&vl_pt=" + encodeURIComponent(_vls.title); //document title
        if (_vls.magic) url += "&" + vinLensCookieName + "=" + encodeURIComponent(_vls.magic); //vinlens cookie
        if (_vls.gaUmtc) url += "&vl_gg=" + encodeURIComponent(_vls.gaUmtc); //google cookie
        if (_vls.wlfid) url += "&vl_fid=" + encodeURIComponent(_vls.wlfid); //formid 
        if (_vls.vin) url += "&vl_vin=" + encodeURIComponent(_vls.vin); // VIN
        url += "&cb=" + new Date().getTime(); // cache buster

        return url;
    }

    function verifyDebugMode(url) {
        //cannot be tested due to message, once written to console, it cannot be retrieved by JavaScript
        if (!_vls.debug || !window.console) return;

        console.info("%cVinLens debugging is enabled", "color:red;font-size: 16pt");
        console.log("_vls", _vls);
        console.log("url", url);
    }

    /* MD5 Hash library - BEGIN */
    function md5Cycle(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);

    }

    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md51(s) {
        var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
        for (i = 64; i <= s.length; i += 64) {
            md5Cycle(state, md5Blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5Cycle(state, tail);
            for (i = 0; i < 16; i++) {
                tail[i] = 0;
            }
        }
        tail[14] = n * 8;
        md5Cycle(state, tail);
        return state;
    }

    /* there needs to be support for Unicode here, unless we pretend that we can redefine the MD-5 algorithm for multi-byte characters (perhaps by adding every four 16-bit characters and shortening the sum to 32 bits). Otherwise I suggest performing MD-5 as if every character was two bytes--e.g., 0040 0025 = @%--but then how will an ordinary MD-5 sum be matched? There is no way to standardize text to something like UTF-8 before transformation; speed cost is utterly prohibitive. The JavaScript standard itself needs to look at this: it should start providing access to strings as preformed UTF-8 8-bit unsigned value arrays. */

    function md5Blk(s) {
        var md5Blks = [], i;

        for (i = 0; i < 64; i += 4) {
            md5Blks[i >> 2] = s.charCodeAt(i) +
            (s.charCodeAt(i + 1) << 8) +
            (s.charCodeAt(i + 2) << 16) +
            (s.charCodeAt(i + 3) << 24);
        }
        return md5Blks;
    }

    var hexChr = "0123456789abcdef".split("");

    function rhex(n) {
        var s = "", j = 0;
        for (; j < 4; j++) {
            s += hexChr[(n >> (j * 8 + 4)) & 0x0F] + hexChr[(n >> (j * 8)) & 0x0F];
        }

        return s;
    }

    function hex(x) {
        for (var i = 0; i < x.length; i++) {
            x[i] = rhex(x[i]);
        }
        return x.join("");
    }

    function md5(s) {
        return hex(md51(s));
    }

    /* this function is much faster, so if possible we use it. Some IEs are the only ones I know of that need the idiotic second function, generated by an if clause.  */
    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }

    if (md5("hello") !== "5d41402abc4b2a76b9719d911017c592") {
        function add32(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
    }
    /* MD5 Hash library - END */

    return {
        siteType: siteType,
        vinLensError: vinLensError,
        vlTracker: vlTracker,
        determineWebHostSiteType: determineWebHostSiteType,
        gatherVinLensAccountId: gatherVinLensAccountId,
        getVisitTrackingToken: getVisitTrackingToken,
        removeHtmlTagsFromTitle: removeHtmlTagsFromTitle,
        getGoogleCookie: getGoogleCookie,
        gatherAutoId: gatherAutoId,
        buildVinLensCallUrl: buildVinLensCallUrl,
        verifyDebugMode: verifyDebugMode,
        createPixel: createPixel
    };
})();


//Call the main function for VinLens to work
if (!window.vinLensFired) _vinLens.vlTracker();
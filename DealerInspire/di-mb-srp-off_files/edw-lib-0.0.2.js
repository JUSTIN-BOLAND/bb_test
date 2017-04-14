
/****  START 1 of 11 FILE: src/main/webapp/js/package.js ****/
/*
 * added EDMUNDS here to ensure namespace exists when EDM exits as we phase out EDMUNDS.
 */
window.EDMUNDS = window.EDMUNDS || {};
window.EDM = window.EDM || {};
EDM.VERSION = 1.0;


/****  END 1 of 11 FILE: src/main/webapp/js/package.js ****/

/****  START 2 of 11 FILE: src/main/webapp/js/core/package.js ****/
window.EDM = window.EDM || {};

EDM.Core = EDM.Core || {};
EDM.Core.VERSION = 1.0;
/****  END 2 of 11 FILE: src/main/webapp/js/core/package.js ****/

/****  START 3 of 11 FILE: src/main/webapp/js/core/cookie.js ****/
/**
 * Pure JavaScript Singleton class for interacting with Cookies.  Has methods for
 * getting and setting cookie values.
 *
 *
 */
EDM.Core.Cookie = new function() {
    var self = this;

    var $L = null; // see init
    var $J = null; // see init

    var DEFAULT_EXP_MONTH = 6;
    var COOKIE_LIMIT = 1000 * 4; // a bit under 4k
    var DEFAULT_PATH = '/';

    var STR_TEST_COOKIE = 'tcook=a';

    var cookieCache = {};
    var initialized = false;

    /**
     * Returns all cookies that match a regular expression.
     *
     * @param name
     * @return {Array}
     */
    this.getMatchingCookies = function(regex){
        init();
        var matchingCookies = [];
        for (var name in cookieCache){
            if(name.match(regex)){
                matchingCookies.push({
                    "name": name,
                    "value": cookieCache[name]
                });
            }
        }
        return matchingCookies;
    };

    /**
     * Gets the cookie parsing it as a JSON object.  If nothing is found an empty
     * object is returned, null is never returned.
     *
     * @param name
     * @param options
     * @return {*}
     */
    this.getAsJson = function(name, options) {
        var str = this.getAsString(name, options);
        if(str) {
            return $J.parse(str);
        }

        return {};
    };

    /**
     * Gets the cookie as a Map parsing it as a query string.  Must start
     * with & not ? character.  If nothing is found an empty object will be returned.
     * Null is never returned.
     *
     * @param name
     * @param options
     * @return {*}
     */
    this.getAsMap = function(name, options) {
        var str = this.getAsString(name, options);
        if(str) {
            return parseQueryString(str);
        }

        return {};
    };

    /**
     * Gets the cookie value as a JSON or Map, if it is neither the a empty object is returned.
     *
     * @param {String} name the name of the cookie
     * @param {map} options key value pairs
     * @return {Object}
     */
    this.getAsObject = function(name, options) {
        init();
        var str = cookieCache[name];
        if(str) {
            if(str.match(/^\{.*\}$/)) {
                return this.getAsJson(name, options);
            } else if(str.match(/^\&.*$/)) {
                return this.getAsMap(name, options);
            }
        }

        return {};
    };

    /**
     *  Gets cookie string value or null if nothing is found.
     *
     * @param name
     * @param options
     * @return {String}
     */

    /*  TODO US135: remove dark launch  
     *  additional checking the arguments
     */
    if(window.location.href.indexOf("qa") != -1 || window.location.search.indexOf("cookiePatch") != -1) {
        this.getAsString = function(name, options) {
            if((typeof name === 'string') && name !== "") {
                init();
                if(cookieCache.hasOwnProperty(name)) {
                    return cookieCache[name];
                }
            }
            return null;
        };
    } else {
        this.getAsString = function(name, options) {
            if(name) {
                init();
                return cookieCache[name];
            }
            return null;
        };
    }

    /**
     * Gets the cookie value, doing its best to figure out, the type.  It can return
     * as a JSON object, map, or defaults to a string.
     *
     * @param name
     * @param options
     * @return {*}
     */
    this.get = function(name, options) {
        init();
        var str = cookieCache[name];
        if(str) {
            if(str.match(/^\{.*\}$/)) {
                return this.getAsJson(name, options);
            } else if(str.match(/^\&.*$/)) {
                return this.getAsMap(name, options);
            }
        }
        return this.getAsString(name, options);
    };


    /**
     * Persists the given name and value as a cookie.      *
     * @param {String} name cookie name
     * @param {Object} value cookie value.  For legacy reasons, if an object is given setAsMap will be used.  If JSON
     * is desired explicitly use setAsJson method.
     * @param {map} options Supported options are :
     * <li>exp - Date object that specifies when the cookie expires or "session".  Defaults to DEFAULT_EXP_MONTH
     * month out for today.
     * <li>path - the cookie path.
     * <li>domain - the domain of the cookie, by default all subdomains will be allowed.
     * <li>secure - flag that specifies if the cookie is secure or not.
     * <li>noencode - flag to prevent encoding of the cookie value, allows for custom encoding of values
     * (prevent double encoding)
     */
    this.set = function(name, value, options) {
        try {
            init();
            options = options || {};
            var cookie = [];
            if(typeof value == 'object') {
                this.setAsMap(name, value, options);
            } else {
                if(countBytes(value) > COOKIE_LIMIT) {
                    $L.error('Cookie ' + name + ' is too large, might not save.');
                }

                if(!options.noencode) {
                    value = encodeURIComponent(value);
                }

                cookie.push(encodeURIComponent(name) + '=' + value);

                options.exp = options.exp || getDefaultExpiration();
                if(options.exp instanceof Date) {
                    cookie.push('expires=' + options.exp.toGMTString());
                }

                var val = options.path || DEFAULT_PATH;
                cookie.push('path=' + val);

                val = (options && options.hasOwnProperty('domain')) ? options.domain : getDefaultDomain();
                cookie.push('domain=' + val);

                if(typeof(options.secure) == 'string') {
                    cookie.push('secure');
                }

                document.cookie = cookie.join('; ');
            }
        } catch(ex) {
            $L.log('exception', ex.stack, ex);
        }
    };

    /**
     * Persists the given map value as a map of values
     *
     * @param {String} name  the cookie name
     * @param {map} value key value pairs
     * @param {map of options} options currently no options are supported
     */
    this.setAsMap = function(name, value, options) {
        init();
        options = options || {};
        value = (typeof value == 'object') ? value : {};
        var str = [];
        str.push('');
        for(var k in value) {
            if(k && value[k]) {
                str.push(encodeURIComponent(k) + '=' + encodeURIComponent(value[k]));
            }
        }

        // avoid double encoding
        options.noencode = true;
        this.set(name, str.join('&'), options);
    };

    /**
     * Persists the given object as a json string
     *
     * @param {String} name  the cookie name
     * @param {Object} value object to be persisted
     * @param options options currently not supported
     */
    this.setAsJson = function(name, value, options) {
        init();
        value = (typeof value == 'object') ? value : {};
        var str = $J.stringify(value);
        this.set(name, str, options);
    };

    /**
     * Delete the cookie by expiring it
     *
     * @param {String} name the name of the cookie
     */
    this.remove = function(name, options) {
        init();
        var options = options || {};
        options.exp = new Date(0);

        this.set(name, '', options);
    };

    /**
     * Convenience function to test if cookies are enabled in the
     * browser or not.
     * @return {boolean} true if cookies are enabled in the browser,
     * false otherwise.
     */
    this.isSupported = function() {
        if(navigator.cookieEnabled === true) {
            return true;
        } else if(document.cookie.indexOf(STR_TEST_COOKIE) >= 0) {
            return true;
        } else {
            document.cookie = STR_TEST_COOKIE;
            return (document.cookie.indexOf('tcook=a') >= 0);
        }
    };


    /**
     * Parses the "map" of values string and turns a map
     * @param {String} str string to be parsed
     *
     * @return {map}
     */
    var parseQueryString = function(str) {
        var toReturn = {};
        //replace start, end quotes
        str = str.replace(/^\"|\"$/g, '');
        var split = str.split('&');
        var parts;
        for(var i = 0, len = split.length; i < len; i++) {
            parts = split[i].split('=');
            if(parts && parts.length) {
                if(parts[0]) {
                    toReturn[parts[0]] = parts.slice(1).join('=');
                }
            }
        }

        return toReturn;
    };

    /**
     * Preps the object and caches the cookies
     */
    var init = function() {
        if(!initialized || arguments[0] === true) {
            $L = EDM.Core.Logger;

            $J = window.JSON;
            // if no naive json use non-intrusive path
            if(!$J || !$J.parse || !$J.stringify) {
                JSONPatch();
            }

            initialized = true;
        }

        // parse every time since cookies can get updated without this class knowing
        cookieCache = parseCookies();
    };

    /**
     * parses the cookies from the document
     *
     * @return {map} the parsed cookies
     */
    var parseCookies = function() {
        var cookieCache = {};
        var cookies = document.cookie.split(/;\s/g);
        if(cookies && cookies.length) {

            var parts;
            var name;
            var value;
            for(var i = 0, len = cookies.length; i < len; i++) {
                parts = cookies[i].split('=');
                if(parts.length) {
                    name = decodeURIComponent(parts[0]);
                    value = decodeURIComponent(parts.slice(1).join('='));
                    cookieCache[name] = value;
                }
            }
        }

        return cookieCache;
    };

    /**
     * Default domain is the current domain and any subdomains.
     *
     * @return {String}
     */
    var getDefaultDomain = function() {
        var host = document.location.host;
        var split = host.split('.');
        if(split.length == 3) {
            host = '.' + split.slice(1).join('.');
        } else if(split.length == 2) {
            host = '.' + split.join('.');
        }

        return host;
    };

    var getDefaultExpiration = function() {
        var date = new Date();
        date.setUTCMonth(date.getUTCMonth() + DEFAULT_EXP_MONTH);
        return date;
    };

    /**
     * calculate the bytes size of the given string
     *
     * @param {String} string
     *
     * @return {Number}
     */
    var countBytes = function(string) {
        var str = encodeURI(string);
        if(str.indexOf("%") != -1) {
            var count = str.split("%").length - 1;
            count = count === 0 ? 1 : count;
            count = count + (str.length - (count * 3));
        }
        else {
            count = str.length;
        }

        return count;
    };

    var JSONPatch = function() {
        $J = {};
        // modded version of /core/browser-compatability/json/json2.js
        // do not want to take over window.JSON due to 3rd party (non edmunds property) dependencies
        (function() {
            function f(a) {
                return 10 > a ? "0" + a : a
            }

            function quote(a) {
                return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function(a) {
                    var b = meta[a];
                    return"string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + a + '"'
            }

            function str(a, b) {
                var c, d, e, f, h, g = gap, i = b[a];
                switch(i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
                    case"string":
                        return quote(i);
                    case"number":
                        return isFinite(i) ? i + "" : "null";
                    case"boolean":
                    case"null":
                        return i + "";
                    case"object":
                        if(!i)return"null";
                        if(gap += indent, h = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                            for(f = i.length, c = 0; f > c; c += 1)h[c] = str(c, i) || "null";
                            return e = 0 === h.length ? "[]" : gap ? "[\n" + gap + h.join(",\n" + gap) + "\n" + g + "]" : "[" + h.join(",") + "]", gap = g, e
                        }
                        if(rep && "object" == typeof rep)for(f = rep.length, c = 0; f > c; c += 1)"string" == typeof rep[c] && (d = rep[c], e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e)); else for(d in i)Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e));
                        return e = 0 === h.length ? "{}" : gap ? "{\n" + gap + h.join(",\n" + gap) + "\n" + g + "}" : "{" + h.join(",") + "}", gap = g, e
                }
            }

            "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
            }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
                return this.valueOf()
            });
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {"\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, rep;
            "function" != typeof $J.stringify && ($J.stringify = function(a, b, c) {
                var d;
                if(gap = "", indent = "", "number" == typeof c)for(d = 0; c > d; d += 1)indent += " "; else"string" == typeof c && (indent = c);
                if(rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length))throw Error("$J.stringify");
                return str("", {"": a})
            }), "function" != typeof $J.parse && ($J.parse = function(text, reviver) {
                function walk(a, b) {
                    var c, d, e = a[b];
                    if(e && "object" == typeof e)for(c in e)Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), void 0 !== d ? e[c] = d : delete e[c]);
                    return reviver.call(a, b, e)
                }

                var j;
                if(text += "", cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(a) {
                    return"\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({"": j}, "") : j;
                throw new SyntaxError("$J.parse")
            });
        }());
    };
}
/****  END 3 of 11 FILE: src/main/webapp/js/core/cookie.js ****/

/****  START 4 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/package.js ****/
EDM.EdwPartner = EDM.EdwPartner||{"VERSION":1.0};
/****  END 4 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/package.js ****/

/****  START 5 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/edw-context-factory.js ****/
/**
 * Factory class to generate edw context values used for tracking
 *
 * @requires EDM.EdwPartner.EdwPartnerContext
 */
EDM.EdwPartner.EdwContextFactory = new function(){
    var self = this;

    var PARTNER_EDMUNDS = 'edmunds';

    /**
     * Generates edw context values specific to the partner and page.
     *
     * @param {String} partnerId
     * @param {Window} _window optional window value used to get values
     * @param {Document} _document optional Document used to get valeus
     * @param {Object} options map of key/value pairs used to override any auto generated context values
     * @return {*}
     */
    this.createContext = function(partnerId, _window, _document, options){
        if(partnerId === PARTNER_EDMUNDS){
            return new EDM.EdwPartner.EdwPartnerContext(partnerId, _window, _document, options);
        }

        return new EDM.EdwPartner.EdwPartnerContext(partnerId, _window, _document, options);
    };
};
/****  END 5 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/edw-context-factory.js ****/

/****  START 6 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/xedw-partner-context.js ****/
/**
 * Class for generating an EDW context for an edw Partner.
 *
 * @requires EDM.EdwPartner.EdwVisitor
 */
EDM.EdwPartner.EdwPartnerContext = function(partnerId, _window, _document, options){
    var self = this;

    var EDW_PARTNER_URL = (window.location.protocol.indexOf("https") == -1)?'http://www.edmunds.com/cgi-bin/edw_partner.cgi':'https://secure.edmunds.com/cgi-bin/edw_partner.cgi';

    // in case we are in an iframe handling source iframes
    try { 
        if(!_window && window.top && window.top.document){
            _window = window.top;
        }
    } catch(ex) {
        _window = window;
    }
    _document = _document||_window.document;

    /**
     * Asynchronous call to gathers all relevant values to given context to the edw tracking event
     *
     * @param {Function} cb callback function which contains the context object as its first argument
     * @return void
     */
    this.generateContext = function(cb){

        EDM.EdwPartner.EdwVisitor.createSession(function(){
            var context = {};
            context.edwsynpartner = partnerId;

            generatePageContext(context, _window, _document);
            generateVisitorContext(context);
            generateAdvertisingContext(context, _window, _document);
            generateVehicleContext(context, _document);

            // options overrides/creates anything generated
            if(options){
                for(var k in options){
                    if(options[k]){
                        context[k] = options[k];
                    }
                }
            }

            EDM.EdwPartner.EdwVisitor.extendSession(function(){});

            cb(context);
        });
    };

    var generatePageContext = function(context, window, document){
        context.title = encodeURIComponent(document.title);
        context.edwurl = encodeURIComponent(document.location.href);
        context.edwref = encodeURIComponent(document.referrer);
        context.edwpg = '';
        context.edwcat = '';

        if (window.EDM && EDM.PageValues && EDM.PageValues.page && EDM.PageValues.page.timestamp != null){
            context.edwtimestamp = EDM.PageValues.page.timestamp;
        }else{
            context.edwtimestamp = new Date().getTime();
        }
        context.ts = context.edwtimestamp;

        if(window.screen){
            context.edwscrres = window.screen.width + 'x' + window.screen.height;
        }

        if(navigator && navigator.userAgent){
            context.ua = navigator.userAgent;
        }
    };

    var generateVisitorContext = function(context){
        context.edwedck = EDM.EdwPartner.EdwVisitor.getVisitorId();
        context.edwck = EDM.EdwPartner.EdwVisitor.getSessionId();
        context.edwzipck = '';
        context.edwreglogin = 'n';
        context.edwregmember = 'v';

    };

    var generateAdvertisingContext = function(context, window, document){
        context.edwad = '';
    };

    var generateVehicleContext = function(context, document){
        context.edwmk = '';
        context.edwmdl = '';
        context.model_link_code = '';
        context.make_id = '';
        context.edwusein = '';
    };
};
/****  END 6 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/xedw-partner-context.js ****/

/****  START 7 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/edw-tracker-factory.js ****/
/**
 *
 * @requires EDM.EdwPartner.EdwContextFactory
 * @requires EDM.EdwPartner.EdwTracker
 */
EDM.EdwPartner.EdwTrackerFactory = new function(){
    var self = this;

    var trackerPool = {};

    /**
     * Creates a tracker object to fire edw events aka edw pixels
     * @param {String} partnerId
     * @param {Object} options hash map of context overrides
     * @param {Window} _window optional window object
     * @param {Document} _document optional document object
     * @return
     */
    this.createTracker = function(partnerId, options, _window, _document){
        if(!trackerPool[partnerId]){
            var context = EDM.EdwPartner.EdwContextFactory.createContext(partnerId, _window, _document, options);
            trackerPool[partnerId] = new EDM.EdwPartner.EdwTracker(context);
        }

        return trackerPool[partnerId];
    };
};
/****  END 7 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/edw-tracker-factory.js ****/

/****  START 8 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/edw-tracker.js ****/
/**
 * Analytic class for firing EDW events aka edw pixels
 *
 * @param {String} partnerId the unique partner identifier
 * @param {Object} context Context object obtained from the context factory.
 *
 * @constructor
 */
EDM.EdwPartner.EdwTracker = function(context, config){
    var self = this;

    config = config||{};

    var KEY_PAGELOAD = 'pageload';

    var EVENT_TYPE_PAGE_ENTER = 'page_enter';

    var DOMAIN = config.DOMAIN||'edw.edmunds.com';
    var PATH = config.PATH||'/edw/edw1x1.gif';

    /**
     * High Level EDW attributes
     * @type {Array}
     */
    var EVENT_ATTRIBUTES = [
        'edwzipck',
        'edwedck',
        'edwtimestamp',
        'edwck',
        'edwregmember',
        'edwreglogin',
        'edwusein',
        'edwmk',
        'edwmdl',
        'edwsubmdl',
        'edwyr',
        'edwpg',
        'edwstlid',
        'edwcat',
        'make_id',
        'model_link_code',
        'model_year_id',
        'submodel_id',
        'edwref',
        'edwurl',
        'title',
        'ua',
        'edwscrres',
        'ts',
        'edwsynpartner'
    ];

    /**
     * Records an event with the specified name and data.
     *
     * Supported options are:
     * {boolean} isPageView if true the event is considered a "page view".  Default is false.
     *
     * @param {String} name the name or "type" of event to track.
     * @param {Object} data a map of key/value strings containing custom values associated with the event
     * @param {Object} options an optional map of key/value strings used to override specific values.
     */
    this.trackEvent = function(name, data, options){
        if(name){
            options = options||{};
            generateValues(name, data, options, function(values){
                var protocol = '//';
                var url = protocol + DOMAIN + PATH + '?' + formatValues(values);
                var img = new Image(1,1);
                img.src = url;
                if (window.ETRACKBASE && window.ETRACKBASE.eventQueue) {
                    window.ETRACKBASE.eventQueue.addEvent(name, data, options);
                }
            });
        } else if(!name) {
            throw "event name is required";
        }
    };

    /**
     * Specific type of event, which records a visitor "entering a page" aka page view.
     *
     * @param {Object} data a map of key/value strings containing custom values associated with the event
     * @param {Object} options an optional map of key/value strings used to override specific values.
     * @return {*}
     */
    this.trackPageEnter = function(data, options){
        options = options||{};
        options.isPageView = options.isPageView||true;
        this.trackEvent(EVENT_TYPE_PAGE_ENTER, data, options);
    };

    var formatValues = function(values){
        var toReturn = '';
        if(values){
            for(var k in values){
                toReturn += k + '=' + values[k] + '&';
            }
        }

        return toReturn;
    };

    /**
     * Asynchronous function used to fetch all tracking key/values.
     *
     * @param {String} name the name of the event aka event type
     * @param {Object} data event specific hashmap of key/values pairs.
     * @param {Object} options map of key/value pairs.
     * @param {Function} cb callback function
     */
    var generateValues = function(name, data, options, cb){
        if(context && typeof(context.generateContext) == 'function'){
            context.generateContext(function(contextData){
                var toReturn = {};

                toReturn.eventtype = name;

                var key;
                for(var i = 0, len = EVENT_ATTRIBUTES.length; i < len; i++){
                    key = EVENT_ATTRIBUTES[i];
                    if(data[key]){
                        toReturn[key] = data[key];
                        delete data[key];
                    } else if(contextData[key]){
                        toReturn[key] = contextData[key];
                    }
                }

                toReturn.eventdata = formatEventData(data, options);
                cb(toReturn);
            });
        }
    };

    /**
     *
     * @param {Object} data
     * @param {Object} options
     * @return {String}
     */
    var formatEventData = function(data, options){
        var toReturn = '';
        if(options.isPageView && (!data || !data[KEY_PAGELOAD])){
            toReturn += KEY_PAGELOAD + '|1;';
        }

        if(data){
            for(var k in data){
                if(k){
                    toReturn += k + '|' + (data[k]||'') + ';';
                }
            }
        }

        return toReturn;
    };
};
/****  END 8 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/edw-tracker.js ****/

/****  START 9 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/xedw-visitor.js ****/
/**
 *
 * @requires EDM.Core.Cookie
 */
EDM.EdwPartner.EdwVisitor = new function(){
    var self = this;

    var $C = EDM.Core.Cookie;

    var EDW_PARTNER_URL = (window.location.protocol.indexOf("https") == -1)?'http://www.edmunds.com/cgi-bin/edw_partner.cgi':'https://secure.edmunds.com/cgi-bin/edw_partner.cgi';

    var KEY_SESSION = '_edwps';
    var KEY_VISITOR = '_edwpv';

    var _isInit = false;
    var _isEdmundsDomain = false;
    var partnerId = '';

    this.getSessionId = function(createIfNeeded){
        init();
        var session = $C.getAsString(KEY_SESSION);
        if(!session && (createIfNeeded === true)){
            session = generateSessionId();
            var options = {};
            options.exp = new Date().getTime() + 1800000; // 30 miniutes
            $C.set(KEY_SESSION, session, options);
        }

        return session;
    };

    this.getVisitorId = function(createIfNeeded){
        init();
        var visitorId = $C.getAsString(KEY_VISITOR);

        if(!visitorId && (createIfNeeded === true)){
            visitorId = generateVisitorId();
            var options = {};
            options.exp = new Date().getTime() + 3.15569e10; // 1 yr
            $C.set(KEY_VISITOR, visitorId, options);
        }

        return visitorId;
    };

    /**
     * extends the current session
     */
    this.extendSession = function(cb){
        init();
        if(_isEdmundsDomain){
            var options = {};
            options.exp = new Date().getTime() + 3.15569e10; // 1 yr
            $C.set(KEY_VISITOR, self.getVisitorId(), options);

            options.exp = new Date().getTime() + 1800000; // 30 miniutes
            $C.set(KEY_SESSION, self.getSessionId(), options);
            cb();
        } else {
            loadEdwPartner(cb, true);
        }
    }

    /**
     * creates session if needed
     * @param {Function} cb callback function called after session created or right away if session already existed.  
     */
    this.createSession = function(cb) {
        init();
        if(!self.getSessionId()){
            if(_isEdmundsDomain){
                self.getSessionId(true);
                self.getVisitorId(true);
                cb();
            } else {
                loadEdwPartner(cb, true);
            }
        } else {
            cb();
        }
    }

    /**
     * Loads the edw partner script
     *
     * @param cb
     */
    var loadEdwPartner = function(cb, force){
        var url = EDW_PARTNER_URL + '?edwp=' + partnerId;
        var loaded = false;
        try {
            loaded = !!document.querySelector('script[src$="' + url + '"]');
        } catch(ex){}

        if(force === true || !loaded) {
            var script = document.createElement('script');
            if(script.onreadystatechange !== undefined){
                script.onreadystatechange = function(){
                    if(this.readyState == 'complete' || this.readyState == 'loaded' || this.status == 304 || this.status == 404){
                        cb();
                    }
                };
            } else {
                script.onload = cb;
            }
            script.src = url;

            document.body.appendChild(script);
        } else {
            cb();
        }
    };

    var init = function() {
        if(!_isInit) {
            try{
                _isInit = true;
                var regex = /^.+\.edmunds\.com$/gi;
                var _host = window.location.host;
                _isEdmundsDomain = !!regex.exec(_host);
                KEY_SESSION = _isEdmundsDomain? 'edw': '_edwps';
                KEY_VISITOR = _isEdmundsDomain? 'edmunds': '_edwpv';
                partnerId = (window._edw && window._edw.account)? window._edw.account: 'unknown';

            } catch(ex){
                _isInit = false;
            }
        }
    }

    var generateSessionId = function(){
        return generateId(30);
    };

    var generateVisitorId = function() {
        return 'ep-' + generateId(56);
    };

    var generateId = function(size) {
       return Math.floor(Math.random() * Math.pow(10, size)).toString(36);
    };
};
/****  END 9 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/xedw-visitor.js ****/

/****  START 10 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/shorthand-patch.js ****/
/**
 * Pass through method to the tracker factory
 * @param partnerId
 * @param _window
 * @param _document
 * @param options
 */
EDM.createTracker = function(partnerId, options, _window, _document){
    return EDM.EdwPartner.EdwTrackerFactory.createTracker(partnerId, options, _window, _document);
};
/****  END 10 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/shorthand-patch.js ****/

/****  START 11 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/no-wait-primer.js ****/
EDM.EdwPartner.NoWaitPrimer = new function(){
    var self = this;

    /**
     * Example usage
     * window._edw = {"account":"test123cr", "data":{"pageload":1,"key1":"value1"}};
     * <script type="text/javascript" src="edw-partners.js">
     */
    this.execute = function(){
        if(window.EDM && EDM.EdwPartner){
            if(window._edw && typeof(window._edw) == 'object'){
                var partnerId = _edw.account||_edw.partnerId;
                var eventType = _edw.eventType;
                var data = _edw.data||{};
                var options = _edw.options||{};
                var tracker = EDM.EdwPartner.EdwTrackerFactory.createTracker(partnerId, options);

                if(eventType){
                    tracker.trackEvent(eventType, data);
                } else {
                    tracker.trackPageEnter(data);
                }
            }
        }
    };
};

(function(){
    EDM.EdwPartner.NoWaitPrimer.execute();
})();

/****  END 11 of 11 FILE: src/main/webapp/thirdparty/edw-partner/js/no-wait-primer.js ****/

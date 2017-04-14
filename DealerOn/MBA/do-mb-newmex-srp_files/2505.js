

(function() {

  var widgetScriptName = "d9k3a853.js",
  slugScript = "d9k3a853",
  dealerIdentifierScript = "2505",
  dealerWebsiteScript = "albuquerque.mercedesdealer.com",
  dealerWebsiteProvider = "Dealer.com",
  artifactVersion = "0.1.46",
  carPreferencesFromScript = null,
  widgetScript = document.currentScript || (document.querySelector && document.querySelector("script[src$='"+widgetScriptName+"']"));

  var apiWidgetClicks = 'https://www.carcode.com/carcode/v1/ccapi/widget-clicks';

  window.__carcodeScripts = window.__carcodeScripts || [];
  if (window.__carcodeScripts.indexOf(widgetScriptName) === -1) {
    window.__carcodeScripts.push(widgetScriptName);
  }
  else {
    return;
  }

if(widgetScript) {
carPreferencesFromScript = getCarPreferences(widgetScript.dataset);
}

var REGEXP_TEST_VIN = '[^\\WioqIOQ]{17}$';
var REGEXP_MATCH_VIN = '[^\\WioqIOQ]{17}';

function isValidVIN (vin) {
  var regexp = new RegExp(REGEXP_TEST_VIN);
  return regexp.test(vin);
}

function getDatasetVIN() {
  var elements = document.querySelectorAll('[data-vin]');
  return (elements.length === 1 &&
            isValidVIN(elements[0].dataset.vin)) ? elements[0].dataset.vin : null;
}

function getDDCLayerVIN() {
  return (window.DDC &&
            window.DDC.dataLayer['vehicles'] &&
            window.DDC.dataLayer['vehicles'].vin &&
            isValidVIN(window.DDC.dataLayer['vehicles'].vin) ) ? window.DDC.dataLayer['vehicles'].vin : null;
}

function getPageTitleVIN () {
  var regexp = new RegExp(REGEXP_MATCH_VIN, 'g');
  var VINs = document.title.match(regexp);
  return (VINs && VINs.length === 1) ? VINs[0] : null;
}

function getInputHiddenVIN () {
  var elements = document.querySelectorAll('input[name="vin"]');
  return (elements.length === 1 &&
            isValidVIN(elements[0].value)) ? elements[0].value : null;
}

function getPageVIN () {
  return getDatasetVIN() || getPageTitleVIN() || getDDCLayerVIN() || getInputHiddenVIN();
}

/*
 * Copy data from 'from' object to 'to' object
 */
function extend(to, from) {
  if(!from) {
    return to;
  }

  if(!to) {
    return null;
  }

  for(key in from) {
    if(from.hasOwnProperty(key)) {
      to[key] = from[key];
    }
  }

  return to;
}

/**
 * Checks if widget button is visible
 */
function isWidgetBtnVisible (el) {

    if (!el) {
        return false;
    }

    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        ~~rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

}

/**
 * Checks if widget button is available and is not overriden by another layer
 */
function isWidgetBtnAvailable(el) {


    if (!el) {
        return false;
    }

    var id = 'carcodesms-default-widget';
    var rect = el.getBoundingClientRect();

    /**
     * Returns element from point (shorthand)
     *
     * @param {integer} x - position x
     * @param {integer} y - position y
     */
    function efp(x, y) {
        return document.elementFromPoint(x, y);
    }

    /**
     * Checks if element's id is equal to passed id
     *
     * @param {object} element - element
     * @param {string} id - element's id
     */
    function isElement(element, id) {
        return element.id === id || element.parentNode.id ===  id;
    }

    return isElement(efp(rect.left + 2, rect.top + 2), id)
            && isElement(efp(rect.right - 2, rect.top + 2), id)
            && isElement(efp(rect.left + 2, rect.bottom - 2), id)
            && isElement(efp(rect.right - 2, rect.bottom - 2), id);

}


var ready = (function(){

var readyList,
    DOMContentLoaded,
    class2type = {};
    class2type["[object Boolean]"] = "boolean";
    class2type["[object Number]"] = "number";
    class2type["[object String]"] = "string";
    class2type["[object Function]"] = "function";
    class2type["[object Array]"] = "array";
    class2type["[object Date]"] = "date";
    class2type["[object RegExp]"] = "regexp";
    class2type["[object Object]"] = "object";

var ReadyObj = {
  // Is the DOM ready to be used? Set to true once it occurs.
  isReady: false,
  // A counter to track how many items to wait for before
  // the ready event fires. See #6781
  readyWait: 1,
  // Hold (or release) the ready event
  holdReady: function( hold ) {
    if ( hold ) {
      ReadyObj.readyWait++;
    } else {
      ReadyObj.ready( true );
    }
  },
  // Handle when the DOM is ready
  ready: function( wait ) {
    // Either a released hold or an DOMready/load event and not yet ready
    if ( (wait === true && !--ReadyObj.readyWait) || (wait !== true && !ReadyObj.isReady) ) {
      // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
      if ( !document.body ) {
        return setTimeout( ReadyObj.ready, 1 );
      }

      // Remember that the DOM is ready
      ReadyObj.isReady = true;
      // If a normal DOM Ready event fired, decrement, and wait if need be
      if ( wait !== true && --ReadyObj.readyWait > 0 ) {
        return;
      }
      // If there are functions bound, to execute
      readyList.resolveWith( document, [ ReadyObj ] );

      // Trigger any bound ready events
      //if ( ReadyObj.fn.trigger ) {
      //  ReadyObj( document ).trigger( "ready" ).unbind( "ready" );
      //}
    }
  },
  bindReady: function() {
    if ( readyList ) {
      return;
    }
    readyList = ReadyObj._Deferred();

    // Catch cases where $(document).ready() is called after the
    // browser event has already occurred.
    if ( document.readyState === "complete" ) {
      // Handle it asynchronously to allow scripts the opportunity to delay ready
      return setTimeout( ReadyObj.ready, 1 );
    }

    // Mozilla, Opera and webkit nightlies currently support this event
    if ( document.addEventListener ) {
      // Use the handy event callback
      document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
      // A fallback to window.onload, that will always work
      window.addEventListener( "load", ReadyObj.ready, false );

      // If IE event model is used
    } else if ( document.attachEvent ) {
      // ensure firing before onload,
      // maybe late but safe also for iframes
      document.attachEvent( "onreadystatechange", DOMContentLoaded );

      // A fallback to window.onload, that will always work
      window.attachEvent( "onload", ReadyObj.ready );

      // If IE and not a frame
      // continually check to see if the document is ready
      var toplevel = false;

      try {
        toplevel = window.frameElement == null;
      } catch(e) {}

      if ( document.documentElement.doScroll && toplevel ) {
        doScrollCheck();
      }
    }
  },
  _Deferred: function() {
    var // callbacks list
    callbacks = [],
    // stored [ context , args ]
    fired,
    // to avoid firing when already doing so
    firing,
    // flag to know if the deferred has been cancelled
    cancelled,
    // the deferred itself
    deferred  = {

      // done( f1, f2, ...)
      done: function() {
        if ( !cancelled ) {
          var args = arguments,
          i,
          length,
          elem,
          type,
          _fired;
          if ( fired ) {
            _fired = fired;
            fired = 0;
          }
          for ( i = 0, length = args.length; i < length; i++ ) {
            elem = args[ i ];
            type = ReadyObj.type( elem );
            if ( type === "array" ) {
              deferred.done.apply( deferred, elem );
            } else if ( type === "function" ) {
              callbacks.push( elem );
            }
          }
          if ( _fired ) {
            deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
          }
        }
        return this;
      },

      // resolve with given context and args
      resolveWith: function( context, args ) {
        if ( !cancelled && !fired && !firing ) {
          // make sure args are available (#8421)
          args = args || [];
          firing = 1;
          try {
            while( callbacks[ 0 ] ) {
              callbacks.shift().apply( context, args );//shifts a callback, and applies it to document
            }
          }
          finally {
            fired = [ context, args ];
            firing = 0;
          }
        }
        return this;
      },

      // resolve with this as context and given arguments
      resolve: function() {
        deferred.resolveWith( this, arguments );
        return this;
      },

      // Has this deferred been resolved?
      isResolved: function() {
        return !!( firing || fired );
      },

      // Cancel
      cancel: function() {
        cancelled = 1;
        callbacks = [];
        return this;
      }
    };

    return deferred;
  },
  type: function( obj ) {
    return obj == null ?
      String( obj ) :
      class2type[ Object.prototype.toString.call(obj) ] || "object";
  }
}
// The DOM ready check for Internet Explorer
function doScrollCheck() {
  if ( ReadyObj.isReady ) {
    return;
  }

  try {
    // If IE is used, use the trick by Diego Perini
    // http://javascript.nwbox.com/IEContentLoaded/
    document.documentElement.doScroll("left");
  } catch(e) {
    setTimeout( doScrollCheck, 1 );
    return;
  }

  // and execute any waiting functions
  ReadyObj.ready();
}
// Cleanup functions for the document ready method
if ( document.addEventListener ) {
  DOMContentLoaded = function() {
    document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
    ReadyObj.ready();
  };

} else if ( document.attachEvent ) {
  DOMContentLoaded = function() {
    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
    if ( document.readyState === "complete" ) {
      document.detachEvent( "onreadystatechange", DOMContentLoaded );
      ReadyObj.ready();
    }
  };
}
function ready( fn ) {
  // Attach the listeners
  ReadyObj.bindReady();

  var type = ReadyObj.type( fn );

  // Add the callback
  readyList.done( fn );//readyList is result of _Deferred()
}
return ready;
})();

  // render widgets/insert_functions
//CC-2290: validate and return car preferences from tag dataset
function getCarPreferences ( dataset ) {
  if ( !dataset ) { return null; }

  var result = {},
      PREF_SET = ['vin', 'stock_no', 'make', 'model', 'year', 'status'];

  PREF_SET.forEach( function ( prop ) {
    if (dataset[prop] && dataset[prop] !== 'PLACE_YOUR_' + prop.toUpperCase() + '_HERE' ) {
      result[prop] = dataset[prop];
    }
  });

  return ( result.vin || result.stock_no ) ? result : null;
}

function getCookieByName(cName) {
    var name = cName + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function getReferringUrl() {
    return window.location ? window.location.href : null;
}

  var matchedTargets = [];

  var insertBefore = function(selector, html, context, matchLimit, scope, data) {
    insertRelative(selector, html, 'before', context, matchLimit, scope, data);
  };

  var insertAfter = function(selector, html, context, matchLimit, scope, data) {
    insertRelative(selector, html, 'after', context, matchLimit, scope, data);
  };

  var insertAfterNext = function(selector, html, context, matchLimit, scope, data) {
    insertRelative(selector, html, 'afterNext', context, matchLimit, scope, data);
  };

  var insertAfterNextNext = function(selector, html, context, matchLimit, scope, data) {
    insertRelative(selector, html, 'afterNextNext', context, matchLimit, scope, data);
  };

  var append = function(selector, html, context, matchLimit, scope, data) {
    insertRelative(selector, html, 'end', 'self', matchLimit, scope, data);
  };

  var insertRelative = function(selector, html, placement, context, matchLimit, scope, data) {
    if (!scope) {
      scope = document;
    }
    var targets = scope.querySelectorAll(selector);
    var len = targets.length;

    if (len) {
      var div = document.createElement('div');
      if (typeof CarcodeWidget_d9k3a853 === "function") {
        var widgetButtonClick = new CarcodeWidget_d9k3a853().clickHandler;
      }

      for (var i = 0; i < len; i++) {
        if (matchLimit && (i+1) > matchLimit) {
          //console.log("matchlimit detected", matchLimit, i, "stopping");
          continue;
        }
        var target = targets[i];
        div.innerHTML = html;
        var element = div.childNodes[0];
        var insertContext;

        if (matchedTargets.indexOf(target) === -1) {
          // console.log("Inserting");
          matchedTargets.push(target);

          var buttons = [];
          if (typeof widgetButtonClick === "function") {
            buttons = div.querySelectorAll("a[href^='sms:'], a[data-numbers]");
            for (var n = 0; n < buttons.length; n++) {
              buttons[n].onclick = widgetButtonClick;
            }
          }

          switch(context) {
            case 'parent':
              target = target.parentNode;
              insertContext = target.parentNode;
            break;
            case 'parentParent':
              target = target.parentNode.parentNode;
              insertContext = target.parentNode;
            break;
            case 'parentParentParent':
              target = target.parentNode.parentNode.parentNode;
              insertContext = target.parentNode;
            break;
            case 'parentParentParentParent':
              target = target.parentNode.parentNode.parentNode.parentNode;
              insertContext = target.parentNode;
            break;
            case 'self':
              // Doesn't matter what target is, since it's not used below with 'end' placement
              insertContext = target;
            break;
            default:
              // target = target by default
              insertContext = target.parentNode;
          }

          switch (placement) {
            case 'before':
              insertContext.insertBefore( element, target );
            break;
            case 'afterNext':
              insertContext.insertBefore( element, target.nextElementSibling.nextElementSibling );
            break;
            case 'afterNextNext':
              insertContext.insertBefore( element, target.nextElementSibling.nextElementSibling.nextElementSibling );
            break;
            case 'end':
              insertContext.appendChild( element );
            default:
              insertContext.insertBefore( element, target.nextElementSibling );
          }

          for (var n = 0; n < buttons.length; n++) {
            if (data) {
              for (var property in data) {
                if (data.hasOwnProperty(property)) {
                  if (typeof data[property] == "function") {
                    buttons[n].dataset[property] = data[property](buttons[n]);
                  } else {
                    buttons[n].dataset[property] = data[property];
                  }
                }
              }
            } else {
              //console.log("No data found");
            }
          }
        }
      }
    }
  };

  //render responsive_function
  window.CarcodeWidget = window.CarcodeWidget_d9k3a853 =  function() {
      var cw = this;
      var clicked = false;
      var justClicked;
      var cannedMessages = [];
      var isCannedMessageClicked = false;

      var isCannedMessageUsed = function (messageText) {
        return cannedMessages.some( function (cannedText) {
          return messageText === 'I\'d like to ' + cannedText;
        });
      };

      var trackAnalyticsEvent = function(action, label) {
        var ga = window[window['GoogleAnalyticsObject'] || 'ga'];
        if (typeof ga === 'function' && ga.getAll) {
          var allTrackers = ga.getAll();
          for (var i = 0, length = allTrackers.length; i < length; i++) {
            var trackerName = allTrackers[i].get('name');
            ga(trackerName + '.send', 'event', 'CarCode', action, label);
          }
        } else if (window['_gaq']) {
          _gaq.push(['_trackEvent', 'CarCode', action, label]);
        }
      };

      var focusChange = function(evt) {
        var evtMap, focus, h, v;
        v = 'visible';
        h = 'hidden';
        evtMap = {
          focus: v,
          focusin: v,
          pageshow: v,
          blur: h,
          focusout: h,
          pagehide: h
        };
        evt = evt || window.event;
        if (evt.type in evtMap) {
          focus = evtMap[evt.type];
        } else {
          focus = this[hidden] ? "hidden" : "visible";
        }

        modalFocusChange(focus);
      };

      var hidden = "hidden";
      if (document[hidden]) {
        document.addEventListener("visibilitychange", focusChange);
      } else if (document["mozHidden"]) {
        hidden = "mozHidden";
        document.addEventListener("mozvisibilitychange", focusChange);
      } else if (document["webkitHidden"]) {
        hidden = "webkitHidden";
        document.addEventListener("webkitvisibilitychange", focusChange);
      } else if (document["msHidden"]) {
        hidden = "msHidden";
        document.addEventListener("msvisibilitychange", focusChange);
      } else if (document['onfocusin']) {
        document.onfocusin = document.onfocusout = focusChange;
      } else {
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = focusChange;
      }

      // Array.findIndex polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex#Polyfill,
      // licensed under Creative Commons Attribution-ShareAlike license (CC-BY-SA):
      // https://developer.mozilla.org/en-US/docs/MDN/About#Copyrights_and_licenses
      function findIndex(arr, predicate) {
        if (arr == null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(arr);
        var length = list.length >>> 0;
        var thisArg = arguments[2];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return i;
          }
        }
        return -1;
      };

      function trim(str) {
        return str.replace(/^\s+|\s+$/g,'');
      };

      function isDocument(elem) {
        return elem instanceof HTMLDocument || Object.prototype.toString.call(elem) === "[object HTMLDocument]";
      }

      function closestClass(elem, className) {
        var parent = elem;
        while ( !isDocument(parent) && parent !== null ) {
          if ( parent && parent.className.indexOf(className) != -1 ) {
            return parent;
          } else {
            parent = parent.parentNode;
          }
        }
        return null;
      };

      function closestTag(elem, tag) {
        var parent = elem;
        while ( parent != document.body ) {
          if ( parent && parent.tagName.toLowerCase() === tag ) {
            return parent;
          } else {
            parent = parent.parentNode;
          }
        }
        return null;
      };

      function titleize(str) {
        return str.replace(/(?:^|\s|-)\S/g, function(c) {
          return c.toUpperCase();
        })
      }

      var focusLostFromSMS;
      function modalFocusChange(focus) {
        // Window focus lost and lost due to button click which just happened (less than 500ms ago)
        var now = new Date;
        //alert("Focus Changed: " + focus);
        cw.widgetLog("Focus changed: " + focus + ", justClicked: " + justClicked + ", focusLostFromSMS: " + focusLostFromSMS + ", now: " + now);
        if (focus == "hidden" && justClicked && (now.getTime() - justClicked.getTime()) < 10000) {
          cw.widgetLog("Setting focusLostFromSMS");
          focusLostFromSMS = new Date;
        } else if (focus == "visible" && focusLostFromSMS) {
          cw.widgetLog("Focus regained focusLostTime: " + focusLostTime);
          var focusLostTime = now.getTime() - focusLostFromSMS.getTime(); // Time out of focus in seconds
          focusLostFromSMS = null;
          // Assume if window is out of focus for more than 5 seconds,
          // they were sending a text.
          if (focusLostTime > 5000) {
            cw.removeModal();
          }
        }
      };

      function checkInvalidity(elem) {
        if (elem.dataset && elem.dataset.invalid) {
          var invalid = document.querySelector(elem.dataset.invalid),
              invalidity = false;

          if (elem.checkValidity()) {
            invalid.style.display = 'none';
            elem.style.borderColor = '#8b8575';
          } else {
            invalidity = true;
            invalid.style.display = 'block';
            elem.style.borderColor = 'rgb(240, 81, 87)';
          }

          return invalidity;
        }
      }

      function formPost(event) {
        cw.widgetLog("Submitting SMS form via AJAX");
        if (cw.enableAnalytics) {
          trackAnalyticsEvent("Texting form submit");
        }

        var form = document.getElementById("carcodesms-form"),
            msg = document.getElementById("carcodesms-msg"),
            elems = form.elements,
            len = elems.length,
            params = "",
            url = form.action,
            validity = true;

        var isCannedMessageSend = isCannedMessageUsed(elems['Body'].value);

        /**
         * Validate form
         */
        for (var i = 0; i < len; i++) {

          if (checkInvalidity(elems[i])) {
            validity = false;
          }
          if (!validity) {
            // Prevent form submission
            if (event.preventDefault) event.preventDefault();
            event.returnValue = false;

            // Abort formPost function
            return false;
          }
        }


        /**
         * Returns leadTags from window.__carcode.leadTags object or null if value isn't found
         *
         * @return {string} The leadTags
         */
        function _getLeadTagsFromConfiguration() {
          return (window && window.__carcode && window.__carcode.leadTags) ? window.__carcode.leadTags : null;
        }

        /**
         * Returns leadTags from cookies or null if value isn't found
         *
         * @return {string} The leadTags
         */
        function _getPaidSourceLeadTag() {
          var tag = getCookieByName('paid_source');
          if (!tag || tag.length === 0) {
            return null;
          }
          tag = tag.replace(/[^a-z0-9]+/gi, "_");
          if (tag.length > 18) {
            tag = tag.substring(0, 18);
          }
          return 'paid_source_' + tag;
        }

        var configuredLeadTags = _getLeadTagsFromConfiguration();
        var paidSourceLeadTag = _getPaidSourceLeadTag();

        /**
         * Initialize params
         */
        for (j = 0; j < len; j++) {
          var elem = elems[j];

          // Case with leadTags already exist
          if(elem.name === 'leadTags') {
            if(isCannedMessageClicked) {
              elem.value += ',#ppm_clicked'
            }
            if(isCannedMessageSend) {
              elem.value += ',#ppm_send'
            }
            if (configuredLeadTags) {
              configuredLeadTags.split(',').forEach(function(tag) {
                elem.value += ',#' + tag;
              });
            }
            if (paidSourceLeadTag) {
              elem.value += ',#' + paidSourceLeadTag;
            }
            elem.value += ',#panelwidget'
          }

          if (elem.tagName == "SELECT") {
            params += elem.name + "=" + encodeURIComponent(elem.options[elem.selectedIndex].value) + "&";
          } else {
            params += elem.name + "=" + encodeURIComponent(elem.value) + "&";
          }
        }

        //Case with no leadTags exist yet
        if(params.indexOf('leadTags') < 0 && (isCannedMessageClicked || isCannedMessageSend || configuredLeadTags || paidSourceLeadTag)) {
          var _leadTags = ['#panelwidget'];
          if (isCannedMessageClicked) {
            _leadTags.push('#ppm_clicked');
          }
          if (isCannedMessageSend) {
            _leadTags.push('#ppm_send');
          }
          if (configuredLeadTags) {
            configuredLeadTags.split(',').forEach(function(tag) {
              _leadTags.push('#' + tag);
            });
          }
          if (paidSourceLeadTag) {
            _leadTags.push('#' + paidSourceLeadTag);
          }
          params += 'leadTags=' + encodeURIComponent(_leadTags.join(',')) + '&';
        }

        if (window.XMLHttpRequest){ // code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp=new XMLHttpRequest();
        } else { // code for IE6, IE5
          xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("POST", url, false);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);

        // This goes before next line to prevent default form submission once AJAX has been posted above,
        // even if filling in the response text causes an error to prevent multiple-submission.
        if ( event.preventDefault ) event.preventDefault();
        event.returnValue = false;

        msg.innerHTML = xmlhttp.responseText;
        form.innerHTML = "";
      }

      var placeholder_is_mobile = "desktop";
      this.isMobile = (placeholder_is_mobile === "mobile");
      this.widgetLog = function() {
        //console.log(arguments);
      };
      this.enableAnalytics = true;
      this.alwaysOpenForm = false;
      this.smsHrefOrMulti = "sms:+15056294017";
      this.dataNumbers = "sales=sms:+15056294017";
      this.defaultWidgetPhone = "+15056294017";
      this.data = {};

      /**
       * In case of LiveChat Panel with SDK dataset is not set for clicked element, it is added when SDK attached
       */
      this.clickHandler = function(e, dataset) {
        cw.widgetLog("Widget SMS Button for Solution 1 clicked");
        if (cw.enableAnalytics) {
          var target = closestTag(e.target, "a") || e.currentTarget,
              label = target.innerHTML;
          if (target.parentNode.id === "carcodesms-default-widget") {
            label = "Floating button: " + label;
          } else if (target.parentNode.tagName.toLowerCase() === "li") {
            label = "Selection list: " + label;
          }
          trackAnalyticsEvent("Texting button click", label);
        }

        if (!cw.isMobile || cw.alwaysOpenForm) {
          if (!cw.isMobile) {
            cw.widgetLog("Desktop device detected");
          }
          if (cw.alwaysOpenForm) {
            cw.widgetLog("always_open_form set to true");
          }
          cw.widgetLog ("Abort native sms link click event");

          if ( e.preventDefault ) e.preventDefault();
          e.returnValue = false;
          // stopPropagation needed for sites such as Dominion which try to catch clicks within
          // inventory listing to send user to vehicle details page
          if(e.stopPropagation) {
            e.stopPropagation();
          } else {
            e.returnValue = false;
          }

            /**
            * When Widget Panel exists and is loaded it adds data-attribute 'chatButton' true
            * Such SDK links in that case should open Widget Panel instead of "Text Us" widget
            * So, don't open default modal window when the link is clicked
            */
            if (!e.target.dataset.chatButton) {
                cw.showModal(e);
            }

        } else {
          justClicked = new Date;

          // On mobile devices if carPreferences exist update href="sms" link with predefined body parameters
          var hrefValue = e.target.href ||
                          e.currentTarget.href ||
                          (e.currentTarget.dataset && e.currentTarget.dataset['href']) ||
                          ('sms:'+cw.defaultWidgetPhone);

          if(cw.isMobile && hrefValue && hrefValue.indexOf('sms') === 0) {

            var iOS_version = null;
            var data = dataset || e.currentTarget.dataset;
            var carPref = getCarPreferences(data) || carPreferencesFromScript;


            /**
             * Returns a "Vehicle Info" object to send it with 'NativeMobileAppClickInfo' object. (CC-3405)
             *
             * @param {object} data - Object with vehicle info
             */
            function getVehicleInfo(data) {
                if (!data) {
                    return null;
                }
                var self = {};
                self.make = data.make || '';
                self.model = data.model || '';
                self.year = data.year || '';
                self.vin = data.vin || '';
                self.stock = data.stock_no || '';
                return self;
            }


            /**
             * Creates an object to send it to 'widget-clicks' API when native app is open and there is no way
             * to send needed data with form submit as it works on desktop. (CC-3405)
             */
            function NativeMobileAppClickInfo() {
                this.clickEvent = 'click';
                this.dealerSiteUrl = document.domain;
                this.dealerId = 2505;
                this.slug = "d9k3a853";
                this.edmundsLeadsCookie = getCookieByName("_edwpv");
                this.edmundsLeadsSession = getCookieByName("_edwps");
                this.referringUrl = window.location.href;
                this.vehicle = getVehicleInfo( carPref );
            }

            var PREPOPULATED_VOI_TEXT ='Hi%2C%20I\'m%20interested%20in%20more%20information%20regarding%20',
                PREPOPULATED_TEXT ='Hi%2C%20I\'d%20like%20to%20speak%20with%20someone%20at%20the%20dealership%20about%20a%20vehicle.';

            // Replace sms:// to sms: in href links for SDK
            hrefValue = hrefValue.replace('sms://','sms:');

            // add predefined body text to href sms
            // differences between iOS and Android
            if(/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                iOS_version = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
                hrefValue += (iOS_version[0] >= 8) ? '&body=' : ';body=';
            }
            else {
                hrefValue += '?body=';
            }

            if(carPref) {
                hrefValue += PREPOPULATED_VOI_TEXT;
                hrefValue += (carPref.stock_no) ? ('stock%23' + carPref.stock_no + '%20') : '';
                hrefValue += (carPref.vin) ? ('VIN%23' + carPref.vin + '%20') : '';
            } else {
                hrefValue += PREPOPULATED_TEXT;
            }

            /**
             * Due to issues with opening of native application on iOS < 10
             * redirect to sms-href (and open native app) and send widget-clicks only on non-iOS devices or iOS < 10
             * On iOS 10+ desktop form will be available instead of native application.
             */
            if (!iOS_version || iOS_version[0] < 10) {

                /**
                * Send click object to API, don't wait for any callback it doesn't matter and should not affect
                * opening of native sms application (CC-3405)
                */
                xmlhttp = new XMLHttpRequest();
                xmlhttp.open('POST', apiWidgetClicks);
                xmlhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                xmlhttp.send(JSON.stringify(new NativeMobileAppClickInfo()));

                window.location.href = hrefValue;

            }
            else {

                if ( e.preventDefault ) e.preventDefault();
                e.returnValue = false;
                if(e.stopPropagation) {
                    e.stopPropagation();
                }
                else {
                    e.returnValue = false;
                }

            }

          }

          cw.widgetLog("Moible device detected, set justClicked timestamp: " + justClicked);

            /**
            * When Widget Panel exists and is loaded it adds data-attribute 'chatButton' true
            * Such SDK links in that case should open Widget Panel instead of "Text Us" widget
            * So, don't open default modal window when the link is clicked
            */
            if (!e.target.dataset.chatButton) {
                cw.showModal(e);
            }

        }
      };

      this.removeModal = function() {
        cw.widgetLog("removing modal");
        var div = document.getElementById("carcodesms-modal");
        if (div) {
          div.parentNode.removeChild(div);
          window.removeEventListener("resize", cw.sizeModal);
          window.removeEventListener("scroll",  cw.sizeModal);
        }
      }

      this.sizeModal = function() {
        var div = document.getElementById("carcodesms-modal"),
            msg = document.getElementById("carcodesms-modal-msg"),
            titleBar = document.getElementById("carcodesms-title-bar"),
            w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        // After msg and button are appended to body, take height measurement and adjust offset margin
        div.style.setProperty('left', (x - div.offsetWidth)/2 + 'px');
        div.style.setProperty('top', (y - div.offsetHeight)/2 + 'px');
        // msg.style.setProperty('margin-top', Math.max(((div.offsetHeight - titleBar.offsetHeight - msg.offsetHeight)/2-16),16) + 'px');
      }

      this.addFormValues = function(form, data) {
        if (data) {
          for (var property in data) {
            if (data.hasOwnProperty(property)) {
              cw.addFormValue(form, property, data[property]);
            }
          }
        }
      }

      this.addFormValue = function(form, property, value) {
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', property);
        hiddenInput.setAttribute('value', value);
        form.appendChild(hiddenInput);
      }

      this.build = function(target, e) {
        var msg = document.createElement('p'),
            form = document.createElement('form'),
            label = document.createElement('label'),
            input = document.createElement('input'),
            invalid = document.createElement('small'),
            textLabel = document.createElement('label'),
            text = document.createElement('textarea'),
            textInvalid = document.createElement('small'),
            submit = document.createElement('input'),

            

            labelName = document.createElement('label'),
            inputName = document.createElement('input'),
            nameInvalid = document.createElement('small'),

            numberLinks = document.createElement('ul'),
            textBody = "Hello, I'm interested in a vehicle on your website.",
            smsToRegex = /sms:\/?\/?([^\?$\/;]+)/,
            href = target.href || cw.smsHrefOrMulti,
            smsTo = href.match(smsToRegex) && href.match(smsToRegex)[1],
            refFrom = window.location.href,
            smsBodyRegex = /body=([^&$]+)/,
            smsBody = (target.href && target.href.match(smsBodyRegex) && decodeURIComponent(target.href.match(smsBodyRegex)[1])) || (target.dataset && target.dataset.body) || textBody,
            dataNumbers = (target.dataset && target.dataset.numbers) || cw.dataNumbers,
            leadTags = target.dataset && target.dataset.tags,
            edVisitorId = getCookieByName("_edwpv"),
            referringUrl = getReferringUrl(),
            numbers = dataNumbers && dataNumbers.split('|');

        if (!smsTo && numbers && numbers.length === 1) {
          var number = numbers[0].split("=")[1];
          smsTo = number && number.match(smsToRegex) && number.match(smsToRegex)[1];
        }

        msg.setAttribute("style", 'color: #828385; line-height: 1.1em; font-size: 14px; margin: 0 !important; padding: 0 20px 20px !important; letter-spacing: initial;');
        msg.id = "carcodesms-msg";
        var dealerNameValue = null;
        if (cw.isMobile) {
          msg.innerHTML = 'If your device does not allow sending SMS directly, you can enter your mobile phone number below, and we\'ll text you back right away.';
        } else {
          msg.innerHTML = 'Enter your mobile phone number below, and someone from '+ "Mercedes-Benz of Albuquerque"+ ' will respond with a text to your phone right away.';
        }

        if (!smsTo && numbers) {
          if (cw.enableAnalytics) {
            trackAnalyticsEvent("Modal show", "Selection list");
          }

          // If isMobile, then event wasn't prevented in the clickHandler() handler above,
          // since it was assumed to be launching the native text app.
          if (cw.isMobile) {
            if ( e.preventDefault ) e.preventDefault();
            e.returnValue = false;
          }
          msg.innerHTML = "How can we help you? Tell us who you'd like to reach, and we'll deliver your message to the right person.";
          numberLinks.setAttribute("style", "list-style: none; margin: 0 !important; padding: 0 !important;");

          for (var i=0; i < numbers.length; i++) {
            var li = document.createElement('li'),
                a = document.createElement('a'),
                numberLabel = numbers[i].split('='),
                label = numberLabel[0] && titleize(numberLabel[0]),
                number = numberLabel[1];

            for (var key in target.dataset) {
              if (target.dataset.hasOwnProperty(key)) {
                a.dataset[key] = target.dataset[key];
              }
            }

            a.onclick = cw.clickHandler;
            a.setAttribute("href", number);
            a.innerHTML = "Text " + label;
            var placeholderEnvDomain = "www.carcodesms.com";
            a.setAttribute("style", "display: block; background-color: #FFF; background-image: url(http://" + placeholderEnvDomain +"/widget_assets/images/" + numberLabel[0] + ".svg), url(http://"+placeholderEnvDomain+"/widget_assets/images/arrow.svg); background-repeat: no-repeat; background-position: 1.5em center, right 1.5em center; background-size: 3em 3em, 1em 1em; padding: 2em 5.5em !important; color: #333; border: solid 1px #F2F2F2; border-width: 1px 0; width: auto; margin: 0 !important; text-align: left;");

            li.appendChild(a)

            numberLinks.appendChild(li);
          }

          return [msg, numberLinks];
        }

        if (cw.enableAnalytics) {
          trackAnalyticsEvent("Modal show", "Texting form");
        }

        submit.setAttribute('type', 'submit');
        submit.id = 'carcodesms_submit';
        submit.setAttribute('data-submit-slug', 'd9k3a853');
        submit.value = "Submit";


        submit_style = "margin-top: 0 !important; margin-bottom: 16px !important; border: none;color:#ffffff;padding: 10px 32px !important; vertical-align: top; font-size: 18px; width: auto; text-align: left; float: none !important; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px;background:#ff6633; display: block;";;

        

        
            submit.setAttribute("style", submit_style);
        

        input.setAttribute('type', 'tel');
        input.setAttribute('name', 'From');
        input.setAttribute('required', 'required');
        //input.setAttribute('pattern', '[\(| |\.|\-]{0,1}\d{3}[\)| |\.\-]{0,1}\d{3}[\-| |\.]{0,1}\d{4}');
        input.id = 'carcodesms_number';
        input.setAttribute('placeholder', '555-867-5309');
        input.setAttribute('style', '-webkit-appearance: none;background-color: white;font-family: inherit;border: 1px solid #cccccc;-webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);color: rgba(0, 0, 0, 0.75);display: block;font-size: 16px;margin: 0 0 1rem 0 !important;padding: 0.5rem !important;height: 2.3125rem;width: 100%;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;-webkit-transition: -webkit-box-shadow 0.45s, border-color 0.45s ease-in-out;-moz-transition: -moz-box-shadow 0.45s, border-color 0.45s ease-in-out;transition: box-shadow 0.45s, border-color 0.45s ease-in-out;border: solid 3px #8b8575;padding: 1em 1.6em !important;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;height: auto;float: none !important; padding: 0.5em 0.6em !important; background: initial !important;');
        input.setAttribute('type', 'tel');

        input.setAttribute('pattern', '\\+?1?[\\s\\-\\.]*\\(?[2-9]{1}\\d{2}\\)?[\\s\\-\\.]*\\d{3}[\\s\\-\\.]*\\d{4}');

        if (input.addEventListener) {
          input.addEventListener('input', function (e) {
            var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
          });
        } else if (input.attachEvent) {
          input.attachEvent('input', function (e) {
            var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
          });
        }

        input.setAttribute('data-invalid', '#carcodesms_number_invalid');

        

        labelName.setAttribute('style', 'text-align: left;font-size: 14px;color: #4d4d4d;cursor: pointer;display: block;margin: 0 !important;position: static;font-weight: normal;');
        labelName.innerHTML = "Name:";
        labelName.setAttribute('for', 'nickname');

        inputName.id = 'nickname';
        inputName.setAttribute('name', 'nickname');
        inputName.setAttribute('placeholder', 'Enter your name here');

        

        inputName.setAttribute('style', '-webkit-appearance: none;background-color: white;font-family: inherit;border: 1px solid #cccccc;-webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);color: rgba(0, 0, 0, 0.75);display: block;font-size: 16px;margin: 0 0 1rem 0 !important;padding: 0.5rem !important;height: 2.3125rem;width: 100%;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;-webkit-transition: -webkit-box-shadow 0.45s, border-color 0.45s ease-in-out;-moz-transition: -moz-box-shadow 0.45s, border-color 0.45s ease-in-out;transition: box-shadow 0.45s, border-color 0.45s ease-in-out;border: solid 3px #8b8575;padding: 1em 1.6em !important;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;height: auto;float: none !important; padding: 0.5em 0.6em !important; line-height: 20px; background: initial !important;');

        //text.innerHTML = smsBody;
        text.id = 'carcodesms_body';
        text.setAttribute('name', 'Body');
        text.setAttribute('placeholder', 'I\'d like to...');
        text.setAttribute('required', 'required');
        text.setAttribute('style', '-webkit-appearance: none;background-color: white;font-family: inherit;border: 1px solid #cccccc;-webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);color: rgba(0, 0, 0, 0.75);display: block;font-size: 16px;margin: 0 0 1rem 0 !important;padding: 0.5rem !important;height: 2.3125rem;width: 100%;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;-webkit-transition: -webkit-box-shadow 0.45s, border-color 0.45s ease-in-out;-moz-transition: -moz-box-shadow 0.45s, border-color 0.45s ease-in-out;transition: box-shadow 0.45s, border-color 0.45s ease-in-out;border: solid 3px #8b8575;padding: 1em 1.6em !important;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;height: auto;float: none !important; padding: 0.5em 0.6em !important; line-height: 20px; background: initial !important;');
        text.setAttribute('data-invalid', '#carcodesms_text_invalid');

        label.setAttribute('for', 'carcodesms_number');
        label.setAttribute('style', 'text-align: left;font-size: 14px;color: #4d4d4d;cursor: pointer;display: block;line-height: 1.3;margin: 0 !important;padding-bottom: 6px;position: static; font-weight: normal; width: 100%;');
        label.innerHTML = "Mobile Phone Number:<span style=\"font-size: smaller; color: #999; font-weight: normal; float: none !important;\"><br>Don't worry - you can opt-out by texting STOP when you don't want to receive any more texts from us.</span>";

        textLabel.setAttribute('for', 'carcodesms_body');
        textLabel.setAttribute('style', 'text-align: left;font-size: 14px;color: #4d4d4d;cursor: pointer;display: block;margin: 0 !important;position: static; font-weight: normal;');
        textLabel.innerHTML = "Message:";

        invalid.setAttribute('style', 'display: none; padding: 0.375rem 0.5625rem 0.5625rem !important; margin-top: -1px; margin-bottom: 1rem; font-size: 0.75rem; font-weight: normal; font-style: italic; background: #f05157; color: white;');
        invalid.id = 'carcodesms_number_invalid';
        invalid.innerHTML = "Please enter a valid mobile phone number, so that we can text you back.";

        textInvalid.setAttribute('style', 'display: none; padding: 0.375rem 0.5625rem 0.5625rem !important; margin-top: -1px; margin-bottom: 1rem; font-size: 0.75rem; font-weight: normal; font-style: italic; background: #f05157; color: white;');
        textInvalid.id = 'carcodesms_text_invalid';
        textInvalid.innerHTML = "Please enter a question or message.";

        nameInvalid.setAttribute('style', 'display: none; padding: 0.375rem 0.5625rem 0.5625rem !important; margin-top: -1px; margin-bottom: 1rem; font-size: 0.75rem; font-weight: normal; font-style: italic; background: #f05157; color: white;');
        nameInvalid.id = 'carcodesms_name_invalid';
        nameInvalid.innerHTML = "Please enter your name.";


        form.setAttribute('action', "https://www.carcode.com/carcode/v1/dealer/sms/widget");
        form.setAttribute('method', 'post');
        form.setAttribute('data-ajax', 'false');
        form.setAttribute('style', 'margin: 0 !important; padding: 20px !important; overflow: initial !important; background: #fff;');
        form.id = "carcodesms-form";
        form.innerHTML = '<input type="hidden" name="src" value="' + refFrom + '" /><input type="hidden" name="To" value="' + smsTo + '" />';

        var carPreferences = getCarPreferences(target.dataset) || carPreferencesFromScript;

        cw.addFormValues(form, cw.data);
        cw.addFormValues(form, carPreferences);
        cw.addFormValue(form, 'source', cw.isMobile ? "widget_mobile" : "widget_wired");

        if(!carPreferences || !carPreferences.vin) {
             var vin = getPageVIN();
             if (vin) { cw.addFormValue(form, 'vin', vin); }
        }

        //add lead tags
        if(leadTags) { cw.addFormValue(form, 'leadTags', leadTags); }

        //add visitor id
        if (edVisitorId) { cw.addFormValue(form, 'cookie', edVisitorId); }

        //add refering url
        if (referringUrl) { cw.addFormValue(form, 'referringurl', referringUrl); }

        //TODO: CC-1633 CW: get value from style
        var showNameInput = false;

        if(showNameInput) {
          form.appendChild(labelName);
          form.appendChild(inputName);
          form.appendChild(nameInvalid);
        }

        var isServiceDepartment = null;
        if (numbers && numbers instanceof Array) {
            isServiceDepartment = numbers.some(function(number) {
                return number.match(/service/i);
            });
        }

        /**
         * If Service Department doesn't exist - show all messages
         */
        if (!isServiceDepartment) {
            cannedMessages = ["schedule a test drive","lease a vehicle","discuss financing options","get information about vehicle","purchase a vehicle","find my perfect car","speak with a service agent","schedule a service appointment"];
        }
        else {
            /**
            * If Service Department exists - show messagess according to selection
            */
            if (target.text.match(/Service/i)) {
                cannedMessages = ["speak with a service agent","schedule a service appointment"];
            }
            else {
                cannedMessages = ["schedule a test drive","lease a vehicle","discuss financing options","get information about vehicle","purchase a vehicle","find my perfect car"];
            }
        }

        var cannedMessagesElement = document.createElement('div');
        cannedMessagesElement.setAttribute('style', 'margin-bottom: 10px;');

        cannedMessages.forEach(function(message) {
            var cannedMessage = document.createElement('div');
            cannedMessage.className = 'carcodesms_canned-message';
            cannedMessage.setAttribute('style', 'display: inline-block; margin: 5px 10px 5px 0 !important; padding: 0 10px !important; background-color: #ededed; color: #444; border-radius: 17px; border-width: 2px; border-style: solid; border-color: #8b8575; box-shadow: none; font-size: 14px; line-height: 28px; cursor: pointer;');

            cannedMessage.addEventListener('click', function() {
                document.getElementById('carcodesms_body').value = 'I\'d like to ' + message;
                isCannedMessageClicked = true;
                textInvalidity();
                trackAnalyticsEvent("Canned message button click", message);
            });
            cannedMessage.addEventListener('mouseover', function() {
                cannedMessage.style.borderColor = "#ff6633";
            });
            cannedMessage.addEventListener('mouseout', function() {
                cannedMessage.style.borderColor = '#8b8575';
            });

            cannedMessage.innerText = message;
            cannedMessagesElement.appendChild(cannedMessage);
        });

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(invalid);
        form.appendChild(textLabel);
        form.appendChild(text);
        form.appendChild(textInvalid);
        if(!cw.isMobile) {
          form.appendChild(cannedMessagesElement); /* switched on only for desktop views */
        }
        form.appendChild(submit);

        

        if (form.addEventListener) {
          form.addEventListener("submit", formPost, true);  //Modern browsers, true for useCapture, to avoid event bubbling which may interfere with site JS or mobile JS framework
        } else if (form.attachEvent) {
          form.attachEvent('onsubmit', formPost);            //Old IE
        }

        var inputInvalidity = function() {
              checkInvalidity(input);
            },
            nameInvalidity = function() {
              checkInvalidity(inputName)
            },
            textInvalidity = function() {
              checkInvalidity(text);
            };

        var isIE10 = navigator.userAgent.indexOf('Trident/6.0') > -1;
        var isIE11 = navigator.userAgent.indexOf('Trident/7.0') > -1;

        if (text.addEventListener) {
          if(isIE11 || isIE10) { //for ie10 & ie11
            text.addEventListener('change', textInvalidity);
            text.addEventListener('keyup', textInvalidity);
            text.addEventListener('paste', textInvalidity);

            
          } else {
            text.addEventListener("input", textInvalidity);  //Modern browsers, true for useCapture, to avoid event bubbling which may interfere with site JS or mobile

            
          }
          // JS framework
        } else if (text.attachEvent) {
          text.attachEvent('onchange', textInvalidity);            //Old IE
          text.attachEvent('onkeyup', textInvalidity);            //Old IE
          text.attachEvent('onpaste', textInvalidity);            //Old IE

          
        }

        if (input.addEventListener) {
          if(isIE11 || isIE10) { //for ie10 & ie11
            input.addEventListener('change', inputInvalidity);
            input.addEventListener('keyup', inputInvalidity);
            input.addEventListener('paste', inputInvalidity);
          } else {
            input.addEventListener("input", inputInvalidity);  //Modern browsers, true for useCapture, to avoid event bubbling which may interfere with site JS or mobile
          }
          // JS framework
        } else if (input.attachEvent) {
          input.attachEvent('onchange', inputInvalidity);            //Old IE
          input.attachEvent('onkeyup', inputInvalidity);            //Old IE
          input.attachEvent('onpaste', inputInvalidity);            //Old IE
        }

        if (submit.addEventListener) {
          submit.addEventListener("click", formPost, true);  //Modern browsers
        } else if (submit.attachEvent) {
          submit.attachEvent('onsubmit', formPost);            //Old IE
        }

        return [msg, form];
      }

      this.showModal = function(e) {
        cw.widgetLog("showing modal");
        var body = document.getElementsByTagName("body")[0];
        var target = closestTag(e.target, "a") || e.currentTarget;

        if (body) {

          var oldModal = document.getElementById("carcodesms-modal");
          if (oldModal) {
            oldModal.parentNode.removeChild(oldModal);
          }

          var div = document.createElement('div'),
              titleBar = document.createElement('div'),
              title = document.createElement('div'),
              content = document.createElement('div'),
              close = document.createElement('a'),
              formWithMsg = cw.build(target, e);

          div.id = "carcodesms-modal";
          div.setAttribute("style", "font-family: Helvetica, Arial, sans-serif; position: fixed; width: calc(100% - 40px); max-width: 600px; height: 100%; height: auto; max-height: 600px; top: 20px; left: 20px; background: #F2F2F2; z-index: 2147483648; border: solid 2px #ff6633; box-shadow: -4px 4px 8px rgba(0,0,0,0.35); overflow: auto !important; box-sizing:border-box; -webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px; text-shadow: initial !important;");

          titleBar.id = "carcodesms-title-bar";
          titleBar.setAttribute("style", "background:#ff6633; color:#ffffff; display: block; width: 100%; height: 30px; padding: 5px 8px !important; box-sizing: border-box");

          title.id = "carcodesms-title";
          title.setAttribute('style', 'float: left !important;');
          title.innerHTML = "Text Us";

          close.innerHTML = "x";
          close.setAttribute("style", "color:#ffffff; float: right !important; display: block; margin-top: 0 !important; margin-right: 0 !important;font-size: 20px; width: 1em; height: 1em; background: transparent; border: none; text-align: center; font-weight: lighter; padding: 0 !important; text-decoration: none; font-family: helvetica; box-sizing: content-box; line-height: 1em;");
          close.setAttribute("href", "#");

          content.id = "carcodesms-modal-msg";
          content.setAttribute('style', 'margin: 20px auto 0 !important; font-size: 20px; line-height: 26px; width: 100%; position: relative;');
          content.appendChild(formWithMsg[0]);
          content.appendChild(formWithMsg[1]);

          titleBar.appendChild( title );
          titleBar.appendChild( close );
          div.appendChild( titleBar );
          div.appendChild( content );

          body.appendChild( div );

          cw.sizeModal();

          if (window.addEventListener) {
            window.addEventListener("resize", cw.sizeModal, false); //Modern browsers
            window.addEventListener("scroll", cw.sizeModal, false); //Modern browsers
          } else if (window.attachEvent) {
            window.attachEvent('onresize', cw.sizeModal);               //Old IE
            window.attachEvent('onscroll', cw.sizeModal);               //Old IE
          }

          if (close.addEventListener) {
            close.addEventListener("click", cw.closeClickHandler, false); //Modern browsers
          } else if (close.attachEvent) {
            close.attachEvent('onsubmit', cw.closeClickHandler);   //Old IE
          }

          if (!cw.isMobile) {
            var carcodesms_number = formWithMsg[1].querySelector("#carcodesms_number");
            carcodesms_number && carcodesms_number.focus();
          }

        }
      }

      this.closeClickHandler = function(event) {
        if (cw.enableAnalytics) {
          trackAnalyticsEvent("Close modal click");
        }

        // Don't follow link
        if ( event.preventDefault ) event.preventDefault();
        event.returnValue = false;

        // Remove fullscreen modal
        cw.removeModal();
      }
    }

    if (window.__carcode && typeof window.__carcode.ready === "function") {
      var dealerId = "2505";
      var dealerName = "Mercedes-Benz of Albuquerque";
      window.__carcode.ready({dealerId: dealerId, dealerName:dealerName});
    }

  //render widgets/tracker_operations
  var EDWT = (function() {

    function _get_tracker_data() {
        var client_ip = "10.221.12.151";
        var loc_id = "12034";
        return {loc_id: loc_id, name: "carcode_btn_click", widget: "pop_up", client_ip: client_ip, dealer_website_provider: dealerWebsiteProvider, widget_btn_position: "bottom center"};
    }

    function _get_fb_tracker_data() {
      var client_ip = "10.221.12.151";
      var loc_id = "12034";
      return {loc_id: loc_id, name: "fb_btn_click", client_ip: client_ip, dealer_website_provider: dealerWebsiteProvider};
    }

    function _is_mobile() {
        var placeholder_is_mobile = "desktop";
        return (placeholder_is_mobile === "mobile");
    }

  return {
    init: function(EDM) {
      var data = _get_tracker_data();
      var data_fb = _get_fb_tracker_data();

      if (_is_mobile()) {
        data.edwpg = "mobile_dealer_site_text_widget";
        data.edwcat = "mobile_dealer_site_text";
        data.edwsynpartner = "third_party_compact";
      } else {
        data.edwpg = "dealer_site_text_widget";
        data.edwcat = "dealer_site_text";
        data.edwsynpartner = "third_party_site";
      }

      this.data = data;
      this.dataFacebook = data_fb;
      this.tracker = EDM.createTracker("edcc9821");
      this.init_operations();
    },

    init_operations: function() {
      this.init_fb_tracking();
      this.open_form();
    },

    listener_close_form: null,

    /**
     * FB button tracking code
     */
    init_fb_tracking: function() {
      var self = this;

      var facebookBtn = document.querySelector('.fb-messengermessageus');
      if(facebookBtn) {
        self.dataFacebook.messenger_app_id = facebookBtn.getAttribute('messenger_app_id');
        self.dataFacebook.page_id = facebookBtn.getAttribute('page_id');

        //send FB button impression trackEvent
        var tracker_data = JSON.parse(JSON.stringify(self.dataFacebook));
        tracker_data.name = "fb_btn_impression";
        self.tracker.trackEvent("link_impression", tracker_data);
      }
    },

    /**
     * Method returns current default clickable element
     *
     * IMPORTANT:
     * This behavior is different from default widget since there is a panel and default clickable element is placed in it.
     */
    get_current_default_element: function() {
        return document.getElementById('CarcodeWidgetHubWidgetsTextUsButton');
    },

    /**
     * Method returns current submit
     */
    get_current_submit_button: function() {
        return document.querySelector('[data-submit-slug="d9k3a853"]') || document.getElementById('carcodesms_submit');
    },

     open_form: function() {
        var self = this;
        var elementArray = [];

        var defaultElement = self.get_current_default_element();
        var customElements = [].slice.call(document.querySelectorAll(".sms-button"));
        if (customElements.length === 0) {
            customElements = [].slice.call(document.querySelectorAll(".smsbutton"));
        }
        for(var j = 0; j < customElements.length; j++) {
            elementArray.push(customElements[j]);
        }
        if(defaultElement !== null) {
            elementArray.push(defaultElement);
        }

        for(var i = 0; i < elementArray.length; i++) {
            elementArray[i].addEventListener("click", function(e) {
                if (!e.target.dataset.chatButton) {
                    //tracker_data = JSON.parse(JSON.stringify(self.data));
                    //self.tracker.trackEvent('link_click', tracker_data);
                    var elements = document.querySelectorAll("#carcodesms-modal-msg ul li a");
                    if (elements.length > 0) {
                        self.bind_events_for_modal(elements);
                    } else {
                        self.bind_events_for_form(self);
                    }
                }
            });
        }

    },

    bind_events_for_form: function(self, data) {
      self.submit_form(data);
      self.close_form();
    },

    unbind_close_form: function() {
      var element = document.querySelector("#carcodesms-title-bar a[href='#']");
      element.removeEventListener('click', this.listener_close_form, false);
    },

    bind_events_for_modal: function(elements) {
      var self = this;
      self.close_form();
      data = JSON.parse(JSON.stringify(self.data));
      for(var i = 0, len = elements.length; i < len; ++i) {
        elements[i].addEventListener("click", function(){
          data.name = 'carcode_panel_text_category';
          data.widget = 'text_pop_up';
          data.selection = this.text.match(/sales|appraisal/i) ? 'sales' : 'service';
          self.tracker.trackEvent('link_click', data);
          self.bind_events_for_form(self, {selection: data.selection});
        });
      };
    },

    submit_form: function(data) {
      var self = this;
      var element = self.get_current_submit_button();
      element.addEventListener("click", function(){
        if(!document.querySelector("[id$=_invalid]")) {
          self.unbind_close_form();
          tracker_data = JSON.parse(JSON.stringify(self.data));
          if(data) {
            tracker_data = extend(tracker_data, data);
          }
          tracker_data.name = 'carcode_panel_btn_click';
          tracker_data.widget = 'text_pop_up';
          self.tracker.trackEvent("text_message_submit", tracker_data);
        }
      });
    },

    close_form: function() {
      var self = this;
      var element = document.querySelector("#carcodesms-title-bar a[href='#']");
      self.listener_close_form = function(){
        tracker_data = JSON.parse(JSON.stringify(self.data));
        tracker_data.name = 'carcode_panel_btn_click';
        tracker_data.widget = 'text_pop_up';
        self.tracker.trackEvent("text_message_cancel", tracker_data);
      };
      element.addEventListener("click", self.listener_close_form);
    },

    /**
     * Init widgets hub that includes selector for 'Live Chat', 'Text Us'  and 'Facebook Messenger' widgets
     */
    init_widgets_hub: function() {

        var self = this;
        var data = _get_tracker_data();

        if (_is_mobile()) {
            data.edwpg = "mobile_dealer_site_panel_widget";
            data.edwcat = "mobile_dealer_site_text";
            data.edwsynpartner = "third_party_compact";
        } else {
            data.edwpg = "dealer_site_panel_widget";
            data.edwcat = "dealer_site_text";
            data.edwsynpartner = "third_party_site";
        }
        this.data = data;
        var tracker_data = JSON.parse(JSON.stringify(self.data));
        this.tracker = this.tracker || EDM.createTracker("edcc9821");

        /* Init operations for widgets hub */
        tracker_data.name = "carcode_panel_impression";
        tracker_data.widget = "panel_pop_up";
        self.tracker.trackEvent('link_impression', tracker_data);

    },

    track_event: function(widget, event, eventType) {
        var self = this;
        var tracker_data = JSON.parse(JSON.stringify(self.data));
        this.tracker = this.tracker || EDM.createTracker("edcc9821");
        tracker_data.name = event;
        tracker_data.widget = widget;
        if (!eventType) {
            eventType = 'link_click';
        }
        self.tracker.trackEvent(eventType, tracker_data);
    }

  }
}());

  // adding css reset for widget elements
  // we need it to protect our widget elements from incorrect styles of dealer sites
  ready(function() {
    var head = document.head || document.getElementsByTagName('head')[0],
            styleElement = document.createElement('style'),
            styleText = "#carcodesms-default-widget,#carcodesms-default-widget *,#carcodesms-modal,#carcodesms-modal *{float:none !important;padding:0 !important;margin:0 !important;position:static;width:auto;height:auto;overflow:visible !important;visibility:visible;transform:none;border:none;background:0 0;animation:none}#carcodesms-modal div,#carcodesms-modal form,#carcodesms-modal li,#carcodesms-modal p,#carcodesms-modal ul{display:block}#carcodesms-modal input,#carcodesms-modal textarea{display:inline-block}#carcodesms-modal a,#carcodesms-modal label,#carcodesms-modal span{display:inline}";

    styleElement.type = 'text/css';

    if(styleElement.styleSheet) {
      styleElement.styleSheet.cssText = styleText;
    } else {
      styleElement.appendChild(document.createTextNode(styleText));
    }

    head.appendChild(styleElement);
  });

  ready(function(){

     // render widgets/tracker
     var edw = document.createElement('script');
     edw.type = 'text/javascript';
     edw.async = true;
     edw.src = "https://static.ed.edmunds-media.com/unversioned/libs/edw/edw-lib-0.0.2-min.js";
     edw.addEventListener('load', function (e) {

     

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CarCodeStorage = function () {
    function CarCodeStorage() {
        var storageType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'localstorage';

        _classCallCheck(this, CarCodeStorage);

        this.storageType = storageType;
        this.prefix = '__carcode_';
    }

    _createClass(CarCodeStorage, [{
        key: 'get',
        value: function get(key) {
            if (this.storageType === 'localstorage') {
                return localStorage.getItem(this.prefix + key);
            }
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            if (this.storageType === 'localstorage') {
                localStorage.setItem(this.prefix + key, value);
            }
        }
    }, {
        key: 'remove',
        value: function remove(key) {
            if (this.storageType === 'localstorage') {
                localStorage.removeItem(this.prefix + key);
            }
        }
    }, {
        key: 'increaseValue',
        value: function increaseValue(key) {
            if (this.storageType === 'localstorage') {
                var value = this.get(key);
                value++;
                this.set(key, value);
            }
        }
    }]);

    return CarCodeStorage;
}();

function WidgetsStylesheet(styles) {

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    this.calculateButtonPosition(styles);
    var css = this.getStyles(styles);
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}

WidgetsStylesheet.prototype.calculateButtonPosition = function (styles) {

    styles.top = 'auto';
    styles.right = 'auto';
    styles.bottom = 'auto';
    styles.left = 'auto';
    styles.transform = 'none';
    styles.transformOrigin = '0 0';

    styles.marginTop = '0';
    styles.marginRight = '0';
    styles.marginBottom = '0';
    styles.marginLeft = '0';

    styles.paddingTop = '0';
    styles.paddingRight = '20px';
    styles.paddingBottom = '0';
    styles.paddingLeft = '40px';

    styles.widgetTop = 'auto';
    styles.widgetRight = 'auto';
    styles.widgetBottom = 'auto';
    styles.widgetLeft = 'auto';

    styles.buttonIconTransform = 'rotate(0) translateX(2px) translateY(2px)';
    styles.buttonHubCounterTransform = 'rotate(0) translateX(2px) translateY(-1px)';

    var _width = this.parseIntStyleValue(styles.hubButtonWidth);
    var _widthHalf = Math.ceil(_width / 2);

    switch (styles.widgetPosition) {

        case 'bottom right':
            styles.bottom = '0';
            styles.right = '0';
            styles.transform = 'none';
            styles.transformOrigin = '0 0';
            styles.borderRadius = '5px 5px 0 0';
            styles.marginRight = styles.hubButtonPosition.marginRight;

            styles.widgetRight = '0';
            styles.widgetBottom = '0';
            break;

        case 'bottom center':
            styles.bottom = '0';
            styles.right = '50%';
            styles.transform = 'translate(' + _widthHalf + 'px, 0)';
            styles.transformOrigin = '0 0';
            styles.borderRadius = '5px 5px 0 0';
            styles.marginLeft = styles.hubButtonPosition.marginLeft;

            styles.widgetRight = 'calc(50% - 160px)';
            styles.widgetBottom = '0';
            break;

        case 'bottom left':
            styles.bottom = '0';
            styles.left = '0';
            styles.transform = 'none';
            styles.transformOrigin = '0 0';
            styles.borderRadius = '5px 5px 0 0';
            styles.marginLeft = styles.hubButtonPosition.marginLeft;

            styles.widgetLeft = '0';
            styles.widgetBottom = '0';
            break;

        case 'side left center':
            styles.top = '50%';
            styles.left = '0';
            styles.transform = 'rotate(-90deg) translate(-' + _widthHalf + 'px, 0)';
            styles.transformOrigin = '0 0';
            styles.borderRadius = '0 0 5px 5px';
            styles.marginTop = styles.hubButtonPosition.marginTop;
            styles.buttonIconTransform = 'rotate(90deg) translateX(-8px) translateY(0px)';
            styles.buttonHubCounterTransform = 'rotate(90deg) translateX(-8px) translateY(-4px)';
            styles.widgetLeft = '0';
            styles.widgetBottom = '0';
            break;

        case 'side lower left':
            styles.bottom = '30%';
            styles.left = styles.hubButtonPosition.left;
            styles.transform = 'rotate(-90deg) translate(-' + _widthHalf + 'px, 0)';
            styles.transformOrigin = '0 0';
            styles.borderRadius = '0 0 5px 5px';
            styles.marginBottom = styles.hubButtonPosition.marginBottom;
            styles.buttonIconTransform = 'rotate(90deg) translateX(-8px) translateY(0px)';
            styles.buttonHubCounterTransform = 'rotate(90deg) translateX(-8px) translateY(-4px)';
            styles.widgetLeft = '0';
            styles.widgetBottom = '0';
            break;

        case 'side right center':
            styles.top = '50%';
            styles.right = '0';
            styles.transform = 'rotate(-90deg) translate(' + _widthHalf + 'px, 0)';
            styles.transformOrigin = '100% 100%';
            styles.borderRadius = '5px 5px 0 0';
            styles.marginTop = styles.hubButtonPosition.marginTop;
            styles.buttonIconTransform = 'rotate(90deg) translateX(-5px) translateY(0px)';
            styles.buttonHubCounterTransform = 'rotate(90deg) translateX(-5px) translateY(-4px)';
            styles.widgetRight = '0';
            styles.widgetBottom = '0';
            break;

        case 'side lower right':
            styles.bottom = '30%';
            styles.right = styles.hubButtonPosition.right;
            styles.transform = 'rotate(-90deg) translate(' + _widthHalf + 'px, 0)';
            styles.transformOrigin = '100% 100%';
            styles.borderRadius = '5px 5px 0 0';
            styles.marginBottom = styles.hubButtonPosition.marginBottom;
            styles.buttonIconTransform = 'rotate(90deg) translateX(-5px) translateY(0px)';
            styles.buttonHubCounterTransform = 'rotate(90deg) translateX(-5px) translateY(-4px)';
            styles.widgetRight = '0';
            styles.widgetBottom = '0';
            break;

    }
};

WidgetsStylesheet.prototype.parseIntStyleValue = function (value) {
    var regEx = /((-?)\d+)/;
    var _value = value.match(regEx);
    _value = _value ? _value[0] : 0;
    return parseInt(_value);
};

WidgetsStylesheet.prototype.getStyles = function (styles) {

    var _styles = '\n\n    /** Widget main button (Hub button) **/\n\n    button.carcode-widget_main-hub-button,\n    button.carcode-widget_main-hub-button:hover {\n        position: fixed;\n        z-index: 2147483641; /* For avoiding of overriding by dealership site styles */\n\n        top:    ' + styles.top + ';\n        right:  ' + styles.right + ';\n        bottom: ' + styles.bottom + ';\n        left:   ' + styles.left + ';\n\n        width:  ' + styles.hubButtonWidth + ';\n        height: ' + styles.hubButtonHeight + ';\n\n        transform:        ' + styles.transform + ';\n        transform-origin: ' + styles.transformOrigin + ';\n\n        padding-top:    ' + styles.paddingTop + ';\n        padding-right:  ' + styles.paddingRight + ';\n        padding-bottom: ' + styles.paddingBottom + ';\n        padding-left:   ' + styles.paddingLeft + ';\n\n        margin-top:    ' + styles.marginTop + ';\n        margin-right:  ' + styles.marginRight + ';\n        margin-bottom: ' + styles.marginBottom + ';\n        margin-left:   ' + styles.marginLeft + ';\n\n        background:  ' + styles.hubButtonColor + ' !important;\n        color:       ' + styles.hubButtonTextColor + ' !important;\n\n        border: 0;\n        border-radius: ' + styles.borderRadius + ';\n\n        outline: none;\n        cursor: pointer;\n\n        font-family:  ' + styles.hubButtonFont + ';\n        font-size:    ' + styles.hubButtonFontSize + ';\n        font-weight:  normal;\n        line-height:  ' + styles.hubButtonHeight + ';\n\n    }\n        button.carcode-widget_main-hub-button.is-hidden {\n            display: none;\n        }\n        button.carcode-widget_main-hub-button > .carcode-widget_button-icon {\n            position: absolute;\n            top: 3px;\n            left: 0;\n            text-align: left;\n            display: inline-block;\n            padding: 0 10px 0 20px;\n            vertical-align: middle;\n            transform: ' + styles.buttonIconTransform + ';\n        }\n        button.carcode-widget_main-hub-button > .carcode-widget_main-hub-counter {\n            box-sizing: content-box;\n            width: 16px;\n            position: absolute;\n            top: 3px;\n            left: 0;\n            text-align: center;\n            display: inline-block;\n            padding: 0 10px 0 20px;\n            vertical-align: middle;\n            transform: ' + styles.buttonHubCounterTransform + ';\n            color: ' + styles.hubButtonColor + ';\n            font-size: 14px;\n        }\n        button.carcode-widget_main-hub-button > .carcode-widget_button-icon > svg {\n            fill: ' + styles.hubButtonTextColor + ';\n        }\n        button.carcode-widget_main-hub-button.notification > .carcode-widget_button-icon > svg {\n            transform: scale(1.4);\n            animation: _animationBlinkOpacityAnimation 1s linear 0s infinite alternate;\n        }\n\n\n    /** General widget styles **/\n\n    div.carcode-widget_widget {\n        z-index: 2147483642;\n        position: fixed;\n        top: ' + styles.widgetTop + ';\n        right: ' + styles.widgetRight + ';\n        bottom: ' + styles.widgetBottom + ';\n        left: ' + styles.widgetLeft + ';\n        width: 320px;\n        height: auto;\n        max-height: 100vh;\n        overflow: hidden;\n\n        background: #f5f5f5;\n        box-shadow: 0 4px 8px 0 rgba(85, 85, 85, 0.5);\n        border-radius: 5px;\n\n        font-style: normal;\n        font-weight: bold;\n        font-size: 14px;\n        font-family: Arial, Helvetica, sans-serif;\n    }\n\n    div.carcode-widget_widget--widgets-hub {\n        min-height: 220px;\n    }\n\n    div.carcode-widget_widget--chat {\n        min-height: 480px;\n    }\n\n    div.carcode-widget_widget.is-hidden {\n        display: none;\n    }\n    div.carcode-widget_widget.is-visible {\n        display: block;\n    }\n\n    /** Widget content section **/\n\n    div.carcode-widget_widget-content {\n        position: relative;\n        overflow-y: auto;\n        min-height: 160px;\n     }\n\n        div.carcode-widget_widget--chat div.carcode-widget_widget-content {\n            height: 355px;\n        }\n\n        .carcode-widget_widget-content::-webkit-scrollbar {\n            width: 5px;\n        }\n        .carcode-widget_widget-content::-webkit-scrollbar-thumb {\n            background: #e6e6e6;\n            border-radius: 2px;\n        }\n\n    @media (max-width: 480px) {\n\n        div.carcode-widget_widget {\n            width: auto;\n            right: 0;\n            left: 0;\n        }\n\n        div.carcode-widget_widget--widgets-hub {\n            box-shadow: 0 4px 10px 4px rgba(85, 85, 85, .5)\n        }\n        div.carcode-widget_widget--chat {\n            border-radius: 0;\n        }\n        div.carcode-widget_widget--chat.is-visible {\n            display: flex;\n            flex-direction: column;\n            height: 65vh;\n            min-height: 0;\n        }\n\n        /* No flex on mobile devices */\n        div.carcode-widget_widget--chat.is-visible div.carcode-widget_widget-header {\n            flex: 0 0 60px;\n        }\n        div.carcode-widget_widget--chat.is-visible div.carcode-widget_widget-content {\n            flex: 1 1 auto;\n        }\n        div.carcode-widget_widget--chat.is-visible div.carcode-widget_input {\n            flex: 0 0 62px;\n        }\n\n        /* When focus is in chat input and mobile keyboard is open */\n        div.carcode-widget_widget--chat.is-visible.is-active {\n            display: block;\n            height: auto;\n            min-height: 0;\n            max-height: none;\n        }\n        div.carcode-widget_widget--chat.is-visible.is-active div.carcode-widget_widget-header {\n            display: block;\n            height: 60px;\n        }\n        div.carcode-widget_widget--chat.is-visible.is-active div.carcode-widget_widget-content {\n            display: block;\n            height: 100px;\n            min-height: 100px;\n        }\n        div.carcode-widget_widget--chat.is-visible.is-active div.carcode-widget_input {\n            display: block;\n            min-height: 62px;\n        }\n\n    }\n\n    @media (max-height: 500px) {\n        div.carcode-widget_widget--chat.is-visible.is-active div.carcode-widget_widget-content {\n            height: 85px;\n            min-height: 85px;\n        }\n    }\n\n    /** Widget actions (buttons \'Collapse\', \'Close\' etc.) **/\n\n    div.carcode-widget_widget-actions {\n        position: absolute;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        left: 0;\n    }\n        button.carcode-widget_widget-actions__back,\n        button.carcode-widget_widget-actions__back:hover,\n        button.carcode-widget_widget-actions__collapse,\n        button.carcode-widget_widget-actions__collapse:hover {\n            margin: 0;\n            padding: 0;\n            background: transparent !important;\n            border: 0;\n            cursor: pointer;\n            -webkit-appearance: none;\n            -webkit-border-radius: 0;\n            border-radius: 0;\n            outline: none\n        }\n        button.carcode-widget_widget-actions__back svg,\n        button.carcode-widget_widget-actions__collapse svg {\n            fill: #555;\n        }\n        button.carcode-widget_widget-actions__back {\n            position: absolute;\n            top: 50%;\n            left: 20px;\n            margin-top: -10px !important;\n        }\n            button.carcode-widget_widget-actions__back .carcode-widget_button-icon {\n                display: inline-block;\n                transform: rotate(90deg);\n            }\n        button.carcode-widget_widget-actions__collapse {\n            position: absolute;\n            top: 50%;\n            right: 20px;\n            margin-top: -10px !important;\n        }\n\n    /** Widget title **/\n\n    .carcode-widget_widget-header {\n        position: relative;\n        min-height: 60px;\n        margin: 0;\n        padding-top: 19px;\n        padding-right: 15px;\n        padding-bottom: 19px;\n        padding-left: 15px;\n        box-sizing: border-box;    \n    }\n        .carcode-widget_widget--chat .carcode-widget_widget-header {\n            padding-top: 10px;\n            padding-right: 15px;\n            padding-bottom: 10px;\n            padding-left: 55px;\n        }\n        .carcode-widget_widget-header__subtitle {\n            font-size: 14px;\n            line-height: 18px;\n            font-weight: normal;\n            color: #999;\n        }\n        .carcode-widget_widget-header__title {\n            width: auto;\n            margin-right: 25px;\n            height: 22px;\n            overflow: hidden;\n            text-overflow: ellipsis;\n            white-space: nowrap;\n            font-size: 16px;\n            font-weight: bold;\n            color: #555;\n        }\n    .carcode-widget_widget-header::after {\n        content: \'\';\n        position: absolute;\n        bottom: 0;\n        right: 20px;\n        left: 20px;\n        display: block;\n        height: 1px;\n        border-bottom: 1px solid #e6e6e6;\n    }\n\n\n    /** Chat widget - Messages style **/\n\n    div.carcode-widget_messages {\n        padding: 20px 20px 0 20px;\n    }\n    div.carcode-widget_message {\n        margin: 0 0 10px 0;\n    }\n\n        div.carcode-widget_message__author {\n            margin: 0 15px 6px;\n            font-style: normal;\n            font-weight: 600;\n            font-size: 11px;\n            font-family: Arial, Helvetica, sans-serif;\n            color: #000;\n        }\n        div.carcode-widget_message__body {\n            display: inline-block;\n            max-width: calc(100% - 60px); /* 240px for desktop */\n            margin: 0;\n            padding: 10px 15px;\n            overflow-wrap: break-word;\n            word-wrap: break-word;\n            -webkit-box-sizing: border-box;\n            -moz-box-sizing: border-box;\n            box-sizing: border-box;\n            border-radius: 8px;\n            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);\n            font-style: normal;\n            font-weight: normal;\n            font-size: 14px;\n            line-height: 1.385;\n            font-family: Arial, Helvetica, sans-serif;\n            background: #fff;\n            color: #4a4a4a;\n        }\n            div.carcode-widget_message__body a,\n            div.carcode-widget_message__body a:hover,\n            div.carcode-widget_message__body a:visited,\n            div.carcode-widget_message__body a:active {\n                background: transparent !important;\n                color: ' + styles.primaryColor + ' !important;\n            }\n            div.carcode-widget_message__body a img {\n                margin: 5px 0;\n            }\n        div.carcode-widget_message__info {\n            margin: 6px 15px 0;\n            font-style: normal;\n            font-weight: normal;\n            font-size: 11px;\n            font-family: Arial, Helvetica, sans-serif;\n            line-height: 11px;\n            color: #bbb;\n        }\n            div.carcode-widget_message__info span {\n                display: inline-block;\n                vertical-align: bottom;\n            }\n            div.carcode-widget_message__info span.carcode-widget_message__info__author {\n                max-width: 180px;\n                margin-right: 5px;\n                overflow: hidden;\n                font-weight: bold;\n                white-space:nowrap;\n                text-overflow:ellipsis;\n            }\n\n        div.carcode-widget_message.message {\n            text-align: right;\n        }\n            div.carcode-widget_message.message div.carcode-widget_message__body {\n                background: #e3eaec;\n                box-shadow: none;\n                text-align: left;\n            }\n\n        div.carcode-widget_message.error div.carcode-widget_message__body {\n            background: #ff6666;\n        }\n\n        div.carcode-widget_message.wsError div.carcode-widget_message__body {\n            background: #ff6666;\n        }\n\n        div.carcode-widget_message.loading {\n            color: #a0a0a0;\n        }\n\n    div.carcode-widget_message__attachments {}\n\n    div.carcode-widget_message__attachments a.carcode-widget_attachment-file-link {\n        display: inline-block;\n        box-sizing: border-box;\n        max-width: 100%;\n        margin: 0 10px 0 0;\n        padding: 5px 5px 5px 20px;\n        font-weight: bold;\n        background: transparent url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjQxNEM5ODBCMEI0MTFFNjlGRURFQTA4NTMwMkIxQTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjQxNEM5ODFCMEI0MTFFNjlGRURFQTA4NTMwMkIxQTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGNDE0Qzk3RUIwQjQxMUU2OUZFREVBMDg1MzAyQjFBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGNDE0Qzk3RkIwQjQxMUU2OUZFREVBMDg1MzAyQjFBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrZ+iSUAAABFSURBVHjaYpw5c+Z/BsKAEYhbgLgGJsDEQDyoBuIOcjSCQDkQ94IYLAykgyIg/kaKRkZkDrEaMQKQiYFMMKpxhGsECDAA1b8IYFrxv0YAAAAASUVORK5CYII=\') no-repeat 0 5px;\n        color: #4a4a4a;\n\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n\n    div.carcode-widget_message__attachments a.carcode-widget_attachment-image-link:not(.is-loaded) {\n        display: block;\n        width: 185px;\n        height: 100px;\n    }\n\n    div.carcode-widget_message__attachments a.carcode-widget_attachment-image-link img {\n        display: block;\n        max-width: 100%;\n    }\n    div.carcode-widget_message__attachments a.carcode-widget_attachment-image-link:hover img {\n        opacity: .95;\n    }\n\n    div.carcode-widget_dealer-texting {\n        position: relative;\n        width: 240px;\n        margin: 10px 0;\n        padding: 20px;\n        background: #fff;\n        border-radius: 8px;\n        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .08);\n    }\n        div.carcode-widget_dealer-texting__icon,\n        div.carcode-widget_dealer-texting__icon::before,\n        div.carcode-widget_dealer-texting__icon::after {\n            position: absolute;\n            display: inline-block;\n            width: 6px;\n            height: 6px;\n            border-radius: 3px;\n            background-color: #999;\n\n            animation-name: _animationLoadingIndicator;\n            animation-duration: .9s;\n            animation-timing-function: linear;\n            animation-iteration-count: infinite;\n        }\n        div.carcode-widget_dealer-texting__icon {\n            top: 17px;\n            left: 20px;\n        }\n            div.carcode-widget_dealer-texting__icon::before {\n                content: \'\';\n                top: 0;\n                left: 12px;\n                animation-delay: .6s;\n                background-color: #bbb;\n            }\n            div.carcode-widget_dealer-texting__icon::after {\n                content: \'\';\n                top: 0;\n                left: 24px;\n                animation-delay: 1.2s;\n                background-color: #ddd;\n            }\n\n\n    /** Chat widget - File input **/\n\n    .carcode-widget_file-input {\n        position: absolute;\n        left: 0;\n        bottom: 10px;\n        width: 40px;\n        height: 40px;\n        margin: 0;\n        float: left;\n        overflow: hidden;\n    }\n        .carcode-widget_file-input .carcode-widget_file-input__icon,\n        .carcode-widget_file-input .carcode-widget_file-input__icon:hover {\n            z-index: 1;\n            position: absolute;\n            top: 10px;\n            left: 8px;\n            width: 24px;\n            height: 24px;\n            margin: 0;\n            padding: 0;\n            background: transparent !important;\n            box-shadow: none;\n            border: 0;\n        }\n            .carcode-widget_file-input .carcode-widget_file-input__icon .carcode-widget_button-icon {\n                display: inline-block;\n            }\n            .carcode-widget_file-input .carcode-widget_file-input__icon .carcode-widget_button-icon svg {\n                transform: scale(0.75);\n            }\n            .carcode-widget_file-input .carcode-widget_file-input__icon .carcode-widget_button-icon svg path {\n                fill: #a9a9a9;\n            }\n            .carcode-widget_file-input .carcode-widget_file-input__icon:hover .carcode-widget_button-icon svg path {\n                fill: ' + styles.primaryColor + ';\n            }\n        .carcode-widget_file-input .carcode-widget_file-input__field {\n            z-index: 2;\n            position: absolute;\n            top: 0;\n            right: 0;\n            bottom: 0;\n            left: 0;\n            width: 40px;\n            height: 40px;\n            margin: 0;\n            opacity: 0;\n        }\n\n        div.carcode-widget_chat-image-attachment {\n            position: relative;\n            display: inline-block;\n            vertical-align: middle;\n            margin: 3px;\n            width: 90px;\n            height: 60px;\n            border-radius: 5px;\n            background-color: #ccc;\n            background-repeat: no-repeat;\n            background-size: cover;\n            background-position: center center;\n            overflow: hidden;\n        }\n        div.carcode-widget_chat-file-attachment {\n            position: relative;\n            display: inline-block;\n            vertical-align: middle;\n            margin: 3px;\n            padding: 4px 25px 5px 10px;\n            width: auto;\n            height: auto;\n            max-width: calc(100% - 6px);\n            box-sizing: border-box;\n            border-radius: 5px;\n            background-color: #ccc;\n            overflow: hidden;\n            text-align: center;\n            white-space: nowrap;\n            text-overflow: ellipsis;\n        }\n            div.carcode-widget_chat-attachment-remove {\n                z-index: 2;\n                position: absolute;\n                top: 2px;\n                right: 2px;\n                width: 11px;\n                height: 11px;\n                border-radius: 5px;\n                background: rgba(0, 0, 0, .4) url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI2MjJBOUJFQUE5RTExRTY5QUQ1QzE3QTdENkUxODQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI2MjJBOUJGQUE5RTExRTY5QUQ1QzE3QTdENkUxODQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjYyMkE5QkNBQTlFMTFFNjlBRDVDMTdBN0Q2RTE4NDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjYyMkE5QkRBQTlFMTFFNjlBRDVDMTdBN0Q2RTE4NDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7CilyTAAAAd0lEQVR42izOsQ5AMBCA4avBIGGQeA+ehhGJhBfwOqx2q9XKszCZ6j+uydfrtb32nPd+EpEDGm8kqFEETDtaDMjQW747KiMWDUo8CLFgFg5VitX/Y7Vc9FmtrBBjsz+rb58bHU6MyCxq3jnr9rRuL6vUHvJXgAEAredH5cWpciIAAAAASUVORK5CYII=\') no-repeat center center;\n                cursor: pointer;\n            }\n                div.carcode-widget_chat-attachment-remove:hover,\n                div.carcode-widget_chat-attachment-remove:active {\n                    background-color: rgba(0, 0, 0, .75);\n                }\n        div.carcode-widget_widget-content-attachments-loading-indicator {\n            position: relative;\n            display: inline-block;\n            vertical-align: middle;\n            margin: 20px 20px 0;\n        }\n        div.carcode-widget_widget-content-attachments-loading-indicator,\n        div.carcode-widget_widget-content-attachments-loading-indicator::before,\n        div.carcode-widget_widget-content-attachments-loading-indicator::after {\n            display: inline-block;\n            width: 8px;\n            height: 8px;\n            border-radius: 100%;\n            background-color: #999;\n            animation-name: _animationLoadingIndicator;\n            animation-duration: 1.2s;\n            animation-timing-function: linear;\n            animation-iteration-count: infinite;\n        }\n        div.carcode-widget_widget-content-attachments-loading-indicator::before {\n            content: \'\';\n            position: absolute;\n            top: 0;\n            right: -20px;\n            animation-delay: .4s;\n            background-color: #bbb;\n        }\n        div.carcode-widget_widget-content-attachments-loading-indicator::after {\n            content: \'\';\n            position: absolute;\n            top: 0;\n            right: -40px;\n            animation-delay: .8s;\n            background-color: #ddd;\n        }\n\n        div.carcode-widget_chat-attachment + div.carcode-widget_widget-content-attachments-loading-indicator {\n            margin-top: 5px;\n        }\n        div.carcode-widget_widget-content-attachments-error {\n            padding: 15px 10px 0;\n            font-size: 12px;\n            font-weight: normal;\n            color: #e74c3c;\n        }\n\n\n    /** Chat widget - Message input **/\n\n    div.carcode-widget_input {\n        z-index: 10;\n        position: relative;\n        min-height: 62px;\n        \n        background-color: #fff ! important;\n        border-radius: 4px;\n    }\n        div.carcode-widget_input-field-wrapper {\n            margin-left: 40px;\n            width: calc(100% - 100px); /* 220px for desktop */\n        }\n        textarea.carcode-widget_input-field,\n        textarea.carcode-widget_input-field:focus {\n            display: inline-block;\n            width: 100%;\n            height: 20px;\n            min-height: 20px;\n            margin-top: 20px;\n            margin-bottom: 13px;\n            padding: 0;\n            box-sizing: border-box;\n            overflow: hidden;\n            -webkit-appearance: none;\n\n            resize: none;\n            border: none;\n            border-radius: 0;\n            box-shadow: none;\n            outline: none;\n            font-style: normal;\n            font-weight: normal;\n            font-size: 14px;\n            line-height: 20px;\n            font-family: Arial, Helvetica, sans-serif;\n\n            background-color: #fff !important;\n            color: #555555;\n        }\n        @media (max-width: 480px) {\n            textarea.carcode-widget_input-field,\n            textarea.carcode-widget_input-field:focus {\n                font-size: 16px;\n            }\n        }\n        div.carcode-widget_input.is-max-height {\n            max-height: 118px;\n            overflow-y: hidden !important;\n        }\n        textarea.carcode-widget_input-field.is-max-height {\n            max-height: 84px;\n            overflow-y: auto !important;\n        }\n        textarea.carcode-widget_input-field::-webkit-scrollbar,\n        textarea.carcode-widget_input-field::-webkit-scrollbar-track {\n            width: 6px;\n            background-color: #eee;\n        }\n        textarea.carcode-widget_input-field::-webkit-scrollbar-thumb {\n            width: 6px;\n            background-color: #c1c1c1;\n        }\n        button.carcode-widget_input-button {\n            position: absolute;\n            right: 0;\n            bottom: 10px;\n            margin: 0;\n            padding: 10px;\n\n            background: transparent !important;\n            border: 0;\n            font-style: normal;\n            font-weight: bold;\n            font-size: 14px;\n            font-family: Arial, Helvetica, sans-serif;\n            color: ' + styles.primaryColor + ' !important;\n            width: 60px;\n            cursor: pointer;\n            outline: none;\n            -webkit-appearance: none;\n            transition: none;\n        }\n        button.carcode-widget_input-button:hover {\n            background: #efefef !important;\n        }\n        button.carcode-widget_input-button:disabled {\n            background: transparent !important;\n            color: #bbbbbb !important;\n            cursor: not-allowed;\n        }\n\n\n    /** Widget loading indicator **/\n\n    div.carcode-widget_widget-loading {\n        width: 100%;\n        height: calc(100vh - 144px);\n        color: #bbbbbb;\n        font-style: normal;\n        font-weight: normal;\n        font-size: 14px;\n        font-family: Arial, Helvetica, sans-serif;\n        text-align: center;\n    }\n        div.carcode-widget_widget-loading__connecting {\n            margin-top: 43px;\n        }\n        div.carcode-widget_widget-loading__indicator {\n            position: relative;\n            margin-left: -40px;\n        }\n        div.carcode-widget_widget-loading__indicator,\n        div.carcode-widget_widget-loading__indicator::before,\n        div.carcode-widget_widget-loading__indicator::after {\n            display: inline-block;\n            width: 8px;\n            height: 8px;\n            border-radius: 100%;\n            background-color: #999;\n            animation-name: _animationLoadingIndicator;\n            animation-duration: 1.2s;\n            animation-timing-function: linear;\n            animation-iteration-count: infinite;\n        }\n        div.carcode-widget_widget-loading__indicator::before {\n            content: \'\';\n            position: absolute;\n            top: 0;\n            right: -20px;\n            animation-delay: .4s;\n            background-color: #bbb;\n        }\n        div.carcode-widget_widget-loading__indicator::after {\n            content: \'\';\n            position: absolute;\n            top: 0;\n            right: -40px;\n            animation-delay: .8s;\n            background-color: #ddd;\n        }\n\n\n    /** Widget Hub - Main buttons (\'Text Us\', \'Live Chat\', \'Facebook Messenger\') **/\n\n    div.carcode-widget_hub-buttons {\n        margin: 20px;\n        background: #fff !important;\n        border-radius: 3px;\n        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);\n    }\n        div.carcode-widget_hub-buttons > a {\n            display: block;\n        }\n        div.carcode-widget_hub-buttons > *:not(:last-child),\n        div.carcode-widget_hub-buttons > *:not(:last-child):hover {\n            border-bottom: 1px solid #e6e6e6;\n        }\n        button.carcode-widget_hub-button,\n        button.carcode-widget_hub-button:hover {\n            width: 100%;\n            margin: 0;\n            padding: 20px;\n            box-sizing: border-box;\n            background: #fff !important;\n            border: 0;\n            font-size: 16px;\n            font-weight: normal;\n            color: #4a4a4a !important;\n            cursor: pointer;\n\n            -webkit-appearance: none;\n            -webkit-border-radius: 0;\n        }\n        button.carcode-widget_hub-button span.carcode-widget_button-text {\n            font-family: Arial, Helvetica, sans-serif;\n            font-weight: normal;\n            color: #4a4a4a !important;\n        }\n    button.carcode-widget_hub-button.hub-button--live-chat,\n    button.carcode-widget_hub-button.hub-button--text-us,\n    button.carcode-widget_hub-button.hub-button--facebook-messenger {\n        position: relative;\n        padding-left: 57px;\n        background: #fff !important;\n        color: #4a4a4a !important;\n        text-align: left;\n    }\n        button.carcode-widget_hub-button.hub-button--live-chat .carcode-widget_button-icon,\n        button.carcode-widget_hub-button.hub-button--text-us .carcode-widget_button-icon,\n        button.carcode-widget_hub-button.hub-button--facebook-messenger .carcode-widget_button-icon {\n            position: absolute;\n            left: 20px;\n            top: 22px;\n            width: 20px;\n            height: 16px;\n            text-align: center;\n        }\n        button.carcode-widget_hub-button.hub-button--live-chat .carcode-widget_button-icon svg path,\n        button.carcode-widget_hub-button.hub-button--text-us .carcode-widget_button-icon svg path {\n            fill: ' + styles.primaryColor + ';\n        }\n        button.carcode-widget_hub-button.hub-button--facebook-messenger .carcode-widget_button-icon svg path {\n            fill: #007fff;\n        }\n        button.carcode-widget_hub-button.hub-button--live-chat.notification .carcode-widget_button-icon > svg {\n            animation: _animationTransformScaleAnimation 1.5s infinite ease-in-out;\n        }\n\n    div.carcode-widget_live-chat--counter {\n        position: absolute;\n        top: 50%;\n        right: 20px;\n        display: inline-block;\n        padding: 2px 10px;\n        margin-top: -10px;\n        font-size: 11px;\n        border-radius: 10px;\n        background: ' + styles.primaryColor + ';\n        color: #fff !important;\n    }\n     div.carcode-widget_live-chat--counter.is-hidden {\n         display: none;\n     }\n\n\n    /* Url previews */\n\n    .carcode-widget_preview-url__wrap {\n        text-align: left;\n        text-decoration: none;\n    }\n    a.carcode-widget_preview-url__wrap:hover {\n        text-decoration: none;\n    }\n    .carcode-widget_preview-url__link {\n        margin-bottom: 10px;\n        text-decoration: underline;\n        color: #555;\n        font-size: 14px;\n        line-height: 1.43;\n    }\n    .carcode-widget_preview-url__image {\n        margin-bottom: 10px;\n        max-width: 100%;\n    }\n    .carcode-widget_preview-url__title {\n        margin-bottom: 10px;\n        color: #555;\n        font-size: 15px;\n        font-weight: bold;\n        line-height: 1.33;\n    }\n    .carcode-widget_preview-url__description {\n        color: #555;\n        font-size: 12px;\n        line-height: 1.67;\n    }\n\n    div.carcode-widget_backdrop {\n        z-index: 2147483645;\n        position: fixed;\n        top: 0;\n        right: 0;\n        bottom: 0;\n        left: 0;\n        background-color: rgba(0, 0, 0, .85);\n    }\n    div.carcode-widget_modal {\n        z-index: 2147483646;\n        position: fixed;\n        top: 50%;\n        left: 50%;\n        width: 440px;\n        margin-left: -220px;\n        margin-top: -220px;\n        padding: 20px;\n        box-sizing: border-box;\n        border-radius: 5px;\n        background-color: #f5f5f5;\n    }\n    div#CarCodeImagePreviewModal {\n        width: auto;\n        margin-left: 0;\n        margin-top: 0;\n        padding: 0;\n        transform: translate(-50%, -50%);\n    }\n    div#CarCodeImagePreviewModalImageContainer img.carcode-widget_image {\n        display: block;\n        opacity: 0;\n    }\n    /* Show only loaded images to avoid visible image resizing during loading */\n    div#CarCodeImagePreviewModalImageContainer img.carcode-widget_image.is-visible {\n        opacity: 1;\n    }\n\n    /* */\n    div.carcode-widget_modal-close {\n        z-index: 20;\n        position: absolute;\n        top: 10px;\n        right: 10px;\n        display: inline-block;\n        width: 30px;\n        height: 30px;\n        box-sizing: border-box;\n        margin: 0;\n        padding: 0;\n        opacity: .8;\n        font-size: 1em;\n        line-height: 1;\n        cursor: pointer;\n    }\n        div.carcode-widget_modal-close::before,\n        div.carcode-widget_modal-close::after {\n            content: \'\';\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            display: inline-block;\n            width: 16px;\n            height: 2px;\n            margin-top: -1px;\n            margin-left: -8px;\n            background: #ccc;\n            transform: rotate(45deg);\n        }\n        div.carcode-widget_modal-close::after {\n            transform: rotate(-45deg);\n        }\n        div.carcode-widget_modal-close:hover::before,\n        div.carcode-widget_modal-close:hover::after {\n            background: #999;\n        }\n\n    div#CarCodeImagePreviewModal div.carcode-widget_modal-close {\n        border-radius: 15px;\n        background-color: rgba(0, 0, 0, .25);\n    }\n        div#CarCodeImagePreviewModal div.carcode-widget_modal-close:hover {\n            background-color: rgba(0, 0, 0, .75);\n        }\n    div#CarCodeImagePreviewModal div.carcode-widget_modal-close::before,\n    div#CarCodeImagePreviewModal div.carcode-widget_modal-close::after {\n        background-color: #fff;\n    }\n\n    div.carcode-widget_modal-row {\n        z-index: 10;\n        position: relative;\n        top: 0;\n        left: 0;\n        margin: 20px 0;\n        padding: 0;\n        box-sizing: border-box;\n    }\n    div.carcode-widget_modal-row.modal-row--title {\n        margin-top: 0;\n        font-size: 18px;\n        font-weight: bold;\n    }\n    div.carcode-widget_modal-row.modal-row--intro {\n        padding-bottom: 15px;\n        border-bottom: 1px solid #e8e8e8;\n        font-size: 13px;\n        color: #969696;\n    }\n    div.carcode-widget_modal-row.modal-row--submit {\n        margin-bottom: 0;\n    }\n    label.carcode-widget_modal-label {\n        z-index: 20;\n        position: absolute;\n        top: 15px;\n        left: 15px;\n        display: block;\n        margin: 0;\n        padding: 0;\n        font-weight: normal;\n        font-size: 16px;\n        background: transparent !important;\n        color: #8b8b8b !important;\n        transition: transform ease .1s;\n        transform: translateY(0) scale(1);\n        transform-origin: left top;\n    }\n    input.carcode-widget_modal-input {\n        z-index: 10;\n        position: static;\n        width: 400px;\n        height: auto;\n        padding: 15px;\n        box-sizing: border-box;\n        border: 0;\n        background-color: #fff !important;\n        background-image: none !important;\n        border-radius: 4px;\n        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);\n        outline: none;\n        font-size: 16px;\n        color: #555 !important;\n    }\n    input.carcode-widget_modal-input[class*="is-error"] {\n        box-shadow: inset 0 0 1px 1px red;\n    }\n    input.carcode-widget_modal-input:focus + label.carcode-widget_modal-label,\n    input.carcode-widget_modal-input:not(.is-empty) + label.carcode-widget_modal-label {\n        transform: translateY(-12px) scale(.75);\n        color: #b5b5b5;\n    }\n    input.carcode-widget_modal-input:focus,\n    input.carcode-widget_modal-input:not(.is-empty) {\n        padding-top: 20px;\n        padding-bottom: 10px;\n    }\n    button.carcode-widget_modal-button {\n        position: static;\n        display: block;\n        width: 240px;\n        height: 40px;\n        margin: 0 auto;\n        padding: 0;\n        box-sizing: border-box;\n        border: 0;\n        border-radius: 20px;\n        background-color: ' + styles.primaryColor + ';\n        background-image: none !important;\n        box-shadow: none;\n        outline: none;\n        color: #fff !important;\n        line-height: 40px;\n        cursor: pointer;\n    }\n    button.carcode-widget_modal-button:hover {\n        opacity: .95;\n    }\n    button.carcode-widget_modal-button[disabled] {\n        background: #ccc !important;\n        cursor: default;\n    }\n    div.carcode-widget_modal-thanks-message {\n        margin-top: 10px;\n        padding: 40px 20px;\n        background: #fff !important;\n        border-radius: 4px;\n        box-shadow: 0 2px 3px 0px rgba(0, 0, 0, .15);\n        text-align: center;\n    }\n    div.carcode-widget_modal-thanks-message-title {\n        margin-bottom: 10px;\n        font-size: 18px;\n        font-weight: bold;\n        color: #424242;\n    }\n    div.carcode-widget_modal-thanks-message-details {\n        font-size: 13px;\n        font-weight: normal;\n        color: #979797;\n    }\n\n    /** Animations **/\n    @keyframes _animationBlinkOpacityAnimation {\n        0% {\n            opacity: 1;\n        }\n        100% {\n            opacity: .6;\n        }\n    }\n    @keyframes _animationTransformScaleAnimation {\n        0% {\n            transform: scale(1);\n            opacity: 1;\n        }\n        100% {\n            transform: scale(1.2);\n            opacity: 0;\n        }\n    }\n    @keyframes _animationLoadingIndicator {\n        0% {\n            background-color: #999;\n        }\n        100% {\n            background-color: #ddd;\n        }\n    }\n';

    return _styles.replace(/(?:\r\n|\r|\n| +(?= ))/g, '');
};

function widgetUI() {}

widgetUI.prototype.svgIconPaths = {
    chat: 'M13,0 L3,0 C2.53124797,0 2.15104344,0.0768221484 2,0 C1.44270656,0.384115352 1.13020969,0.593748672 1,1 C0.593748672,1.13020969 0.384115352,1.44270656 0,2 C0.0768221484,2.15104344 0,2.53124797 0,3 L0,14 L3,11 L13,11 C13.468752,11 13.8489566,10.9231779 14,11 C14.5572934,10.6158846 14.8697903,10.4062513 15,10 C15.4062513,9.86979031 15.6158846,9.55729344 16,9 C15.9231779,8.84895656 16,8.46875203 16,8 L16,3 C16,2.53124797 15.9231779,2.15104344 16,2 C15.6158846,1.44270656 15.4062513,1.13020969 15,1 C14.8697903,0.593748672 14.5572934,0.384115352 14,0 C13.8489566,0.0768221484 13.468752,0 13,0 L13,0 Z M14,8 C14,8.18750063 13.9752607,8.30729109 14,8 C13.8763018,8.53645891 13.8072921,8.63541625 14,9 C13.6354162,8.80729211 13.5364589,8.87630184 13,9 C13.3072911,8.97526066 13.1875006,9 13,9 L2,9 L2,3 C2,2.81249938 2.02473934,2.69270891 2,3 C2.12369816,2.46354109 2.19270789,2.36458375 2,2 C2.36458375,2.19270789 2.46354109,2.12369816 3,2 C2.69270891,2.02473934 2.81249937,2 3,2 L13,2 C13.1875006,2 13.3072911,2.02473934 13,2 C13.5364589,2.12369816 13.6354162,2.19270789 14,2 C13.8072921,2.36458375 13.8763018,2.46354109 14,3 C13.9752607,2.69270891 14,2.81249938 14,3 L14,8 Z',
    chat_notification: 'M13,0 L3,0 C2.53124797,0 2.15104344,0.0768221484 2,0 C1.44270656,0.384115352 1.13020969,0.593748672 1,1 C0.593748672,1.13020969 0.384115352,1.44270656 0,2 C0.0768221484,2.15104344 0,2.53124797 0,3 L0,14 L3,11 L13,11 C13.468752,11 13.8489566,10.9231779 14,11 C14.5572934,10.6158846 14.8697903,10.4062513 15,10 C15.4062513,9.86979031 15.6158846,9.55729344 16,9 C15.9231779,8.84895656 16,8.46875203 16,8 L16,3 C16,2.53124797 15.9231779,2.15104344 16,2 C15.6158846,1.44270656 15.4062513,1.13020969 15,1 C14.8697903,0.593748672 14.5572934,0.384115352 14,0 C13.8489566,0.0768221484 13.468752,0 13,0 L13,0 Z',
    arrow_down: 'M16,1.5L14.5 0 8 6.5 1.5 0 0 1.5 8 9.5z',
    cross: 'M12.3180804,1.4609375L10.8962054 0.0390625 6.35714288 4.5859375 1.81808038 0.0390625 0.396205381 1.4609375 4.94308038 6 0.396205381 10.5390625 1.81808038 11.9609375 6.35714288 7.4140625 10.8962054 11.9609375 12.3180804 10.5390625 7.77120538 6z',
    phone: 'M0,1.99406028 C0,0.892771196 0.88743329,0 1.99961498,0 L8.00038502,0 C9.10474188,0 10,0.894513756 10,1.99406028 L10,14.0059397 C10,15.1072288 9.11256671,16 8.00038502,16 L1.99961498,16 C0.895258123,16 0,15.1054862 0,14.0059397 L0,1.99406028 Z M9,12 L1,12 L1,3 L9,3 L9,12 Z M4,13 L6,13 L6,15 L4,15 L4,13 Z M3,1 L7,1 L7,2 L3,2 L3,1 Z',
    facebook_messenger: 'M70.36,79.802L54.062,62.42    L22.261,79.802l34.981-37.136l16.696,17.383l31.404-17.383L70.36,79.802z M64,0C28.654,0,0,26.531,0,59.259    c0,18.649,9.307,35.283,23.851,46.146V128l21.791-11.96c5.816,1.609,11.977,2.478,18.358,2.478c35.346,0,64-26.531,64-59.259    S99.346,0,64,0z',
    camera: 'M21,4c-1.402,0-2.867,0-2.867,0L17.2,2c-0.215-0.498-1.075-1-1.826-1H8.759    C8.008,1,7.148,1.502,6.933,2L6,4c0,0-1.517,0-3,0C0.611,4,0,6,0,6v14c0,0,1.5,2,3,2s16.406,0,18,0s3-2,3-2V6C24,6,23.496,4,21,4z     M12,19.001c-3.313,0-6-2.687-6-6.001c0-3.313,2.687-6,6-6c3.314,0,6,2.687,6,6C18,16.314,15.314,19.001,12,19.001z M12,9    c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4S14.209,9,12,9z',
    attachment: 'M22.5,6c-2-2-5.2-2-7.2,0l-8.7,8.6c-1.2,1.2-1.2,3.1,0,4.3c1.2,1.2,3.1,1.2,4.3,0l7.2-7.2c0.4-0.4,0.4-1,0-1.4  c-0.4-0.4-1-0.4-1.4,0l-7.2,7.2c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l8.7-8.7c1.2-1.2,3.1-1.2,4.3,0c1.2,1.2,1.2,3.1,0,4.3  l-8.7,8.6c-2,2-5.2,2-7.2,0c-2-2-2-5.2,0-7.2L16.7,1.7c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L3.7,11.8c-2.8,2.8-2.8,7.3,0,10.1  c2.8,2.8,7.3,2.8,10.1,0l8.7-8.6C24.4,11.3,24.4,8,22.5,6z'
};

widgetUI.prototype.createEl = function (options) {

    var _tag = options.tag || 'div';
    var _element = document.createElement(_tag);

    if (options.className) {
        _element.className = 'carcode-widget_' + options.className;
    }

    if (options.classModificator) {
        _element.className += ' ' + _element.className + '--' + options.classModificator;
    }

    if (options.events) {
        for (var event in options.events) {
            _element.addEventListener(event, options.events[event]);
        }
    }

    if (options.text) {
        _element.innerText = options.text;
    }

    if (options.attrs) {
        var attrsKeys = Object.keys(options.attrs);
        attrsKeys.forEach(function (key) {
            _element.setAttribute(key, options.attrs[key]);
        });
    }

    return _element;
};

widgetUI.prototype.createSimpleActionButton = function (options) {

    return this.createEl({
        tag: 'button',
        text: options.text,
        className: options.className,
        attrs: {
            id: options.id
        }
    });
};

widgetUI.prototype.createIconActionButton = function (options) {

    var _actionButton;
    var _icon;

    _actionButton = this.createEl({
        tag: 'button',
        className: options.className,
        attrs: {
            id: options.id
        }
    });

    _icon = this.createEl({
        tag: 'span',
        className: 'button-icon'
    });

    if (options.icon.svg) {
        _icon.appendChild(this.createSvgIcon(options.icon.svg));
    }

    if (options.text) {
        _actionButton.appendChild(this.createEl({
            tag: 'span',
            className: 'button-text',
            text: options.text
        }));
    }

    _actionButton.appendChild(_icon);
    return _actionButton;
};

widgetUI.prototype.createActionButton = function (options) {

    var _actionButton;

    if (options.icon) {
        _actionButton = this.createIconActionButton(options);
    } else {
        _actionButton = this.createSimpleActionButton(options);
    }

    _actionButton.addEventListener('click', options.callback);

    return _actionButton;
};

widgetUI.prototype.removeEl = function (id) {

    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
};

widgetUI.prototype.createSvgIcon = function (options) {

    var _svgNS = "http://www.w3.org/2000/svg";
    var _svg = document.createElementNS(_svgNS, 'svg');
    options.width && _svg.setAttributeNS(null, 'width', options.width);
    options.height && _svg.setAttributeNS(null, 'height', options.height);
    options.viewbox && _svg.setAttributeNS(null, 'viewBox', options.viewbox);

    if (options.path) {
        var _path = document.createElementNS(_svgNS, 'path');
        options.path.d && _path.setAttributeNS(null, 'd', options.path.d);
        options.path.fill && _path.setAttributeNS(null, 'fill', options.path.fill);

        if (options.g) {
            var _g = document.createElementNS(_svgNS, 'g');
            options.g.strokeWidth && _g.setAttributeNS(null, 'stroke-width', options.g.strokeWidth);
            options.g.fillRule && _g.setAttributeNS(null, 'fill-rule', options.g.fillRule);
            _g.appendChild(_path);
            _svg.appendChild(_g);
        } else {
            _svg.appendChild(_path);
        }
    }

    return _svg;
};

widgetUI.prototype.generateWidgetId = function (id) {
    var id = id || '';
    return 'CarcodeWidget' + id; // TODO
};

widgetUI.prototype.createHeader = function (options) {

    var _widgetTitle = this.createEl({
        className: 'widget-header'
    });

    if (options.subtitle) {
        _widgetTitle.appendChild(this.createEl({
            className: 'widget-header__subtitle',
            text: options.subtitle
        }));
    }

    if (options.title) {
        _widgetTitle.appendChild(this.createEl({
            className: 'widget-header__title',
            text: options.title
        }));
    }

    if (typeof this.createWidgetActions === 'function') {
        _widgetTitle.appendChild(this.createWidgetActions());
    }

    return _widgetTitle;
};

widgetUI.prototype.createContentArea = function () {

    return this.createEl({
        className: 'widget-content',
        attrs: {
            id: this.widgetContentID
        }
    });
};

widgetUI.prototype.createWidget = function (sections) {
    var classModificator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var isWidgetVisible = arguments[2];


    var _classModificator = classModificator || null;

    var _widget = this.createEl({
        className: 'widget',
        classModificator: _classModificator,
        attrs: {
            id: this.widgetID
        }
    });

    if (isWidgetVisible) {
        _widget.classList.add('is-visible');
    } else {
        _widget.classList.add('is-hidden');
    }

    sections.forEach(function (section) {
        _widget.appendChild(section);
    });

    return _widget;
};

widgetUI.prototype.hideAllWidgets = function () {
    var _widgets = document.getElementsByClassName(this.options.cssPrefix + 'widget');
    Array.prototype.forEach.call(_widgets, function (_widget) {
        _widget.classList.remove('is-visible');
        _widget.classList.add('is-hidden');
    });
};

widgetUI.prototype.showWidget = function () {
    this.widget.classList.remove('is-hidden');
    this.widget.classList.add('is-visible');
};

widgetUI.prototype.hideWidget = function () {
    this.widget.classList.add('is-hidden');
    this.widget.classList.remove('is-visible');
};

widgetUI.prototype.destroyWidget = function () {
    this.widget && this.widget.parentNode.removeChild(this.widget);
    this.widgetExists = false;
};

widgetUI.prototype.getTimeBasedId = function (prefix) {
    var d = new Date();
    return '' + prefix + d.getTime();
};


/**
  * Carcode widget UI constructor
  * @param {Object} options Widget options
  */
function CarcodeChatWidgetUI(options) {

    var _widgetID = this.generateWidgetId();

    this.options = {};
    this.options.cssPrefix = 'carcode-widget_';

    this.message = {};
    this.attachments = [];

    this.dealerName = options.dealerName || 'Dealer';

    this.widgetID = 'widget' + _widgetID;
    this.widgetContentID = 'widgetContent' + _widgetID;
    this.widgetMessagesID = 'widgetMessages' + _widgetID;
    this.widgetInputID = 'widgetInput' + _widgetID;
    this.widgetButtonID = 'widgetButtonID' + _widgetID;
    this.widgetSendButtonID = 'widgetSendButtonID' + _widgetID;
    this.widgetLoadingID = 'widgetLoading' + _widgetID;
    this.widgetAttachmentsID = 'widgetAttachments' + _widgetID;
    this.widgetConfirmationID = 'widgetConfirmation' + _widgetID;
    this.dealerTextingID = 'widgetDealerTexting' + _widgetID;

    this.options.applySendEvent = options.applySendEvent || function () {};
    this.options.applyOpenEvent = options.applyOpenEvent || function () {};
    this.options.applyNotificationEvent = options.applyNotificationEvent || function () {};
    this.options.applyIdleEvent = options.applyIdleEvent || function () {};
    this.options.onWidgetClose = options.onWidgetClose || function () {};
    this.options.onWidgetHide = options.onWidgetHide || function () {};

    this.options.widgetSmsUrl = options.widgetSmsUrl;
    this.options.dealerPhoneNumber = options.dealerPhoneNumber;
    this.options.dealerApiLink = options.dealerApiLink;
    this.options.fileApiUrl = options.fileApiUrl;
    this.options.previewLink = options.previewLink;
    this.options.maxAttachmentSize = options.maxAttachmentSize;

    this.storage = new CarCodeStorage();

    this.isLiveChatCreated = false;
}

CarcodeChatWidgetUI.prototype = Object.create(widgetUI.prototype);


CarcodeChatWidgetUI.prototype.checkDealershipAvailability = function (openCallback, closedCallback) {
    var _this = this;

    /**
     * If options are incorrect and there is no way to check if dealership is open - open LiveChat
     */
    if (this.options && this.options.dealerApiLink && this.options.dealerPhoneNumber) {
        (function () {

            var openHoursUrl = _this.options.dealerApiLink + '/department/' + _this.options.dealerPhoneNumber + '/open-hours';
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    if(xmlHttp.status === 200) {
                        var data = JSON.parse(xmlHttp.responseText);
                        if(!data.currentlyClosed) {
                            _this.storage.set('dealership_status', 'open');
                            typeof openCallback === 'function' && openCallback(data);
                        } else {
                            _this.storage.set('dealership_status', 'closed');
                            if (typeof closedCallback === 'function') {
                                closedCallback();
                            }
                        }
                    } else {
                        // call open callback in case of response error
                        _this.storage.set('dealership_status', 'open');
                        if (typeof openCallback === 'function') {
                                openCallback();
                            }
                    }
                }
            };
            xmlHttp.open("GET", openHoursUrl, true);
            xmlHttp.send(null);
        })();
    } else {
        openCallback();
    }
};

/**
 * Open widget if it exists or create widget and open it if there is not
 *
 * @param isLiveChatOpen {boolean} - chat should be open
 * Force chat opening regardless of chat status in storage
 */
CarcodeChatWidgetUI.prototype.initChatWidget = function (isLiveChatOpen) {
    var _this2 = this;

    /**
     * Three states of the chat
     * - open
     * - collapsed
     * - closed
     */

    var _openCallback = function _openCallback(data) {

        var liveChatStatus = _this2.storage.get('live_chat_status');
        if (liveChatStatus === 'open') {
            isLiveChatOpen = true;
        }

        if (!_this2.isLiveChatCreated) {
            _this2.createWidget(isLiveChatOpen);
            _this2.showLoadingIndicator();
            _this2.options.applyOpenEvent();
            _this2.options.initMessage = data && data.chatGreetingMessage || null;
            if (isLiveChatOpen) {
                _this2.storage.set('live_chat_unreads', 0);
            }
            _this2.isLiveChatCreated = true;
        } else {
            _this2.showWidget();
        }
    };

    var _openContactModal = function _openContactModal() {
        var modalOptions = {
            dealerPhoneNumber: _this2.options.dealerPhoneNumber,
            smsUrl: _this2.options.widgetSmsUrl
        };
        var modal = new CarCodeWidgetsContactModal(modalOptions);
        modal.createModal();
    };

    if (isLiveChatOpen) {
        this.checkDealershipAvailability(_openCallback, _openContactModal);
    } else {
        this.checkDealershipAvailability(_openCallback);
    }
};

/**
 * Create node - widget content
 * @return {Object} widget content element
 */
CarcodeChatWidgetUI.prototype.createWidgetContent = function (messages) {
    var widgetContentArea = this.createContentArea();
    widgetContentArea.appendChild(this.createMessagesList(messages));
    return widgetContentArea;
};

/**
 * Create node - widget close button
 * @return {Object} widget close button element
 */
CarcodeChatWidgetUI.prototype.createWidgetActions = function () {

    /* Actions block with collapse and close buttons */
    var _actionsBlock = this.createEl({ className: 'widget-actions' });

    /**
     * Button "Collapse Chat Widget"
     */
    var _btnCollapse = this.createActionButton({
        id: this.widgetButtonID,
        className: 'widget-actions__collapse',
        icon: {
            svg: {
                width: '16px',
                height: '10px',
                path: { d: this.svgIconPaths.arrow_down }
            }
        },
        callback: function () {
            this.hideWidget();
            this.storage.set('live_chat_status', 'collapsed');
            EDWT.track_event('chat_pop_up', 'carcode_chat_btn_collapse');
        }.bind(this)
    });
    _actionsBlock.appendChild(_btnCollapse);

    /**
     * Button "Back" - Back to channels selector
     */
    var _btnBack = this.createActionButton({
        id: this.widgetButtonID,
        className: 'widget-actions__back',
        icon: {
            svg: {
                width: '16px',
                height: '10px',
                path: { d: this.svgIconPaths.arrow_down }
            }
        },
        callback: function () {
            this.hideWidget();
            this.options.onWidgetClose();
            this.storage.set('live_chat_status', 'closed');
            EDWT.track_event('chat_pop_up', 'carcode_chat_btn_click', 'text_message_cancel');
        }.bind(this)
    });
    _actionsBlock.appendChild(_btnBack);

    return _actionsBlock;
};

/**
 * Create messages list
 * @return {Object}
 */
CarcodeChatWidgetUI.prototype.createMessagesList = function (messages) {

    var _messages = this.createEl({
        className: 'messages',
        attrs: {
            id: this.widgetMessagesID
        }
    });

    this.addMessages(messages, _messages);

    return _messages;
};

CarcodeChatWidgetUI.prototype.addMessages = function (messages, parentContainer) {
    var _this = this;

    parentContainer = parentContainer ? parentContainer : document.getElementById(this.widgetMessagesID);
    messages && messages.forEach(function (message) {
        return parentContainer.appendChild(_this.createMessage(message));
    });
    this.handleImageLoading();
};

CarcodeChatWidgetUI.prototype.addMessage = function (message) {
    var _container = document.getElementById(this.widgetMessagesID);
    _container.appendChild(this.createMessage(message));

    this.scrollToEndOfMessagesContainer();
    document.getElementById(this.widgetInputID).value = '';
};

CarcodeChatWidgetUI.prototype.getWsError = function () {
    var _container = document.getElementById(this.widgetMessagesID);
    return _container.querySelector('.wsError');
};

CarcodeChatWidgetUI.prototype.removeWsError = function () {
    var _container = document.getElementById(this.widgetMessagesID),
        _wsError = _container.querySelector('.wsError');

     if (_wsError) {
        _container.removeChild(_wsError);
     }
};

CarcodeChatWidgetUI.prototype.dealerTexting = function (message) {

    if (this.isDealerTexting || document.getElementById(this.dealerTextingID)) {
        return;
    }

    var messagesArea = document.getElementById(this.widgetMessagesID);
    var _textingInfo = this.createEl({
        className: 'dealer-texting',
        attrs: {
            id: this.dealerTextingID
        }
    });
    _textingInfo.appendChild(this.createEl({ className: 'dealer-texting__icon' }));
    messagesArea.appendChild(_textingInfo);

    this.isDealerTexting = true;
    this.scrollToEndOfMessagesContainer();

    setTimeout(function () {
        this.removeEl(this.dealerTextingID);
        this.isDealerTexting = false;
    }.bind(this), 4000);
};

CarcodeChatWidgetUI.prototype.removePendingMessage = function (message) {
    var _container = document.getElementById(this.widgetMessagesID);
    var _messagesNodes = Array.prototype.slice.call(_container.getElementsByClassName('pending'));

    _messagesNodes.forEach(function (_messageNode) {
        if (_messageNode.getAttribute('data-text') === message.body) {
            _container.removeChild(_messageNode);
        }
    });
};

/**
 * Compare and add messages
 *
 * @param  {Array} messages [description]
 */
CarcodeChatWidgetUI.prototype.compareAndAppendNewMessages = function (messages) {

    /* Container with widget */
    var _widgetContainer = document.getElementById(this.widgetMessagesID);
    /* Select list of synchronized messages in DOM - List of DOM-elements */
    var _messagesList = _widgetContainer.getElementsByClassName('synchronized');

    /* Go through all messages */
    messages.forEach(function (message, index) {
        if (_messagesList[index] && parseInt(_messagesList[index].getAttribute('data-time')) !== message.createdAt) {
            _widgetContainer.insertBefore(this.createMessage(message), _messagesList[index]);
            _messagesList = _widgetContainer.getElementsByClassName('synchronized');
        } else if (messages.length > _messagesList.length && messages.length === index + 1) {
            _widgetContainer.appendChild(this.createMessage(message));
        }
    }.bind(this));

    this.scrollToEndOfMessagesContainer();
};

/**
 * Create one message
 * @return {Object}
 */
CarcodeChatWidgetUI.prototype.createMessage = function (message) {
    var _this2 = this;

    var _message = this.createEl({ className: 'message' });
    var _messageInfo = this.createEl({ className: 'message__info' });
    var _messageInfoTime = this.createEl({ className: 'message__info__time', tag: 'span' });
    var _messageInfoAuthor = this.createEl({ className: 'message__info__author', tag: 'span' });
    var _messageBody = this.createEl({ className: 'message__body' });
    var _messageAttachments = this.createEl({ className: 'message__attachments' });
    var text;

    _messageBody.classList.add('ui-body');

    /**
     * Add attachment 'image' - shows image preview with a link to original image
     */
    var _getImageAttachment = function _getImageAttachment(attachment) {

        var _link = _this2.createEl({
            tag: 'a',
            className: 'attachment-image-link',
            attrs: {
                href: attachment.url
            }
        });

        _link.addEventListener('click', function (event) {
            event.preventDefault();
            var image = new CarCodeImageViewModal();
            image.openImage({ url: attachment.url });
        });

        var _image = _this2.createEl({
            tag: 'img',
            className: 'attachment-image',
            attrs: {
                src: attachment.url,
                alt: attachment.niceName,
                target: '_blank'
            },
            events: {
                load: function load() {
                    this.parentNode.classList.add('is-loaded');
                }
            }
        });
        _link.appendChild(_image);

        return _link;
    };

    /**
     * Add attachment 'file' - shows filename with link to download attachment
     */
    var _getFileAttachment = function _getFileAttachment(attachment) {

        var _link = _this2.createEl({
            tag: 'a',
            className: 'attachment-file-link',
            text: attachment.niceName,
            attrs: {
                href: attachment.url
            }
        });

        return _link;
    };

    var time = '';
    if (message.createdAt) {
        var date = new Date(message.createdAt);
        var curDate = new Date();

        var options = {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit"
        };

        if (date.getDay() !== curDate.getDay() || date.getMonth() !== curDate.getMonth() || date.getYear() !== curDate.getYear()) {
            options.month = 'short';
            options.day = 'numeric';

            time = date.toLocaleDateString("en-US", options);
        } else {
            time = date.toLocaleTimeString("en-US", options);
        }

        _message.setAttribute('data-time', message.createdAt);
    }

    _messageInfoTime.innerText = time;
    _messageInfoAuthor.innerText = message.senderName || '';

    _messageInfo.appendChild(_messageInfoAuthor);
    _messageInfo.appendChild(_messageInfoTime);

    if (message.body.name === 'SyntaxError') {
        _messageBody.innerHTML = this.prepareText(message.body.message) || '';
    } else {
        text = message.body;
        if (message.attachments) {
            message.attachments.forEach(function (attachment) {
                if (attachment.type === 'image') {
                    _messageAttachments.appendChild(_getImageAttachment(attachment));
                } else {
                    _messageAttachments.appendChild(_getFileAttachment(attachment));
                }
            });
        }

        _messageBody.innerHTML = this.prepareText(text) || '';
        _message.setAttribute('data-text', message.body);
    }

    _message.classList.add(message.type);
    var _status = message.createdAt ? 'synchronized' : 'pending';
    _message.classList.add(_status);

    _messageBody.appendChild(_messageAttachments);
    _message.appendChild(_messageBody);
    _message.appendChild(_messageInfo);

    this.prepareLinkPreview(message);

    return _message;
};

/**
 * Updates input area height
 */
CarcodeChatWidgetUI.prototype.updateInputHeight = function () {

    var _inputElement = document.getElementById(this.widgetInputID);
    var _inputElementWrapper = document.getElementById(this.widgetInputID + 'Wrapper');
    var _inputAttachments = document.getElementById(this.widgetAttachmentsID);

    var _inputElementMaxHeight = 80; /* Default max-height of textarea element */
    var _inputElementWrapperMaxHeight = 124; /* Default max-height of input wrapper */

    var _inputHeight = void 0,
        _inpputWrapperHeight = void 0;

    /**
     * Returns height of wrapper element depending on input height and attachment section height
     */
    function _getInputWrapperHeight() {
        var _inputMargins = 38; /* Default sum of paddings and margins to correct wrapper element height */
        var _inputAttachmentsHeight = _inputAttachments.offsetHeight; /* Attachments section height */
        return _inputHeight === 20 ? 'auto' : _inputHeight + _inputMargins + _inputAttachmentsHeight + 'px';
    }

    setTimeout(function () {

        _inputElement.style.height = 'auto';
        _inputHeight = _inputElement.scrollHeight;
        _inpputWrapperHeight = _getInputWrapperHeight();

        _inputElement.style.height = _inputHeight + 'px';
        _inputElementWrapper.style.height = _inpputWrapperHeight;
        _inputElementWrapper.style.flexBasis = _inpputWrapperHeight;

        /* Add 'is-max-height' css class if height of message is higher than maximum allowed height */
        if (_inputHeight > _inputElementMaxHeight) {
            _inputElement.classList.add('is-max-height');
            _inputElementWrapper.classList.add('is-max-height');
        } else {
            _inputElement.classList.remove('is-max-height');
            _inputElementWrapper.classList.remove('is-max-height');
        }

        _inputElementWrapper.style.maxHeight = _inputElementWrapperMaxHeight + _inputAttachments.offsetHeight + 'px';
    }, 0);
};

/**
 * Resets input height
 */
CarcodeChatWidgetUI.prototype.resetInputHeight = function () {

    var _inputElement = document.getElementById(this.widgetInputID);
    var _inputElementWrapper = document.getElementById(this.widgetInputID + 'Wrapper');

    setTimeout(function () {

        _inputElement.value = '';
        _inputElement.style.height = 'auto';
        _inputElement.classList.remove('is-max-height');

        _inputElementWrapper.style.height = 'auto';
        _inputElementWrapper.style.flexBasis = 'auto';
        _inputElementWrapper.classList.remove('is-max-height');
    }, 0);
};

CarcodeChatWidgetUI.prototype.isMessage = function () {
    return this.message && this.message.body && this.message.body.length > 0;
};

CarcodeChatWidgetUI.prototype.isAttachments = function () {
    return this.attachments && this.attachments.length > 0;
};

CarcodeChatWidgetUI.prototype.updateMessage = function () {
    var body = document.getElementById(this.widgetInputID).value.trim();
    var attachments = this.attachments;
    this.message = { body: body, attachments: attachments };
};

CarcodeChatWidgetUI.prototype.updateSubmitButton = function () {
    if (this.isMessage() || this.isAttachments()) {
        this.enableSubmitButton();
    } else {
        this.disableSubmitButton();
    }
};

CarcodeChatWidgetUI.prototype.enableSubmitButton = function () {
    document.getElementById(this.widgetSendButtonID).removeAttribute('disabled');
};

CarcodeChatWidgetUI.prototype.disableSubmitButton = function () {
    document.getElementById(this.widgetSendButtonID).setAttribute('disabled', 'disabled');
};

/**
 * Create chat input area
 */

/**
 * Create chat input area
 */
CarcodeChatWidgetUI.prototype.createChatInput = function () {
    var _this5 = this;

    /**
     * Sends a message
     */
    var _sendMessage = function _sendMessage() {
        if (_this5.isMessage() || _this5.isAttachments()) {
            _this5.options.applySendEvent(_this5.message);
            _this5.message = {};
            _this5.attachments = [];
            _this5.clearAttachmentsPreview();
            _this5.resetInputHeight();
            _this5.updateSubmitButton();
            EDWT.track_event('chat_pop_up', 'carcode_chat_send_click');
        }
    };

    /**
     * Send a notification to Dealer App ("Customer is typing...")
     */
    var _sendNotification = function _sendNotification() {
        if (_this5.isMessage() && _this5.message.body.length % 2 === 0) {
            _this5.options.applyNotificationEvent(_this5.message);
        }
    };

    /**
     * Handles keyups
     * If 'Enter' is clicked - sends a message if it is
     * If text is longer than one row - increases height of input area
     */
    var _inputHandleKeyUp = function _inputHandleKeyUp(e) {

        var _keyCode = e.which || e.keyCode;
        var _inputElement = e.target;

        _this5.updateMessage();

        if (_this5.message.body.length !== 0) {
            _sendNotification();
        }

        if (_keyCode === 13) {
            _sendMessage();
            _this5.resetInputHeight();
        }

        _this5.updateSubmitButton();
        _this5.updateInputHeight();
    };

    var _inputHandleFocus = function _inputHandleFocus(e) {
        document.getElementById(_this5.widgetID).classList.add('is-active');
    };

    var _inputHandleBlur = function _inputHandleBlur(e) {
        document.getElementById(_this5.widgetID).classList.remove('is-active');
    };

    var _fileUploader = this.createFileUploader();
    var _input = this.createEl({
        className: 'input',
        attrs: {
            id: this.widgetInputID + 'Wrapper'
        }
    });
    var _inputTextarea = this.createEl({
        className: 'input-field-wrapper',
        events: {
            click: function () {
                document.getElementById(this.widgetInputID).focus();
            }.bind(this)
        }
    });
    _inputTextarea.appendChild(this.createEl({
        tag: 'textarea',
        className: 'input-field',
        attrs: {
            id: this.widgetInputID,
            placeholder: 'Type a Message here...',
            rows: 1,
            maxlength: 5000
        },
        events: {
            keyup: _inputHandleKeyUp,
            focus: _inputHandleFocus,
            blur: _inputHandleBlur
        }
    }));
    var _btnSend = this.createActionButton({
        id: this.widgetSendButtonID,
        className: 'input-button',
        text: 'Send',
        callback: function () {
            _sendMessage();
            this.resetInputHeight();
        }.bind(this)
    });

    _input.appendChild(this.createEl({
        className: 'widget-content-attachments-preview',
        attrs: {
            id: this.widgetAttachmentsID
        }
    }));

    _input.appendChild(_fileUploader);
    _input.appendChild(_inputTextarea);
    _input.appendChild(_btnSend);

    return _input;
};

CarcodeChatWidgetUI.prototype.createFileUploader = function () {
    var _this6 = this;

    var _checkFile = function _checkFile(file) {
        if (file.size > _this6.options.maxAttachmentSize) {
            return {
                error: 'File is too large, 5Mb is a maximum'
            };
        }
        return true;
    };

    var _sendFile = function _sendFile(file) {
        _this6.showAttachmentsLoadingIndicator();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', _this6.options.fileApiUrl, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                _this6.hideAttachmentsLoadingIndicator();
                if (xhr.status === 200) {
                    var attachment = JSON.parse(xhr.responseText);
                    attachment.id = _this6.getTimeBasedId('chatAttachment');
                    _this6.attachments.push(attachment);
                    _this6.addAttachmentPreview(attachment);
                    _this6.updateMessage();
                    _this6.updateSubmitButton();
                    document.getElementById(_this6.widgetID + 'InputField').value = '';
                    _this6.updateInputHeight();
                } else {
                    _this6.showAttachmentsError('File upload error, try again, please');
                }
            }
        };
        var formData = new FormData();
        formData.append("file", file, file.name);
        xhr.send(formData);
    };

    var _fileInputChange = function _fileInputChange(e) {
        _this6.updateInputHeight();
        var _files = Array.prototype.slice.call(e.target.files);
        if (!_files) {
            return;
        }
        if (_this6.attachments.length + _files.length > 10) {
            _this6.showAttachmentsError('Only 10 images could be uploaded with one message');
            return;
        }
        _this6.hideAttachmentsError();
        _files.forEach(function (file) {
            var _checkFileResult = _checkFile.call(_this6, file);
            if (_checkFileResult.error) {
                _this6.showAttachmentsError(file.name + ': ' + _checkFileResult.error);
            } else {
                _sendFile.call(_this6, file);
            }
        });
    };

    var _fileInput = this.createEl({
        tag: 'label',
        className: 'file-input'
    });
    var _fileInputButton = this.createActionButton({
        className: 'file-input__icon',
        icon: {
            svg: {
                width: '24px',
                height: '24px',
                path: { d: this.svgIconPaths.attachment }
            }
        }
    });
    var _fileInputField = this.createEl({
        tag: 'input',
        className: 'file-input__field',
        attrs: {
            type: 'file',
            name: 'file',
            id: this.widgetID + 'InputField',
            multiple: 'multiple'
        },
        events: {
            change: _fileInputChange
        }
    });

    _fileInput.appendChild(_fileInputButton);
    _fileInput.appendChild(_fileInputField);

    return _fileInput;
};

CarcodeChatWidgetUI.prototype.getAttachmentsContainer = function () {
    return document.getElementById(this.widgetContentID + 'AttachmentsPreview');
};

CarcodeChatWidgetUI.prototype.showAttachmentsError = function (message) {
    var _errorsContainerId = this.widgetContentID + 'attachmentsError';
    var _errorsContainer = document.getElementById(_errorsContainerId);
    if (!_errorsContainer) {
        this.hideAttachmentsError();
        this.attachmentsContainer.appendChild(this.createEl({
            className: 'widget-content-attachments-error',
            attrs: {
                id: _errorsContainerId
            }
        }));
        _errorsContainer = document.getElementById(_errorsContainerId);
    }
    _errorsContainer.appendChild(this.createEl({ text: message }));
};

CarcodeChatWidgetUI.prototype.hideAttachmentsError = function () {
    var node = document.getElementById(this.widgetContentID + 'attachmentsError');
    node && node.parentNode.removeChild(node);
};

CarcodeChatWidgetUI.prototype.showAttachmentsLoadingIndicator = function () {
    var _indicatorId = this.widgetContentID + 'attachmentsLoadingIndicator';
    if (!document.getElementById(_indicatorId)) {
        this.attachmentsContainer.appendChild(this.createEl({
            className: 'widget-content-attachments-loading-indicator',
            attrs: {
                id: _indicatorId
            }
        }));
    }
};

CarcodeChatWidgetUI.prototype.hideAttachmentsLoadingIndicator = function () {
    var node = document.getElementById(this.widgetContentID + 'attachmentsLoadingIndicator');
    node && node.parentNode.removeChild(node);
};

CarcodeChatWidgetUI.prototype.addAttachmentPreview = function (attachment) {

    var _attachment = void 0;

    if (attachment.type === 'image') {
        _attachment = this.createEl({
            className: 'chat-image-attachment',
            attrs: {
                id: attachment.id
            }
        });
        _attachment.style.backgroundImage = 'url(' + attachment.url + ')';
    } else {
        _attachment = this.createEl({
            className: 'chat-file-attachment',
            attrs: {
                id: attachment.id
            }
        });
        _attachment.innerText = attachment.niceName;
    }

    var _attachmentRemoveButton = this.createEl({
        className: 'chat-attachment-remove',
        events: {
            click: function (e) {
                var id = e.target.parentNode.id;
                this.attachments = this.attachments.filter(function (attachment) {
                    return attachment.id !== id;
                });
                this.removeEl(id);
                this.updateSubmitButton();
                this.updateInputHeight();
                if (this.attachments.length <= 10) {
                    this.hideAttachmentsError();
                }
            }.bind(this)
        }
    });

    _attachment.appendChild(_attachmentRemoveButton);

    this.attachmentsContainer.appendChild(_attachment);
};

CarcodeChatWidgetUI.prototype.clearAttachmentsPreview = function () {
    this.attachmentsContainer.innerHTML = '';
};

/**
 * Create widget
 */
CarcodeChatWidgetUI.prototype.createWidget = function (isWidgetVisible, messages) {

    var dealerName = this.dealerName;

    var sections = [];
    sections.push(this.createHeader({
        title: dealerName,
        subtitle: 'Chat with'
    }));
    sections.push(this.createWidgetContent(messages));
    sections.push(this.createChatInput());

    document.body.appendChild(this.constructor.prototype.createWidget.call(this, sections, 'chat', isWidgetVisible));

    this.widget = document.getElementById(this.widgetID);
    this.attachmentsContainer = document.getElementById(this.widgetAttachmentsID);

    if (isWidgetVisible) {
        this.storage.set('live_chat_status', 'open');
    }
};

/**
 * Show existent widget
 */
CarcodeChatWidgetUI.prototype.showWidget = function () {
    this.constructor.prototype.showWidget.call(this);

    // initial state
    this.scrollToEndOfMessagesContainer();
    this.stopReplyNotification();
    this.handleImageLoading();

    this.storage.set('live_chat_status', 'open');
    this.storage.set('live_chat_unreads', 0);
};

CarcodeChatWidgetUI.prototype.handleImageLoading = function () {

    var _messagesNode = document.getElementById(this.widgetMessagesID);
    if (!_messagesNode) {
        return;
    }
    var _images = [].slice.call(_messagesNode.querySelectorAll('img'));
    _images.forEach(function (_image) {
        var _img = new Image();
        _img.onload = function () {
            this.scrollToEndOfMessagesContainer();
        }.bind(this);
        _img.src = _image.src;
    }.bind(this));
};

CarcodeChatWidgetUI.prototype.showLoadingIndicator = function () {
    this.updateSubmitButton();

    var _loading = this.createEl({
        className: 'widget-loading',
        attrs: {
            id: this.widgetLoadingID
        }
    });

    _loading.appendChild(this.createEl({
        className: 'widget-loading__connecting',
        text: 'Connecting...'
    }));

    _loading.appendChild(this.createEl({
        className: 'widget-loading__indicator'
    }));

    document.getElementById(this.widgetContentID).appendChild(_loading);
};

CarcodeChatWidgetUI.prototype.hideLoading = function () {
    var _loading = document.getElementById(this.widgetLoadingID);
    if (_loading) {
        _loading.parentNode.removeChild(_loading);
    }
};

CarcodeChatWidgetUI.prototype.scrollToEndOfMessagesContainer = function () {
    var _container = document.getElementById(this.widgetContentID);
    _container.scrollTop = _container.scrollHeight;
};

CarcodeChatWidgetUI.prototype.replyNotification = function () {
    if (this.widget.classList.contains('is-hidden')) {
        document.getElementById('CarcodeWidgetHubWidgetsHubButton').classList.add('notification');
    }
};

CarcodeChatWidgetUI.prototype.stopReplyNotification = function () {
    document.getElementById('CarcodeWidgetHubWidgetsHubButton').classList.remove('notification');
    this.storage.set('live_chat_unreads', 0);
};

CarcodeChatWidgetUI.prototype.refresh = function () {
    this.enableSendButton();
};

CarcodeChatWidgetUI.prototype.hideWidget = function () {
    this.options.onWidgetHide();
    this.constructor.prototype.hideWidget.call(this);
    // send customer idle event
    this.options.applyIdleEvent();
};

CarcodeChatWidgetUI.prototype.replaceLinks = function (text) {
    var _urlRegex = /(https?:\/\/||wwww.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
    var _imgRegex = /\.(?:jpe?g|gif|png)$/ig;
    var _link;
    return text.replace(_urlRegex, function (match) {
        _imgRegex.lastIndex = 0;
        _link = match;
        if (match.substring(0, 4) === 'www.') {
            _link = '//' + match;
        }
        if (_imgRegex.test(match)) {
            return '<a href="' + _link + '" target="_blank"><img src="' + match + '" style="max-width: 100%;" /></a>';
        } else {
          return match.indexOf('@') === -1 ? '<a href="' + _link + '" target="_blank" title="' + match + '">' + match + '</a>' : '<a href="mailto:' + _link + '" target="_blank" title="' + match + '">' + match + '</a>';
        }
    });
};

CarcodeChatWidgetUI.prototype.prepareText = function (text) {
    return this.replaceLinks(text);
};

CarcodeChatWidgetUI.prototype.prepareLinkPreview = function (message) {
    var _this5 = this;

    if (message.createdAt) {
      // as we are currently support link preview for messages which contains only link
      // than we can add ^ and &. Remove them if we will need to find any match of link in a message
      var _urlRegex = /^(https?:\/\/||www.)?[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9:%_\+.~#?&//=]*)$/ig;
        if (_urlRegex.test(message.body)) {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.options.previewLink + '?url=' + message.body, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var _data = JSON.parse(xhr.responseText);

                        if (_data.source && (_data.title || _data.description || _data.url)) {
                            var _bodyOfMessageEl = _this5.findBodyOfElement(_this5.findMessageElementByTime(message.createdAt));
                            _this5.updateMessageForPreviewLink(_bodyOfMessageEl, _data);
                        }
                    }
                }
            };
            xhr.send(null);
        }
    }
};

CarcodeChatWidgetUI.prototype.findMessageElementByTime = function (time) {
    var _widgetContainer = document.getElementById(this.widgetMessagesID);
    return _widgetContainer.querySelector('[data-time="' + time + '"]');
};

CarcodeChatWidgetUI.prototype.findBodyOfElement = function (messageEl) {
    return messageEl.querySelector('.ui-body');
};

CarcodeChatWidgetUI.prototype.updateMessageForPreviewLink = function (parent, data) {
    var _container = this.createEl({
        tag: 'a',
        className: 'preview-url__wrap',
        attrs: {
            target: '_blank',
            href: data.source
        }
    });

    var _link = this.createEl({ className: 'preview-url__link' });
    _link.innerText = data.source;
    _container.appendChild(_link);

    if (data.url) {
        var _image = this.createEl({
            tag: 'img',
            className: 'preview-url__image',
            attrs: {
                src: data.url
            }
        });
        _container.appendChild(_image);
    }
    if (data.title) {
        var _title = this.createEl({ className: 'preview-url__title' });
        _title.innerText = data.title;
        _container.appendChild(_title);
    }
    if (data.description) {
        var _description = this.createEl({ className: 'preview-url__description' });
        _description.innerText = data.description;
        _container.appendChild(_description);
    }

    // clear old body of message
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild);
    }
    parent.appendChild(_container);

    this.scrollToEndOfMessagesContainer();
};
; /**
  * Chat server connection
  *
  * @param options
  * @constructor
  */
function ChatServerConnection(options) {
    this.options = options;
}

ChatServerConnection.prototype.getWsUrl = function () {

    this.options.chatSettings.visitorId = this.options.chatSettings.visitorId || window.EDM.EdwPartner.EdwVisitor.getVisitorId(true);
    if (this.options.chatSettings.visitorId) {
        return this.options.chatSettings.wsUrl.replace(/:([a-zA-Z0-9]+)/g, function (match, p1) {
            return this.options.chatSettings[p1];
        }.bind(this));
    } else {
        return false;
    }
};

ChatServerConnection.prototype.init = function () {
    var _this6 = this;

    var onWsOpen = function (event) {
        var data = JSON.stringify(this.options.onOpen());
        this.webSocket.send(data);
    }.bind(this);

    var onWsError = function (event) {
        this.options.onError();
    }.bind(this);

    var onWsClose = function () {
        this.options.onClose();
        /* When websocket-connection is closed - try to reconnect each 5 sec until chat is completely closed */
        var reconnect = setInterval(function () {
            this.webSocket.readyState === this.webSocket.CLOSED && this.init();
            if (this.webSocket.readyState === this.webSocket.OPEN) {
                clearInterval(reconnect);
                this.options.onReconnect();
            }
        }.bind(this), 5000);
    }.bind(this);

    try {
        this.webSocket = new WebSocket(this.getWsUrl());
        this.webSocket.onopen = onWsOpen;
        this.webSocket.onerror = onWsError;
        this.webSocket.onclose = onWsClose;

        window.addEventListener('beforeunload', function () {
            _this6.webSocket.onclose();
            _this6.webSocket.close();
        });

        this.watch();
    } catch (error) {
        onWsError();
    }
};

ChatServerConnection.prototype.send = function (message) {
    this.webSocket.send(JSON.stringify(message));
};

ChatServerConnection.prototype.watch = function () {
    this.webSocket.onmessage = function (event) {
        this.options.onMessage(JSON.parse(event.data));
    }.bind(this);
};

ChatServerConnection.prototype.close = function () {
    this.webSocket.onclose = function (event) {};
    this.webSocket.close();
};
; /**
  * Chat conversation
  *
  * @param chatUi
  * @constructor
  */
function ChatConversation(chatUi) {

    this.chatUi = chatUi;
    this.messages = new Messages();

    this.isReady = false;
}

ChatConversation.prototype.init = function (messages) {

    if (messages.length === 0 && this.chatUi.options.initMessage) {
        try {
            var initMessage = {
                body: this.chatUi.options.initMessage,
                type: 'reply'
            };
            messages.push({ dialogues: [initMessage] });
        }
        catch(e) {}
    }

    this.messages.set(messages);
    this.chatUi.addMessages(this.messages.get());

    this.chatUi.hideLoading();
    this.chatUi.scrollToEndOfMessagesContainer();

    this.isReady = true;
};

ChatConversation.prototype.add = function (message) {

    if (message.createdAt) {
        this.messages.push(message);
        this.chatUi.compareAndAppendNewMessages(this.messages.get());
    } else {
        //for system message (errors, loading) and pending message
        // do not add ws error more than one time
        if (message.type !== 'wsError' || !this.chatUi.getWsError()) {
            this.chatUi.addMessage(message);
        }
    }
};

ChatConversation.prototype.update = function (message) {
    this.messages.push(message);
    this.chatUi.removePendingMessage(message);
    this.chatUi.compareAndAppendNewMessages(this.messages.get());
};

ChatConversation.prototype.dealerTexting = function (message) {
    this.chatUi.dealerTexting(message);
};

ChatConversation.prototype.freeze = function () {
    this.chatUi.hideLoading();
    this.chatUi.disableSubmitButton();
};

ChatConversation.prototype.replyNotification = function () {
    this.chatUi.replyNotification();
};

ChatConversation.prototype.refresh = function () {
    this.chatUi.removeWsError();
    this.chatUi.enableSubmitButton();
};

ChatConversation.prototype.blockUi = function () {
    this.chatUi.disableSubmitButton();
};

/**
 * Messages
 *
 * @constructor
 */
function Messages() {
    this.messages = [];
}

Messages.prototype._formatDialogues = function (day, formatMessages) {
    day.dialogues.forEach(function (message) {
        formatMessages.push(message);
    });
};

Messages.prototype.format = function (messages) {
    var formatMessages = [];
    messages.forEach(function (day) {
        this._formatDialogues(day, formatMessages);
    }.bind(this));
    return formatMessages;
};

Messages.prototype.sort = function (messages) {
    var propertyBy = 'createdAt';
    messages.sort(function (first, second) {
        return first[propertyBy] - second[propertyBy];
    });
    return messages;
};

Messages.prototype.set = function (messages) {
    this.messages = this.sort(this.format(messages));
};

Messages.prototype.push = function (message) {
    this.messages.push(message);
    this.sort(this.messages);
};

Messages.prototype.get = function () {
    return this.messages;
};

/**
 * Message for sending on server
 *
 * @param type
 * @param data
 * @constructor
 */
function Message(type, data, attachReferringUrl) {
    this.webSoketEvent = type;
    this.notificationData = null;

    if (data) {
        this.notificationData = new MessageData(data, attachReferringUrl);
    }
}

/**
 * Message detail for sending on server
 *
 * @param data
 * @constructor
 */
function MessageData(data, attachReferringUrl) {
    this.body = data.body;
    if (data.type) {
        this.type = data.type;
    }
    if (data.attachments) {
        this.attachments = data.attachments;
    }
    if (attachReferringUrl) {
        this.referringUrl = location.href;
    }
}
;var carcodeChatWidget = function (config) {

    var chatWidgetInstance;

    function CarcodeChatWidget(config) {

        var events = {};
        var unreads = 0;
        var isReferringUrlHasBeenSent = false;

        var options = {
            fileApiUrl: config.fileApiUrl,
            previewLink: config.previewLink,
            dealerApiLink: config.dealerApiLink,
            widgetSmsUrl: config.widgetSmsUrl,
            dealerPhoneNumber: config.dealerPhoneNumber,
            maxAttachmentSize: config.maxAttachmentSize,
            dealerName: config.dealerName,
            cssPrefix: config.cssPrefix,
            applySendEvent: _applySendEvent,
            applyNotificationEvent: _applyNotificationEvent,
            applyIdleEvent: _applyIdleEvent,
            applyOpenEvent: _applyOpenEvent,
            onWidgetClose: _onWidgetClose,
            onWidgetHide: _onWidgetHide
        };

        var carcodeChatWidgetUI = new CarcodeChatWidgetUI(options);
        var chatConversation = new ChatConversation(carcodeChatWidgetUI);
        var chatServerConnection = new ChatServerConnection({
            chatSettings: config,
            onOpen: _onWsOpen,
            onError: _onWsError,
            onMessage: _onWsMessage,
            onClose: _onWsClose,
            onReconnect: _onWsReconnect
        });

        function _applySendEvent(message) {
            var attachReferringUrl = false;
            var messageData = new MessageData({
                body: message.body,
                type: config.events.message,
                attachments: message.attachments
            });
            if (!isReferringUrlHasBeenSent) {
                isReferringUrlHasBeenSent = true;
                attachReferringUrl = true;
            }
            chatServerConnection.send(new Message(config.events.message, messageData, attachReferringUrl));
            chatConversation.add(messageData);
        }

        function _applyNotificationEvent(message) {
            var messageData = new MessageData({
                body: message.body,
                type: config.events.customerTexting
            });
            chatServerConnection.send(new Message(config.events.customerTexting, messageData));
        }

        function _applyIdleEvent() {
            chatServerConnection.send(new Message(config.events.customerIdle));
        }

        function _applyOpenEvent() {
            chatServerConnection.init();
        }

        function _onWsOpen() {
            return new Message(config.events.history);
        }

        function _onWsError(errorMsg) {
            chatConversation.add({
                body: errorMsg || 'Chat connection is temporary lost',
                type: 'wsError'
            });
            chatConversation.freeze();
        }

        function _onWsMessage(data) {
            switch (data.event) {

                /* Load chat history */
                case config.events.history:
                    if (!chatConversation.isReady) {
                        chatConversation.init(data.data);
                    }
                    break;

                /* Add reply */
                case config.events.reply:
                    chatConversation.replyNotification();
                    events.onReply();
                    chatConversation.add(data.data);
                    break;

                /* Confirmation message */
                case config.events.confirmationMessage:
                    chatConversation.update(data.data);
                    break;

                /* Dealer is typing */
                case config.events.dealerTexting:
                    chatConversation.dealerTexting(data.data);
                    break;

            }
        }

        function _onWsClose() {
            chatConversation.blockUi();
        }

        function _onWsReconnect() {
            chatConversation.refresh();
        }

        function _onWidgetClose() {
            events.onWidgetClose();
        }

        function _onWidgetHide() {
            events.onWidgetHide();
        }

        /**
         * Public methods
         */

        /**
         * Add event
         */
        this.addEvent = function (eventName, eventCallback) {
            events[eventName] = eventCallback;
        };

        /**
         * Init Chat Widget
         */
        this.initChatWidget = function (isChatWidgetVisible) {
            carcodeChatWidgetUI.initChatWidget(isChatWidgetVisible);
        };
    }

    /**
     * Create an instance
     */
    function createChatWidgetInstance(config) {
        return new CarcodeChatWidget(config.config);
    }

    return {

        /**
         * Return an instance of Chat Widget Object
         */
        get: function get(config) {

            /**
             * Create an instance if it isn't created yet
             */
            if (!chatWidgetInstance) {
                chatWidgetInstance = createChatWidgetInstance(config);
            }
            return chatWidgetInstance;
        }

    };
}();



function CarcodeWidgetsHubUi(config) {

    this.options = config;

    this.widgetID = this.generateWidgetId('Hub') + 'WidgetsHub';
    this.widgetContainerID = this.generateWidgetId('Hub') + 'WidgetsHubContainer';
    this.widgetContentID = this.generateWidgetId('Hub') + 'WidgetsHubContent';
    this.widgetButtonID = this.generateWidgetId('Hub') + 'WidgetsHubButton';

    this.liveChatButtonID = this.generateWidgetId('Hub') + 'WidgetsLiveChatButton';
    this.liveChatCounterID = this.generateWidgetId('Hub') + 'WidgetsLiveChatCounter';
    this.textUsButtonID = this.generateWidgetId('Hub') + 'WidgetsTextUsButton';
    this.facebookMessengerButtonID = this.generateWidgetId('Hub') + 'WidgetsFacebookMessengerButton';

    this.storage = new CarCodeStorage();
}

CarcodeWidgetsHubUi.prototype = Object.create(widgetUI.prototype);

/**
 * Attach events for SDK-buttons
 *
 * @param {function} callback - Attached event
 */
CarcodeWidgetsHubUi.prototype.attachSDK = function (callback) {
    var sdkElements = [].slice.call(document.querySelectorAll(".sms-button"));
    if (sdkElements.length === 0) {
        sdkElements = [].slice.call(document.querySelectorAll(".smsbutton"));
    }
    sdkElements.forEach(function (element) {
        element.dataset.chatButton = true;
        element.addEventListener('click', function (event) {
            callback(element.dataset);
            event.stopPropagation();
        });
    });
};

/**
 * Create 'Open Chat' CTA - Opens hub with communcation channels selector
 */
CarcodeWidgetsHubUi.prototype.createOpenButton = function () {
    var _this7 = this;

    if (document.getElementById(this.widgetButtonID)) {
        return;
    }

    var _openHub = function _openHub(dataset) {

        var liveChatStatus = _this7.storage.get('live_chat_status');
        var dealershipStatus = _this7.storage.get('dealership_status');
        if (!liveChatStatus || liveChatStatus === 'closed' || dealershipStatus === 'closed') {
            EDWT.track_event('panel_pop_up', 'carcode_panel_btn_click');
            _this7.openWidgetsHub(dataset);
        } else {
            EDWT.track_event('panel_pop_up', 'carcode_chat_btn_expand');
            if (_this7.options.liveChat && typeof _this7.options.liveChat.callback === 'function') {
                _this7.options.liveChat.callback(true);
                _this7.isLiveChatOpen=true;
                // hide counter into hub button
                var liveChatCounterNode=document.getElementById(_this7.liveChatCounterID);!liveChatCounterNode.classList.contains('is-hidden')&&liveChatCounterNode.classList.add('is-hidden');               // remove counter
                // because of chat will be opened
                _this7.removeMainHubButtonCounter();
            }
        }

    };

    var _button = this.createActionButton({
        id: this.widgetButtonID,
        className: 'main-hub-button',
        icon: {
            svg: {
                width: '16px',
                height: '14px',
                path: { d: this.svgIconPaths.chat }
            }
        },
        text: 'Contact Us',
        callback: _openHub
    });

    document.body.appendChild(_button);
    this.hubButton = document.getElementById(this.widgetButtonID);

    if (+this.storage.get('live_chat_unreads')) {
        _button.classList.add('notification');
        this.updateMainHubButtonCounter();
    }

    CarcodeWidgetsHubUi.prototype.attachSDK(_openHub);
};

/**
 * Load widget if it was open before
 */
CarcodeWidgetsHubUi.prototype.loadWidgets = function () {
    if (this.options.liveChat && typeof this.options.liveChat.callback === 'function') {
        this.options.liveChat.callback();
    }
};

/**
 * Create Hub buttons
 */
CarcodeWidgetsHubUi.prototype.createButtons = function () {
    var _this8 = this;

    
    var _getLiveChatButton = function _getLiveChatButton() {
        var liveChatButton = _this8.createActionButton({
            className: 'hub-button hub-button--live-chat',
            id: _this8.liveChatButtonID,
            icon: {
                svg: {
                    width: '16px',
                    height: '14px',
                    path: { d: _this8.svgIconPaths.chat }
                }
            },
            text: 'Live Chat',
            callback: function () {
                var liveChatCounterNode = document.getElementById(this.liveChatCounterID);
                if (this.options.liveChat && typeof this.options.liveChat.callback === 'function') {
                    this.options.liveChat.callback(true);
                    this.isLiveChatOpen = true;
                }
                !liveChatCounterNode.classList.contains('is-hidden') && liveChatCounterNode.classList.add('is-hidden');
                // remove counter on main hub button
                this.removeMainHubButtonCounter();
                EDWT.track_event('chat_pop_up', 'carcode_panel_btn_click');
            }.bind(_this8)
        });
        liveChatButton.appendChild(_this8.createEl({
            className: 'live-chat--counter is-hidden',
            attrs: {
                id: _this8.liveChatCounterID
            }
        }));
        return liveChatButton;
    };
    

    var _getTextUsButton = function _getTextUsButton() {

        var textUsButton = _this8.createEl({
            tag: 'a',
            className: 'sms-button',
            attrs: {
                'id': _this8.textUsButtonID,
                'href': "sms:+15056294017",
                'data-numbers': "sales=sms:+15056294017"
            }
        });
        textUsButton.addEventListener('click', function(e) {
            EDWT.track_event('text_pop_up', 'carcode_panel_btn_click');
            this.options.textUs.callback(e, this.dataset);
        }.bind(_this8));

        var textUsButtonChild = _this8.createActionButton({
            className: 'hub-button hub-button--text-us',
            id: _this8.textUsButtonID + 'Child',
            icon: {
                svg: {
                    width: '10px',
                    height: '16px',
                    g: { strokeWidth: 1, fillRule: 'evenodd' },
                    path: { d: _this8.svgIconPaths.phone }
                }
            },
            text: 'Text Us'
        });
        textUsButton.appendChild(textUsButtonChild);
        return textUsButton;
    };

    

    var buttons = this.createEl({ className: 'hub-buttons' });

    
    buttons.appendChild(_getLiveChatButton());
    

    buttons.appendChild(_getTextUsButton());

    

    return buttons;
};

CarcodeWidgetsHubUi.prototype.onChatReply = function () {
    var liveChatCounterNode = document.getElementById(this.liveChatCounterID);
    if (!this.isLiveChatOpen) {
        this.storage.increaseValue('live_chat_unreads');
        // update counter value or create new counter
        this.updateMainHubButtonCounter();
        liveChatCounterNode.classList.remove('is-hidden');
    } else {
        this.storage.set('live_chat_unreads', 0);
        !liveChatCounterNode.classList.contains('is-hidden') && liveChatCounterNode.classList.add('is-hidden');
        // remove counter on main hub button
        this.removeMainHubButtonCounter();
    }
    liveChatCounterNode.innerText = this.storage.get('live_chat_unreads');
};

CarcodeWidgetsHubUi.prototype.createContentArea = function () {
    var _contentArea = this.constructor.prototype.createContentArea.call(this);
    _contentArea.appendChild(this.createButtons());
    return _contentArea;
};

CarcodeWidgetsHubUi.prototype.createWidgetActions = function () {

    /* Actions block with collapse and close buttons */
    var _actionsBlock = this.createEl({ className: 'widget-actions' });

    /* Button "Collapse widget" */
    var _btnCollapse = this.createActionButton({
        id: this.widgetButtonID,
        className: 'widget-actions__collapse',
        icon: {
            svg: {
                width: '16px',
                height: '10px',
                path: { d: this.svgIconPaths.arrow_down }
            }
        },
        callback: function () {
            this.hideWidget();
            this.showHubButton();
        }.bind(this)
    });
    _actionsBlock.appendChild(_btnCollapse);

    return _actionsBlock;
};

CarcodeWidgetsHubUi.prototype.createWidget = function () {
    var isHubWidgetVisible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


    var sections = [];
    sections.push(this.createHeader({
        title: 'How do you want to contact us?'
    }));
    sections.push(this.createContentArea());
    document.body.appendChild(this.constructor.prototype.createWidget.call(this, sections, 'widgets-hub', isHubWidgetVisible));
    EDWT && EDWT.init(EDM);
    this.widget = document.getElementById(this.widgetID);
};

CarcodeWidgetsHubUi.prototype.openWidgetsHub = function(dataset) {

    this.dataset = dataset || null;
    this.showWidget();
    if (this.isLiveChatOpen && this.options.liveChat && typeof this.options.liveChat.callback === 'function' && this.storage.get('dealership_status') !== 'closed') {
        EDWT.track_event('panel_pop_up', 'carcode_chat_btn_expand');
        this.options.liveChat.callback(true);
    }
    this.widgetExists = true;
};

CarcodeWidgetsHubUi.prototype.hideHubButton = function () {
    this.hubButton.classList.add('is-hidden');
};
CarcodeWidgetsHubUi.prototype.showHubButton = function () {
    this.hubButton.classList.remove('is-hidden');
};

CarcodeWidgetsHubUi.prototype.updateMainHubButtonCounter = function() {
    var svgPathElement = this.hubButton.querySelector('path'),
         counterEl;
    // if button have not been notified than notify it
    if(svgPathElement.getAttribute('d') !== this.svgIconPaths.chat_notification) {
        // change svg icon
        this.hubButton.querySelector('path').setAttributeNS(null, 'd', this.svgIconPaths.chat_notification);

        // create counter element
        counterEl = this.createEl({
            tag: 'span',
            className: 'main-hub-counter'
        });
        this.hubButton.appendChild(counterEl);
    } else { // else find current counter element
        counterEl = this.hubButton.querySelector('.carcode-widget_main-hub-counter');
    }

    if(counterEl) {
        counterEl.innerHTML = this.storage.get('live_chat_unreads');
    }
};

CarcodeWidgetsHubUi.prototype.removeMainHubButtonCounter = function() {
    // remove counter
    var counterEl = this.hubButton.querySelector('.carcode-widget_main-hub-counter');
    if(counterEl) {
        this.hubButton.removeChild(counterEl);
        // update svg
        // change svg icon
        this.hubButton.querySelector('path').setAttributeNS(null, 'd', this.svgIconPaths.chat);
    }
};

CarcodeWidgetsHubUi.prototype.onChatCollapsed = function() {
    this.showWidget();
    this.isLiveChatOpen = false;
};

CarcodeWidgetsHubUi.prototype.onChatClosed = function() {
 this.hideWidget();
 this.isLiveChatOpen = false;
};


;

var CarCodeWidgetsModal = function (_widgetUI) {
    _inherits(CarCodeWidgetsModal, _widgetUI);

    function CarCodeWidgetsModal() {
        _classCallCheck(this, CarCodeWidgetsModal);

        var _this11 = _possibleConstructorReturn(this, (CarCodeWidgetsModal.__proto__ || Object.getPrototypeOf(CarCodeWidgetsModal)).call(this));

        _this11.validation = new CarCodeFormValidation();
        return _this11;
    }

    _createClass(CarCodeWidgetsModal, [{
        key: 'createModal',
        value: function createModal() {
            var _this12 = this;

            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            var modal = this.createEl({
                className: 'modal',
                attrs: {
                    id: id
                }
            });

            var closeButton = this.createEl({
                className: 'modal-close'
            });
            closeButton.addEventListener('click', function () {
                return _this12.destroy(id);
            });

            modal.appendChild(closeButton);
            return modal;
        }
    }, {
        key: 'createBackdrop',
        value: function createBackdrop(id) {
            var _this13 = this;

            var backdrop = document.getElementById(id);
            if (!backdrop) {
                backdrop = this.createEl({
                    className: 'backdrop',
                    attrs: {
                        id: id + 'Backdrop'
                    }
                });
                backdrop.addEventListener('click', function () {
                    return _this13.destroy(id);
                });
            }

            return backdrop;
        }
    }, {
        key: 'destroy',
        value: function destroy(id) {
            var modal = document.getElementById(id);
            if (modal) {
                modal.parentNode.removeChild(modal);
            }

            var backdrop = document.getElementById(id + 'Backdrop');
            if (backdrop) {
                backdrop.parentNode.removeChild(backdrop);
            }
        }
    }, {
        key: 'createFormLabel',
        value: function createFormLabel() {
            var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var forAttr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            return this.createEl({
                tag: 'label',
                text: text,
                className: 'modal-label',
                attrs: {
                    for: forAttr
                }
            });
        }
    }, {
        key: 'createFormInput',
        value: function createFormInput(id, options) {
            var _this14 = this;

            var input = this.createEl({
                tag: 'input',
                className: 'modal-input ',
                attrs: {
                    id: id,
                    type: options.type
                }
            });
            input.classList.add('is-empty');

            if (options.type === 'phoneNumber') {
                input.addEventListener('input', function (e) {
                    var value = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                    e.target.value = !value[2] ? value[1] : '(' + value[1] + ') ' + value[2] + (value[3] ? '-' + value[3] : '');
                });
            }

            input.addEventListener('input', function (e) {
                if (options.model && options.name) {
                    _this14.model[options.name] = e.target.value;
                }
                if (e.target.value.length === 0) {
                    e.target.classList.add('is-empty');
                } else {
                    e.target.classList.remove('is-empty');
                }
                if (options.required) {
                    _this14.validation.validateRequired(e);
                }
                if (options.minLength) {
                    _this14.validation.validateMinLength(e, options.minLength);
                }
                if (options.maxLength) {
                    _this14.validation.validateMaxLength(e, options.maxLength);
                }
            });

            return input;
        }
    }]);

    return CarCodeWidgetsModal;
}(widgetUI);


var CarCodeWidgetsContactModal = function (_CarCodeWidgetsModal) {
    _inherits(CarCodeWidgetsContactModal, _CarCodeWidgetsModal);

    function CarCodeWidgetsContactModal(options) {
        _classCallCheck(this, CarCodeWidgetsContactModal);

        var _this15 = _possibleConstructorReturn(this, (CarCodeWidgetsContactModal.__proto__ || Object.getPrototypeOf(CarCodeWidgetsContactModal)).call(this));

        _this15.id = 'CarCodeContactModal';
        _this15.options = options;
        _this15.isFormValid = false;
        _this15.model = {
            name: '',
            phone: '',
            email: ''
        };
        return _this15;
    }

    _createClass(CarCodeWidgetsContactModal, [{
        key: 'verifyFormData',
        value: function verifyFormData() {
            if (this.model.name.length === 0 || this.model.phone.length !== 14) {
                this.submitButton.setAttribute('disabled', 'disabled');
                return false;
            } else {
                this.submitButton.removeAttribute('disabled', 'disabled');
                return true;
            }
        }
    }, {
        key: 'sendForm',
        value: function sendForm() {
            var _this16 = this;

            var xhttp = new XMLHttpRequest();
            var url = this.options.smsUrl;

            var body = this.model.email ? 'Customer with email ' + this.model.email + ' texted when dealership was closed' : 'Customer texted when dealership was closed';

            var params = [{ name: 'src', value: document.location.href }, { name: 'To', value: this.options.dealerPhoneNumber }, { name: 'nickname', value: this.model.name }, { name: 'From', value: this.model.phone }, { name: 'Body', value: body }];

            var query = '';
            for (var i = 0; i < params.length; i++) {
                query += params[i].name + '=' + encodeURIComponent(params[i].value) + '&';
            }
            xhttp.open('POST', url, true);
            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4 && xhttp.status === 200) {
                    _this16.showThanksMessage();
                }
            };
            xhttp.send(query);
        }
    }, {
        key: 'showThanksMessage',
        value: function showThanksMessage() {
            var message = this.createEl({
                className: 'modal-thanks-message',
                attrs: {
                    id: 'CarCodeModalMessages'
                }
            });
            var messageTitle = this.createEl({
                className: 'modal-thanks-message-title',
                text: 'Thank you!'
            });
            var messageDetails = this.createEl({
                className: 'modal-thanks-message-details',
                text: 'We will contact you as soon as we\'re open.'
            });
            message.appendChild(messageTitle);
            message.appendChild(messageDetails);

            this.formSection.parentNode.removeChild(this.formSection);
            this.modal.appendChild(message);
        }
    }, {
        key: 'createModal',
        value: function createModal() {
            var _this17 = this;

            var titleRow = this.createEl({
                className: 'modal-row modal-row--title',
                text: 'Text Us'
            });

            var introRow = this.createEl({
                className: 'modal-row modal-row--intro',
                text: 'Sorry, the dealership is closed right now. Let us know where we can contact you and will get back to you as soon as we\'re open.'
            });

            var formSection = this.createEl({
                className: 'modal-form',
                attrs: {
                    id: 'CarCodeModalForm'
                }
            });

            var nameRow = this.createEl({ className: 'modal-row' });
            var nameLabel = this.createFormLabel('Enter your name', 'CarCodeModalInputName');
            var nameInput = this.createFormInput('CarCodeModalInputName', {
                model: this.model,
                name: 'name',
                type: 'text',
                minLength: 2
            });
            nameInput.addEventListener('keyup', function () {
                return _this17.verifyFormData();
            });
            nameRow.appendChild(nameInput);
            nameRow.appendChild(nameLabel);

            var phoneRow = this.createEl({ className: 'modal-row' });
            var phoneLabel = this.createFormLabel('Enter your phone number', 'CarCodeModalInputPhone');
            var phoneInput = this.createFormInput('CarCodeModalInputPhone', {
                model: this.model,
                name: 'phone',
                type: 'phoneNumber',
                required: true,
                minLength: 14,
                maxLength: 14
            });
            phoneInput.addEventListener('keyup', function () {
                return _this17.verifyFormData();
            });
            phoneRow.appendChild(phoneInput);
            phoneRow.appendChild(phoneLabel);

            var emailRow = this.createEl({ className: 'modal-row' });
            var emailLabel = this.createFormLabel('Enter your email (optional)', 'CarCodeModalInputEmail');
            var emailInput = this.createFormInput('CarCodeModalInputEmail', {
                model: this.model,
                name: 'email',
                type: 'text',
                minLength: 6
            });
            emailInput.addEventListener('keyup', function () {
                return _this17.verifyFormData();
            });
            emailRow.appendChild(emailInput);
            emailRow.appendChild(emailLabel);

            var submitRow = this.createEl({ className: 'modal-row modal-row--submit' });
            var submitButton = this.createEl({
                tag: 'button',
                className: 'modal-button',
                text: 'Send',
                attrs: {
                    id: 'modalSubmitButton',
                    type: 'submit',
                    disabled: 'disabled'
                }
            });
            submitButton.addEventListener('click', function () {
                return _this17.sendForm();
            });
            submitRow.appendChild(submitButton);

            var modal = _get(CarCodeWidgetsContactModal.prototype.__proto__ || Object.getPrototypeOf(CarCodeWidgetsContactModal.prototype), 'createModal', this).call(this, this.id);

            formSection.appendChild(nameRow);
            formSection.appendChild(phoneRow);
            formSection.appendChild(emailRow);
            formSection.appendChild(submitRow);

            modal.appendChild(titleRow);
            modal.appendChild(introRow);
            modal.appendChild(formSection);

            var backdrop = this.createBackdrop(this.id);

            document.body.appendChild(backdrop);
            document.body.appendChild(modal);

            this.modal = document.getElementById(this.id);
            this.formSection = document.getElementById('CarCodeModalForm');
            this.submitButton = document.getElementById('modalSubmitButton');
        }
    }]);

    return CarCodeWidgetsContactModal;
}(CarCodeWidgetsModal);


var CarCodeImageViewModal = function (_CarCodeWidgetsModal2) {
    _inherits(CarCodeImageViewModal, _CarCodeWidgetsModal2);

    function CarCodeImageViewModal() {
        _classCallCheck(this, CarCodeImageViewModal);

        var _this18 = _possibleConstructorReturn(this, (CarCodeImageViewModal.__proto__ || Object.getPrototypeOf(CarCodeImageViewModal)).call(this));

        _this18.id = 'CarCodeImagePreviewModal';
        return _this18;
    }

    _createClass(CarCodeImageViewModal, [{
        key: 'openImage',
        value: function openImage(image) {

            var backdrop = this.createBackdrop(this.id);

            var modal = _get(CarCodeImageViewModal.prototype.__proto__ || Object.getPrototypeOf(CarCodeImageViewModal.prototype), 'createModal', this).call(this, this.id);
            var imageView = void 0;

            if (imageView = this.createImage(image)) {
                modal.appendChild(imageView);
                document.body.appendChild(backdrop);
                document.body.appendChild(modal);
                this.modal = document.getElementById(this.id);
            }
        }
    }, {
        key: 'createImage',
        value: function createImage(image) {
            var _this19 = this;

            if (image.url) {
                var imageContainer = this.createEl({
                    className: 'image-container',
                    attrs: {
                        id: this.id + 'ImageContainer'
                    }
                });
                var imagePreview = this.createEl({
                    tag: 'img',
                    className: 'image',
                    attrs: {
                        src: image.url,
                        id: this.id + 'Image'
                    }
                });
                imagePreview.addEventListener('load', function () {

                    var windowWidth = window.innerWidth;
                    var windowHeight = window.innerHeight;

                    var image = document.getElementById(_this19.id + 'Image');
                    var imageWidth = image.offsetWidth;
                    var imageHeight = image.offsetHeight;

                    if (imageWidth > windowWidth - 100 || imageHeight > windowHeight - 100) {
                        var difX = imageWidth - windowWidth - 100;
                        var difY = imageHeight - windowHeight - 100;
                        if (difX > difY) {
                            image.style.width = windowWidth - 100 + 'px';
                        } else {
                            image.style.height = windowHeight - 100 + 'px';
                        }
                    }
                    setTimeout(function () {
                        return image.classList.add('is-visible');
                    }, 0);
                });
                imageContainer.appendChild(imagePreview);
                return imageContainer;
            }
            return null;
        }
    }]);

    return CarCodeImageViewModal;
}(CarCodeWidgetsModal);

;
var CarCodeFormValidation = function () {
    function CarCodeFormValidation() {
        _classCallCheck(this, CarCodeFormValidation);
    }

    _createClass(CarCodeFormValidation, [{
        key: 'validateMinLength',
        value: function validateMinLength(e, minLength) {
            if (e.target.value.length < minLength) {
                e.target.classList.add('is-error-minlength');
                return false;
            } else {
                e.target.classList.remove('is-error-minlength');
                return true;
            }
        }
    }, {
        key: 'validateMaxLength',
        value: function validateMaxLength(e, maxLength) {
            if (e.target.value.length > maxLength) {
                e.target.classList.add('is-error-maxlength');
                return false;
            } else {
                e.target.classList.remove('is-error-maxlength');
                return true;
            }
        }
    }, {
        key: 'validateRequired',
        value: function validateRequired(e) {
            if (e.target.value.length === 0) {
                e.target.classList.add('is-error-required');
                return false;
            } else {
                e.target.classList.remove('is-error-required');
                return true;
            }
        }
    }]);

    return CarCodeFormValidation;
}();

;(function () {

    var storage = new CarCodeStorage();

    var carcodeWidgetsConfiguration = {

        /**
         * Common config
         */
        common: {
            cssPrefix: 'carcode-widget_',
            styles: {
                widgetPosition: "bottom center",
                primaryColor: "#ff6633",
                hubButtonWidth: "150px",
                hubButtonHeight: "39px",
                hubButtonColor: "#ff6633",
                hubButtonTextColor: "#ffffff",
                hubButtonFont: "Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif",
                hubButtonFontSize: "16px",
                hubButtonPosition: {
                    top: '0',
                    right: '0',
                    left: '0',
                    bottom: '0',
                    marginTop: '0',
                    marginBottom: '0',
                    marginRight: '0',
                    marginLeft: '0'
                }
            }
        },

        /**
         * Widgets Hub config
         */
        hub: {},

        
        /**
         * Livechat config
         */
        liveChat: {
            config: {
                dealerPhoneNumber: "+15056294017",
                dealerName: "Mercedes-Benz of Albuquerque",
                widgetSmsUrl: "https://www.carcode.com/carcode/v1/dealer/sms/widget",
                fileApiUrl: 'https://www.carcode.com/carcode/v1/ccapi/upload/file',
                previewLink: 'https://www.carcode.com/carcode/v1/ccapi/image-upload/link-previews',
                dealerApiLink: 'https://www.carcode.com/carcode/v1/ccapi/dealer',
                wsUrl: 'wss://api.carcode.com/ws/carcode/chat/dealer/:dealerPhoneNumber/customer/:visitorId',
                maxAttachmentSize: 5242880,
                events: {
                    history: 'history',
                    message: 'message',
                    reply: 'reply',
                    dealerTexting: 'dealer_texting',
                    customerTexting: 'customer_texting',
                    customerIdle: 'customer_idle',
                    confirmationMessage: 'confirmation_message'
                }
            },
            callback: function callback(isLiveChatOpen) {

                var carcodeChatWidgetInstance = carcodeChatWidget.get(carcodeWidgetsConfiguration.liveChat);
                carcodeChatWidgetInstance.initChatWidget(isLiveChatOpen);

                carcodeChatWidgetInstance.addEvent('onWidgetClose', function () {
                    widgetsHubUi.onChatCollapsed();
                    storage.set('live_chat_status', 'closed');
                });

                carcodeChatWidgetInstance.addEvent('onWidgetHide', function () {
                    widgetsHubUi.onChatClosed();
                });

                carcodeChatWidgetInstance.addEvent('onReply', function () {
                    widgetsHubUi.onChatReply();
                });

                widgetsHubUi.hideWidget();
            }
        },
        

        /**
         * Text Us config
         */
        textUs: {
            callback: function callback(e, dataset) {
                var widget = new CarcodeWidget();
                widgetsHubUi.hideWidget();
                widget.clickHandler(e, dataset);
            }
        },

        

    };

    var carcodeWidgetsStyles = new WidgetsStylesheet(carcodeWidgetsConfiguration.common.styles);
    var widgetsHubUi = new CarcodeWidgetsHubUi(carcodeWidgetsConfiguration);

    /**
     * Init widgets
     * If live_chat_is_open is in localStorage - start LiveChat to keep the previous conversation
     */
    var initWidgets = function initWidgets() {

        widgetsHubUi.createOpenButton();
        widgetsHubUi.createWidget(false);

        if (storage.get('live_chat_status')) {
            if (carcodeWidgetsConfiguration.liveChat && typeof carcodeWidgetsConfiguration.liveChat.callback === 'function') {
                carcodeWidgetsConfiguration.liveChat.callback();
            }
        }
    };

    if (document.readyState === 'complete') {
        initWidgets();
    } else {
        document.addEventListener('readystatechange', function () {
            document.readyState === 'complete' && initWidgets();
        });
    }
})();



     

    setTimeout(function() {
        EDWT.init_widgets_hub(EDM);
    }, 0);

   }, false);
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(edw, s);

  });

})();




/* exported pixelFactory, now_utc, doSync, base64ForSync, mchx_ds */
var mchx_ds = {
    base64ForSync: function () {
        'use strict';
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = this._utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);

                }

                return output;
            },


            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                while (i < input.length) {

                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 !== 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 !== 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                }

                output = this._utf8_decode(output);

                return output;

            },

            _utf8_encode: function (string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            },

            _utf8_decode: function (utftext) {
                var string = "";
                var i = 0;
                var c = 0;
                var c3 = 0;
                var c2 = 0;

                while (i < utftext.length) {

                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    }
                    else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    }
                    else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }

                }

                return string;
            }
        };

    },


    pixelFactory: function () {
        'use strict';
        return {
            buildPixel: function (url) {
                var img = new Image();
                img.src = url;
                return img;
            }
        };
    },

    documentCookieUpdater: function () {
        'use strict';
        return {
            updateCookieValue: function (key, value, theDoc, expirationDate) {
                theDoc.cookie = key + "=" + value + ";expires=" + expirationDate + ";domain=marchex.io;path=/";
            }
        };
    },

    now_utc: function () {
        'use strict';
        return new Date();
    },

    doSync: function (pFactory, documentCookieUpdater, theDoc, dateSource) {
        'use strict';
        var dayInMillis = 24 * 60 * 60 * 1000;
        if (typeof(theDoc) === 'undefined') {
            theDoc = document;
        }
        if (typeof(dateSource) === 'undefined') {
            dateSource = {
                getTime: function () {
                    return mchx_ds.now_utc().getTime();
                }
            };
        }
        if (typeof(documentCookieUpdater) === 'undefined') {
            documentCookieUpdater = mchx_ds.documentCookieUpdater();
        }
        var base64 = mchx_ds.base64ForSync();
        return {

            protocol: (theDoc.location.protocol + '//'),
            createPixel: function (url) {
                pFactory.buildPixel(url);
            },
            insertPartner: function (syncKey, expirationDate, decodedString) {

                if (decodedString !== '') {
                    decodedString += '/';
                }
                return decodedString + " " + syncKey + "=" + expirationDate.toUTCString();
            },
            updatePartner: function (syncKey, expirationDate, decodedString) {
                return decodedString.replace(new RegExp(syncKey + '=([^/]+)'), syncKey + "=" + expirationDate.toUTCString());
            },
            updateCookieValue: function (key, value) {
                documentCookieUpdater.updateCookieValue(key, value, theDoc, this.getOneYearFromNow().toUTCString());
            },
            replaceValueOnKey: function (str, key, value) {
                return str.replace(new RegExp(key + '=([^;]+)'), key + "=" + value);
            },
            getOneYearFromNow: function () {
                var expDate = new Date(dateSource.getTime());
                expDate.setTime(dateSource.getTime() + (365 * dayInMillis));
                return expDate;
            },
            getCookieValue: function (name) {
                if (typeof theDoc.cookie === 'undefined') {
                    return null;
                }
                var match = theDoc.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                if (match) {
                    return match[2];
                }
                else {
                    return null;
                }
            },
            hasValidId: function (id) {
                return !!(id && id !== '-1');
            },
            cookieReplace: function (url, cookieId) {

                if (cookieId === null) {
                    return url;
                }
                return url.replace('<cookie_id>', cookieId);
            },
            getPartnerExpiration: function (decoded, name) {
                if (typeof decoded === 'undefined') {
                    return null;
                }
                var match = decoded.match(new RegExp('( )' + name + '=([^/]+)'));
                if (match) {
                    return match[2];
                }
                else {
                    return null;
                }
            },
            syncWithSettings: function (partner) {
                var pxUrl = partner.url;
                var expDays = partner.timeout;
                var label = partner.label;
                var encoded = this.getCookieValue('tracker');
                var cookieId = this.getCookieValue('uid');
                if (cookieId !== null) {
                    var decoded = "";
                    if (encoded !== null) {
                        decoded = base64.decode(encoded);
                    }
                    var partnerExpiresDate = this.getPartnerExpiration(decoded, label);

                    if (partnerExpiresDate === null || partnerExpiresDate === "") {
                        partnerExpiresDate = new Date(dateSource.getTime());
                        partnerExpiresDate.setTime(dateSource.getTime() + (expDays * dayInMillis));

                        decoded = this.insertPartner(label, partnerExpiresDate, decoded);

                        pxUrl = this.cookieReplace(pxUrl, cookieId);
                        pFactory.buildPixel(this.protocol + pxUrl);
                    }
                    else {
                        var expiresDate = new Date(partnerExpiresDate);
                        var nowDate = new Date(dateSource.getTime());

                        if (nowDate.getTime() > expiresDate.getTime()) {
                            expiresDate.setTime(dateSource.getTime() + (expDays * dayInMillis));
                            decoded = this.updatePartner(label, expiresDate, decoded);
                            pxUrl = this.cookieReplace(pxUrl, cookieId);
                            pFactory.buildPixel(this.protocol + pxUrl);
                        }
                    }
                    this.updateCookieValue("tracker", base64.encode(decoded));
                }
            },
            performSync: function (syncPartners) {
                for (var i = 0; i < syncPartners.length; i+=1) {
                    this.syncWithSettings(syncPartners[i]);
                }
            },
            startSync: function () {
                var cookieId = this.getCookieValue('uid');
                if(cookieId !== '-1') {
                    this.withSyncPartners(this.performSync);
                }
            },
            withSyncPartners: function(callback) {
                var request = new XMLHttpRequest();
                var rulesetId = this.getRuleSetId();
                var url = this.protocol+'snc.marchex.io/snc/'+rulesetId+'/map.json';
                var syncObject = this;
                request.onreadystatechange = function() {
                    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                        callback.call(syncObject, JSON.parse(request.responseText).syncMap);
                    }
                };
                request.open('GET', url);
                request.send();
            },
            getRuleSetId: function() {
                var ruleSetId = 'Default-29c651ecdb9e';
                var queryParams = theDoc.location.search;
                if(queryParams) {
                    queryParams = queryParams.split('=');
                    if(queryParams.length > 1) {
                        ruleSetId = queryParams[1];
                    }
                }
                return ruleSetId;
            }
        };
    }
};;
(function () {
    'use strict';
    var syncer = mchx_ds.doSync(mchx_ds.pixelFactory(), mchx_ds.documentCookieUpdater());
    syncer.startSync();
}());

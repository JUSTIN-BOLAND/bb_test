/**
*   Pixel and matching library and calls.
*
*
*
*   window.LXLoader variable will be created
*   on load of this js file.
**/
window.LXLoader = (function(){

    var queue           = window.LXLoader || [];

    var debug           = false;
    var dev             = false;
    var devDomain       = "http://dev-cm.lotlinx.com";
    var prodDomain      = "https://cm.lotlinx.com";

    var paths = {
        list : "/affiliate/getPixelUrls?",
    };

    var params = {};

    /**
    *   Get the proper domain of requests - dev/prod/other
    **/
    var domain = function(){
        return (dev ? devDomain : prodDomain);
    };


    /**
    *   Print to console, set debugOnly to only output while in debug mode.
    **/
    var out = function(str, debugOnly){
        str = str || '';
        debugOnly = debugOnly || false;
        if(!debugOnly || debug){
            console.log("[LXLoader] " + str);
        }
    };

    /**
    *   Extra web/library functions
    **/
    var lib = {
        jsonToUri : function(obj){
            return encodeURIComponent(JSON.stringify(obj));
        },
        jsonToQuery : function(obj){
            var arr = [];
            for(var prop in obj){
                var p = obj[prop];
                if(!this.isEncoded(p))
                    p = encodeURIComponent(p);
                arr.push(encodeURIComponent(prop) + "=" + p);
            }
            return arr.join("&");
        },
        /**
        *   In case a publisher takes the time to
        *   encode a parameter (URL for example), we
        *   don't want to double encode it.
        **/
        isEncoded : function(str){
            return typeof str == "string" && decodeURIComponent(str) !== str;
        },
        ord : function(){
            if (!Date.now){
                Date.now = function(){return new Date().getTime();};
            }
            return Date.now();
        },
        microAjax : function (url, isAsync, callbackFunction){
            this.isXdr = false;
            if (window.XDomainRequest)
                this.isXdr = true;

            this.bindFunction = function (caller, object){
                return function(){
                    return caller.apply(object, [object]);
                };
            };

            this.stateChange = function (object){
                if (this.request.readyState == 4 || this.isXdr != false){
                    this.callbackFunction(this.request.responseText);
                }
            };

            this.getRequest = function(){
                if (window.XDomainRequest)
                    return new XDomainRequest();
                else if (window.ActiveXObject)
                    return new ActiveXObject('Microsoft.XMLHTTP');
                else if (window.XMLHttpRequest)
                    return new XMLHttpRequest();
                return false;
            };

            this.postBody = (arguments[3] || "");
            this.callbackFunction = callbackFunction;
            this.url = url;
            this.request = this.getRequest();

            if(this.request){
                var req = this.request;
                if(this.isXdr == false){
                    req.onreadystatechange = this.bindFunction(this.stateChange, this);
                }
                else{
                    req.onload = this.bindFunction(this.stateChange, this);
                }
                if(this.postBody!==""){
                    if (this.isXdr == false){
                        req.open("POST", url, isAsync);
                        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        req.setRequestHeader('x-client-user-agent', navigator.userAgent);
                    }
                    else{
                        req.open("POST", url);
                    }
                }
                else{
                    req.open("GET", url, isAsync);
                }
                req.send(this.postBody);
            }
        },
        /**
        *   Call AJAX URL, execute success or failure functions
        *   on complete. success should take a JSON data object,
        *   and failure a status string as their arguments.
        **/
        callAjax : function(url, success, failure){
            new lib.microAjax(url, true, function(result){
                // result should be json
                try{
                    var resp = JSON.parse(result);
                    if(typeof resp.status != 'undefined'){
                        if(resp.status == 'ok'){
                            if(typeof resp.data != 'undefined'){
                                success(resp);
                                return;
                            }
                            failure(resp);
                        }
                        failure(resp);
                        return;
                    }
                    failure({"status":"no status returned"});
                    return;
                }
                catch(err){
                    out(err.message, true);
                    failure({"status" : "couldn't parse response"});
                    return;
                }
            });
        }
    };

    /**
    *   Call cm.lotlinx server to get a list
    *   of urls to include as pixels.
    *
    **/
    var track = function(options){
        out("track called", true);
        var url = domain() + paths.list + lib.jsonToQuery(params) + "&ord=" + lib.ord();
        out(url, true);
        var success = function(resp){
            out("Success", true);
            var data = resp.data;
            if(typeof data.pixels == "undefined")
                return;

            var urls = data.pixels;
            for(var i = 0; i < urls.length; i++){
                window.LXLoader.push({
                    op : "addPixel",
                    src : urls[i],
                });
            }
        };
        var failure = function(resp){
            out("Failure", true);
        };

        lib.callAjax(
            url,
            success,
            failure
            );
    };

    /**
    *   Build and load a pixel for a
    *   url. 
    *
    **/
    var _addPixel = function(options){
        out("_addPixel called", true);

        if(typeof options.src == "undefined")
            return;

        var img = document.createElement('img');
        img.setAttribute('style', 'width:1px;height:1px;border:none;display:block');
        img.src = options.src;
    };

    var setParams = function(options){
        out("setParams called", true);

        for(var prop in options){
            if(prop == "op")
                continue;
            params[prop] = options[prop];
            if(prop == "debug")
                debug = options[prop];
            if(prop == "dev")
                dev = options[prop];
        }
    };

    /**
    *   Burn through queue items, dispatch them to
    *   proper processing functions.
    **/
    var process = function(){

        // TODO
        while(queue.length > 0){
            // ...
            var e = queue.shift();
            if(typeof e.op != 'undefined'){
                /**
                *   Compare op name to our list of
                *   valid operations. If match, run
                *   operation.
                **/
                if(typeof operations[e.op] != 'undefined'){
                    var func = operations[e.op];
                    func(e);
                    continue;
                }
            }
        }
    };

    /**
    *   List of valid operations.
    *
    **/
    var operations = {
        "track"         : track,
        "setParams"     : setParams,
        "addPixel"      : _addPixel,
    };

    /** 
    *   Once we have created our library, 
    *   run the process function to burn
    *   through anything in the queue. 
    *   Then return our queue functions.
    **/
    process();
    return {
        push : function(){
            for(var i = 0; i < arguments.length; i++){
                queue.push(arguments[i]);
            }
            process();
        },
    };
})();
var EDM = window.EDM = window.EDM || {};
EDM.ContainerLoader = EDM.ContainerLoader || (function() {
    var scripts = document.getElementsByTagName('script');

    function isGtmScriptLoaded(body) {
        var gtmContainerIDs = window.GTMContainerIDs || [];
        gtmContainerIDs.forEach(function (id, j) {
            if (body.indexOf(id) !== -1) {
                return true;
            }
        });
        return false;
    }

    function isScriptLoadedByUrl(url) {
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src === url) {
                return true;
            }
        }
        return false;
    }

    var getCurrentScript = function(){
        var current = document.currentScript;
        if(current){
            return current;
        }
        return document.getElementsByTagName("script")[0];
    };
    var loadChildScript = function (url){
        var childScript = document.createElement("script");
        childScript.setAttribute('type', 'text/javascript');
        childScript.setAttribute('defer', 'defer');
        childScript.setAttribute('src', url);
        var scriptEl = getCurrentScript();
        scriptEl.parentNode.insertBefore(childScript, scriptEl);
    };
    var loadChildScriptWithBody = function(body){
        var childScript = document.createElement("script");
        childScript.innerHTML = body;
        var scriptEl = getCurrentScript();
        scriptEl.parentNode.insertBefore(childScript, scriptEl);
    };
    var loadChildScripts = function(urls, bodies) {
        if (urls) {
            urls.forEach(function (url) {
                if (!isScriptLoadedByUrl(url)) {
                    loadChildScript(url);
                }
            });
        }
        if(bodies) {
            bodies.forEach(function (body) {
                if (!isGtmScriptLoaded(body)) {
                    loadChildScriptWithBody(body);
                }
            });
        }
    };
    var loadChildScriptsWithKeys = function(urls, bodies, urlSites) {
        loadChildScripts(urls, bodies);
        if(urlSites){
            var hostname = location.hostname.replace(/^www\./,'');
            for (var url in urlSites) {
                var sites = urlSites[url];
                if(sites.indexOf(hostname) !== -1){
                    if (!isScriptLoadedByUrl(url)) {
                         loadChildScript(url);
                    }
                    break;
                }
            }
        }
    };

    return {
        loadFromContainer: true,
        loadChildScripts: loadChildScripts,
        loadChildScriptsWithKeys: loadChildScriptsWithKeys
    };
})();

(function() {
	var state = document.readyState;
	if(state === 'complete' || state === 'interactive'){
		executeContainerScript();
	}
	if(state == 'loading'){
		document.addEventListener('DOMContentLoaded',executeContainerScript);
	}
})();

function executeContainerScript(){EDM.ContainerLoader.loadChildScriptsWithKeys(["https://cas-assets.edmunds.com/partner-analytics/17811/eas.js"], ["(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NRTXBVD');"], {"https://widgetstore.edmunds.com/api/extension/v1/js/bea40fa2-8337-4520-9415-56d5e393b208":["mercedesbenzofaustin.com"]});}
!function(e){var n=e(".navigation-default"),d="mega-menu-ajax-",t={ajaxLoadingContainer:"navigation-ajax-container",ajaxLoadComplete:"ajax-load-complete",ddcIcon:"ddc-icon",ddcIconSize:"ddc-icon-size-xlarge",ddcIconGear:"ddc-icon-specs-gear1",hide:"hide",loading:"loading",open:"open"},a={ddcContent:".ddc-content",ddcMegaMenuNav:".ddc-mega-menu-nav.ddc-nav",ajaxLoadComplete:".ajax-load-complete",loading:".loading"},o={ajaxComplete:"ddc-mega-menu-nav-ajax-load-complete"},i={linkIsDdc404:/404.html$/},r=function(n){e(document).trigger("modulesRefresh",{modules:{lazyImage:DDC.modules.lazyImage}}),n.siblings(".ddc-dropdown-menu").find('div.ajax-navigation-element:not([data-fragment-url=""])').not(a.ajaxLoadComplete).each(function(){var n=e(this),d=650,r=(new Date).getTime(),u=n.data("fragment-url"),m=n.data("fragment-id"),p=DDC.i18n.getLabel("LOADING");i.linkIsDdc404.test(u)||(!c(m)&&l(m)?(n.html(u).removeClass(t.hide).html(s(m)),g(1,1),n.css("visibility","visible").addClass(t.ajaxLoadComplete),e(document).trigger("modulesRefresh"),g(2,500),$thisLoad.find(a.ddcContent).first().trigger(o.ajaxComplete)):(n.not(a.ajaxLoadComplete).before('<span class="'+t.ajaxLoadingContainer+" "+t.loading+'"><i class="'+t.ddcIcon+" "+t.ddcIconGear+" "+t.ddcIconSize+'"></i> '+p+"</span>"),n.html("").removeClass(t.hide).load(u,function(){g(1,1);var n=e(this),t=(new Date).getTime()-r;d=t>d?0:d-t,n.delay(d).queue(function(){e(this).css("visibility","visible").siblings(a.loading).remove(),e(document).trigger("modulesRefresh")}),n.find(a.ddcContent).first().trigger(o.ajaxComplete),g(3,500)}).addClass(t.ajaxLoadComplete)))})},s=function(e){return localStorage.getItem(d+e)},c=function(){return!0},l=function(){return!1},u=function(n){e(".ddc-dropdown.dropdown").each(function(){var d=e(this);if(d.hasClass(t.open)||n){var a=d.find(".ddc-dropdown-menu > li");a.css({minHeight:"",height:""});var o=d.find(".ddc-dropdown-menu").height();a.css({minHeight:o,height:"auto"})}})},g=function(e,n){function d(){return o>=e?void t():(u(!1),void o++)}function t(){clearInterval(a)}var a=setInterval(function(){d()},n),o=0},m=function(){var d=n.find("[data-dropdown-display-type]").attr("data-dropdown-display-type"),o="click";d.length>0&&(o=d),"hover"==o&&(n.find(a.ddcMegaMenuNav).find("li.ddc-dropdown").hover(function(){jQuery(this).has(".ddc-dropdown-menu").length>0&&(jQuery(this).siblings().removeClass("open"),jQuery(this).addClass("open").trigger("show.bs.dropdown"))},function(){jQuery(this).has(".ddc-dropdown-menu").length>0&&jQuery(this).removeClass("open").trigger("hidden.bs.dropdown")}),n.find(a.ddcMegaMenuNav).find("li.ddc-dropdown ul.ddc-dropdown-menu").hover(function(){},function(){jQuery(this).parent("li").removeClass("open").trigger("hidden.bs.dropdown")})),n.find(".ddc-dropdown").on(o,"[data-toggle=dropdown]",function(){var n=e.trim(e(this)[0].text);e(this).closest(".dropdown").hasClass(t.open)||(r(e(this)),e(document).trigger("trackEvent",[{widgetName:"mega-menu",eventName:"click",data:n}]))}),n.find(".ddc-dropdown-menu").on(o,function(n){var d,t,a=e(n.target),o=a.parents("[data-widget-name]"),i=o.data("widget-name"),r=null;a.is(".media img")&&"inventory-featured-default"===i?(n.preventDefault(),n.stopPropagation(),o.find(".hover-state").removeClass("hover-state"),e(this).closest(".hproduct > div").addClass("hover-state")):a.is("a")||a.parent().hasClass("inventory-count-link")?(d="model-selector-default"===i?a.parents(".hproduct").find("a").text():a.text(),t=e.trim(i+"|"+d.replace(/\s/g," ")),("inventory-featured-default"===i||"model-selector-default"===i)&&(r=parseInt(o.find(".hproduct").length,10)),e(document).trigger("trackEvent",[{widgetName:"mega-menu",eventName:"click",data:t,value:r}])):"submit"!=e(n.target).attr("type")&&n.stopPropagation()})};e(document).ready(function(){m(),u(!0)})}(jQuery);
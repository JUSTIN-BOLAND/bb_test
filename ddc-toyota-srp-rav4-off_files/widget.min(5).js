!function(e,n){"use strict";var t=function(){e(document).on("trackEvent",function(e,n){if(n&&n.widgetName&&n.eventName){var t=[];t.push(n.widgetName),t.push(n.eventName),t.push(n.data),t.push(n.value),t.push(!!n.noninteraction),n.hitCallback&&t.push(n.hitCallback),n.dimensionIndex&&n.dimensionValue&&(t.push("dimension"+n.dimensionIndex),t.push(n.dimensionValue)),"undefined"!=typeof ga&&ga(function(){for(var i=n.trackerIds?n.trackerIds.join():void 0,o=ga.getAll(),d=[],c=0;c<o.length;++c){var s=o[c],r=s.get("name"),u=s.get("trackingId");i&&i.indexOf(u)>-1?d.push(r):void 0==i&&d.push(r)}for(var c=0;c<d.length;c++){var g=d[c],l="["+ga.getByName(g).get("trackingId")+"] _"+e.type+"()",p="dimension"+n.dimensionIndex,h={hitType:"event",eventCategory:n.widgetName,eventAction:n.eventName,eventLabel:n.data,eventValue:n.value,nonInteraction:n.noninteraction||void 0,hitCallback:n.hitCallback||void 0};n.dimensionIndex&&n.dimensionValue&&(h[p]=n.dimensionValue),ga(g+".send",h),a(l,t)}})}}),e(document).on("trackSocialEvent",function(e,n){if(n&&n.network&&n.socialAction){var t=[];t.push(n.network),t.push(n.socialAction),t.push(n.opt_target),t.push(n.opt_pagePath),"undefined"!=typeof ga&&ga(function(){for(var i=ga.getAll(),o=0;o<i.length;++o){var d=i[o],c=d.get("name"),s="["+d.get("trackingId")+"] _"+e.type+"()";ga(c+".send",{hitType:"social",socialNetwork:n.network,socialAction:n.socialAction,socialTarget:n.opt_target,page:n.opt_pagePath}),a(s,t)}})}})},a=function(e,t){for(var a=[e],i=0;i<t.length;i++)a.push(t[i]);n.log(a)};e(function(){t(),e.publish("ddc-event-tracking-ready")})}(jQuery,window.DDC);
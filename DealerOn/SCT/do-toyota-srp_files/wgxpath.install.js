!function(){function a(a){return function(){return this[a]}}function b(a){return function(){return a}}function d(a){var b=typeof a;if("object"==b){if(!a)return"null";if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function e(a){return"string"==typeof a}function f(a,b,c){return a.call.apply(a.bind,arguments)}function g(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(c,d),a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function h(a,b,c){return h=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?f:g,h.apply(null,arguments)}function i(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();return b.push.apply(b,arguments),a.apply(this,b)}}function j(a){function c(){}var b=ya;c.prototype=b.prototype,a.u=b.prototype,a.prototype=new c,a.t=function(a,c,d){for(var e=Array(arguments.length-2),f=2;f<arguments.length;f++)e[f-2]=arguments[f];return b.prototype[c].apply(a,e)}}function k(a,b,c){this.a=a,this.b=b||1,this.d=c||1}function m(a,b){return-1!=a.indexOf(b)}function n(a,b){return a<b?-1:a>b?1:0}function u(a,b){var c;a:{c=a.length;for(var d=e(a)?a.split(""):a,f=0;f<c;f++)if(f in d&&b.call(void 0,d[f],f,a)){c=f;break a}c=-1}return 0>c?null:e(a)?a.charAt(c):a[c]}function v(a){return o.concat.apply(o,arguments)}function w(a,b,c){return 2>=arguments.length?o.slice.call(a,b):o.slice.call(a,b,c)}function x(a){var b=arguments.length;if(1==b&&"array"==d(arguments[0]))return x.apply(null,arguments[0]);for(var c={},e=0;e<b;e++)c[arguments[e]]=!0;return c}function B(){return m(y,"Edge")}function G(){var a=y;return E?/rv\:([^\);]+)(\)|;)/.exec(a):D&&B()?/Edge\/([\d\.]+)/.exec(a):D?/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a):F?/WebKit\/(\S+)/.exec(a):void 0}function H(){var a=c.document;return a?a.documentMode:void 0}function K(a){if(!J[a]){for(var b=0,c=l(String(I)).split("."),d=l(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",h=d[f]||"",i=RegExp("(\\d*)(\\D*)","g"),j=RegExp("(\\d*)(\\D*)","g");do{var k=i.exec(g)||["","",""],m=j.exec(h)||["","",""];if(0==k[0].length&&0==m[0].length)break;b=n(0==k[1].length?0:parseInt(k[1],10),0==m[1].length?0:parseInt(m[1],10))||n(0==k[2].length,0==m[2].length)||n(k[2],m[2])}while(0==b)}J[a]=0<=b}}function L(a){return D&&(B()||O>=a)}function R(a,b,c,d){this.a=a,this.nodeName=c,this.nodeValue=d,this.nodeType=2,this.parentNode=this.ownerElement=b}function S(a,b){var c=Q&&"href"==b.nodeName?a.getAttribute(b.nodeName,2):b.nodeValue;return new R(b,a,b.nodeName,c)}function T(a){this.b=a,this.a=0}function U(a){a=a.match(V);for(var b=0;b<a.length;b++)W.test(a[b])&&a.splice(b,1);return new T(a)}function X(a,b){return a.b[a.a+(b||0)]}function Y(a){return a.b[a.a++]}function Z(a){return a.b.length<=a.a}function $(a,b){if(a.contains&&1==b.nodeType)return a==b||a.contains(b);if("undefined"!=typeof a.compareDocumentPosition)return a==b||Boolean(16&a.compareDocumentPosition(b));for(;b&&a!=b;)b=b.parentNode;return b==a}function _(a,b){if(a==b)return 0;if(a.compareDocumentPosition)return 2&a.compareDocumentPosition(b)?1:-1;if(D&&!L(9)){if(9==a.nodeType)return-1;if(9==b.nodeType)return 1}if("sourceIndex"in a||a.parentNode&&"sourceIndex"in a.parentNode){var d=1==a.nodeType,e=1==b.nodeType;if(d&&e)return a.sourceIndex-b.sourceIndex;var f=a.parentNode,g=b.parentNode;return f==g?ba(a,b):!d&&$(f,b)?-1*aa(a,b):!e&&$(g,a)?aa(b,a):(d?a.sourceIndex:f.sourceIndex)-(e?b.sourceIndex:g.sourceIndex)}return e=9==a.nodeType?a:a.ownerDocument||a.document,d=e.createRange(),d.selectNode(a),d.collapse(!0),e=e.createRange(),e.selectNode(b),e.collapse(!0),d.compareBoundaryPoints(c.Range.START_TO_END,e)}function aa(a,b){var c=a.parentNode;if(c==b)return-1;for(var d=b;d.parentNode!=c;)d=d.parentNode;return ba(d,a)}function ba(a,b){for(var c=b;c=c.previousSibling;)if(c==a)return-1;return 1}function ca(a){var b=null,c=a.nodeType;if(1==c&&(b=a.textContent,b=void 0==b||null==b?a.innerText:b,b=void 0==b||null==b?"":b),"string"!=typeof b)if(P&&"title"==a.nodeName.toLowerCase()&&1==c)b=a.text;else if(9==c||1==c){a=9==c?a.documentElement:a.firstChild;for(var c=0,d=[],b="";a;){do 1!=a.nodeType&&(b+=a.nodeValue),P&&"title"==a.nodeName.toLowerCase()&&(b+=a.text),d[c++]=a;while(a=a.firstChild);for(;c&&!(a=d[--c].nextSibling););}}else b=a.nodeValue;return""+b}function da(a,b,c){if(null===b)return!0;try{if(!a.getAttribute)return!1}catch(a){return!1}return Q&&"class"==b&&(b="className"),null==c?!!a.getAttribute(b):a.getAttribute(b,2)==c}function ea(a,b,c,d,f){return(P?fa:ga).call(null,a,b,e(c)?c:null,e(d)?d:null,f||new la)}function fa(a,b,c,d,e){if(a instanceof Ta||8==a.b||c&&null===a.b){var f=b.all;if(!f)return e;if(a=ka(a),"*"!=a&&(f=b.getElementsByTagName(a),!f))return e;if(c){for(var g=[],h=0;b=f[h++];)da(b,c,d)&&g.push(b);f=g}for(h=0;b=f[h++];)"*"==a&&"!"==b.tagName||pa(e,b);return e}return ja(a,b,c,d,e),e}function ga(a,b,c,d,e){return b.getElementsByName&&d&&"name"==c&&!D?(b=b.getElementsByName(d),q(b,function(b){a.a(b)&&pa(e,b)})):b.getElementsByClassName&&d&&"class"==c?(b=b.getElementsByClassName(d),q(b,function(b){b.className==d&&a.a(b)&&pa(e,b)})):a instanceof Qa?ja(a,b,c,d,e):b.getElementsByTagName&&(b=b.getElementsByTagName(a.d()),q(b,function(a){da(a,c,d)&&pa(e,a)})),e}function ha(a,b,c,d,e){var f;if((a instanceof Ta||8==a.b||c&&null===a.b)&&(f=b.childNodes)){var g=ka(a);return"*"==g||(f=r(f,function(a){return a.tagName&&a.tagName.toLowerCase()==g}))?(c&&(f=r(f,function(a){return da(a,c,d)})),q(f,function(a){"*"==g&&("!"==a.tagName||"*"==g&&1!=a.nodeType)||pa(e,a)}),e):e}return ia(a,b,c,d,e)}function ia(a,b,c,d,e){for(b=b.firstChild;b;b=b.nextSibling)da(b,c,d)&&a.a(b)&&pa(e,b);return e}function ja(a,b,c,d,e){for(b=b.firstChild;b;b=b.nextSibling)da(b,c,d)&&a.a(b)&&pa(e,b),ja(a,b,c,d,e)}function ka(a){if(a instanceof Qa){if(8==a.b)return"!";if(null===a.b)return"*"}return a.d()}function la(){this.b=this.a=null,this.i=0}function ma(a){this.d=a,this.a=this.b=null}function na(a,b){if(!a.a)return b;if(!b.a)return a;for(var c=a.a,d=b.a,e=null,f=null,g=0;c&&d;){var f=c.d,h=d.d;f==h||f instanceof R&&h instanceof R&&f.a==h.a?(f=c,c=c.a,d=d.a):0<_(c.d,d.d)?(f=d,d=d.a):(f=c,c=c.a),(f.b=e)?e.a=f:a.a=f,e=f,g++}for(f=c||d;f;)f.b=e,e=e.a=f,g++,f=f.a;return a.b=e,a.i=g,a}function oa(a,b){var c=new ma(b);c.a=a.a,a.b?a.a.b=c:a.a=a.b=c,a.a=c,a.i++}function pa(a,b){var c=new ma(b);c.b=a.b,a.a?a.b.a=c:a.a=a.b=c,a.b=c,a.i++}function qa(a){return(a=a.a)?a.d:null}function ra(a){return(a=qa(a))?ca(a):""}function sa(a,b){return new ta(a,!!b)}function ta(a,b){this.d=a,this.b=(this.c=b)?a.b:a.a,this.a=null}function ua(a){var b=a.b;if(null==b)return null;var c=a.a=b;return a.b=a.c?b.b:b.a,c.d}function va(a){switch(a.nodeType){case 1:return i(xa,a);case 9:return va(a.documentElement);case 11:case 10:case 6:case 12:return wa;default:return a.parentNode?va(a.parentNode):wa}}function wa(){return null}function xa(a,b){if(a.prefix==b)return a.namespaceURI||"http://www.w3.org/1999/xhtml";var c=a.getAttributeNode("xmlns:"+b);return c&&c.specified?c.value||null:a.parentNode&&9!=a.parentNode.nodeType?xa(a.parentNode,b):null}function ya(a){this.g=a,this.b=this.e=!1,this.d=null}function za(a){return"\n  "+a.toString().split("\n").join("\n  ")}function Aa(a,b){a.e=b}function Ba(a,b){a.b=b}function Ca(a,b){var c=a.a(b);return c instanceof la?+ra(c):+c}function Da(a,b){var c=a.a(b);return c instanceof la?ra(c):""+c}function Ea(a,b){var c=a.a(b);return c instanceof la?!!c.i:!!c}function Fa(a,b,c){ya.call(this,a.g),this.c=a,this.f=b,this.k=c,this.e=b.e||c.e,this.b=b.b||c.b,this.c==Ka&&(c.b||c.e||4==c.g||0==c.g||!b.d?b.b||b.e||4==b.g||0==b.g||!c.d||(this.d={name:c.d.name,l:b}):this.d={name:b.d.name,l:c})}function Ga(a,b,c,d,e){b=b.a(d),c=c.a(d);var f;if(b instanceof la&&c instanceof la){for(e=sa(b),d=ua(e);d;d=ua(e))for(b=sa(c),f=ua(b);f;f=ua(b))if(a(ca(d),ca(f)))return!0;return!1}if(b instanceof la||c instanceof la){for(b instanceof la?e=b:(e=c,c=b),e=sa(e),b=typeof c,d=ua(e);d;d=ua(e)){switch(b){case"number":d=+ca(d);break;case"boolean":d=!!ca(d);break;case"string":d=ca(d);break;default:throw Error("Illegal primitive type for comparison.")}if(a(d,c))return!0}return!1}return e?"boolean"==typeof b||"boolean"==typeof c?a(!!b,!!c):"number"==typeof b||"number"==typeof c?a(+b,+c):a(b,c):a(+b,+c)}function Ha(a,b,c,d){this.a=a,this.p=b,this.g=c,this.j=d}function Ja(a,b,c,d){if(Ia.hasOwnProperty(a))throw Error("Binary operator already created: "+a);return a=new Ha(a,b,c,d),Ia[a.toString()]=a}function La(a,b){if(b.a.length&&4!=a.g)throw Error("Primary expression must evaluate to nodeset if filter has predicate(s).");ya.call(this,a.g),this.c=a,this.f=b,this.e=a.e,this.b=a.b}function Ma(a,b){if(b.length<a.o)throw Error("Function "+a.h+" expects at least"+a.o+" arguments, "+b.length+" given");if(null!==a.n&&b.length>a.n)throw Error("Function "+a.h+" expects at most "+a.n+" arguments, "+b.length+" given");a.s&&q(b,function(b,c){if(4!=b.g)throw Error("Argument "+c+" to function "+a.h+" is not of type Nodeset: "+b)}),ya.call(this,a.g),this.f=a,this.c=b,Aa(this,a.e||t(b,function(a){return a.e})),Ba(this,a.r&&!b.length||a.q&&!!b.length||t(b,function(a){return a.b}))}function Na(a,b,c,d,e,f,g,h,i){this.h=a,this.g=b,this.e=c,this.r=d,this.q=e,this.j=f,this.o=g,this.n=void 0!==h?h:g,this.s=!!i}function Pa(a,b,c,d,e,f,g,h){if(Oa.hasOwnProperty(a))throw Error("Function already created: "+a+".");Oa[a]=new Na(a,b,c,d,!1,e,f,g,h)}function Qa(a,b){switch(this.f=a,this.c=void 0!==b?b:null,this.b=null,a){case"comment":this.b=8;break;case"text":this.b=3;break;case"processing-instruction":this.b=7;break;case"node":break;default:throw Error("Unexpected argument")}}function Ra(a){return"comment"==a||"text"==a||"processing-instruction"==a||"node"==a}function Sa(a){ya.call(this,3),this.c=a.substring(1,a.length-1)}function Ta(a,b){this.h=a.toLowerCase(),this.c=b?b.toLowerCase():"http://www.w3.org/1999/xhtml"}function Ua(a){ya.call(this,1),this.c=a}function Va(a,b){if(ya.call(this,a.g),this.f=a,this.c=b,this.e=a.e,this.b=a.b,1==this.c.length){var c=this.c[0];c.m||c.c!=db||(c=c.k,"*"!=c.d()&&(this.d={name:c.d(),l:null}))}}function Wa(){ya.call(this,4)}function Xa(){ya.call(this,4)}function Ya(a){return"/"==a||"//"==a}function Za(a,b){this.a=a,this.b=!!b}function $a(a,b,c){for(c=c||0;c<a.a.length;c++)for(var g,d=a.a[c],e=sa(b),f=b.i,h=0;g=ua(e);h++){var i=a.b?f-h:h+1;if(g=d.a(new k(g,i,f)),"number"==typeof g)i=i==g;else if("string"==typeof g||"boolean"==typeof g)i=!!g;else{if(!(g instanceof la))throw Error("Predicate.evaluate returned an unexpected type.");i=0<g.i}if(!i){i=e,g=i.d;var j=i.a;if(!j)throw Error("Next must be called at least once before remove.");var l=j.b,j=j.a;l?l.a=j:g.a=j,j?j.b=l:g.b=l,g.i--,i.a=null}}return b}function _a(a,b,c,d){ya.call(this,4),this.c=a,this.k=b,this.f=c||new Za([]),this.m=!!d,b=this.f,b=0<b.a.length?b.a[0].d:null,a.b&&b&&(a=b.name,a=P?a.toLowerCase():a,this.d={name:a,l:b.l});a:{for(a=this.f,b=0;b<a.a.length;b++)if(c=a.a[b],c.e||1==c.g||0==c.g){a=!0;break a}a=!1}this.e=a}function ab(a,b,c,d){this.h=a,this.d=b,this.a=c,this.b=d}function cb(a,b,c,d){if(bb.hasOwnProperty(a))throw Error("Axis already created: "+a);return b=new ab(a,b,c,!!d),bb[a]=b}function kb(a){ya.call(this,1),this.c=a,this.e=a.e,this.b=a.b}function lb(a){ya.call(this,4),this.c=a,Aa(this,t(this.c,function(a){return a.e})),Ba(this,t(this.c,function(a){return a.b}))}function mb(a,b){this.a=a,this.b=b}function nb(a){for(var b,c=[];;){ob(a,"Missing right hand side of binary expression."),b=wb(a);var d=Y(a.a);if(!d)break;var e=(d=Ia[d]||null)&&d.p;if(!e){a.a.a--;break}for(;c.length&&e<=c[c.length-1].p;)b=new Fa(c.pop(),c.pop(),b);c.push(b,d)}for(;c.length;)b=new Fa(c.pop(),c.pop(),b);return b}function ob(a,b){if(Z(a.a))throw Error(b)}function pb(a,b){var c=Y(a.a);if(c!=b)throw Error("Bad token, expected: "+b+" got: "+c)}function qb(a){if(a=Y(a.a),")"!=a)throw Error("Bad token: "+a)}function rb(a){if(a=Y(a.a),2>a.length)throw Error("Unclosed literal string");return new Sa(a)}function sb(a){var b=Y(a.a),c=b.indexOf(":");if(-1==c)return new Ta(b);var d=b.substring(0,c);if(a=a.b(d),!a)throw Error("Namespace prefix not declared: "+d);return b=b.substr(c+1),new Ta(b,a)}function tb(a){var b,d,c=[];if(Ya(X(a.a))){if(b=Y(a.a),d=X(a.a),"/"==b&&(Z(a.a)||"."!=d&&".."!=d&&"@"!=d&&"*"!=d&&!/(?![0-9])[\w]/.test(d)))return new Wa;d=new Wa,ob(a,"Missing next location step."),b=ub(a,b),c.push(b)}else{a:{switch(b=X(a.a),d=b.charAt(0)){case"$":throw Error("Variable reference not allowed in HTML XPath");case"(":Y(a.a),b=nb(a),ob(a,'unclosed "("'),pb(a,")");break;case'"':case"'":b=rb(a);break;default:if(isNaN(+b)){if(Ra(b)||!/(?![0-9])[\w]/.test(d)||"("!=X(a.a,1)){b=null;break a}for(b=Y(a.a),b=Oa[b]||null,Y(a.a),d=[];")"!=X(a.a)&&(ob(a,"Missing function argument list."),d.push(nb(a)),","==X(a.a));)Y(a.a);ob(a,"Unclosed function argument list."),qb(a),b=new Ma(b,d)}else b=new Ua(+Y(a.a))}"["==X(a.a)&&(d=new Za(vb(a)),b=new La(b,d))}if(b){if(!Ya(X(a.a)))return b;d=b}else b=ub(a,"/"),d=new Xa,c.push(b)}for(;Ya(X(a.a));)b=Y(a.a),ob(a,"Missing next location step."),b=ub(a,b),c.push(b);return new Va(d,c)}function ub(a,b){var c,d,e;if("/"!=b&&"//"!=b)throw Error('Step op should be "/" or "//"');if("."==X(a.a))return d=new _a(jb,new Qa("node")),Y(a.a),d;if(".."==X(a.a))return d=new _a(hb,new Qa("node")),Y(a.a),d;var f;if("@"==X(a.a))f=db,Y(a.a),ob(a,"Missing attribute name");else if("::"==X(a.a,1)){if(!/(?![0-9])[\w]/.test(X(a.a).charAt(0)))throw Error("Bad token: "+Y(a.a));if(c=Y(a.a),f=bb[c]||null,!f)throw Error("No axis with name: "+c);Y(a.a),ob(a,"Missing node name")}else f=eb;if(c=X(a.a),/(?![0-9])[\w]/.test(c.charAt(0)))if("("==X(a.a,1)){if(!Ra(c))throw Error("Invalid node type: "+c);if(c=Y(a.a),!Ra(c))throw Error("Invalid type name: "+c);pb(a,"("),ob(a,"Bad nodetype"),e=X(a.a).charAt(0);var g=null;'"'!=e&&"'"!=e||(g=rb(a)),ob(a,"Bad nodetype"),qb(a),c=new Qa(c,g)}else c=sb(a);else{if("*"!=c)throw Error("Bad token: "+Y(a.a));c=sb(a)}return e=new Za(vb(a),f.a),d||new _a(f,c,e,"//"==b)}function vb(a){for(var b=[];"["==X(a.a);){Y(a.a),ob(a,"Missing predicate expression.");var c=nb(a);b.push(c),ob(a,"Unclosed predicate expression."),pb(a,"]")}return b}function wb(a){if("-"==X(a.a))return Y(a.a),new kb(wb(a));var b=tb(a);if("|"!=X(a.a))a=b;else{for(b=[b];"|"==Y(a.a);)ob(a,"Missing next union location path."),b.push(tb(a));a.a.a--,a=new lb(b)}return a}function xb(a,c){if(!a.length)throw Error("Empty XPath expression.");var e=U(a);if(Z(e))throw Error("Invalid XPath expression.");c?"function"==d(c)||(c=h(c.lookupNamespaceURI,c)):c=b(null);var f=nb(new mb(e,c));if(!Z(e))throw Error("Bad token: "+Y(e));this.evaluate=function(a,b){var c=f.a(new k(a));return new yb(c,b)}}function yb(a,b){if(0==b)if(a instanceof la)b=4;else if("string"==typeof a)b=2;else if("number"==typeof a)b=1;else{if("boolean"!=typeof a)throw Error("Unexpected evaluation result.");b=3}if(2!=b&&1!=b&&3!=b&&!(a instanceof la))throw Error("value could not be converted to the specified type");this.resultType=b;var c;switch(b){case 2:this.stringValue=a instanceof la?ra(a):""+a;break;case 1:this.numberValue=a instanceof la?+ra(a):+a;break;case 3:this.booleanValue=a instanceof la?0<a.i:!!a;break;case 4:case 5:case 6:case 7:var d=sa(a);c=[];for(var e=ua(d);e;e=ua(d))c.push(e instanceof R?e.a:e);this.snapshotLength=a.i,this.invalidIteratorState=!1;break;case 8:case 9:d=qa(a),this.singleNodeValue=d instanceof R?d.a:d;break;default:throw Error("Unknown XPathResult type.")}var f=0;this.iterateNext=function(){if(4!=b&&5!=b)throw Error("iterateNext called with wrong result type");return f>=c.length?null:c[f++]},this.snapshotItem=function(a){if(6!=b&&7!=b)throw Error("snapshotItem called with wrong result type");return a>=c.length||0>a?null:c[a]}}function zb(a){this.lookupNamespaceURI=va(a)}function Ab(a){a=a||c;var b=a.document;b.evaluate||(a.XPathResult=yb,b.evaluate=function(a,b,c,d){return new xb(a,c).evaluate(b,d)},b.createExpression=function(a,b){return new xb(a,b)},b.createNSResolver=function(a){return new zb(a)})}var c=this;Function.prototype.bind=Function.prototype.bind||function(a,b){if(1<arguments.length){var c=Array.prototype.slice.call(arguments,1);return c.unshift(this,a),h.apply(null,c)}return h(this,a)};var y,l=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},o=Array.prototype,p=o.indexOf?function(a,b,c){return o.indexOf.call(a,b,c)}:function(a,b,c){if(c=null==c?0:0>c?Math.max(0,a.length+c):c,e(a))return e(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},q=o.forEach?function(a,b,c){o.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=e(a)?a.split(""):a,g=0;g<d;g++)g in f&&b.call(c,f[g],g,a)},r=o.filter?function(a,b,c){return o.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=[],g=0,h=e(a)?a.split(""):a,i=0;i<d;i++)if(i in h){var j=h[i];b.call(c,j,i,a)&&(f[g++]=j)}return f},s=o.reduce?function(a,b,c,d){return d&&(b=h(b,d)),o.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;return q(a,function(c,f){e=b.call(d,e,c,f,a)}),e},t=o.some?function(a,b,c){return o.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=e(a)?a.split(""):a,g=0;g<d;g++)if(g in f&&b.call(c,f[g],g,a))return!0;return!1};a:{var z=c.navigator;if(z){var A=z.userAgent;if(A){y=A;break a}}y=""}var C=m(y,"Opera")||m(y,"OPR"),D=m(y,"Edge")||m(y,"Trident")||m(y,"MSIE"),E=m(y,"Gecko")&&!(m(y.toLowerCase(),"webkit")&&!B())&&!(m(y,"Trident")||m(y,"MSIE"))&&!B(),F=m(y.toLowerCase(),"webkit")&&!B(),I=function(){if(C&&c.opera){var a=c.opera.version;return"function"==d(a)?a():a}var a="",b=G();return b&&(a=b?b[1]:""),D&&!B()&&(b=H(),b>parseFloat(a))?String(b):a}(),J={},M=c.document,N=H(),O=!M||!D||!N&&B()?void 0:N||("CSS1Compat"==M.compatMode?parseInt(I,10):5),P=D&&!L(9),Q=D&&!L(8),V=RegExp("\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+|\\/\\/|\\.\\.|::|\\d+(?:\\.\\d*)?|\\.\\d+|\"[^\"]*\"|'[^']*'|[!<>]=|\\s+|.","g"),W=/^\s/;x("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),!E&&!D||D&&L(9)||E&&K("1.9.1"),D&&K("9"),j(Fa),Fa.prototype.a=function(a){return this.c.j(this.f,this.k,a)},Fa.prototype.toString=function(){var a="Binary Expression: "+this.c,a=a+za(this.f);return a+=za(this.k)},Ha.prototype.toString=a("a");var Ia={};Ja("div",6,1,function(a,b,c){return Ca(a,c)/Ca(b,c)}),Ja("mod",6,1,function(a,b,c){return Ca(a,c)%Ca(b,c)}),Ja("*",6,1,function(a,b,c){return Ca(a,c)*Ca(b,c)}),Ja("+",5,1,function(a,b,c){return Ca(a,c)+Ca(b,c)}),Ja("-",5,1,function(a,b,c){return Ca(a,c)-Ca(b,c)}),Ja("<",4,2,function(a,b,c){return Ga(function(a,b){return a<b},a,b,c)}),Ja(">",4,2,function(a,b,c){return Ga(function(a,b){return a>b},a,b,c)}),Ja("<=",4,2,function(a,b,c){return Ga(function(a,b){return a<=b},a,b,c)}),Ja(">=",4,2,function(a,b,c){return Ga(function(a,b){return a>=b},a,b,c)});var Ka=Ja("=",3,2,function(a,b,c){return Ga(function(a,b){return a==b},a,b,c,!0)});Ja("!=",3,2,function(a,b,c){return Ga(function(a,b){return a!=b},a,b,c,!0)}),Ja("and",2,2,function(a,b,c){return Ea(a,c)&&Ea(b,c)}),Ja("or",1,2,function(a,b,c){return Ea(a,c)||Ea(b,c)}),j(La),La.prototype.a=function(a){return a=this.c.a(a),$a(this.f,a)},La.prototype.toString=function(){var a;return a="Filter:"+za(this.c),a+=za(this.f)},j(Ma),Ma.prototype.a=function(a){return this.f.j.apply(null,v(a,this.c))},Ma.prototype.toString=function(){var a="Function: "+this.f;if(this.c.length)var b=s(this.c,function(a,b){return a+za(b)},"Arguments:"),a=a+za(b);return a},Na.prototype.toString=a("h");var Oa={};Pa("boolean",2,!1,!1,function(a,b){return Ea(b,a)},1),Pa("ceiling",1,!1,!1,function(a,b){return Math.ceil(Ca(b,a))},1),Pa("concat",3,!1,!1,function(a,b){var c=w(arguments,1);return s(c,function(b,c){return b+Da(c,a)},"")},2,null),Pa("contains",2,!1,!1,function(a,b,c){return m(Da(b,a),Da(c,a))},2),Pa("count",1,!1,!1,function(a,b){return b.a(a).i},1,1,!0),Pa("false",2,!1,!1,b(!1),0),Pa("floor",1,!1,!1,function(a,b){return Math.floor(Ca(b,a))},1),Pa("id",4,!1,!1,function(a,b){function c(a){if(P){var b=e.all[a];if(b){if(b.nodeType&&a==b.id)return b;if(b.length)return u(b,function(b){return a==b.id})}return null}return e.getElementById(a)}var d=a.a,e=9==d.nodeType?d:d.ownerDocument,d=Da(b,a).split(/\s+/),f=[];q(d,function(a){a=c(a),!a||0<=p(f,a)||f.push(a)}),f.sort(_);var g=new la;return q(f,function(a){pa(g,a)}),g},1),Pa("lang",2,!1,!1,b(!1),1),Pa("last",1,!0,!1,function(a){if(1!=arguments.length)throw Error("Function last expects ()");return a.d},0),Pa("local-name",3,!1,!0,function(a,b){var c=b?qa(b.a(a)):a.a;return c?c.localName||c.nodeName.toLowerCase():""},0,1,!0),Pa("name",3,!1,!0,function(a,b){var c=b?qa(b.a(a)):a.a;return c?c.nodeName.toLowerCase():""},0,1,!0),Pa("namespace-uri",3,!0,!1,b(""),0,1,!0),Pa("normalize-space",3,!1,!0,function(a,b){return(b?Da(b,a):ca(a.a)).replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"")},0,1),Pa("not",2,!1,!1,function(a,b){return!Ea(b,a)},1),Pa("number",1,!1,!0,function(a,b){return b?Ca(b,a):+ca(a.a)},0,1),Pa("position",1,!0,!1,function(a){return a.b},0),Pa("round",1,!1,!1,function(a,b){return Math.round(Ca(b,a))},1),Pa("starts-with",2,!1,!1,function(a,b,c){return b=Da(b,a),a=Da(c,a),0==b.lastIndexOf(a,0)},2),Pa("string",3,!1,!0,function(a,b){return b?Da(b,a):ca(a.a)},0,1),Pa("string-length",1,!1,!0,function(a,b){return(b?Da(b,a):ca(a.a)).length},0,1),Pa("substring",3,!1,!1,function(a,b,c,d){if(c=Ca(c,a),isNaN(c)||1/0==c||-(1/0)==c)return"";if(d=d?Ca(d,a):1/0,isNaN(d)||-(1/0)===d)return"";c=Math.round(c)-1;var e=Math.max(c,0);return a=Da(b,a),1/0==d?a.substring(e):(b=Math.round(d),a.substring(e,c+b))},2,3),Pa("substring-after",3,!1,!1,function(a,b,c){return b=Da(b,a),a=Da(c,a),c=b.indexOf(a),-1==c?"":b.substring(c+a.length)},2),Pa("substring-before",3,!1,!1,function(a,b,c){return b=Da(b,a),a=Da(c,a),a=b.indexOf(a),-1==a?"":b.substring(0,a)},2),Pa("sum",1,!1,!1,function(a,b){for(var c=sa(b.a(a)),d=0,e=ua(c);e;e=ua(c))d+=+ca(e);return d},1,1,!0),Pa("translate",3,!1,!1,function(a,b,c,d){b=Da(b,a),c=Da(c,a);var e=Da(d,a);for(a=[],d=0;d<c.length;d++){var f=c.charAt(d);f in a||(a[f]=e.charAt(d))}for(c="",d=0;d<b.length;d++)f=b.charAt(d),c+=f in a?a[f]:f;return c},3),Pa("true",2,!1,!1,b(!0),0),Qa.prototype.a=function(a){return null===this.b||this.b==a.nodeType},Qa.prototype.d=a("f"),Qa.prototype.toString=function(){var a="Kind Test: "+this.f;return null===this.c||(a+=za(this.c)),a},j(Sa),Sa.prototype.a=a("c"),Sa.prototype.toString=function(){return"Literal: "+this.c},Ta.prototype.a=function(a){var b=a.nodeType;return(1==b||2==b)&&(("*"==this.h||this.h==a.nodeName.toLowerCase())&&this.c==(a.namespaceURI?a.namespaceURI.toLowerCase():"http://www.w3.org/1999/xhtml"))},Ta.prototype.d=a("h"),Ta.prototype.toString=function(){return"Name Test: "+("http://www.w3.org/1999/xhtml"==this.c?"":this.c+":")+this.h},j(Ua),Ua.prototype.a=a("c"),Ua.prototype.toString=function(){return"Number: "+this.c},j(Va),j(Wa),Wa.prototype.a=function(a){var b=new la;return a=a.a,9==a.nodeType?pa(b,a):pa(b,a.ownerDocument),b},Wa.prototype.toString=b("Root Helper Expression"),j(Xa),Xa.prototype.a=function(a){var b=new la;return pa(b,a.a),b},Xa.prototype.toString=b("Context Helper Expression"),Va.prototype.a=function(a){var b=this.f.a(a);if(!(b instanceof la))throw Error("Filter expression must evaluate to nodeset.");a=this.c;for(var c=0,d=a.length;c<d&&b.i;c++){var g,e=a[c],f=sa(b,e.c.a);if(e.e||e.c!=gb)if(e.e||e.c!=ib)for(g=ua(f),b=e.a(new k(g));null!=(g=ua(f));)g=e.a(new k(g)),b=na(b,g);else g=ua(f),b=e.a(new k(g));else{for(g=ua(f);(b=ua(f))&&(!g.contains||g.contains(b))&&8&b.compareDocumentPosition(g);g=b);b=e.a(new k(g))}}return b},Va.prototype.toString=function(){var a;if(a="Path Expression:"+za(this.f),this.c.length){var b=s(this.c,function(a,b){return a+za(b)},"Steps:");a+=za(b)}return a},Za.prototype.toString=function(){return s(this.a,function(a,b){return a+za(b)},"Predicates:")},j(_a),_a.prototype.a=function(a){var b=a.a,c=null,c=this.d,d=null,e=null,f=0;if(c&&(d=c.name,e=c.l?Da(c.l,a):null,f=1),this.m)if(this.e||this.c!=eb)if(a=sa(new _a(fb,new Qa("node")).a(a)),b=ua(a))for(c=this.j(b,d,e,f);null!=(b=ua(a));)c=na(c,this.j(b,d,e,f));else c=new la;else c=ea(this.k,b,d,e),c=$a(this.f,c,f);else c=this.j(a.a,d,e,f);return c},_a.prototype.j=function(a,b,c,d){return a=this.c.d(this.k,a,b,c),a=$a(this.f,a,d)},_a.prototype.toString=function(){var a;if(a="Step:"+za("Operator: "+(this.m?"//":"/")),this.c.h&&(a+=za("Axis: "+this.c)),a+=za(this.k),this.f.a.length){var b=s(this.f.a,function(a,b){return a+za(b)},"Predicates:");a+=za(b)}return a},ab.prototype.toString=a("h");var bb={};cb("ancestor",function(a,b){for(var c=new la,d=b;d=d.parentNode;)a.a(d)&&oa(c,d);return c},!0),cb("ancestor-or-self",function(a,b){var c=new la,d=b;do a.a(d)&&oa(c,d);while(d=d.parentNode);return c},!0);var db=cb("attribute",function(a,b){var c=new la,d=a.d();if("style"==d&&b.style&&P)return pa(c,new R(b.style,b,"style",b.style.cssText)),c;var e=b.attributes;if(e)if(a instanceof Qa&&null===a.b||"*"==d)for(var f,d=0;f=e[d];d++)P?f.nodeValue&&pa(c,S(b,f)):pa(c,f);else(f=e.getNamedItem(d))&&(P?f.nodeValue&&pa(c,S(b,f)):pa(c,f));return c},!1),eb=cb("child",function(a,b,c,d,f){return(P?ha:ia).call(null,a,b,e(c)?c:null,e(d)?d:null,f||new la)},!1,!0);cb("descendant",ea,!1,!0);var fb=cb("descendant-or-self",function(a,b,c,d){var e=new la;return da(b,c,d)&&a.a(b)&&pa(e,b),ea(a,b,c,d,e)},!1,!0),gb=cb("following",function(a,b,c,d){var e=new la;do for(var f=b;f=f.nextSibling;)da(f,c,d)&&a.a(f)&&pa(e,f),e=ea(a,f,c,d,e);while(b=b.parentNode);return e},!1,!0);cb("following-sibling",function(a,b){for(var c=new la,d=b;d=d.nextSibling;)a.a(d)&&pa(c,d);return c},!1),cb("namespace",function(){return new la},!1);var hb=cb("parent",function(a,b){var c=new la;if(9==b.nodeType)return c;if(2==b.nodeType)return pa(c,b.ownerElement),c;var d=b.parentNode;return a.a(d)&&pa(c,d),c},!1),ib=cb("preceding",function(a,b,c,d){var e=new la,f=[];do f.unshift(b);while(b=b.parentNode);for(var g=1,h=f.length;g<h;g++){var i=[];for(b=f[g];b=b.previousSibling;)i.unshift(b);for(var j=0,k=i.length;j<k;j++)b=i[j],da(b,c,d)&&a.a(b)&&pa(e,b),e=ea(a,b,c,d,e)}return e},!0,!0);cb("preceding-sibling",function(a,b){for(var c=new la,d=b;d=d.previousSibling;)a.a(d)&&oa(c,d);return c},!0);var jb=cb("self",function(a,b){var c=new la;return a.a(b)&&pa(c,b),c},!1);j(kb),kb.prototype.a=function(a){return-Ca(this.c,a)},kb.prototype.toString=function(){return"Unary Expression: -"+za(this.c)},j(lb),lb.prototype.a=function(a){var b=new la;return q(this.c,function(c){if(c=c.a(a),!(c instanceof la))throw Error("Path expression must evaluate to NodeSet.");b=na(b,c)}),b},lb.prototype.toString=function(){return s(this.c,function(a,b){return a+za(b)},"Union Expression:")},yb.ANY_TYPE=0,yb.NUMBER_TYPE=1,yb.STRING_TYPE=2,yb.BOOLEAN_TYPE=3,yb.UNORDERED_NODE_ITERATOR_TYPE=4,yb.ORDERED_NODE_ITERATOR_TYPE=5,yb.UNORDERED_NODE_SNAPSHOT_TYPE=6,yb.ORDERED_NODE_SNAPSHOT_TYPE=7,yb.ANY_UNORDERED_NODE_TYPE=8,yb.FIRST_ORDERED_NODE_TYPE=9;var Bb=["wgxpath","install"],Cb=c;Bb[0]in Cb||!Cb.execScript||Cb.execScript("var "+Bb[0]);for(var Db;Bb.length&&(Db=Bb.shift());)Bb.length||void 0===Ab?Cb=Cb[Db]?Cb[Db]:Cb[Db]={}:Cb[Db]=Ab}();
!function(){var e=this,s={linksList:".links-list:not(.type-0)",links:"a"},a={},r={page:{},user:{mouseout:"mouseleave"}},i={user:{mouseout:[s.linksList,s.links]}},t={page:{highlight:function(){$(s.linksList).find(s.links).each(function(){t.user.type($(this))})}},user:{type:function(e){var s=[],r=[],i=e.attr("href").replace("%20","").replace("&_mode=debug",""),t=0;for(var n in a.params)if("tags"==n||"type"==n){t++;var u=a.params[n];s.push(n),r.push(u.replace("%20",""))}var s=s.join("|"),r=r.join("|"),o=2>t?"\\?+("+s+")+([\\^?&;=]*("+r+"))$":"\\?+("+s+")+([\\^?&;=]*("+r+"))+([\\^?&;=]*("+s+"))+([\\^?&;=]*("+r+"))$",p=new RegExp(o,"gi");return i.match(p)?(e.addClass("ui-state-hover"),!1):void 0},mouseout:function(){t.user.type($(this))}}},n={queryParams:!function(e,s,r,i){for(r={},i=/([^?&;=]+)=?([^?&;]*)/g;s=i.exec(e.substr(1));)r[s[1]]=s[2];a.params=r,t.page.highlight()}(e.location.search)};for(var u in r.page)$(document).bind(r.page[u],t.page[u]);for(var u in i.user){var o=i.user[u];$(o[0]).undelegate(o[1],r.user[u]).delegate(o[1],r.user[u],t.user[u])}for(var u in n)"function"==typeof n[u]&&n[u]()}();
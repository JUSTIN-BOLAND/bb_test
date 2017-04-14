(function() {
  if (typeof window.DealeronCookie == 'object'){
    if (!window.DealeronCookie.hasItem('DLRON_coordinate')) {
      return;
    }
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var trimmed = link.href.split('?')[0];
      var permission = sessionStorage.getItem('DLRON_coordinate_'+ trimmed);
      if(permission == 1) {
        var location = trimLatLongCoordinate(window.DealeronCookie.getItem('DLRON_coordinate'));
        if(link.href.indexOf('currentlocation') < 0 && link.href.indexOf('ZipCode') < 0){
          link.href += link.href.indexOf("?") === -1 ? "?" : "&";
          link.href += "currentlocation="+location;
          link.href += link.href.indexOf("st=") === -1 ? "&st=Distance+asc,default" : "";
        }
      }
    }
  }
})();


function trimLatLongCoordinate(location){
  var latLong = location.split('|');
  return parseFloat(latLong[0]).toFixed(3) + '|' + parseFloat(latLong[1]).toFixed(3);
 }
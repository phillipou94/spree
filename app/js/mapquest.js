var mapquest = require('mapquest');
var MAPQUEST_KEY  = "zAZmTKnxe2J7RmiS31OIE84VsqqFpnSN";
const request = require('request');


var MapQuest = function() {
  var that = Object.create(MapQuest.prototype);

  that.geocode = function(addressString, callback) {
    var url = "https://www.mapquestapi.com/geocoding/v1/address?key="+MAPQUEST_KEY+"&inFormat=json&outFormat=json&json={'location':{'street':"+addressString+"}}";
    var locationRequest =  {street: addressString};
    request.get({
      url: url,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }, function apiSuccess(err, data, res) {
      var body = JSON.parse(data.body);
      if (body && body.results && body.results.length > 0) {
        var result = body.results[0];
        var locations = result.locations;
        if (locations && locations.length > 0) {
          var coord = locations[0].displayLatLng;
          var coordinates = {latitude:coord.lat, longitude:coord.lng};
          callback(null, coordinates);
        } else {
          callback("Could not find coordinates", null);
        }
      } else {
        callback(err, null)
      }
        // callback(err,data);
    });
  }

  that.getCity = function(coordinates, callback) {
    mapquest.reverse({ coordinates: coordinates, key:MAPQUEST_KEY }, function(err, location) {
      if (!err) {
        var city = location.adminArea5;
        var state = location.adminArea3
        callback(null, city+", "+state);
      } else {
        callback(err, null);
      }
    });
  }

  Object.freeze(that);
  return that;

}

module.exports = MapQuest;

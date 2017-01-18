const request = require('request');
var API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=';
var API_KEY  = "7elxdku9GGG5k8j0Xm8KWdANDgecHMV0";
var DEFAULT_SPORTS_PHOTO = "https://s1.ticketm.net/dam/c/25d/09139288-a226-487d-a98d-6136663e325d_106551_TABLET_LANDSCAPE_LARGE_16_9.jpg";

var TicketMaster = function() {
  var that = Object.create(TicketMaster.prototype);

  that.getImageForEvent = function(e, callback) {
    var title = e.title;
    var url = API_URL+API_KEY+"&keyword="+title+"&size=1";
    makeRequest(url, function(error, data) {
      if (error) {
        callback(error, null);
      }
      var object = JSON.parse(data.body);
      if (object["_embedded"] && object["_embedded"]["events"]) {
        var events = object["_embedded"]["events"];
        var event = events[0];
        var images = event.images;
        images.sort(function(a, b){
          return a.width < b.width;
        });
        var image = images[0].url;
        callback(null,image);
      } else {
        callback("Could not find picture", null);
      }
    });
  }

  that.getImagesForEvents = function(events) {
    var tm = this;

    var imagePromise = function(event) {
      var event_id = event._id;
      var event_type = event.type;
        return new Promise(function(resolve, reject) {
          tm.getImageForEvent(event, function (error, image) {
            if (!error) {
              var response = {};
              response[event_id] = image;
              resolve({event_id:event_id,image:image});
            } else if (["nba","nfl","mlb","mls","nhl"].indexOf(event_type) > -1){
              resolve({event_id:event_id,image:DEFAULT_SPORTS_PHOTO});
            } else {
              resolve(null);
            }
          });
        });

    }
    return Promise.all(events.map(imagePromise));
  }

  var makeRequest = function(url, callback) {
    request.get({
      url: url,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }, function apiSuccess(err, data, res) {
        callback(err,data);
    });
  }

  Object.freeze(that);
  return that;

}

module.exports = TicketMaster;

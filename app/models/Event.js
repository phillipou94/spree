var mongoose = require('mongoose');
var SeatGeek = require('../js/seatgeek.js');
var seatgeek = new SeatGeek();
var TicketMaster = require("../js/ticketmaster.js");
var tm = new TicketMaster();

var EventSchema = mongoose.Schema({
  title:{type:String},
  type: {type:String},
  low_price:{type:Number},
  average_price:{type:Number},
  high_price:{type:Number},
  photo_url: {type:String},
  url:{type:String},
  date:{type: Date},
  date_tbd:{type:Boolean},
  time_tbd:{type:Boolean},
  venue: {},
  performers:[],
  favorited_by:{type: mongoose.Schema.Types.ObjectId,ref: 'User'}
}, { timestamps: true });

var EventModel = mongoose.model('Event', EventSchema);

var Event = (function(EventModel) {
  that = {};
  var parse = function(seatGeekObject) {
    var event = new EventModel();
    event.title = seatGeekObject.title;
    event.type = seatGeekObject.type;
    event.low_price = seatGeekObject.stats.lowest_price;
    event.high_price = seatGeekObject.stats.highest_price;
    event.average_price = seatGeekObject.stats.average_price;
    event.time_tbd = seatGeekObject.time_tbd;
    event.date_tbd = seatGeekObject.date_tbd;
    event.date = seatGeekObject.datetime_local;
    event.url = seatGeekObject.url;
    event.venue = seatGeekObject.venue;
    event.performers = seatGeekObject.performers;
    return event;
  }

  that.getEvents = function(options, callback) {
    seatgeek.getEvents(options, function(error, response) {
      if (error) {
        callback(error, []);
      } else {
        var objects = JSON.parse(response.body).events;
        var events = objects.map(function(seatGeekObject) {
          return parse(seatGeekObject);
        });
        callback(error,events);
      }
    });
  }

  that.searchEvents = function(query, options, callback) {
    seatgeek.searchEvents(query, options, function(error, response) {
      if (error) {
        callback(error, []);
      } else {
        var objects = JSON.parse(response.body).events;
        var events = objects.map(function(seatGeekObject) {
          return parse(seatGeekObject);
        });
        callback(error,events);
      }
    });
  }

  that.getTicketMasterImages = function(events, callback) {
    console.log("hits model");
    console.log(events);
    tm.getImagesForEvents(events).then((res) => {
      console.log("res");
      console.log(res);
      callback(null, res);
    });
  }

  that.buy = function(event, callback) {

  }

  that.save = function(event) {

  }

  Object.freeze(that);
  return that;

})(EventModel);

var ticketmasterImage = function(title) {
  var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&keyword="+title+"&size=1";
  request.get({
    url: url,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  }, function apiSuccess(err, data, res) {
      var object = JSON.parse(data.body);
      var event = object["_embedded"]["events"][0];
      var images = event.images;
      images.sort(function(a, b){
        return a.width < b.width;
      });
      var image = images[0].url;

  });
}

module.exports = Event;

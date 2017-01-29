var mongoose = require('mongoose');
var SeatGeek = require('../js/seatgeek.js');
var seatgeek = new SeatGeek();
var TicketMaster = require("../js/ticketmaster.js");
var tm = new TicketMaster();

var EventSchema = mongoose.Schema({
  seatgeek_id:{type:String},
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
  user_id : {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
  venue: {},
  performers:[],
}, { timestamps: true });

var EventModel = mongoose.model('Event', EventSchema);

var Event = (function(EventModel) {
  that = {};
  var parse = function(seatGeekObject) {
    var event = new EventModel();
    if (seatGeekObject) {
      event.title = seatGeekObject.title;
      event.type = seatGeekObject.type;
      event.time_tbd = seatGeekObject.time_tbd;
      event.date_tbd = seatGeekObject.date_tbd;
      event.date = seatGeekObject.datetime_local;
      event.url = seatGeekObject.url;
      event.venue = seatGeekObject.venue;
      event.performers = seatGeekObject.performers;
      event.seatgeek_id = seatGeekObject.id;
      if (seatGeekObject.stats) {
        event.low_price = seatGeekObject.stats.lowest_price;
        event.high_price = seatGeekObject.stats.highest_price;
        event.average_price = seatGeekObject.stats.average_price;
      }
    }
    return event;
  }

  that.getEvents = function(options, callback) {
    seatgeek.getEvents(options, function(error, response) {
      if (error || !response) {
        callback(error, []);
      } else {
        var objects = JSON.parse(response.body).events;
        if (objects) {
          var events = objects.map(function(seatGeekObject) {

            return parse(seatGeekObject);
          });
          callback(error,events);
        } else {
          callback(error, []);
        }

      }
    });
  }

  that.getEvent = function(seatgeek_id, callback) {
    seatgeek.event(seatgeek_id, function(error, response) {
      var responseBody = JSON.parse(response.body);
      if (error) {
        callback(error, null);
      } else if (responseBody.status === "error") {
        callback(responseBody, null)
      } else {
        var event = responseBody;
        callback(error,parse(event));
      }
    })
  }

  that.recommendations = function(seatgeek_id, options, callback) {
    seatgeek.recommendations(seatgeek_id, options, function(error, response) {
      var responseObject = JSON.parse(response.body);
      if (error) {
        callback(error, []);
      } else if (responseObject.status === "error") {
        callback(response.body, []);
      } else if (responseObject.status === 400) {
        callback(response.body, []);
      } else {
        if (responseObject.recommendations) {
          var events = responseObject.recommendations.map(function(obj){
            return parse(obj.event);
          });
          callback(error,events);
        } else {
          callback(error, []);
        }

      }
    })
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
    tm.getImagesForEvents(events).then((res) => {
      callback(null, res);
    });
  }

  that.saveToWishlist = function(user_id, eventObject, callback) {
    var event = new EventModel();
    event.title = eventObject.title;
    event.type = eventObject.type;
    event.low_price = eventObject.low_price;
    event.high_price = eventObject.high_price ;
    event.time_tbd = eventObject.time_tbd;
    event.date_tbd = eventObject.date_tbd;
    event.date = eventObject.date;
    event.url = eventObject.url;
    event.venue = eventObject.venue;
    event.performers = eventObject.performers;
    event.seatgeek_id = eventObject.seatgeek_id;
    event.user_id = user_id;
    event.save(function(err, user) {
    if (err) callback({ msg: err });
      callback(null, user);
    });
  }

  that.delete = function(event_id, callback) {
    EventModel.find({_id:event_id }).remove().exec(function(err, event) {
      if(!err) {
        callback(null, event);
      } else {
        callback(err, null);
      }
    });
  }


  that.getWishlist = function(user_id, callback) {
    EventModel.find({user_id:user_id}).exec(function(err, events) {
        if(!err) {
          callback(null, events);
        } else {
          callback(err, null);
        }
    });
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

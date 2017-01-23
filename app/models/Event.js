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
    event.seatgeek_id = seatGeekObject.id;
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

  that.getEvent = function(seatgeek_id, callback) {
    seatgeek.event(seatgeek_id, function(error, response) {
      if (error) {
        callback(error, []);
      } else {
        var event = JSON.parse(response.body);
        callback(error,parse(event));
      }
    })
  }

  that.recommendations = function(seatgeek_id, options, callback) {
    seatgeek.recommendations(seatgeek_id, options, function(error, response) {
      if (error) {
        callback(error, []);
      } else {
        var responseBody = JSON.parse(response.body);
        if (responseBody.recommendations) {
          var events = responseBody.recommendations.map(function(obj){
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
    event.date = eventObject.datetime_local;
    event.url = eventObject.url;
    event.venue = eventObject.venue;
    event.performers = eventObject.performers;
    event.seatgeek_id = eventObject.id;
    event.user_id = user_id;
    event.save(function(err, user) {
    if (err) callback({ msg: err });
      callback(null, user);
    });
  }


  that.getWishlist = function(user_id, callback) {
    EventModel.find({user_id:user_id}).exec(function(err, weeks) {
      console.log(weeks);
        if(!err) {
          callback(null, weeks);
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

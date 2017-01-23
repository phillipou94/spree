var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Event = require('../models/Event.js');

router.get('/lat=:lat&lng=:lng/page=:page/budget=:budget', function(req, res) {
  var latitude = req.params.lat;
  var longitude = req.params.lng;
  var page = req.params.page;
  var budget = req.params.budget;
  Event.getEvents({latitude:latitude,longitude:longitude, page:page, budget:budget}, function(error, events) {
    if (!error) {
      utils.sendSuccessResponse(res,events);
    } else {
      utils.sendErrorResponse(res, 500, events);
    }
  });
});

router.get('/search/search=:searchTerm/lat=:lat&lng=:lng/page=:page/budget=:budget', function(req, res) {
  var searchTerm = req.params.searchTerm;
  var latitude = req.params.lat;
  var longitude = req.params.lng;
  var page = req.params.page;
  var budget = req.params.budget;
  Event.searchEvents(searchTerm, {latitude:latitude,longitude:longitude, page:page, budget:budget}, function(error, events) {
    if (!error) {
      utils.sendSuccessResponse(res,events);
    } else {
      utils.sendErrorResponse(res, 500, events);
    }
  });
});

router.get("/seatgeek_id=:seatgeek_id", function(req, res) {
  Event.getEvent(req.params.seatgeek_id, function(error, event){
    if (!error) {
      utils.sendSuccessResponse(res,event);
    } else {
      utils.sendErrorResponse(res, 500, events);
    }
  });
});

router.get("/recommendations/:seatgeek_id/lat=:lat&lng=:lng/page=:page/budget=:budget", function(req,res) {
  var latitude = req.params.lat;
  var longitude = req.params.lng;
  var page = req.params.page;
  var budget = req.params.budget;
  Event.recommendations(req.params.seatgeek_id,
                        {latitude:latitude,longitude:longitude, page:page, budget:budget},
                        function(error, events) {
    if (!error) {
      utils.sendSuccessResponse(res,events);
    } else {
      utils.sendErrorResponse(res, 500, events);
    }
  });

});

router.post('/wishlist', function(req, res) {
  var event = req.body.event;
  var user_id = req.session.user._id;
  Event.saveToWishlist(user_id, event, function(error, images){
    if (!error) {
      utils.sendSuccessResponse(res,images);
    } else {
      utils.sendErrorResponse(res, 500, images);
    }
  });
});

router.get("/wishlist", function(req, res) {
  Event.getWishlist(req.session.user._id, function(error, events){
    if (!error) {
      utils.sendSuccessResponse(res,events);
    } else {
      utils.sendErrorResponse(res, 500, events);
    }
  });
});

router.post('/images', function(req, res) {
  var events = req.body.events;

  var requestedEvents = events.map(function(event) {
    return {_id:event._id, title:event.title, type:event.type};
  });
  Event.getTicketMasterImages(requestedEvents, function(error, images){
    if (!error) {
      utils.sendSuccessResponse(res,images);
    } else {
      utils.sendErrorResponse(res, 500, images);
    }
  });
});

router.post('/wishlist', function(req, res) {
  var event = req.body.event;
  Event.saveToWishlist(event, function(error, event) {
    if (!error) {
      utils.sendSuccessResponse(res,event);
    } else {
      utils.sendErrorResponse(res, 500, event);
    }
  })
});

module.exports = router;

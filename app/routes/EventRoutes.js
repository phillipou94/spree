var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Event = require('../models/Event.js');

router.get('/lat=:lat&lng=:lng/page=:page', function(req, res) {
  var latitude = req.params.lat;
  var longitude = req.params.lng;
  var page = req.params.page;
  Event.getEvents({latitude:latitude,longitude:longitude, page:page}, function(error, events) {
    if (!error) {
      utils.sendSuccessResponse(res,events);
    } else {
      utils.sendErrorResponse(res, 500, events);
    }
  });
});

router.get('/search/search=:searchTerm/lat=:lat&lng=:lng/page=:page', function(req, res) {
  var searchTerm = req.params.searchTerm;
  var latitude = req.params.lat;
  var longitude = req.params.lng;
  var page = req.params.page;
  Event.searchEvents(searchTerm, {latitude:latitude,longitude:longitude, page:page}, function(error, events) {
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

module.exports = router;

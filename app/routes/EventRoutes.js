var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Event = require('../models/Event.js');

router.get('/', function(req, res) {
  Event.getEvents({latitude:"42.36",longitude: "-71.06"}, function(error, events) {
    if (!error) {
      utils.sendSuccessResponse(res,events);
    } else {
      utils.sendErrorResponse(res, 500, events);
    }
  });
});

router.get('/search/:searchTerm', function(req, res) {
  var searchTerm = req.params.searchTerm;
  Event.getEvents(searchTerm, {latitude:"42.36",longitude: "-71.06"}, function(error, events) {
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
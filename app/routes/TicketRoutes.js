var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Ticket = require('../models/Ticket.js');
var User = require('../models/User.js');

router.post('/buy', function(req, res) {
  var event = req.body.event;
  var user_id = req.session.user._id;
  Ticket.create(event,user_id, function(error, ticket) {
    if (!error) {
      User.indicateTicketPurchase(user_id, ticket._id, function(error, user) {
        if (error) {
          utils.sendErrorResponse(res, 500, 'Could not update user with purchased ticket');
        } else {
          req.session.user.pending_ticket_id = ticket._id;
          utils.sendSuccessResponse(res, user);
        }
      });
    } else {
      utils.sendErrorResponse(res, 500, ticket);
    }
  });
});

router.get('/ticket/:ticket_id', function(req,res) {
  var ticket_id = req.params.ticket_id;
  Ticket.findById(ticket_id, function(error, ticket) {
    if (error) {
      utils.sendErrorResponse(res, 500, 'Could not update user with purchased ticket');
    } else {
      utils.sendSuccessResponse(res, ticket);
    }
  });
});

module.exports = router;

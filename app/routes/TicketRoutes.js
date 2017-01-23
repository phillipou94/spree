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

router.get('/:ticket_id', function(req,res) {
  var ticket_id = req.params.ticket_id;
  Ticket.findById(ticket_id, function(error, ticket) {
    if (error) {
      utils.sendErrorResponse(res, 500, 'Could not update user with purchased ticket');
    } else {
      utils.sendSuccessResponse(res, ticket);
    }
  });
});

router.post('/confirm/:ticket_id', function(req,res) {
  var ticket_id = req.params.ticket_id;
  var ticketPrice = req.body.ticketPrice;
  User.confirmTicketPurchase(req.session.user._id, ticketPrice, function(error, user) {
    req.session.user = user;
    Ticket.updatePrice(ticket_id, ticketPrice,function(error, user) {
      if (error) {
        utils.sendErrorResponse(res, 500, 'Could not update user with purchased ticket');
      } else {
        utils.sendSuccessResponse(res, ticket);
      }
    });
  });
});

router.post('/deny/:ticket_id', function(req,res) {
  var ticket_id = req.params.ticket_id;
  console.log("DENY TICKET");
  console.log(ticket_id);
  console.log(req.session.user._id);
  User.denyTicketPurchase(req.session.user._id, ticket_id, function(error, user) {
    req.session.user = user;
    console.log(req.session.user);
    Ticket.delete(ticket_id, function(error, ticket) {
      if (error) {
        console.log(error);
        utils.sendErrorResponse(res, 500, 'Could not update user with purchased ticket');
      } else {
        utils.sendSuccessResponse(res, ticket);
      }
    });
  });

});

module.exports = router;

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
          utils.sendErrorResponse(res, 500, 'Could not update user with purchsed ticket');
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

module.exports = router;

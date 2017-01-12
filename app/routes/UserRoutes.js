var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var User = require('../models/User.js');
var Week = require('../models/Week.js')

var validator = require("email-validator");

/*
 Require authentication on ALL access to /notes/*
 Clients which are not logged in will receive a 403 error code.
 */
var requireAuthentication = function(req, res, next) {
    if (!req.currentUser) {
        utils.sendErrorResponse(res, 403, 'Must be logged in to use this feature.');
    } else {
        next();
    }
};

/**
 * Logs a user out
 */
router.post('/logout', requireAuthentication);

/*
 For both login and create user, we want to send an error code if the user
 is logged in, or if the client did not provide a username and password
 This function returns true if an error code was sent; the caller should return
 immediately in this case.
 */
var invalidLogin = function(req, res) {
    if (req.session.user) {
        utils.sendErrorResponse(res, 403, 'There is already a user logged in.');
        return true;
    } else if (!(req.body.email && req.body.password)) {
        utils.sendErrorResponse(res, 400, 'Username or password not provided.');
        return true;
    }
    return false;
};


router.post('/signup', function(req, res) {
  User.create(req.body.name, req.body.email, req.body.password, function(err, user) {
    if (err) {
      if (err.taken) {
        utils.sendErrorResponse(res, 400, 'That username is already taken!');
      } else if (err.msg) {
        utils.sendErrorResponse(res, 400, err.msg);
      } else {
        utils.sendErrorResponse(res, 500, 'An unknown error has occurred.');
      }
    } else {
      req.session.user = user;
      utils.sendSuccessResponse(res, user);
    }
  });
});

router.post('/login', function(req, res) {
  if (!validator.validate(req.body.email)) {
    utils.sendErrorResponse(res, 400, 'This is not a valid email address.');
    return;
  }
  if (invalidLogin(req, res)) {
    return;
  }
  User.login(req.body.email, req.body.password, function(err, user) {
    if (user) {
      req.session.user = user;
      utils.sendSuccessResponse(res, { user: user});
    } else {
      utils.sendErrorResponse(res, 403, 'Invalid username and password.');
    }
  });
});

//TODO: Calculate budget given spending
router.get('/current', function(req, res) {
  if (req.session.user) {
    var user_id = req.session.user._id
      User.findById(user_id, function(error, user) {
          if (!error) {
            req.session.user = user;
            Week.getPreviousWeeks(user_id, function(err, weeks) {
              if (err) {
                utils.sendSuccessResponse(res, { authenticated: true, user: user, balance:0 })
              } else {
                //calculate how much under budget you are total
                var balance = calculateTotalBalance(weeks);
                var sessionInfo = { authenticated: true, user: user, balance:balance }
                console.log(sessionInfo);
                utils.sendSuccessResponse(res, sessionInfo)
              }
            });
          } else {
              utils.sendErrorResponse(res, 500, 'Problem finding current_user user');
          }
      });
  } else {
      utils.sendSuccessResponse(res, { authenticated: false });
  }
});

var calculateTotalBalance(weeks) {
  var balance = weeks.reduce(function(current,week){
    var weekly_budget = week.budget ? week.budget : 0;
    console.log("weekly budget: "+weekly_budget);
    console.log("weekly spent: "+week.spent);
    console.log("-------");
    var weekly_balance = Math.max(0,weekly_budget - week.spent);
    return current+weekly_balance;
  },0);
  return balance;
}

// router.put('/logout', function(req, res) {
//     req.session.destroy();
//     utils.sendSuccessResponse(res);
// });

module.exports = router;

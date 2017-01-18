var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var User = require('../models/User.js');
var Week = require('../models/Week.js');
var request = require('request');

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
      Week.getPreviousWeeks(user._id, function(err, weeks) {
        if (err) {
          utils.sendSuccessResponse(res, { authenticated: true, user: user, balance:0, weeks:[] });
        } else {
          //calculate how much under budget you are total
          var balance = calculateTotalBalance(weeks);
          req.session.user.balance = balance;
          var sessionInfo = { authenticated: true, user: user, balance:balance, weeks:weeks };
          utils.sendSuccessResponse(res, sessionInfo)
        }
      });
    } else {
      utils.sendErrorResponse(res, 403, 'Invalid username and password.');
    }
  });
});

router.get('/current', function(req, res) {
  if (req.session.user) {
    var user_id = req.session.user._id
      User.findById(user_id, function(error, user) {
          if (!error) {
            req.session.user = user;
            Week.getPreviousWeeks(user_id, function(err, weeks) {
              if (err) {
                utils.sendSuccessResponse(res, { authenticated: true, user: user, balance:0, weeks:[] });
              } else {
                //calculate how much under budget you are total
                var balance = calculateTotalBalance(weeks);
                req.session.user.balance = balance;
                var sessionInfo = { authenticated: true, user: user, balance:balance, weeks:weeks };
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

router.get('/cached', function(req, res) {
  utils.sendSuccessResponse(res, { user: req.session.user });
});

router.put('/budget', function(req,res) {
  var newBudget = req.body.budget;
  User.updateBudget(req.session.user._id, newBudget, function(error, user) {
    if (error) {
      utils.sendErrorResponse(res, 500, 'Could not update user budget');
    } else {
      utils.sendSuccessResponse(res, user);
    }
  });
});

router.get("/city", function(req,resp) {
  if (req.session.location) {
    var location = req.session.location;
    var coordinates = req.session.coordinates;
    utils.sendSuccessResponse(resp, {location:location, coordinates:coordinates});
    return;
  }
  request.get({
    url: 'http://ipinfo.io',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  }, function apiSuccess(err, data, res) {
    var response = JSON.parse(data.body);
    var coord = response.loc.split(',');
    var latitude = coord[0];
    var longitude = coord[1];
    User.getCurrentCity({ latitude: latitude, longitude: longitude }, function(error, location){
      req.session.location = location;
      req.session.coordinates = { latitude: latitude, longitude: longitude };
      if (error) {
        utils.sendErrorResponse(resp, 500, 'Could not find user location');
      } else {
        utils.sendSuccessResponse(resp, {location:location, coordinates:{ latitude: latitude, longitude: longitude }});
      }
    });
  });

});

var calculateTotalBalance = function(weeks) {
  var balance = weeks.reduce(function(current,week){
    var weekly_budget = week.budget ? week.budget : 0;
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

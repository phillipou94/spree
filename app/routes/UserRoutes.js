var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var User = require('../models/User.js');

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
    if (req.currentUser) {
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
      utils.sendSuccessResponse(res, user);
    }
  });
});

router.post('/login', function(req, res) {
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

// router.put('/logout', function(req, res) {
//     req.session.destroy();
//     utils.sendSuccessResponse(res);
// });

module.exports = router;

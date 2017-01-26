var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var time = require('../utils/time.js');

var Bank = require('../models/Bank.js');

router.get('/all', function(req, res) {
  Bank.all(function(error, response) {
    if (!error) {
      var banks = response.map(function(bankObject) {
        return Bank(bankObject);
      });
      utils.sendSuccessResponse(res,banks);
    } else {
      utils.sendErrorResponse(res, 500, 'Could not retrieve banks');
    }
  });
});

router.get('/search/:searchTerm', function(req, res) {
  var searchTerm = req.params.searchTerm;
  Bank.search(searchTerm, function(error, response) {
    if (!error) {
      var banks = response.map(function(bankObject) {
        return Bank(bankObject);
      });
      utils.sendSuccessResponse(res,banks);
    } else {
      utils.sendErrorResponse(res, 500, 'Could not retrieve banks');
    }
  });
});

router.post('/authenticate', function(req, res) {
  var body = req.body;
  var user = req.session.user;
  Bank.authenticate(user, body, function(error, mfaResponse, response) {
    if (error) {
      utils.sendErrorResponse(res, 401, error);
    } else if (mfaResponse) {
      utils.sendStepResponse(res, mfaResponse);
    } else {
      req.session.user = response;
      console.log(req.session.user);
      utils.sendSuccessResponse(res,response);
    }
  });
});

router.post('/answer', function(req, res) {
  var body = req.body;
  var user = req.session.user;
  Bank.answerSecurityQuestion(user, body, function(error, mfaResponse, response) {
    if (error) {
      utils.sendErrorResponse(res, 401, error);
    } else if (mfaResponse) {
      utils.sendStepResponse(res, mfaResponse);
    } else {
      req.session.user = response;
      console.log(req.session.user);
      utils.sendSuccessResponse(res,response);
    }
  });
});

router.get('/transactions/start_date=:start_date&end_date=:end_date', function(req, res) {
  var body = req.body;
  var user = req.session.user;
  if (!user.plaid_access_token) {
    utils.sendErrorResponse(res, 500, 'Could not retrieve transactions');
  } else {
    Bank.getTransactions(user,req.params.start_date,req.params.end_date,function(error, transactions) {
      if (!error) {
        utils.sendSuccessResponse(res,transactions);
      } else {
        utils.sendErrorResponse(res, 500, 'Could not retrieve transactions');
      }
    });
  }
});

module.exports = router;

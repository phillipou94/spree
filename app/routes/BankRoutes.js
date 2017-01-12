var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
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
  Bank.authenticate(body, function(error, mfaResponse, response) {
    if (error) {
      utils.sendErrorResponse(res, 401, error);
    } else if (mfaResponse) {
      utils.sendStepResponse(res, mfaResponse);
    } else {
      utils.sendSuccessResponse(res,response);
    }
  });
});

module.exports = router;

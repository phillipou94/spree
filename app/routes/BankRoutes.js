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

module.exports = router;

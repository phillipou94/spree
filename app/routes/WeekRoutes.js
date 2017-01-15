var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Week = require('../models/Week.js');

router.get('/previous/:user_id', function(req, res) {
  var user_id = req.params.user_id;
  Week.getPreviousWeeks(user_id, function(error, weeks) {
    console.log(weeks);
    console.log(error);
    if (!error) {
      utils.sendSuccessResponse(res,weeks);
    } else {
      utils.sendErrorResponse(res, 500, 'Could not retrieve banks');
    }
  });
});

module.exports = router;

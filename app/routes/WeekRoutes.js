var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var Week = require('../models/Week.js');

router.get('/previous', function(req, res) {
  var user_id = req.session.user._id;
  Week.getPreviousWeeks(user_id, function(error, weeks) {
    if (!error) {
      utils.sendSuccessResponse(res,weeks);
    } else {
      utils.sendErrorResponse(res, 500, 'Could not retrieve banks');
    }
  });
});

module.exports = router;

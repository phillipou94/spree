var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var time = require("../utils/time.js");

var WeekSchema = mongoose.Schema({
  budget:{type:Number},
  spent:{type:Number},
  start_date:{type:Date},
  end_date:{type:Date},
  user_id:{type: mongoose.Schema.Types.ObjectId,ref: 'User'}
}, { timestamps: true });

var WeekModel = mongoose.model('Week', WeekSchema);

var Week = (function(WeekModel) {
  that = {};
  that.create = function(object, callback) {
    var week = new WeekModel();
    week.budget = object.budget;
    week.spent = object.spent;
    week.start_date = object.start_date;
    week.end_date = object.end_date;
    week.user_id = object.user_id;
    week.save(function(err, week) {
      if (err) callback({ msg: err });
      callback(null, week);
    });
  }

  that.getPreviousWeeks = function(user_id, callback) {
    WeekModel.find({ user_id: user_id}).exec(function(err, weeks) {
        if(!err) {
          callback(null, weeks);
        } else {
          callback(err, null);
        }
    });
  }

  Object.freeze(that);
  return that;

})(WeekModel);

module.exports = Week;

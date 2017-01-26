var User = require("../models/User.js");
var Week = require("../models/Week.js");
var time = require("../utils/time.js");

const DEMO_BANK_LOGIN = "#BANK_DEMO";

var DemoAccountCreator = function(user_id) {
  var that = Object.create(DemoAccountCreator.prototype);
  that.update = function(callback) {
    var bankInfo = {
      bank_name : DEMO_BANK_LOGIN,
      bank_id : DEMO_BANK_LOGIN,
      plaid_access_token : DEMO_BANK_LOGIN
    }
    createPreviousWeek(user_id, function(error, succeeded) {
      if (succeeded) {
        User.updateBankInformation(user_id, bankInfo, function(err, user) {
          user.bank_name = bankInfo.bank_name;
          user.bank_id = bankInfo.bank_id;
          user.plaid_access_token = bankInfo.plaid_access_token;
          callback(err,user);
        });
      } else {
        callback(error, null);
      }
    });

  }

  var createPreviousWeek = function(user_id, success) {
    var start_of_last_week = time.getFirstMondayLastWeek();
    var end_of_last_week = time.getNearestMondayAfterDate(start_of_last_week);
    var weekModel = {
                     budget : 100,
                     user_id : user_id,
                     spent : 50,
                     start_date : start_of_last_week,
                     end_date : end_of_last_week
                   };
    Week.create(weekModel, function(error, week) {
      if (error) {
        success(error,false);
      } else {
        success(null, true);
      }
    });

  }

  Object.freeze(that);
  return that;
}

module.exports = DemoAccountCreator;

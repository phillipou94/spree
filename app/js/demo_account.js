var User = require("../models/User.js");
var Week = require("../models/Week.js");
var time = require("../utils/time.js");

const DEMO_BANK_LOGIN = "#BANK_DEMO";

var DemoAccount = function(user_id) {
  var that = Object.create(DemoAccount.prototype);
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

  that.transactions = function(date) {
    return [
      transaction(15.37,"13","CLOVER",date),
      transaction(28.72, "13", "BAR MEZZANNA",date),
      transaction(10.31, "26", "VENMO DES:PAYMENT ID:XXXXX4349",date),
      transaction(4.03, "27", "UBER POOL",date),
      transaction(18.25, "17", "MOVIE REGAL FENWAY", date),
      transaction(2.00, "26", "VENMO DES:PAYMENT ID:XXXXX4389",date),
      transaction(9.69, "13", "POKI GO MONTEBELLO CA", date),
      transaction(39.01, "19", "PRIMARK BOSTON MA", date),
    ];
  }

  var transaction = function(amount, category_id, name, date) {
    var transactionDate = new Date();
    if (date.getDay() !== 1) {
      transactionDate.setDate(date.getDate() - 1);
    }
    return {amount:amount, category_id:category_id, name:name, date:transactionDate, type:{primary:"demo"}}
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

module.exports = DemoAccount;

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/spree');

var User = require('../app/models/User.js');
var Bank = require('../app/models/Bank.js');
var Week = require('../app/models/Week.js');
var TransactionUtils = require('../app/utils/transactionUtils.js');
var time = require('../app/utils/time.js');

var connection = mongoose.connection;


var calculateAllUsersWeeklySpending = function(callback) {
  connection.on('error', console.error.bind(console, 'connection error:'));
  var start_of_week = time.getNearestMondayBeforeDate(new Date());
  var end_of_week = time.getNearestMondayAfterDate(new Date());
  connection.once('open', function() {
    User._bankAuthenticatedUsers(function(err, users) {
      users.forEach(function(user){
        Bank._getTransactions(user, start_of_week, end_of_week, function(err, transactions) {
          var spent_this_week = TransactionUtils.calculateTotal(transactions);
          console.log(user);
          var weekModel = {
                           budget : user.budget,
                           user_id : user._id,
                           spent : spent_this_week,
                           start_date : start_of_week,
                           end_date : end_of_week
                         };
          Week.create(weekModel, function(e, week) {
            console.log(week);
          });
        });
      });
    });
  });
}

calculateAllUsersWeeklySpending();

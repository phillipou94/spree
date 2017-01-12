var bb = require('bluebird');
var deferred = bb.defer();

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/spree');

var User = require('../app/models/User.js');
var Bank = require('../app/models/Bank.js');
var Week = require('../app/models/Week.js');
var TransactionUtils = require('../app/utils/transactionUtils.js');
var time = require('../app/utils/time.js');

var connection = mongoose.connection;

var calculateAllUsersWeeklySpending = function(callback) {
  console.log("start");
  connection.on('error', console.error.bind(console, 'connection error:'));
  var start_of_week = time.getNearestMondayBeforeDate(new Date());
  var end_of_week = time.getNearestMondayAfterDate(new Date());
  connection.once('open', function() {

    var bankUsersPromise = function() {
      var promise = new Promise(function(resolve,reject)  {
        User._bankAuthenticatedUsers(function(err, users) {
          resolve(users);
        });
      });

      return promise;
    };

    var weekPromises = function(users) {
      var promiseStack = [];
      users.forEach(function(user){
        var weekPromise = new Promise(function(resolve, reject) {
          Bank._getTransactions(user, start_of_week, end_of_week, function(err, transactions) {
            var spent_this_week = TransactionUtils.calculateTotal(transactions);
            var weekModel = {
                             budget : user.budget,
                             user_id : user._id,
                             spent : spent_this_week,
                             start_date : start_of_week,
                             end_date : end_of_week
                           };
            resolve(weekModel);
            Week.create(weekModel, function(e, week) {
              resolve(week)
            });
          });
        });

        promiseStack.push(deferred.weekPromise);
        var weekPromises = bb.all(promiseStack);
        return weekPromises;
      });
    };

    var bankUsersPromise = bankUsersPromise();

    bankUsersPromise.then(weekPromises).then(function() {
      console.log("finish");
    });
  });
}

calculateAllUsersWeeklySpending();

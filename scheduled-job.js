var bb = require('bluebird');
var deferred = bb.defer();

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/spree');

var User = require('./app/models/User.js');
var Bank = require('./app/models/Bank.js');
var Week = require('./app/models/Week.js');
var TransactionUtils = require('./app/utils/transactionUtils.js');
var time = require('./app/utils/time.js');


var calculateAllUsersWeeklySpending = function(callback) {
  console.log("Started : Calculate All Users Weekly Spending Task");
  var start_of_last_week = time.getFirstMondayLastWeek(new Date());
  var end_of_last_week = time.getNearestMondayAfterDate(start_of_last_week);

  var getBankAuthenticatedUsers = function() {
    var promise = new Promise(function(resolve,reject)  {
      User._bankAuthenticatedUsers(function(err, users) {
        if (err) {
          reject(err);
        }
        console.log("resolved users");
        resolve(users);
      });
    });

    return promise;
  };

  var setWeekForAllUsers = function(users) {
    //this weekPromise method will be applied to each user in users
    var weekPromise = function(user) {
        return new Promise(function(resolve, reject) {
          Bank.getTransactions(user, start_of_last_week, end_of_last_week, function(err, transactions) {
            if (err) {
              reject(err);
            }
            var spent_this_week = TransactionUtils.calculateTotal(transactions);
            var weekModel = {
                             budget : user.budget,
                             user_id : user._id,
                             spent : spent_this_week,
                             start_date : start_of_last_week,
                             end_date : end_of_last_week
                           };
            Week.create(weekModel, function(error, week) {
              if (error) {
                reject(error);
              }
              console.log("resolved week");
              resolve(week);
            });
          });
        });

    }

    return Promise.all(users.map(weekPromise));
  };

  var getBankAuthenticatedUsers = getBankAuthenticatedUsers();

  return getBankAuthenticatedUsers.then(setWeekForAllUsers);
}

var run = function() {
  var today = new Date();
  if (today.getDay() !== 1) {
    throw new Error("Only Run Job on Mondays");
  }

  //TODO: FIND BETTER WAY TO FORCE CLOSE DB
  // TIME_LIMIT_TO_COMPLETE = 5 * 60 * 1000 //5 minutes
  // setTimeout(
  //   function(){
  //     throw new Error("Job Timed Out");
  //  }, TIME_LIMIT_TO_COMPLETE);

   var db = mongoose.connection;

   db.on('error', console.error.bind(console, 'connection error:'));

   db.once('open', function() {
     var task = calculateAllUsersWeeklySpending();
     task.then(function() {
        console.log("Finished : Calculate All Users Weekly Spending Task");
        db.close();
      });
   });
}

run();

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/spree');

var User = require('./app/models/User.js');
var Bank = require('./app/models/Bank.js');
var TransactionUtils = require('./app/utils/transactionUtils.js');

var connection = mongoose.connection;


var calculateAllUsersWeeklySpending = function(callback) {
  connection.on('error', console.error.bind(console, 'connection error:'));
  connection.once('open', function() {
    User._bankAuthenticatedUsers(function(err, users) {
      users.forEach(function(user){
        Bank._getTransactions(user, function(err, transactions) {
          console.log(TransactionUtils.calculateTotal(transactions));
          //create week;
        });
      });
    });
  });
}

calculateAllUsersWeeklySpending();

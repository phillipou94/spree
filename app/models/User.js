var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var time = require("../utils/time.js");

var UserSchema = mongoose.Schema({
  name: String,
  email: {
      type: String,
      index: {unique: true}
  },
  password: String,
  budget:0,
  total_balance:0,
  current_week_spent:0,
  events_saved:[{type: mongoose.Schema.Types.ObjectId,ref: 'Event'}],
  events_purchased:[{type: mongoose.Schema.Types.ObjectId,ref: 'Event'}],
  bank_name:{type: String, default: null},
  bank_id:{type: String, default: null},
  pending_ticket_id:{type: mongoose.Schema.Types.ObjectId,ref: 'Ticket'},
  account_last_updated: {type: Date, default: Date.now},
  end_of_current_week: {type: Date, default: time.getNearestMondayAfterDate(new Date())},
  previous_weeks: {type: mongoose.Schema.Types.ObjectId,ref: 'Week'}
}, { timestamps: true });

UserSchema.index({email: 'text'});

/**
 * hashes a password
 * @param password {string} - password
 * @returns the hashed password
 */
UserSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * Validate a hashed password
 * @param password {string} - password
 * @returns {*}
 */
UserSchema.methods.validPassword = function(password) {
  console.log(password);

  return bcrypt.compareSync(password, this.password);
};

var UserModel = mongoose.model('User', UserSchema);

/**
 * An object that encapsulates functions that work with the User database
 */
var User = (function(UserModel) {
  that = {};

  that.create = function(name, email, password, callback) {
    UserModel.findOne({ email: email}, function(err, result) {
      if (result !== null) {
        callback({ msg: 'A user has already signed up with this email' });
      } else if (password.length < 5) {
        callback({ msg: 'Please select a longer password!' });
      } else {
        var user = new UserModel();
        user.name = name;
        user.email = email;
        user.password = user.hashPassword(password);
        user.save(function(err, user) {
          if (err) callback({ msg: err });
          callback(null, user);
        });
      }
    });
  };

  that.login = function(email, password, callback) {
    UserModel.findOne({ email: email }, function(err, user) {
      if (err) callback({ msg: err });
      if (user !== null && user.validPassword(password)) {
        callback(null, user);
      } else {
        callback(null, false);
      }
    });
  };

  Object.freeze(that);
  return that;

})(UserModel);

module.exports = User;

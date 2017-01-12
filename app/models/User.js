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
  budget:{type:Number},
  total_balance:{type:Number},
  current_week_spent:{type:Number},
  events_saved:[{type: mongoose.Schema.Types.ObjectId,ref: 'Event'}],
  events_purchased:[{type: mongoose.Schema.Types.ObjectId,ref: 'Event'}],
  bank_name:{type: String, default: null},
  bank_id:{type: String, default: null},
  plaid_access_token:{type: String, default: null},
  pending_ticket_id:{type: mongoose.Schema.Types.ObjectId,ref: 'Ticket'},
  account_last_updated: {type: Date, default: Date.now},
  end_of_current_week: {type: Date, default: time.getNearestMondayAfterDate(new Date())},
  previous_weeks: [{type: mongoose.Schema.Types.ObjectId,ref: 'Week'}]
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
  return bcrypt.compareSync(password, this.password);
};

var UserModel = mongoose.model('User', UserSchema);

/**
 * An object that encapsulates functions that work with the User database
 */
var User = (function(UserModel) {
  that = {};

  that.findById = function(_id, callback) {
    UserModel.findById(_id, function(err, user) {
        if (err) callback({ msg: err });
        if (user !== null) {
            callback(null, user);
        } else {
            callback({ msg: 'This user does not exist!' });
        }
    });
  };

  that._bankAuthenticatedUsers = function(callback) {
    UserModel.find({ plaid_access_token: { $exists: true, $ne:null} }).
              select('_id plaid_access_token budget').
              exec(function(err, users) {
                if(!err) {
                  callback(null, users);
                }
    });
  }

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

  that.updateBankInformation = function(user_id, bankInfo, callback) {
    const bank_name = bankInfo.bank_name;
    const bank_id = bankInfo.bank_id;
    const plaid_access_token = bankInfo.plaid_access_token;
    console.log(bankInfo);
    console.log(bank_id)
    UserModel.findOneAndUpdate({_id:user_id},{bank_name:bank_name,
                                              bank_id:bank_id,
                                              plaid_access_token:plaid_access_token}, function(err, user) {
      if (err) callback({ msg: err });
      if (user !== null) {
          callback(null, user);
      } else {
          callback({ msg: 'This user does not exist!' });
      }
    });
  }

  Object.freeze(that);
  return that;

})(UserModel);

module.exports = User;

var plaid = require('plaid');

const PLAID_ENV = plaid.environments.tartan;
const LOGO_MAP = {
  "amex":"",
  "bbt":"",
  "bofa":"",
  "capone":"",
  "schwab":"",
  "chase":"",
  "citi":"",
  "fidelity":"",
  "nfcu":"",
  "pnc":"",
  "suntrust":"",
  "td":"",
  "us":"",
  "usaa":"",
  "wells":""
}

var Bank = function(plaidBankObject) {
   var that = Object.create(Bank.prototype);
   that._id = plaidBankObject.id;
   that.name = plaidBankObject.name;
   that.type = plaidBankObject.type;
   that.credentials = plaidBankObject.credentials;
   that.has_mfa = plaidBankObject.has_mfa;
   that.mfa = plaidBankObject.mfa;
   that.logo_url = LOGO_MAP[plaidBankObject.type];

   Object.freeze(that);
   return that;
};

Bank.all = function(callback) {
  plaid.getInstitutions(PLAID_ENV, function(err, response) {
    callback(err, response);
  });
};

module.exports = Bank;

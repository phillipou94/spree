var plaid = require('plaid');

const PLAID_ENV = plaid.environments.tartan;
const LOGO_MAP = {
  "amex":"http://logo.clearbit.com/americanexpress.com",
  "bbt":"http://logo.clearbit.com/bbt.com",
  "bofa":"https://media.glassdoor.com/sqll/8874/bank-of-america-squarelogo-1453269130589.png",
  "capone":"https://static1.squarespace.com/static/536be0afe4b0c5614e1cfcc2/t/5581f049e4b03b63b3710746/1434579022426/CapitalOne-logo-copy_Square.jpg?format=2500w",
  "capone360":"http://www.harvardsquare.com/sites/default/files/ls.jpg",
  "schwab":"https://upload.wikimedia.org/wikipedia/commons/a/a4/Charles_Schwab_Corporation_logo.png",
  "chase":"http://kclathrop.com/wp-content/uploads/2015/10/Screen-Shot-2015-10-01-at-9.28.20-PM.png",
  "citi":"http://news-cdn.efinancialcareers.com/wp-content/uploads/citi_1.png",
  "fidelity":"https://pbs.twimg.com/profile_images/458954942313533440/K95J2hrW_400x400.png",
  "nfcu":"https://www.navyfederal.org/assets/images/nfcu-logo-bluegrad-800.jpg",
  "pnc":"http://freevectorlogo.net/wp-content/uploads/2012/05/pnc-bank-logo-vector-01.png",
  "suntrust":"http://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/0020/4578/brand.gif?itok=Y2UTGs6a",
  "td":"http://nsomusic.ca/wp-content/uploads/2013/12/td-bank-logo.png",
  "us":"http://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/022014/us_bank_correctcolors.png?itok=DamCfmkg",
  "usaa":"https://files.graphiq.com/765/media/images/USAA_Federal_Savings_Bank_109121.jpg",
  "wells":"http://www.ppfive.com/wp-content/uploads/2016/04/wells-fargo-logo-high-res.jpg"
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

Bank.search = function(searchString, callback) {
  plaid.searchInstitutions({product:"auth", query: searchString}, PLAID_ENV, function(err, response) {
    callback(err, response);
  });
};

module.exports = Bank;

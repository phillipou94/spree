var TransactionUtils = (function() {

  var that = {};

  that.calculateTotal = function(transactions) {
    // transaction.type.primary != "special";
    var total = transactions.reduce(function(amount, transaction) {
      var thirdPartyPayment = (transaction.category &&
                                (transaction.category.indexOf("Transfer") > -1 ||
                                  transaction.category.indexOf("Third Party") > -1
                                )
                              );
      if (thirdPartyPayment && transaction.amount > 0){
        return amount + transaction.amount;
      }
      if (transaction.type.primary === "special" || transaction.amount < 0) {
        return amount;
      }
      return amount + transaction.amount;
    },0);
    return Math.ceil(total * 100) / 100;
  }


  Object.freeze(that);
  return that;

})();

module.exports = TransactionUtils;

var time = (function() {

  var that = {};

  that.getNearestMondayAfterDate = function(milliseconds) {
    var d = new Date(milliseconds);
    d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
    d.setHours(0,0,0,0);
    return d;
  }

  Object.freeze(that);
  return that;

})();

module.exports = time;

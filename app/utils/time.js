var time = (function() {

  var that = {};

  that.getNearestMondayAfterDate = function(milliseconds) {
    var d = new Date(milliseconds);
    d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
    d.setHours(0,0,0,0);
    return d;
  }

  that.getNearestMondayBeforeDate = function(milliseconds) {
    var date = new Date(milliseconds);
    var day = date.getDay() || 7;
    if( day !== 1 )
    date.setHours(-24 * (day - 1));
    date.setHours(0,0,0,0);
    return date;
  }

  Object.freeze(that);
  return that;

})();

module.exports = time;

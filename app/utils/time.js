var time = (function() {
  var dateFormat = require('dateformat');
  var that = {};

  that.getNearestMondayAfterDate = function(milliseconds) {
    var d = new Date(milliseconds);
    if (d.getDay() === 1) {
      d.setDate(d.getDate() + 7);
      d.setHours(0,0,0,0);
      return new Date(d);
    }
    d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
    d.setHours(0,0,0,0);
    return d;
  }

  that.getFirstMondayLastWeek = function() {
    var date = this.getNearestMondayBeforeDate(new Date());
    date.setDate(date.getDate() - 7);
    date.setHours(0,0,0,0);
    return date;
  }

  that.getNearestMondayBeforeDate = function(milliseconds) {
    var date = new Date(milliseconds);
    var day = date.getDay() || 7;
    if( day !== 1 ) {
      date.setHours(-24 * (day - 1));
    }
    date.setHours(0,0,0,0);
    return date;
  }

  that.daysLeftInWeek = function() {
    var oneDay = 24*60*60*1000;
    var today = new Date();
    var nextMonday = this.getNearestMondayAfterDate(today);
    var daysLeft = Math.ceil(Math.abs((nextMonday.getTime() - today.getTime())/(oneDay)));
    return daysLeft;
  }

  that.timeString = function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  }

  that.formattedDateString = function(date) {
    return dateFormat(date, "mmm dd, yyyy");
  }

  that.formattedMonthDayString = function(date) {
    return dateFormat(date, "mmm dd");
  }

  Object.freeze(that);
  return that;

})();

module.exports = time;

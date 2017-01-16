const request = require('request');
var API_URL = 'https://api.seatgeek.com/2';
var CLIENT_ID  = "NjU0MzMzOHwxNDgzMzI4NzU2";

var SeatGeek = function() {
  var that = Object.create(SeatGeek.prototype);
  var today = new Date();

  var defaultParams = function() {
    return "sort=score.desc&per_page=20&datetime_utc.gte="+today.toISOString();
  }

  var parseOptions = function(options) {
    if (!options) {
      return defaultParams();
    }
    var optionsString = "";
    if (options.latitude && options.longitude) {
      var latitude = options.latitude;
      var longitude = options.longitude;
      optionsString += ("lat="+latitude)+"&";
      optionsString += ("lon="+longitude)+"&";
    }
    if (options.page && options.page >=1) {
      optionsString += "page="+options.page+"&";
    }
    if (options.budget && options.budget > 0) {
      optionsString += "lowest_price.lte="+options.budget;
    }
    return optionsString+defaultParams();
  }

  var authenticationString = function() {
    return "&client_id="+CLIENT_ID;
  }

  var makeRequest = function(url, callback) {
    request.get({
      url: url,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    }, function apiSuccess(err, data, res) {
        callback(err,data);
    });
  }

  that.getEvents = function(options, callback) {
    var optionsString = parseOptions(options);
    var reqURL = API_URL+"/events"+"?"+optionsString+authenticationString();
    makeRequest(reqURL, function(error, data){
      callback(error, data);
    });
  }

  that.searchEvents = function(searchTerm, options, callback) {
    var optionsString = parseOptions(options);
    var searchString = searchTerm.replace(" ", "+");
    var reqURL = API_URL+"/events?q="+searchString+"&"+optionsString+authenticationString();
    console.log(reqURL);
    makeRequest(reqURL, function(error, data){
      callback(error, data);
    });
  }

  that.recommendations = function(event_id, callback) {
    var location = options.location;
    var page = options.page;
    var budget = options.budget;
  }

  Object.freeze(that);
  return that;

}

module.exports = SeatGeek;

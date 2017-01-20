var dev = 'http://localhost:3000/api/events';
var prod = 'https://git.heroku.com/enigmatic-mesa-53717/api/events';
const BASE_URL =  dev;

var request = require('request-promise-native');

/**
 * Services to link the front-end to the user models
 */
export default {
  events : (options) => {
    var lat = options.coordinates.latitude;
    var lng = options.coordinates.longitude;
    var uri = BASE_URL + '/lat='+lat+'&lng='+lng+'/page='+options.page+'/budget='+options.budget;
    return request({
      uri : uri,
      method: 'GET',
      json : true
    });
  },

  search : (query,options) => {
    var lat = options.coordinates.latitude;
    var lng = options.coordinates.longitude;
    var page = options.page;
    var uri = BASE_URL + '/search/search='+query+'/lat='+lat+'&lng='+lng+'/page='+page+'/budget='+options.budget;
    return request({
      uri : uri,
      method: 'GET',
      json : true
    });
  },
  images : (events) => {
    return request({
      uri : BASE_URL+"/images",
      method: 'POST',
      json : true,
      body : {
        events: events
      }
    });
  },

}

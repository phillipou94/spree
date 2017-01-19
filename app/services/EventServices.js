var dev = 'http://localhost:3000/api/events';
var prod = '';
const BASE_URL =  dev;

var request = require('request-promise-native');

/**
 * Services to link the front-end to the user models
 */
export default {
  events : (page,coordinates) => {
    var lat = coordinates.latitude;
    var lng = coordinates.longitude;
    var uri = BASE_URL + '/lat='+lat+'&lng='+lng+'/page='+page;
    return request({
      uri : uri,
      method: 'GET',
      json : true
    });
  },

  search : (query,page,coordinates) => {
    var lat = coordinates.latitude;
    var lng = coordinates.longitude;
    var uri = BASE_URL + '/search/search='+query+'/lat='+lat+'&lng='+lng+'/page='+page;
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

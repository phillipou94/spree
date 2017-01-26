var dev = 'http://localhost:3000/api/events';
var prod = 'https://spree-save.herokuapp.com/api/events';
const BASE_URL =  prod;

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

  event : (seatgeek_id) => {
    var uri = BASE_URL + '/seatgeek_id='+seatgeek_id
    return request({
      uri : uri,
      method: 'GET',
      json : true
    });
  },

  recommendations : (seatgeek_id, options) => {
    var lat = options.coordinates.latitude;
    var lng = options.coordinates.longitude;
    var page = options.page;
    var uri = BASE_URL + '/recommendations/'+seatgeek_id+'/lat='+lat+'&lng='+lng+'/page='+page+'/budget='+options.budget;
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
  saveToWishlist : (event) => {
    return request({
      uri : BASE_URL+"/wishlist",
      method: 'POST',
      json : true,
      body : {
        event: event
      }
    });
  },

  removeFromWishlist : (event_id) => {
    return request({
      uri : BASE_URL+"/wishlist/delete/"+event_id,
      method: 'DELETE',
      json : true
    });
  },

  wishlist : () => {
    return request({
      uri : BASE_URL+"/wishlist",
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

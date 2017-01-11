var dev = 'http://localhost:3000/api/banks';
var prod = '';
const BASE_URL = dev;

var request = require('request-promise-native');

/**
 * Services to link the front-end to the user models
 */
export default {
  all : () => {
    return request({
      uri : BASE_URL + '/all',
      method: 'GET',
      json : true
    });
  },

  search : (searchTerm) => {
    return request({
      uri : BASE_URL + '/search/'+searchTerm,
      method: 'GET',
      json : true
    });
  }
}

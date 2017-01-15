var dev = 'http://localhost:3000/api/weeks';
var prod = '';
const BASE_URL =  dev;

var request = require('request-promise-native');

/**
 * Services to link the front-end to the user models
 */
export default {
  previousWeeks : () => {
    return request({
      uri : BASE_URL + '/previous/',
      method: 'GET',
      json : true
    });
  },

}

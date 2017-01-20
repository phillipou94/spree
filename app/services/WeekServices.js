var dev = 'http://localhost:3000/api/weeks';
var prod = 'https://git.heroku.com/enigmatic-mesa-53717/api/weeks';
const BASE_URL =  process.env.MONGODB_URI ? prod : dev;

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

var dev = 'http://localhost:3000/api/weeks';
var prod = '';
const BASE_URL =  dev;

var request = require('request-promise-native');

/**
 * Services to link the front-end to the user models
 */
export default {
  previousWeeks : (user_id) => {
    console.log("services!");
    console.log(user_id);
    return request({
      uri : BASE_URL + '/previous/'+user_id,
      method: 'GET',
      json : true
    });
  },

}

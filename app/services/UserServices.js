var dev = 'http://localhost:3000/api/users';
var prod = '';
const BASE_URL = dev;

var request = require('request-promise-native');

/**
 * Services to link the front-end to the user models
 */
export default {
  register : (email, password) => {
    return request({
      uri : BASE_URL,
      method: 'POST',
      json : true,
      body : {
        email : email,
        password : password,
      }
    });
  },

  login : (username, password) => {
    return request({
      uri : BASE_URL + '/login',
      method: 'POST',
      body : {
        email : email,
        password : password
      },
      json : true
    });
  },
}

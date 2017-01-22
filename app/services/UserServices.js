var dev = 'http://localhost:3000/api/users';
var prod = 'https://enigmatic-mesa-53717.herokuapp.com/api/users';
const BASE_URL =  dev;

var request = require('request-promise-native');

/**
 * Services to link the front-end to the user models
 */
export default {
  signup : (name, email, password) => {
    return request({
      uri : BASE_URL + '/signup',
      method: 'POST',
      json : true,
      body : {
        name: name,
        email : email,
        password : password,
      }
    });
  },

  login : (email, password) => {
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

  currentUser : () => {
    return request({
      uri : BASE_URL + '/current',
      method: 'GET',
      json : true
    });

  },

  cachedUser : () => {
    return request({
      uri : BASE_URL + '/cached',
      method: 'GET',
      json : true
    });

  },

  currentCity : () => {
    var uri = BASE_URL + '/city';
    return request({
      uri : uri,
      method: 'GET',
      json : true
    });

  },

  updateBudget : (newBudget) => {
    console.log("SERVICES");
    return request({
      uri : BASE_URL + '/budget',
      method: 'PUT',
      body : {
        budget : newBudget
      },
      json : true
    });

  }
}

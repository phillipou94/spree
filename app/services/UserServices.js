var dev = 'http://localhost:3000/api/users';
var prod = 'https://spree-save.herokuapp.com/api/users';
const BASE_URL =  prod;

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

  logout : () => {
    return request({
      uri : BASE_URL + '/logout',
      method: 'POST',
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
    var uri = BASE_URL + '/city/cached';
    return request({
      uri : uri,
      method: 'GET',
      json : true
    });
  },

  updateCity : (coordinates) => {
    var uri = BASE_URL + '/city';
    return request({
      uri : uri,
      body : {
        latitude:coordinates.latitude,
        longitude:coordinates.longitude
      },
      method: 'POST',
      json : true
    });
  },

  coordinatesFromAddress : (address) => {
    var uri = BASE_URL + '/address';
    return request({
      uri : uri,
      body : {
        address:address
      },
      method: 'POST',
      json : true
    });
  },

  updateBudget : (newBudget) => {
    return request({
      uri : BASE_URL + '/budget',
      method: 'PUT',
      body : {
        budget : newBudget
      },
      json : true
    });
  },

  unlinkBankAccount : () => {
    return request({
      uri : BASE_URL + '/unlink_bank',
      method: 'PUT',
      json : true
    });
  }


}

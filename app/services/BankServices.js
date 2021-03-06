var dev = 'http://localhost:3000/api/banks';
var prod = 'https://spree-save.herokuapp.com/api/banks';
const BASE_URL =  prod;

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
  },

  authenticate : (req) => {
    return request({
      uri : BASE_URL + '/authenticate',
      method: 'POST',
      body : {
        username : req.username,
        password : req.password,
        pin : req.pin,
        type : req.type,
        bank_name: req.bank_name,
        bank_id: req.bank_id,
      },
      json : true
    });
  },

  answerSecurityQuestion : (req) => {
    return request({
      uri : BASE_URL + '/answer',
      method: 'POST',
      body : {
        answer : req.answer,
        access_token : req.access_token,
        type : req.type,
        bank_name: req.bank_name,
        bank_id: req.bank_id,
      },
      json : true
    });
  },

  getTransactions : (start_date,end_date) => {
    return request({
      uri : BASE_URL + '/transactions/start_date='+start_date+'&end_date='+end_date,
      method: 'GET',
      body : {
        start_date : start_date,
        end_date : end_date
      },
      json : true
    });
  },

}

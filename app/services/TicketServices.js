var dev = 'http://localhost:3000/api/tickets';
var prod = 'https://enigmatic-mesa-53717.herokuapp.com/api/tickets';
const BASE_URL =  dev;

var request = require('request-promise-native');

/**
 * Services to link the front-end to the user models
 */
export default {
  buy : (event) => {
    var uri = BASE_URL + '/buy';
    return request({
      uri : uri,
      body : {
        event: event
      },
      method: 'POST',
      json : true
    });
  },

  getTicket : (ticket_id) => {
    var uri = BASE_URL + '/'+ticket_id;
    return request({
      uri : uri,
      method: 'GET',
      json : true
    });
  },

  confirmPurchase : (ticket) => {
    var uri = BASE_URL + '/confirm/'+ticket._id;
    return request({
      uri : uri,
      body : {ticketPrice : ticket.price},
      method: 'POST',
      json : true
    });
  },

  denyPurchase : (ticket) => {
    var uri = BASE_URL + '/deny/'+ticket._id;
    return request({
      uri : uri,
      method: 'POST',
      json : true
    });
  }

}

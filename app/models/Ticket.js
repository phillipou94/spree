var mongoose = require('mongoose');

var TicketSchema = mongoose.Schema({
  bought_by:{type: mongoose.Schema.Types.ObjectId,ref: 'User'},
  event:{type: mongoose.Schema.Types.ObjectId,ref: 'Event'},
  seatgeek_id:{type:String},
  purchase_price:{type:Number},
  title:{type:String}
}, { timestamps: true });

var TicketModel = mongoose.model('Ticket', TicketSchema);

var Ticket = (function(TicketModel) {
  that = {};

  that.create = function(event, user_id, callback) {
    var ticket = new TicketModel();
    ticket.event = event._id;
    ticket.seatgeek_id = event.seatgeek_id;
    ticket.title = event.title;
    ticket.bought_by = user_id;
    ticket.save(function(err, ticket) {
      if (err) callback({ msg: err });
      callback(null, ticket);
    });
  }

  Object.freeze(that);
  return that;

})(TicketModel);

module.exports = Ticket;

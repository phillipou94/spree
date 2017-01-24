var mongoose = require('mongoose');

var TicketSchema = mongoose.Schema({
  bought_by:{type: mongoose.Schema.Types.ObjectId,ref: 'User'},
  event:{type: mongoose.Schema.Types.ObjectId,ref: 'Event'},
  seatgeek_id:{type:String},
  price:{type:Number, default: 0},
  purchased:{type:Boolean, default: false},
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

  that.findById = function(_id, callback) {
    TicketModel.findById(_id, function(err, ticket) {
        if (err) {
          callback(err, ticket);
        }
        if (ticket !== null) {
            callback(null, ticket);
        } else {
            callback(err, ticket);
        }
    });
  };

  that.findTicketsFromUser = function(user_id, callback) {
    TicketModel.find({bought_by:user_id, purchased: true}).sort({updatedAt: -1}).exec(function(error, tickets) {
      if (error) {
        callback(error, null);
      } else {
        callback(null, tickets);
      }
    });
  }

  that.delete = function(_id, callback) {
    TicketModel.remove({ _id: _id}, function(err, ticket) {
      if (err) {
        callback(error, ticket);
      } else {
        callback(null, ticket);
      }
    });
  }

  that.purchase = function(ticket_id, price, callback) {
    TicketModel.findByIdAndUpdate(ticket_id, {price:price, purchased:true}, function(err, ticket) {
      if (err) callback({ msg: err });
      ticket.price = price;
      callback(null, ticket);
    });
  }

  Object.freeze(that);
  return that;

})(TicketModel);

module.exports = Ticket;

var SeatGeek = require("./app/js/seatgeek.js");

var Event = require("./app/models/Event.js");

var test = function() {
  var seatgeek = new SeatGeek();
  // seatgeek.getEvents({latitude:"42.36",longitude: "-71.06"}, function(error, data) {
  //   console.log(data);
  // });
  // Event.getEvents({latitude:"42.36",longitude: "-71.06"}, function(error, events) {
  //   console.log(events);
  // });

  // Event.searchEvents("red sox",{page:5}, function(error, events) {
  //   console.log(events);
  // });

  //
  // seatgeek.searchEvents("red sox", {latitude:"42.36",longitude: "-71.06"}, function(error, data) {
  //   console.log(data);
  // });
}

test();

var SeatGeek = require("./app/js/seatgeek.js");

var test = function() {
  var seatgeek = new SeatGeek();
  seatgeek.searchEvents("red sox", {latitude:"42.36",longitude: "-71.06"}, function(error, data) {
    console.log(data);
  });
}

test();

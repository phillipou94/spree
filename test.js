var TicketMaster = require("./app/js/ticketmaster.js");

var Event = require("./app/models/Event.js");
const request = require('request');

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

var photo = function() {
  var query = "john legend"
  var type = "band";
  var search_term = query.replace(" ","+");
  var url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c6bf3aae9c5ca349ce2b731a6f923b0c&tags="+type+"&text="+search_term+"&sort=relevance&per_page=1&format=json&nojsoncallback=1";
  request.get({
    url: url,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  }, function apiSuccess(err, data, res) {
      var photoObject = JSON.parse(data.body).photos.photo[0];
      if (photoObject) {
        var farm_id =photoObject.farm;
        var server_id = photoObject["server"];
        var id = photoObject["id"];
        var secret = photoObject["secret"];
        var url = "https://farm"+farm_id+".staticflickr.com/"+server_id+"/"+id+"_"+secret+".jpg"
          console.log(url);
      } else {
        console.log(data.body);
      }


  });
}

// var ticketmaster = function() {
//   var title = "Eric Church";
//   var url = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0&keyword="+title+"&size=1";
//   request.get({
//     url: url,
//     headers: { 'Content-Type': 'application/json' },
//     withCredentials: true,
//   }, function apiSuccess(err, data, res) {
//       var object = JSON.parse(data.body);
//       var event = object["_embedded"]["events"][0];
//       var images = event.images;
//       images.sort(function(a, b){
//         return a.width < b.width;
//       });
//       var image = images[0].url;
//       console.log(image);
//
//   });
// }

var ticketmaster = function() {
  var tm = new TicketMaster();
  tm.getImagesForEvents([{title:"Justin Bieber", _id:"1234"},{title:"Justin Bieber", _id:"1234"},{title:"Justin Bieber", _id:"1234"}]).
  then((res) => {
    console.log(res);
  });

}

ticketmaster();

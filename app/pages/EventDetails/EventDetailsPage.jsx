import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import InfiniteScroll from 'react-infinite-scroller';
import styles from "./EventDetailsPage.css";
var TicketMaster = require("../../js/ticketmaster.js");
var tm = new TicketMaster();
import time from "../../utils/time.js";
var Loader = require('halogen/ClipLoader');

import UserServices from "../../services/UserServices.js";
import EventServices from "../../services/EventServices.js";
import TicketServices from "../../services/TicketServices.js";

import EventCard from "../../components/Cards/EventCard/EventCard.jsx";
import TransparentNavbarAuthenticated from '../../components/Navbar/TransparentNavbarAuthenticated.jsx';
import TransparentSearchbar from '../../components/Searchbar/TransparentSearchbar.jsx';
import Switch from '../../components/Switch/Switch.jsx';

class EventDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {user:null,
                  balance:0.00,
                  event:null,
                  recommendations:[],
                  eventsWithinBudget:false,
                  loading:true,
                  addedToWishlist:false
                  }

  }

  componentWillMount() {
    var that = this;
    UserServices.currentUser().then((res) => {
      var user = res.body.user;
      var balance = new Number(res.body.balance).toFixed(2);
      if (user) {
        this.setState({user:user, balance: balance});
      }
    });
    var event_id = this.props.params.event_id;
    EventServices.event(event_id).then((res) => {
      var event = res.body;
      EventServices.images([event]).then((res) => {
        var images = res.body;
        if (images && images.length) {
          event.featured_image = images[0].image;
        }
        this.setState({event:event, loading:false});
      }).catch((errorResponse) => {
        this.setState({loading:false});
      });
    }).catch((errorResponse) => {
      this.setState({loading:false});
    });
    this.getRecommendations(event_id);
  }

  componentDidMount() {
    if (this && window) {
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  componentWillUnmount() {
    if(this && window) {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  handleScroll(event) {
    if (this) {
      let scrollTop = event.srcElement.body.scrollTop;
      this.setState({
         scrollTop: scrollTop
      });
    }
  }

  getLocation(callback) {
    UserServices.currentCity().then((res) => {
      if (res.body && res.body.location) {
        var city = res.body.location;
        var coordinates = res.body.coordinates;
        this.setState({city:city, coordinates:coordinates});
        callback(coordinates);
      } else {

        callback(null);
      }

    });
  }

  getEventOptions(callback, withinBudget, searchTerm, location) {
    var options = {page : 1};
    if (withinBudget) {
      options["budget"] = Math.floor(this.state.balance);

    }
    if (searchTerm && searchTerm.length) {
      options["searchTerm"] = searchTerm;
    }
    if (!location) {
      this.getLocation(function(coordinates){
        options["coordinates"] = coordinates;

        callback(options);
      });
    } else {
      options["coordinates"] = location;
      callback(options);
    }
  }

  getRecommendations(event_seatgeek_id, withinBudget, searchTerm, location) {
    var self = this;
    this.getEventOptions(function(options) {
        EventServices.recommendations(event_seatgeek_id, options).then((res) => {
          self.setState({recommendations:res.body,
                        searchTerm:"",
                        eventsWithinBudget:options.withinBudget,
                        location:location,
                        page:1,
                        });
      }).catch((errorResponse) => {
        console.log("recommendations");
        console.log(errorResponse);
      });
  }, withinBudget, searchTerm, location);
}

  didClickEvent(e) {
    var event = e;
    this.getRecommendations(event.seatgeek_id);
    EventServices.event(event.seatgeek_id).then((res) => {
      var newEvent = res.body;
      EventServices.images([newEvent]).then((response) => {
        var images = response.body;
        if (images && images.length) {
          newEvent.featured_image = images[0].image;
        }
        this.setState({event:newEvent});
      }).catch((err) => {
        this.setState({event:newEvent});
      });
    });
  }

  buyTicket() {
    var event = this.state.event;
    var url = event.url;
    TicketServices.buy(event).then((res) => {
      this.props.router.push("/");
      window.open(url, '_blank');
    })

  }

  saveToWishlist() {
    var event = this.state.event;
    if (!this.state.addedToWishlist) {
      EventServices.saveToWishlist(event);
    }
    this.setState({addedToWishlist:true});

  }

  render() {
    var events = this.state.recommendations;
    var balance = this.props.balance;
    var navbarOpacity = Math.min(1,this.state.scrollTop/450);
    var self = this;
    var eventCards = events.map(function(event,index) {
      return <EventCard key = {index}
                        event = {event}
                        balance = {balance}
                        onClick = {() => {self.didClickEvent(event);}}/>
    });

    if (this.state.event) {
      var event = this.state.event;
      var eventTime = time.timeString(new Date(event.date));
      var date = time.fullFormattedDateString(new Date(event.date));
      var dateString = eventTime + " - "+date;
      var venue = event.venue;
      var venueName = venue.name;
      var venueAddress = venue.address + ", "+venue.extended_address;
      var featured_image = event.featured_image ? event.featured_image : event.performers[0].image;
    }

    var wishListButtonStyle = {background : this.state.addedToWishlist ? "#E52F4F" : "none",
                               border: this.state.addedToWishlist ? "none" : "1px solid white"};


    return (
      <div className = {styles.EventDetailsPage}>
      <TransparentNavbarAuthenticated
                          opacity = {navbarOpacity}
                           balance = {this.state.balance}
                           showBalance = {true}
                           currentPage = {"Events"}
                           loading = {this.state.loading}
      />
    {!this.state.event && this.state.loading &&
      <div className = {styles.loadingHeader}>
        <div className = {styles.loaderContainer}>
          <Loader color={"white"} size="100px" margin="90px"/>
        </div>
      </div>
    }
    {!this.state.event && !this.state.loading &&
      <div className = {styles.loadingHeader}>
        <div className = {styles.errorText}>
          <h2>Sorry, this event isn't available</h2>
          <p>The link you followed may be broken, or the event may have been removed.</p>
          <a href = "/">Explore Other Events</a>
        </div>

      </div>
    }
    {this.state.event &&
      <div className = {styles.header}>

          <div>
            <img src = {featured_image}
                 className = {styles.eventPhoto}/>
            <div className = {styles.eventInfo}>
              <h1>{event.title}</h1>
              <p>{dateString}</p>
              <p>{venueName}</p>
              <p>{venueAddress}</p>
           </div>

       <div className = {styles.headerButtonContainer}>
         {this.state.balance > event.low_price &&
           <button className = {styles.buyButton}
                   onClick= {this.buyTicket.bind(this)}>
                   {"Buy $"+event.low_price}</button>
          }
          <div className = {styles.wishListButton}
               style = {wishListButtonStyle}
               onClick= {this.saveToWishlist.bind(this)}>
           <p>{this.state.addedToWishlist ? "Added to wishlist" : "Add to wishlist"}</p>
         </div>
       </div>
     </div>

      </div>
         }
      <div className = {styles.secondaryHeader}>
        <p className = {styles.headerDescription}>{"Similar Events"}</p>


      </div>

      {eventCards.length > 0 &&
      <div className = {styles.events}>
        <InfiniteScroll
            className = {styles.eventsTable}
            pageStart={1}
            loadMore={this.getRecommendations.bind(this)}
            hasMore={false}
            loader={<div className="loader">Loading ...</div>}>
            {eventCards}
        </InfiniteScroll>
      </div>
    }

    </div>
    );
  }
}

export default withRouter(CSSModules(EventDetailsPage, styles));

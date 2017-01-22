import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import InfiniteScroll from 'react-infinite-scroller';
import styles from "./EventDetailsPage.css";
var TicketMaster = require("../../js/ticketmaster.js");
var tm = new TicketMaster();
import time from "../../utils/time.js";

import UserServices from "../../services/UserServices.js";
import EventServices from "../../services/EventServices.js";

import EventCard from "../../components/Cards/EventCard/EventCard.jsx";
import TransparentNavbar from '../../components/Navbar/TransparentNavbar.jsx';
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
        this.setState({event:event});
      }).catch((err) => {
        this.setState({event:event});
      });
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
                        page:1});
      });
  }, withinBudget, searchTerm, location);
}


  didSelectSwitch(side) {
    var withinBudget = side === "RIGHT";
    if (this.state.searchTerm && this.state.searchTerm.length) {
      this.getEvents(withinBudget,this.state.searchTerm);
    } else {
      this.getEvents(withinBudget);
    }
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
    var heartIcon = require("../../assets/Heart.svg");
    if (this.state.event) {
      var event = this.state.event;
      var eventTime = time.timeString(new Date(event.date));
      var date = time.formattedDateString(new Date(event.date));
      var dateString = eventTime + " - "+date;
      var venue = event.venue;
      var venueName = venue.name;
      var venueAddress = venue.address + ", "+venue.extended_address;
      var featured_image = event.featured_image ? event.featured_image : event.performers[0].image;
    }


    return (
      <div className = {styles.EventDetailsPage}>
      <TransparentNavbar   opacity = {navbarOpacity}
                           balance = {this.state.balance}
                           showBalance = {true}
                           currentPage = {"Events"}
      />
    {this.state.event &&
      <div className = {styles.header}>

          <img src = {featured_image}
               className = {styles.eventPhoto}/>
        <div className = {styles.eventInfo}>
          <h1>{event.title}</h1>
          <p>{dateString}</p>
          <p>{venueName}</p>
          <p>{venueAddress}</p>

       </div>

       <div className = {styles.headerButtonContainer}>
         <button className = {styles.buyButton}>{"Buy $"+event.low_price}</button>
         <div className = {styles.wishListButton}>
           <p>Add to wishlist</p>
           <img src = {heartIcon} className = {styles.heartIcon}/>
         </div>
       </div>
      </div>
    }
      <div className = {styles.secondaryHeader}>
        <p className = {styles.headerDescription}>{"Similar Events"}</p>
        <div className = {styles.switch}>
          <Switch didSelectSwitch = {this.didSelectSwitch.bind(this)}/>
        </div>

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

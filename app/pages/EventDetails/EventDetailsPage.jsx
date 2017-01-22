import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import InfiniteScroll from 'react-infinite-scroller';
import styles from "./EventDetailsPage.css";
var TicketMaster = require("../../js/ticketmaster.js");
var tm = new TicketMaster();

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
                  similarEvents:[],
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
    this.getEvents();
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

  getEvents(withinBudget, searchTerm, location) {
    var self = this;
    this.getEventOptions(function(options) {
      if (options.searchTerm) {
        EventServices.search(searchTerm,options).then((res) => {
          self.setState({events:res.body,
                        eventsWithinBudget:options.withinBudget,
                        location:location,
                        searchTerm:searchTerm,
                        page:1});
        });
      } else {
        EventServices.events(options).then((res) => {
          self.setState({events:res.body,
                        searchTerm:"",
                        eventsWithinBudget:options.withinBudget,
                        location:location,
                        page:1});
      });
    }
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

  render() {
    var events = this.state.similarEvents;
    var balance = this.props.balance;
    var navbarOpacity = Math.min(1,this.state.scrollTop/450);

    var eventCards = events.map(function(event,index) {
      return <EventCard key = {index} event = {event} balance = {balance}/>
    });
    var heartIcon = require("../../assets/Heart.svg");

    return (
      <div className = {styles.EventDetailsPage}>
      <TransparentNavbar   opacity = {navbarOpacity}
                           balance = {this.state.balance}
                           showBalance = {true}
                           currentPage = {"Events"}
      />
      <div className = {styles.header}>
        <img src = {"https://static.pexels.com/photos/29021/pexels-photo-29021.jpg"}
             className = {styles.eventPhoto}/>
        <div className = {styles.eventInfo}>
          <h1>One Direction</h1>
          <p>July 5, 2016</p>
          <p>Staples Center</p>
          <p>1111 S Figueroa St, Los Angeles, CA 90015</p>
       </div>
       <div className = {styles.headerButtonContainer}>
         <button className = {styles.buyButton}>Buy $39</button>
         <div className = {styles.wishListButton}>
           <p>Add to wishlist</p>
           <img src = {heartIcon} className = {styles.heartIcon}/>
         </div>
       </div>
      </div>
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
            loadMore={this.getMoreEvents.bind(this)}
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

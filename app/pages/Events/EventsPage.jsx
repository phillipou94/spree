import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import InfiniteScroll from 'react-infinite-scroller';
import styles from "./EventsPage.css";
var TicketMaster = require("../../js/ticketmaster.js");
var tm = new TicketMaster();

import UserServices from "../../services/UserServices.js";
import EventServices from "../../services/EventServices.js";

import EventCarousel from "../../components/EventCarousel/EventCarousel.jsx";
import EventCard from "../../components/Cards/EventCard/EventCard.jsx";
import NavbarAuthenticated from '../../components/Navbar/NavbarAuthenticated.jsx';
import Searchbar from '../../components/Searchbar/Searchbar.jsx';


class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user:null,
                  events:[],
                  page:1,
                  searchTerm:"",
                  loadMoreEvents:true,
                  featuredEvents:[],
                  balance: 0.00,
                  city:"No Location Provided",
                  displayIndex: 0,
                  coordinates: null,
                  images: ['http://i.imgur.com/kJXRAZH.jpg','http://i.imgur.com/TaA1gj9.png', 'http://i.imgur.com/kJXRAZH.jpg','http://i.imgur.com/TaA1gj9.png'],
                  transitionDirection:"LEFT"}

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
    this.getLocation(function(coordinates){
      var options = {page:that.state.page, coordinates:coordinates};
      EventServices.events(options).then((res) => {
        var events = res.body;
        that.setState({events:events,loadMoreEvents:(events && events.length > 0), page:that.state.page+1});
        that.getFeaturedEvents(events);
      });
    });
  }

  getEvents() {
    if (this.state.loadMoreEvents) {
      console.log('GETTING MORE EVENTS!');
      var events = this.state.events;
      this.setState({loadMoreEvents:false});
      var that = this;
      this.getLocation(function(coordinates){
        var options = {page:that.state.page, coordinates:coordinates};
        EventServices.events(options).then((res) => {
          console.log(that.state.page)
          var moreEvents = events.concat(res.body);
          that.setState({events:moreEvents, loadMoreEvents:(events && events.length > 0),page:that.state.page+1});
        });
      });
    }


  }

  nextPressed() {
    var displayIndex = this.state.displayIndex;
    displayIndex = (displayIndex + 1) % this.state.images.length;
    this.setState({displayIndex:displayIndex, transitionDirection:"RIGHT"});
  }

  previousPressed() {
    var displayIndex = this.state.displayIndex;
    var length = this.state.images.length;
    var index = (displayIndex - 1) % length;
    if (index < 0) {
      index = length - Math.abs(index);
    }
    this.setState({displayIndex:index, transitionDirection:"LEFT"});
  }

  didClickThumbnail(index) {
    if (index !== this.state.displayIndex) {
      var transitionDirection = index > this.state.displayIndex ? "RIGHT" : "LEFT";
      this.setState({displayIndex:index, transitionDirection:transitionDirection});
    }

  }

  getFeaturedEvents(events) {
    if (!this.state.events) {
      return [];
    }
    var topEventRange = Math.min(4,events.length);
    var featuredEvents = events.slice(0,topEventRange);
    EventServices.images(featuredEvents).then((res) => {
      var images = res.body;
      featuredEvents.map(function(event) {
        var matched_images = images.filter(function(imageObject) {
          return imageObject.event_id === event._id;
        });
        if(matched_images.length > 0) {
          var featured_image = matched_images[0].image;
          event.featured_image = featured_image;
        }
        return event;
      })
      this.setState({featuredEvents:featuredEvents});
    });
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

  searchEvents(searchString) {
    var that = this;
    this.getLocation(function(coordinates){
      EventServices.search(searchString,{page:1,coordinates:coordinates}).then((res) => {
        that.setState({events:res.body,
                      loadMoreEvents:false,
                      searchTerm:searchString,
                      page:1,
                      featuredEvents:[]});
      });
    });

  }

  render() {
    var leftArrow = require("../../assets/LeftArrow.svg");
    var rightArrow = require("../../assets/RightArrow.svg");
    var locationIcon = require("../../assets/LocationIcon.svg");
    var dropdownIndicator = require("../../assets/DropdownIndicator(grey).svg");
    var featuredEvents = this.state.featuredEvents;
    var events = this.state.events;
    var balance = this.state.balance;
    var isSearching = this.state.searchTerm && this.state.searchTerm.length > 0;

    var eventCards = events.map(function(event) {
      return <EventCard event = {event} balance = {balance}/>
    });

    var headerTitle = this.state.searchTerm && this.state.searchTerm.length > 0 ?
                      "Search Results for "+this.state.searchTerm : "Find Events";
    return (
      <div>
        <NavbarAuthenticated balance = {this.state.balance}
                             showBalance = {true}
                             currentPage = {"Events"}
        />
      {featuredEvents && featuredEvents.length > 0 &&
      <div className = {styles.carouselHeader}>
          <img className = {styles.leftArrow} src = {leftArrow} onClick = {this.previousPressed.bind(this)}/>
          <img className = {styles.rightArrow} src = {rightArrow} onClick = {this.nextPressed.bind(this)}/>
          <div className = {styles.carouselContainer}>
            <EventCarousel displayIndex = {this.state.displayIndex}
                           events = {featuredEvents}
                           images = {this.state.images}
                           transitionDirection = {this.state.transitionDirection}
                           didClickThumbnail = {this.didClickThumbnail.bind(this)}/>
          </div>


        </div>
      }
      <div className = {styles.header}>
        <h1>Find Events</h1>
        <div className = {styles.searchbarContainer}>
          <Searchbar placeholder = {"Find Events You Love"} onSubmit = {this.searchEvents.bind(this)}/>
        </div>
      </div>
      <div className = {styles.secondaryHeader}>
        <div id = "locationButton" className = {styles.locationButton}>
          <img className = {styles.locationIcon} src = {locationIcon} />
          <p>{this.state.city}</p>
          <img className = {styles.dropdownIndicator} src = {dropdownIndicator} />
        </div>
        <div className = {styles.switch}>
          <p>Most Popular</p>
          <p>{" | "}</p>
          <p>Within Budget</p>
        </div>
      </div>
      {eventCards.length > 0 &&
      <div className = {styles.events}>
        <InfiniteScroll
            className = {styles.eventsTable}
            pageStart={0}
            loadMore={this.getEvents.bind(this)}
            hasMore={!isSearching && this.state.loadMoreEvents}
            loader={<div className="loader">Loading ...</div>}>
            {eventCards}
        </InfiniteScroll>
      </div>
    }

    </div>
    );
  }
}

export default withRouter(CSSModules(EventsPage, styles));

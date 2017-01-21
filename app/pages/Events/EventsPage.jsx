import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import InfiniteScroll from 'react-infinite-scroller';
import styles from "./EventsPage.css";
var TicketMaster = require("../../js/ticketmaster.js");
var tm = new TicketMaster();

import UserServices from "../../services/UserServices.js";
import EventServices from "../../services/EventServices.js";

import Tooltip from 'rc-tooltip';

import EventCarousel from "../../components/EventCarousel/EventCarousel.jsx";
import EventCard from "../../components/Cards/EventCard/EventCard.jsx";
import TransparentNavbar from '../../components/Navbar/TransparentNavbar.jsx';
import Searchbar from '../../components/Searchbar/Searchbar.jsx';
import Switch from '../../components/Switch/Switch.jsx';


class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {user:null,
                  events:[],
                  page:1,
                  eventOption:"MOST_POPULAR",
                  searchTerm:"",
                  loadMoreEvents:true,
                  featuredEvents:[],
                  balance: 0.00,
                  city:"No Location Provided",
                  displayIndex: 0,
                  coordinates: null,
                  showTooltip: false}

  }

  componentDidMount() {
      window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(event) {
    if (this) {
      let scrollTop = event.srcElement.body.scrollTop;
      this.setState({
         scrollTop: scrollTop
      });
    }
  }

  onScroll(event) {
    console.log("ON SCROLL!!");
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

  nextPressed() {
    var displayIndex = this.state.displayIndex;
    displayIndex = (displayIndex + 1) % this.state.events.length;
    this.setState({displayIndex:displayIndex, transitionDirection:"RIGHT"});
  }

  previousPressed() {
    var displayIndex = this.state.displayIndex;
    var length = this.state.events.length;
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

  getEvents(eventOption, resetPage) {
    if (this.state.loadMoreEvents) {
      var that = this;
      var page = resetPage ? 1 : this.state.page;
      this.getLocation(function(coordinates){
        var options = {page:page, coordinates:coordinates};
        if (eventOption === "WITHIN_BUDGET") {
          options["budget"] = Math.floor(that.state.balance);
        }
        EventServices.events(options).then((res) => {
          var events = that.state.events;
          if (page > 1) {
            events = events.concat(res.body);
          } else {
            events = res.body;
          }
          that.setState({events:events, loadMoreEvents:(events && events.length > 0),page:that.state.page+1});
        });
      });
    }

  }

  searchEvents(searchString, eventOption, resetPage) {
    var that = this;
    if (!eventOption) {
      eventOption = this.state.eventOption;
    }
    this.getLocation(function(coordinates){
      var options = {page:1,coordinates:coordinates};
      if (eventOption === "WITHIN_BUDGET") {
        options["budget"] = Math.floor(that.state.balance);
      }
      EventServices.search(searchString,options).then((res) => {
        that.setState({events:res.body,
                      loadMoreEvents:false,
                      searchTerm:searchString,
                      page:1,
                      featuredEvents:[]});
      });
    });
  }

  didSelectSwitch(side) {
    if (side === "LEFT") {
      var eventOption = "MOST_POPULAR";

    } else {
      var eventOption = "WITHIN_BUDGET";
    }
    this.setState({eventOption:eventOption});
    if (this.state.searchTerm && this.state.searchTerm.length > 0) {
      this.searchEvents(this.state.searchTerm, eventOption);
    } else {
      this.getEvents(eventOption, /*resetPage*/true);
    }
  }

  showTooltip() {
    this.setState({showTooltip:true});
  }

  render() {
    var headerImage = 'https://static.pexels.com/photos/29021/pexels-photo-29021.jpg';
    var locationIcon = require("../../assets/LocationIcon.svg");
    var dropdownIndicator = require("../../assets/DropdownIndicator(grey).svg");
    var featuredEvents = this.state.featuredEvents;
    var events = this.state.events;
    var balance = this.state.balance;
    var isSearching = this.state.searchTerm && this.state.searchTerm.length > 0;

    var navbarOpacity = Math.min(1,this.state.scrollTop/450);

    var eventCards = events.map(function(event,index) {
      return <EventCard key = {index} event = {event} balance = {balance}/>
    });

    var headerTitle = this.state.searchTerm && this.state.searchTerm.length > 0 ?
                      "Search Results for "+this.state.searchTerm : "Find Events";
    return (
      <div>
      <TransparentNavbar   opacity = {navbarOpacity}
                           balance = {this.state.balance}
                           showBalance = {true}
                           currentPage = {"Events"}
      />
      <div className = {styles.header}>
        <div className = {styles.headerInfo}>

          <div className = {styles.headerTitleContainer}>
            <h1>Discover and Book</h1>
            <div>
              <h1>{"Your Next Adventure in "} <span style = {{textDecoration: "underline", cursor:"pointer"}}>{this.state.city}</span></h1>
              <img className = {styles.dropdownIndicator} src = {dropdownIndicator} />
            </div>

          </div>
        </div>
        <img className = {styles.headerImage} src = {headerImage} />

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

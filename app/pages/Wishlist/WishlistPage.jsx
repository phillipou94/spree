import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import InfiniteScroll from 'react-infinite-scroller';
import styles from "./WishlistPage.css";

import UserServices from "../../services/UserServices.js";
import EventServices from "../../services/EventServices.js";

import Tooltip from 'rc-tooltip';

import EventCard from "../../components/Cards/EventCard/EventCard.jsx";
import NavbarAuthenticated from '../../components/Navbar/NavbarAuthenticated.jsx';
import Searchbar from '../../components/Searchbar/Searchbar.jsx';
import Switch from '../../components/Switch/Switch.jsx';


class WishlistPage extends Component {
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
      });
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
    var locationIcon = require("../../assets/LocationIcon.svg");
    var dropdownIndicator = require("../../assets/DropdownIndicator(grey).svg");
    var events = this.state.events;
    var balance = this.state.balance;
    var isSearching = this.state.searchTerm && this.state.searchTerm.length > 0;

    var eventCards = events.map(function(event,index) {
      return <EventCard key = {index} event = {event} balance = {balance}/>
    });

    var headerTitle = this.state.searchTerm && this.state.searchTerm.length > 0 ?
                      "Search Results for "+this.state.searchTerm : "Find Events";
    return (
      <div>
        <NavbarAuthenticated balance = {this.state.balance}
                             showBalance = {true}
                             currentPage = {"Events"}
        />
      <div className = {styles.header}>
        <h1>Wish List</h1>
        <div className = {styles.searchbarContainer}>
          <Searchbar placeholder = {"Find Events You Love"} onSubmit = {this.searchEvents.bind(this)}/>
        </div>
      </div>
      <div className = {styles.secondaryHeader}>
        <Tooltip
          trigger="click"
          visible={this.state.showTooltip}
          placement="bottom"
          overlay={<span></span>}>
          <div id = "locationButton" className = {styles.locationButton} onClick = {this.showTooltip.bind(this)}>
            <img className = {styles.locationIcon} src = {locationIcon} />
            <p>{this.state.city}</p>
            <img className = {styles.dropdownIndicator} src = {dropdownIndicator} />
          </div>
        </Tooltip>
        <Switch didSelectSwitch = {this.didSelectSwitch.bind(this)}/>
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

export default withRouter(CSSModules(WishlistPage, styles));

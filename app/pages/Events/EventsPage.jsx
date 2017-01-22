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
import TransparentSearchbar from '../../components/Searchbar/TransparentSearchbar.jsx';
import Switch from '../../components/Switch/Switch.jsx';


class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {user:null,
                  events:[],
                  page:1,
                  eventOption:"MOST_POPULAR",
                  searchTerm:"",
                  isSearching:false,
                  balance: 0.00,
                  city:"No Location Provided",
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
        that.setState({events:events});
      });
    });
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
    var that = this;
    var page = resetPage ? 1 : this.state.page;
    if (this.state.isSearching) {
      return;
    }
    if (this.state.loadMoreEvents) {

    }
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
        that.setState({events:events,isSearching:false,searchTerm:"", eventOption:eventOption});
      });
    });


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
                      searchTerm:searchString,
                      isSearching:true,
                      page:1});
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
    if (this.state.searchTerm && this.state.searchTerm.length) {
      this.searchEvents(this.state.searchTerm, eventOption);
    } else {
      this.getEvents(eventOption, /*resetPage*/true);
    }
  }

  showTooltip() {
    this.setState({showTooltip:true});
  }

  isSearching() {
    this.setState({isSearching:true, searchTerm:""});
  }

  exitSearch() {
    this.setState({isSearching:false, searchTerm:""});
    this.getEvents("MOST_POPULAR", true);
  }

  searchInputDidChange(event) {
    this.setState({currenSearchTerm:event.target.value})
  }

  searchClicked() {
    console.log(this.state);
  }

  render() {
    var headerImage = 'https://static.pexels.com/photos/29021/pexels-photo-29021.jpg';
    var searchIcon = require("../../assets/Search.svg");
    var searchIconWhite = require("../../assets/Search(White).svg");
    var exitIcon = require("../../assets/CloseIcon.svg");
    var dropdownIndicator = require("../../assets/DropdownIndicator(grey).svg");
    var featuredEvents = this.state.featuredEvents;
    var events = this.state.events;
    var balance = this.state.balance;
    var isSearching = this.state.isSearching;

    console.log("Should load more :"+!isSearching);
    var navbarOpacity = Math.min(1,this.state.scrollTop/450);

    var eventCards = events.map(function(event,index) {
      return <EventCard key = {index} event = {event} balance = {balance}/>
    });

    var headerTitle = this.state.searchTerm && this.state.searchTerm.length > 0 ?
                      "Search Results for "+this.state.searchTerm : "Find Events";
    return (
      <div className = {styles.EventsPage}>
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
      {this.state.isSearching && this.state.searchTerm && this.state.searchTerm.length &&
        <div className = {styles.searchResultsHeader}>
          <button className = {styles.searchResultsButton} onClick = {this.isSearching.bind(this)}>
            <img src = {searchIconWhite} />
            <p>Search</p>
          </button>
          <div className = {styles.searchTerm}>
            <p>{"'"+this.state.searchTerm+"'"}</p>
            <img className = {styles.exitIcon}
                 src = {exitIcon}
                 onClick = {this.exitSearch.bind(this)}/>
          </div>
          <div className = {styles.switch}>
            <Switch didSelectSwitch = {this.didSelectSwitch.bind(this)}/>
          </div>
          <p className = {styles.headerDescription}>{this.state.events.length+" results in "+this.state.city}</p>
        </div>
      }
      {this.state.isSearching && (!this.state.searchTerm || this.state.searchTerm.length < 1) &&
        <div className = {styles.searchingHeader}>
          <div className = {styles.searchbarContainer}>
            <TransparentSearchbar placeholder = {"Find Events You Love"}
                                  onSubmit = {this.searchEvents.bind(this)}
                                  exitSearch = {this.exitSearch.bind(this)}
                                  inputDidChange = {this.searchInputDidChange.bind(this)}/>
          </div>
            <button className = {styles.submitSearchButton} onClick = {() => this.searchClicked()}>SEARCH</button>
        </div>
      }
      {!this.state.isSearching &&
      <div className = {styles.secondaryHeader}>
          <button className = {styles.searchButton} onClick = {this.isSearching.bind(this)}>
            <img src = {searchIcon} />
            <p>Search</p>
          </button>

          <div className = {styles.switch}>
            <Switch didSelectSwitch = {this.didSelectSwitch.bind(this)}/>
          </div>
          <p className = {styles.headerDescription}>{"Events in "+this.state.city}</p>


      </div>
      }
      {eventCards.length > 0 &&
      <div className = {styles.events}>
        <InfiniteScroll
            className = {styles.eventsTable}
            pageStart={0}
            loadMore={this.getEvents.bind(this)}
            hasMore={!isSearching}
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

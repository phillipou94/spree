import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import InfiniteScroll from 'react-infinite-scroller';
import styles from "./EventsPage.css";
var TicketMaster = require("../../js/ticketmaster.js");
var tm = new TicketMaster();
var Loader = require('halogen/ClipLoader');

import UserServices from "../../services/UserServices.js";
import EventServices from "../../services/EventServices.js";
import TicketServices from "../../services/TicketServices.js";

import Tooltip from 'rc-tooltip';

import PopupConductor from '../../components/Popups/PopupConductor.jsx';
import EventCard from "../../components/Cards/EventCard/EventCard.jsx";
import TransparentNavbarAuthenticated from '../../components/Navbar/TransparentNavbarAuthenticated.jsx';
import TransparentSearchbar from '../../components/Searchbar/TransparentSearchbar.jsx';
import Switch from '../../components/Switch/Switch.jsx';

var HeaderStateEnum =  {
  DEFAULT : 0,
  SEARCHING : 1,
  SEARCHRESULTS : 2
}


class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {user:null,
                  events:[],
                  page:1,
                  eventsWithinBudget:false,
                  headerState: HeaderStateEnum.DEFAULT,
                  searchTerm:"",
                  balance: 0.00,
                  city:"No Location Provided",
                  coordinates: null,
                  showLocationPopup: false,
                  pending_ticket_id:null,
                  loading:true}

  }

  componentWillMount() {
    UserServices.currentUser().then((res) => {
      var user = res.body.user;
      var balance = new Number(res.body.balance).toFixed(2);
      if (user) {
        this.setState({user:user, balance: balance,pending_ticket_id:user.pending_ticket_id});
      }
    });
    this.getEvents();
  }

  componentDidMount() {
    if (this && window) {
      this._mounted = true;
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  componentWillUnmount() {
    if(this && window) {
      this._mounted = false;
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  handleScroll(event) {
    if (this._mounted) {
      let scrollTop = event.srcElement.body.scrollTop;
      this.setState({
         scrollTop: scrollTop
      });
    }
  }

  getLocation(callback) {
    var that = this;
    UserServices.currentCity().then((res) => {
      if (res.body && res.body.location) {
        var city = res.body.location;
        var coordinates = res.body.coordinates;
        this.setState({city:city, coordinates:coordinates});
        callback(coordinates);
      } else if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var coordinates = {latitude:latitude, longitude:longitude};
            UserServices.updateCity(coordinates).then((res) => {
              var city = res.body.location;
              that.setState({city:city, coordinates:res.body.coordinates});
            });
            callback(coordinates);
          });
      } else {
          callback();
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
      if (this.state.coordinates) {
        options["coordinates"] = this.state.coordinates;
        callback(options);
      } else {
        this.getLocation(function(coordinates){
          options["coordinates"] = coordinates;
          callback(options);
        });
      }
    } else {
      options["coordinates"] = location;
      callback(options);
    }
  }

  getEvents(withinBudget, searchTerm, location) {
    var self = this;
    this.getEventOptions(function(options) {
      if (options.searchTerm) {
        EventServices.search(options.searchTerm,options).then((res) => {
          self.setState({events:res.body,
                        eventsWithinBudget:options.withinBudget,
                        location:location,
                        searchTerm:searchTerm,
                        page:1,
                        loading:false});
        });
      } else {
        EventServices.events(options).then((res) => {
          self.setState({events:res.body,
                        searchTerm:"",
                        eventsWithinBudget:options.withinBudget,
                        location:location,
                        page:1,
                        loading:false});
      });
    }
  }, withinBudget, searchTerm, location);
}

getMoreEvents() {
  var self = this;
  this.getEventOptions(function(options) {
    var page = self.state.page + 1;
    options.page = page;
    var events = self.state.events;
    if (options.searchTerm) {
      EventServices.search(options.searchTerm,options).then((res) => {
        events = events.concat(res.body);
        self.setState({events:events,
                      searchTerm:options.searchTerm,
                      eventsWithinBudget:options.withinBudget,
                      location:options.coordinates,
                      page:page});
      });
    } else {
      EventServices.events(options).then((res) => {
        events = events.concat(res.body);
        self.setState({events:events,
                       searchTerm:"",
                       eventsWithinBudget:options.withinBudget,
                       location:location,
                       page:page});
    });
  }
}, this.state.eventsWithinBudget, this.state.searchTerm, this.state.coordinates);

}


  searchEvents(searchString) {
    this.setState({headerState:HeaderStateEnum.SEARCHRESULTS});
    this.getEvents(false,searchString);
  }

  didSelectSwitch(side) {
    var withinBudget = side === "RIGHT";
    if (this.state.searchTerm && this.state.searchTerm.length) {
      this.getEvents(withinBudget,this.state.searchTerm);
    } else {
      this.getEvents(withinBudget);
    }
  }

  showTooltip() {
    this.setState({showTooltip:true});
  }

  isSearching() {
    this.setState({headerState:HeaderStateEnum.SEARCHING});
  }

  exitSearch() {
    this.setState({headerState:HeaderStateEnum.DEFAULT});
    this.getEvents();
  }

  searchInputDidChange(event) {
    this.setState({searchTerm:event.target.value})
  }

  searchClicked() {
    var searchString = this.state.searchTerm;
    this.searchEvents(searchString);
  }

  didClickEvent(event) {
    this.props.router.push("/event/"+event.seatgeek_id);
  }

  confirmTicketPurchase(ticket) {
    this.setState({pending_ticket_id:null});
    var balance = this.state.balance;
    TicketServices.confirmPurchase(ticket, balance).then((res) => {
      var user = res.body.user;
      var ticket = res.body.ticket;
      var newBalance = Math.max(0,this.state.balance - ticket.price);
      this.setState({user:user, balance:new Number(newBalance).toFixed(2)});
    });
  }

  denyTicketPurchase(ticket) {
    this.setState({pending_ticket_id:null});
    TicketServices.denyPurchase(ticket).then((res) => {

    });
  }

  showLocationPopup() {
    this.setState({showLocationPopup:true});
  }

  closeLocationPopup() {
    this.setState({showLocationPopup:false});
  }

  didSelectLocation(coordinates, city) {
    this.setState({coordinates:coordinates, city:city, showLocationPopup:false});
    var self = this;
    UserServices.updateCity(coordinates).then((res) => {
      var city = res.body.location;
      self.setState({city:city, coordinates:coordinates});
    });
    this.getEvents(this.state.eventsWithinBudget, this.state.searchTerm,coordinates);
  }

  didEnterAddress(address) {
    this.setState({loading:true,showLocationPopup:false});
    var self = this;
    UserServices.coordinatesFromAddress(address).then((res) => {
      var coordinates = res.body;
      UserServices.updateCity(coordinates).then((res) => {
        console.log(res);
        var city = res.body.location;
        self.getEvents(self.state.withinBudget, self.state.searchTerm, coordinates);
        self.setState({city:city, coordinates:coordinates, loading:false});
      }).catch((error) => {
        console.log(error);
        this.setState({loading:false});
      });
    }).catch((errorResponse) => {
      console.log(errorResponse);
      this.setState({loading:false})
    });

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
    var navbarOpacity = Math.min(1,this.state.scrollTop/450);
    var self = this;
    var eventCards = events.map(function(event,index) {
      return <EventCard key = {index}
                        event = {event}
                        balance = {balance}
                        onClick = {() => {self.didClickEvent(event);}}/>
    });

    var headerTitle = this.state.searchTerm && this.state.searchTerm.length > 0 ?
                      "Search Results for "+this.state.searchTerm : "Find Events";
    return (
      <div className = {styles.EventsPage}>
        {this.state.pending_ticket_id &&
          <PopupConductor type = {"TICKET"}
                          ticket_id = {this.state.pending_ticket_id}
                          confirmTicketPurchase = {this.confirmTicketPurchase.bind(this)}
                          denyTicketPurchase = {this.denyTicketPurchase.bind(this)}
                          />
        }
        {this.state.showLocationPopup &&
          <PopupConductor type = {"LOCATION"}
                          closePressed = {this.closeLocationPopup.bind(this)}
                          didSelectLocation = {this.didSelectLocation.bind(this)}
                          didEnterAddress = {this.didEnterAddress.bind(this)}/>
        }
      <TransparentNavbarAuthenticated   opacity = {navbarOpacity}
                           balance = {this.state.balance}
                           showBalance = {true}
                           currentPage = {"Events"}
                           loading = {this.state.loading}
      />
      <div className = {styles.header}>
        <div className = {styles.headerInfo}>
          <div className = {styles.headerTitleContainer}>
            {this.state.loading &&
              <Loader color={"white"} size="100px" margin="90px"/>
            }
            {!this.state.loading &&
            <div>
              <h1>Discover and Book</h1>
              <div>
                <h1>{"Your Next Adventure in "}
                   <span style = {{textDecoration: "underline", cursor:"pointer"}}
                         onClick = {this.showLocationPopup.bind(this)}>{this.state.city}</span></h1>
                <img className = {styles.dropdownIndicator}
                     onClick = {this.showLocationPopup.bind(this)}
                     src = {dropdownIndicator} />
              </div>
            </div>
            }
          </div>
        </div>
        <img className = {styles.headerImage} src = {headerImage} />

      </div>
      {this.state.headerState === HeaderStateEnum.SEARCHRESULTS &&
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
      {this.state.headerState === HeaderStateEnum.SEARCHING &&
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
      {this.state.headerState === HeaderStateEnum.DEFAULT &&
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
            pageStart={1}
            loadMore={this.getMoreEvents.bind(this)}
            hasMore={this.state.headerState === HeaderStateEnum.DEFAULT}
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

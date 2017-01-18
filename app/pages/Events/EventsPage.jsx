import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./EventsPage.css";

import UserServices from "../../services/UserServices.js";
import EventServices from "../../services/EventServices.js";

import EventCarousel from "../../components/EventCarousel/EventCarousel.jsx";
import EventCard from "../../components/Cards/EventCard/EventCard.jsx";
import NavbarAuthenticated from '../../components/Navbar/NavbarAuthenticated.jsx';


class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user:null,
                  events:[],
                  balance: 0.00,
                  displayIndex: 0,
                  images: ['http://i.imgur.com/kJXRAZH.jpg','http://i.imgur.com/TaA1gj9.png', 'http://i.imgur.com/kJXRAZH.jpg','http://i.imgur.com/TaA1gj9.png'],
                  transitionDirection:"LEFT"}

  }

  componentWillMount() {
    UserServices.currentUser().then((res) => {
      var user = res.body.user;
      var balance = new Number(res.body.balance).toFixed(2);
      if (user) {
        this.setState({user:user, balance: balance});
      }
    });
    EventServices.events().then((res) => {
      var events = res.body;
      console.log("EVENTS");
      console.log(events);
      this.setState({events:events});
    });
  }

  nextPressed() {
    var displayIndex = this.state.displayIndex;
    displayIndex = (displayIndex + 1) % this.state.images.length;
    this.setState({displayIndex:displayIndex, transitionDirection:"RIGHT"});
  }

  previousPressed() {
    var displayIndex = this.state.displayIndex;
    displayIndex = Math.abs((displayIndex - 1) % this.state.images.length);
    this.setState({displayIndex:displayIndex, transitionDirection:"LEFT"});
  }

  didClickThumbnail(index) {
    if (index !== this.state.displayIndex) {
      var transitionDirection = index > this.state.displayIndex ? "RIGHT" : "LEFT";
      this.setState({displayIndex:index, transitionDirection:transitionDirection});
    }

  }

  getFeaturedEvents() {
    if (!this.state.events) {
      return [];
    }
    var events = this.state.events;
    events.sort( function() { return 0.5 - Math.random() } );
    var topEventRange = Math.min(4,events.length);
    return this.state.events.slice(0,topEventRange);
  }

  render() {
    var leftArrow = require("../../assets/LeftArrow.svg");
    var rightArrow = require("../../assets/RightArrow.svg");
    var featuredEvents = this.getFeaturedEvents();
    return (
      <div>
        <NavbarAuthenticated balance = {this.state.balance}
                             showBalance = {true}
                             currentPage = {"Events"}
        />
      {featuredEvents && featuredEvents.length > 0 &&
      <div className = {styles.carouselContainer}>
          <img className = {styles.leftArrow} src = {leftArrow} onClick = {this.previousPressed.bind(this)}/>


        <EventCarousel displayIndex = {this.state.displayIndex}
                       events = {featuredEvents}
                       images = {this.state.images}
                       transitionDirection = {this.state.transitionDirection}
                       didClickThumbnail = {this.didClickThumbnail.bind(this)}/>
        <img className = {styles.rightArrow} src = {rightArrow} onClick = {this.nextPressed.bind(this)}/>

        </div>
      }
      </div>
    );
  }
}

export default withRouter(CSSModules(EventsPage, styles));

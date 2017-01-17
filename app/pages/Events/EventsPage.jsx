import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./EventsPage.css";

import UserServices from "../../services/UserServices.js";

import EventCarousel from "../../components/EventCarousel/EventCarousel.jsx";
import EventCard from "../../components/Cards/EventCard/EventCard.jsx";
import NavbarAuthenticated from '../../components/Navbar/NavbarAuthenticated.jsx';


class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user:null,
                  balance: 0.00,
                  displayIndex: 0,
                  images: ['http://i.imgur.com/kJXRAZH.jpg','http://i.imgur.com/TaA1gj9.png']}

  }

  componentWillMount() {
    UserServices.currentUser().then((res) => {
      var user = res.body.user;
      var balance = new Number(res.body.balance).toFixed(2);
      if (user) {
        this.setState({user:user, balance: balance});
      }
    });
  }

  nextPressed() {
    var displayIndex = this.state.displayIndex;
    displayIndex = (displayIndex + 1) % this.state.images.length;
    this.setState({displayIndex:displayIndex});
  }

  previousPressed() {
    var displayIndex = this.state.displayIndex;
    displayIndex = Math.abs((displayIndex - 1) % this.state.images.length);
    this.setState({displayIndex:displayIndex});
  }

  render() {
    var leftArrow = require("../../assets/LeftArrow.svg");
    var rightArrow = require("../../assets/RightArrow.svg");
    return (
      <div>
        <NavbarAuthenticated balance = {this.state.balance}
                             showBalance = {true}
                             currentPage = {"Events"}
        />
      <div className = {styles.carouselContainer}>
          <img className = {styles.leftArrow} src = {leftArrow} onClick = {this.previousPressed.bind(this)}/>


        <EventCarousel displayIndex = {this.state.displayIndex} images = {this.state.images}/>
        <img className = {styles.rightArrow} src = {rightArrow} onClick = {this.nextPressed.bind(this)}/>

        </div>
      </div>
    );
  }
}

export default withRouter(CSSModules(EventsPage, styles));

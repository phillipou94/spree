import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./EventCard.css";
import LazyLoad from "react-lazy-load";

import time from "../../../utils/time.js";

class EventCard extends Component {
  constructor(props) {
    super(props);
    this.state = {showWishlistButton:false, onWishList:false}
  }

  didClickHeart() {
    this.setState({onWishList: !this.state.onWishList});
  }

  onMouseEnter() {
    this.setState({showWishlistButton:true});
  }

  onMouseLeave() {
    this.setState({showWishlistButton:false})
  }

  render() {
    const { event } = this.props;
    var empty_heart = require("../../../assets/Heart.svg");
    var filled_heart = require("../../../assets/HeartFilled.svg");
    var wishlist_icon = this.state.onWishList ? filled_heart : empty_heart;
    var image = event.featured_image ? event.featured_image : event.performers[0].image;
    var date = time.formattedDateString(new Date(event.date));

    var priceContainerColor = {
      background: event.low_price > Math.round(this.props.balance) ? "#121212" : "#AC9456"
    }

    return (
      <div className = {styles.EventCard}
           onClick = {this.props.onClick}
           onMouseEnter = {this.onMouseEnter.bind(this)}
           onMouseLeave = {this.onMouseLeave.bind(this)}>
          <div></div>
         <LazyLoad height = "200px">
         <div className = {styles.photoContainer}>

          <div className = {styles.info}>
            <p className = {styles.price}>{"$"+event.low_price}</p>
            <p className = {styles.title}>{event.title}</p>
            <div className = {styles.secondaryInfo}>
              <p>{date}</p>
              <p>{event.venue.name}</p>
            </div>

          </div>
           <img src = {image} style = {{width:"100%", height:"100%",  position:"relative"} }/>


           </div>
          </LazyLoad>
        </div>
    )
  }
}

export default withRouter(CSSModules(EventCard, styles));

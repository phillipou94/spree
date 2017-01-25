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

  removeFromWishList(e) {
    this.props.removeFromWishList(this.props.index);
    e.stopPropagation();
  }

  render() {
    const { event } = this.props;
    var empty_heart = require("../../../assets/Heart.svg");
    var filled_heart = require("../../../assets/HeartFilled.svg");
    var shopping_bag = require("../../../assets/ShoppingBag.svg")
    var wishlist_icon = this.state.onWishList ? filled_heart : empty_heart;
    var image = event.featured_image ? event.featured_image : event.performers[0].image;
    var eventDate = event.date;
    var date = time.formattedDateString(new Date(eventDate));

    var buyable = event.low_price < Math.round(this.props.balance);

    return (
      <div className = {styles.EventCard}
           onClick = {this.props.onClick}
           onMouseEnter = {this.onMouseEnter.bind(this)}
           onMouseLeave = {this.onMouseLeave.bind(this)}>
          <div></div>
         <div className = {styles.photoContainer}>
          <div className = {styles.info}>
            {this.props.removeFromWishList &&
              <p className = {styles.deleteButton} onClick = {this.removeFromWishList.bind(this)}>x</p>
            }
            <p className = {styles.price}>{"$"+event.low_price}</p>
            {buyable &&
              <img src = {shopping_bag} className = {styles.buyableIndicator}/>
            }
            <p className = {styles.title}>{event.title}</p>
            <div className = {styles.secondaryInfo}>
              <p>{date}</p>
              <p>{event.venue.name}</p>
            </div>

          </div>
           <img src = {image} style = {{width:"100%", height:"100%",  position:"relative"} }/>


           </div>
        </div>
    )
  }
}

export default withRouter(CSSModules(EventCard, styles));

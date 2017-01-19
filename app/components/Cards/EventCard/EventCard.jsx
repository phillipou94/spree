import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./EventCard.css";

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

    var backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3)),url("+image+")";
    var photoContainerStyle = {
      "width":"90%",
      "maxHeight":"175px",
      "marginLeft":"5%",
      "marginTop":'10px',
      "height": "175px",
      "background":"red",
      "backgroundSize": "100% 100%",
      "backgroundRepeat": "no-repeat",
      "backgroundImage":backgroundImage
    };

    var priceContainerColor = {
      background: event.low_price > Math.round(this.props.balance) ? "#435061" : "#33AE8B"
    }

    return (
      <div className = {styles.EventCard}
           onClick = {this.props.onClick}
           onMouseEnter = {this.onMouseEnter.bind(this)}
           onMouseLeave = {this.onMouseLeave.bind(this)}>

        <div style = {photoContainerStyle}>
          {this.state.showWishlistButton &&
            <img src = {wishlist_icon} className = {styles.wishlistIcon} onClick = {this.didClickHeart.bind(this)}/>
          }
        </div>

        <div className = {styles.secondaryInfo}>
          <div className = {styles.priceContainer} style = {priceContainerColor}>
            <p className = {styles.price}>{"$"+event.low_price}</p>
          </div>
          <p className = {styles.title}>{event.title}</p>
          <div className = {styles.venueDescription}>
            <p>{date}</p>
            <p>{event.venue.name}</p>
            <p>{event.venue.display_location}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModules(EventCard, styles));

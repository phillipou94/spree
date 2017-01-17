import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./EventCard.css";

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
    var image_url = "https://chairnerd.global.ssl.fastly.net/images/performers-landscape/zac-brown-band-16c33d/2047/huge.jpg";
    var backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0, 0.3)),url("+image_url+")";
    var photoContainerStyle = {
      "width":"90%",
      "maxHeight":"175px",
      "marginLeft":"5%",
      "height": "175px",
      "background":"red",
      "backgroundSize": "100% 100%",
      "backgroundRepeat": "no-repeat",
      "backgroundImage":backgroundImage
    };
    return (
      <div className = {styles.EventCard}
           onClick = {this.props.onClick}
           onMouseEnter = {this.onMouseEnter.bind(this)}
           onMouseLeave = {this.onMouseLeave.bind(this)}>
        <p className = {styles.title}>One Direction</p>
        <div style = {photoContainerStyle}>
          {this.state.showWishlistButton &&
            <img src = {wishlist_icon} className = {styles.wishlistIcon} onClick = {this.didClickHeart.bind(this)}/>
          }
        </div>
        <div className = {styles.secondaryInfo}>
          <div className = {styles.priceContainer}>
            <p className = {styles.price}>$1690</p>
          </div>
          <div className = {styles.venueDescription}>
            <p>July 6, 2017</p>
            <p>Staples Center</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModules(EventCard, styles));

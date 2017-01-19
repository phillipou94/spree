import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import CrossFadeAnimation from "./CrossFadeAnimation.css";
import styles from "./EventCarousel.css";
import time from "../../utils/time.js";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from "../Button/Button.jsx";

class BackgroundImage extends React.Component {
  render() {
    const style = {
      marginTop: "25px",
      marginLeft:"20px",
      width: '42%',
      height: '300px',
      position:"absolute"
    };
   return <img src={this.props.image} style={style} />;
  }
}

class EventThumbnail extends React.Component {
  didClick() {
    this.props.didClickThumbnail(this.props.index);
  }
  render() {
    const style = {
      width: '100px',
      height: '100px',
      marginRight:"10px"
    };
    if (this.props.displayIndex === this.props.index) {
      style["border"] = "2px solid #33AE8B";
    }
    var event = this.props.event;
    var image = event.featured_image ? event.featured_image : event.performers[0].image;
    return <img src={image} style={style} onClick = {this.didClick.bind(this)}/>;
  }
}

class EventCarousel extends Component {
    render() {
      var events = this.props.events;
      var event = events[this.props.displayIndex];
      var image = event.featured_image ? event.featured_image : event.performers[0].image;
      var direction = this.props.transitionDirection;
      var that = this;
      var date = time.formattedDateString(new Date(event.date));
      var venueName = event.venue.name;
      var venueAddress = event.venue.display_location;
      var secondaryInfoText = date + " | "+venueName+" - "+venueAddress;
      var price = event.low_price;

        return (
          <div className = {styles.EventCarousel}>
             <ReactCSSTransitionGroup
                transitionName={CrossFadeAnimation}
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}>

                <BackgroundImage image={image} key={image} />

              </ReactCSSTransitionGroup>
              <div className = {styles.info}>
                <div className = {styles.eventInfo}>
                  <h1 className = {styles.eventTitle}>{event.title}</h1>
                  <p>{secondaryInfoText}</p>

                </div>
                <Button title = {"Buy Now   $"+price} className = {styles.buyButton}/>
                <div className = {styles.thumbnails}>
                  {events.map(function(event, index) {
                    return <EventThumbnail event = {event}
                                           displayIndex = {that.props.displayIndex}
                                           index = {index}
                                           didClickThumbnail = {that.props.didClickThumbnail}/>
                  })}
                </div>
              </div>

          </div>
        )
    }
}

export default withRouter(CSSModules(EventCarousel, styles));

import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import CarouselAnimation from "./CarouselAnimation.css";
import CarouselAnimation2 from "./CarouselAnimation2.css";
import styles from "./EventCarousel.css";
import time from "../../utils/time.js";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Button from "../Button/Button.jsx";

class BackgroundImage extends React.Component {
  render() {
    const style = {
      position: 'fixed',
      marginTop: "25px",
      marginLeft:"40px",
      width: '550px',
      height: '300px'
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
      width: '80px',
      height: '80px',
      marginRight:"20px"
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

      var animation = direction === "RIGHT" ? CarouselAnimation : CarouselAnimation2;
      var that = this;
      var date = time.formattedDateString(new Date(event.date));
      var venueName = event.venue.name;
      var venueAddress = event.venue.display_location;
      var secondaryInfoText = date + " | "+venueName+" - "+venueAddress;
      var price = event.low_price;

        return (
          <div className = {styles.EventCarousel}>
            <div className = {styles.leftFrame} style = {{width:"100px"}}></div>
             <ReactCSSTransitionGroup
                transitionName={animation}
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}>
              <BackgroundImage image={image} key={image} />
              </ReactCSSTransitionGroup>
              <div className = {styles.rightFrame} style = {{width:"800px", marginLeft:"650px"}}>
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

import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import CarouselAnimation from "./CarouselAnimation.css";
import CarouselAnimation2 from "./CarouselAnimation2.css";
import styles from "./EventCarousel.css";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class BackgroundImage extends React.Component {
  render() {
    const style = {
      position: 'fixed',
      marginTop: "40px",
      marginLeft:"200px",
      width: '400px',
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
   return <img src={this.props.image} style={style} onClick = {this.didClick.bind(this)}/>;
  }
}

class EventCarousel extends Component {
    render() {
      var images = this.props.images;
      var image = images[this.props.displayIndex];
      var direction = this.props.transitionDirection;
      var animation = direction === "RIGHT" ? CarouselAnimation : CarouselAnimation2;
      var that = this;
        return (
          <div>
            <div className = {styles.leftFrame} style = {{width:"253px"}}></div>
             <ReactCSSTransitionGroup
                transitionName={animation}
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}>
              <BackgroundImage image={image} key={image} />
              </ReactCSSTransitionGroup>
              <div className = {styles.rightFrame} style = {{width:"600px", marginLeft:"653px"}}>
                <div className = {styles.thumbnails}>
                  {images.map(function(image, index) {
                    return <EventThumbnail image = {image}
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

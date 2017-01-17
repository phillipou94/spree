import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import CarouselAnimation from "./CarouselAnimation.css";
import styles from "./EventCarousel.css";

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class BackgroundImage extends React.Component {
  render() {
    const style = {
      position: 'fixed',
      marginTop: "40px",
      marginLeft:"225px",
      width: '30%'
    };

   return <img src={this.props.image} style={style} />;
  }
}

class EventCarousel extends Component {
    render() {
      var image = this.props.images[this.props.displayIndex];
        return (
          <div>
            <div className = {styles.leftFrame}></div>
             <ReactCSSTransitionGroup
                transitionName={CarouselAnimation}
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}
                style = {{width:"30%"}}>
              <BackgroundImage image={image} key={image} />
              </ReactCSSTransitionGroup>
          </div>
        )
    }
}

export default withRouter(CSSModules(EventCarousel, styles));

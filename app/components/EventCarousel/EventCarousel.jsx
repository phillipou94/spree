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
      marginLeft:"225px",
      width: '400px',
      height: '300px'
    };

   return <img src={this.props.image} style={style} />;
  }
}

class EventCarousel extends Component {
    render() {
      var image = this.props.images[this.props.displayIndex];
      var direction = this.props.transitionDirection;
      var animation = direction === "RIGHT" ? CarouselAnimation : CarouselAnimation2;
        return (
          <div>
            <div className = {styles.leftFrame} style = {{width:"278px"}}></div>
             <ReactCSSTransitionGroup
                transitionName={animation}
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}>
              <BackgroundImage image={image} key={image} />
              </ReactCSSTransitionGroup>
              <div className = {styles.rightFrame} style = {{width:"400px",marginLeft:"678px"}}></div>
          </div>
        )
    }
}

export default withRouter(CSSModules(EventCarousel, styles));

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
      backgroundColor: '#FFFEF4',
      width: '100%'
    };

   return <img src={this.props.image} style={style} />;
  }
}

class EventCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {displayIndex:0, images:['http://i.imgur.com/kJXRAZH.jpg','http://i.imgur.com/TaA1gj9.png']};
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
      var image = this.state.images[this.state.displayIndex];
        return (
          <div>
            <button onClick = {this.nextPressed.bind(this)}>Next</button>
            <button onClick = {this.previousPressed.bind(this)}>Previous</button>
             <ReactCSSTransitionGroup
                transitionName={CarouselAnimation}
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}
              >
                <BackgroundImage image={image} key={image} />
              </ReactCSSTransitionGroup>
      </div>
        )
    }
}

export default withRouter(CSSModules(EventCarousel, styles));

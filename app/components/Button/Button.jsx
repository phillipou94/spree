import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Button.css"

class Button extends Component {

  render() {
    return (
      <button className = {styles.Button}>{this.props.title}</button>
    )
  }
}

export default withRouter(CSSModules(Button, styles));

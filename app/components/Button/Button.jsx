import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Button.css";

var Loader = require('halogen/ClipLoader');

class Button extends Component {

  render() {
    var loadingColor = this.props.loadingColor || "#121212";
    return (
      <button className = {styles.Button}
              onClick={this.props.onClick}>
              {this.props.loading &&
                <Loader color={loadingColor} size="16px" margin="4px"/>
              }
              {!this.props.loading &&
                this.props.title
              }

      </button>
    )
  }
}

export default withRouter(CSSModules(Button, styles));

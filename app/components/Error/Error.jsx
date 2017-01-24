import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Error.css";

class ErrorMessage extends Component {
  render() {
    console.log(this.props);
    var errorMessage = this.props.message || "Error";
    return (
      <div className = {styles.Error}>
        <p>{errorMessage}</p>
      </div>
    )
  }
}

export default withRouter(CSSModules(ErrorMessage, styles));

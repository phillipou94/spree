import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Switch.css";

class Switch extends Component {
  constructor(props) {
    super(props);
    this.state = {side:"LEFT"}
  }

  selectedLeft() {
    if (this.state.side === "RIGHT") {
      this.setState({side:"LEFT"});
      this.props.didSelectSwitch("LEFT");
    }
  }

  selectedRight() {
    if (this.state.side === "LEFT") {
      this.setState({side:"RIGHT"});
      this.props.didSelectSwitch("RIGHT");
    }

  }

  render() {
    var leftStyle = {color:this.state.side === "LEFT" ? "#435061": "#9199A3"}
    var rightStyle = {color:this.state.side === "RIGHT" ? "#435061": "#9199A3"}
    return (
      <div className = {styles.switch}>
        <p style = {leftStyle} onClick = {this.selectedLeft.bind(this)}>Most Popular</p>
        <p>{" | "}</p>
        <p style = {rightStyle} onClick = {this.selectedRight.bind(this)}>Within Budget</p>
      </div>
    )
  }
}

export default withRouter(CSSModules(Switch, styles));

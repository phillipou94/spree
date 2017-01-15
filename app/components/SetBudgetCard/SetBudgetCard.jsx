import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./SetBudgetCard.css";

class SetBudgetCard extends Component {
  render() {
    var icon = require("../../assets/Coins.svg");
    var arrow = require("../../assets/Arrow.svg");
    return (
      <div className = {styles.SetBudgetCard} onClick = {this.props.onClick}>
        <div className = {styles.iconContainer}>
          <img src = {icon} className = {styles.icon}/>
        </div>
        <h1 className = {styles.title}>Set Weekly Budget</h1>
        <img src = {arrow} className = {styles.arrow}/>
      </div>
    )
  }
}

export default withRouter(CSSModules(SetBudgetCard, styles));

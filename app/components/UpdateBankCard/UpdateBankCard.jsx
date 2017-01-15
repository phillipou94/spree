import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./UpdateBankCard.css";

class UpdateBankCard extends Component {
  render() {
    var icon = require("../../assets/PiggyBankDollar.svg");
    var arrow = require("../../assets/Arrow.svg");
    return (
      <div className = {styles.UpdateBankCard} onClick = {this.props.onClick}>
        <div className = {styles.iconContainer}>
          <img src = {icon} className = {styles.icon}/>
        </div>
        <h1 className = {styles.title}>Update Bank Information</h1>
        <img src = {arrow} className = {styles.arrow}/>
      </div>
    )
  }
}

export default withRouter(CSSModules(UpdateBankCard, styles));

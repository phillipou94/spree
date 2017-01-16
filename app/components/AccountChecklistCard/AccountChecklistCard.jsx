import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./AccountChecklistCard.css";

class AccountChecklistCard extends Component {
  render() {
    var completedIcon = require("../../assets/CompletedOval.svg");
    var unfinishedIcon = require("../../assets/EmptyOval.svg");
    return (
      <div className = {styles.AccountChecklistCard}>
        <div className = {styles.item}>
          <img src = {completedIcon} />
          <p>Signed Up</p>
        </div>
        <div className = {styles.item}>
          <img src = {unfinishedIcon} />
          <p>Set Up Bank Information</p>
        </div>
        <div className = {styles.item}>
          <img src = {unfinishedIcon} />
          <p>Set Up Weekly Budget</p>
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModules(AccountChecklistCard, styles));

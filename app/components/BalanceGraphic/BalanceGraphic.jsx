import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BalanceGraphic.css";

import time from "../../utils/time.js";

class BalanceGraphic extends Component {
  render() {
    var budget = this.props.budget;
    var spent = this.props.spentThisWeek;
    var left = Math.max(0, budget - spent);
    var leftInBudgetRounded = Math.ceil(left * 100) / 100;
    var daysLeft = time.daysLeftInWeek();

    return (
      <div className = {styles.BalanceGraphic}>
        <div className = {styles.WeeklyBalanceInfo}>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Weekly Budget</p>
            <p className = {styles.info}>{"$ "+budget}</p>
          </div>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Days Left this Week</p>
            <p className = {styles.info}>{daysLeft}</p>
          </div>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Spent this Week</p>
            <p className = {styles.info}>{"$ "+spent}</p>
          </div>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Left in Budget</p>
            <p className = {styles.info}>{"$ "+leftInBudgetRounded}</p>
          </div>
        </div>
        <div className = {styles.graphicContainer}>
          <p className = {styles.graphicTitle}>Week of Aug 12 - Aug 19</p>
          <div className = {styles.graphic}>
            <div>
              <p className = {styles.amount}>{"$ "+spent}</p>
              <div style = {{width:"50%"}} className = {styles.amountBar}></div>
            </div>
            <div>
              <div style = {{width:"100%"}} className = {styles.totalBar}></div>
              <p className = {styles.total}>{"$ "+budget}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModules(BalanceGraphic, styles));

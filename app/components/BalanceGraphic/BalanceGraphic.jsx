import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BalanceGraphic.css";

import time from "../../utils/time.js";

class BalanceGraphic extends Component {
  calculateSpendingPercentages(spent, budget) {
    var percentage = spent < budget ? spent * 100 / budget : budget * 100 / spent;
    return spent < budget ? {"spent" : percentage, "budget" : 100} : {"spent" : 100, "budget" : percentage};
  }
  render() {
    var budget = this.props.budget;
    var spent = this.props.spentThisWeek;
    var left = Math.max(0, budget - spent);
    var leftInBudgetRounded = Math.ceil(left * 100) / 100;
    var daysLeft = time.daysLeftInWeek();

    var spentPercentage = this.calculateSpendingPercentages(spent,budget).spent;
    var budgetPercentage = this.calculateSpendingPercentages(spent,budget).budget;

    var amountBarStyle = {width:spentPercentage+"%"};
    var budgetBarStyle = {width:budgetPercentage+"%"};


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
              <p className = {styles.amount}>{"Spent $ "+spent}</p>
              <div style = {amountBarStyle} className = {styles.amountBar}></div>
            </div>
            <div>
              <div style = {budgetBarStyle} className = {styles.totalBar}></div>
              <p className = {styles.total}>{"Budgetted $ "+budget}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModules(BalanceGraphic, styles));

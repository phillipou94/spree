import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BalanceGraphic.css";

import time from "../../utils/time.js";

class BalanceGraphic extends Component {

  calculateSpendingPercentages(spent, budget) {
    var spentInt = Math.round(spent);
    var budgetInt = Math.round(budget);
    var percentage = spentInt < budgetInt ? spentInt * 100 / budgetInt : budgetInt *100 / spentInt;
    return spentInt < budgetInt ? {"spent" : percentage, "budget" : 100} : {"spent" : 100, "budget" : percentage};
  }

  render() {
    var budget = new Number(this.props.budget).toFixed(2);
    var spent = new Number(this.props.spentThisWeek).toFixed(2);
    var left = Math.max(0, budget - spent);
    var leftInBudgetRounded = new Number(left).toFixed(2);
    var daysLeft = time.daysLeftInWeek();

    var spentPercentage = this.calculateSpendingPercentages(spent,budget).spent;
    var budgetPercentage = this.calculateSpendingPercentages(spent,budget).budget;

    var amountBarStyle = {width:spentPercentage+"%"};
    var budgetBarStyle = {width:budgetPercentage+"%"};

    var now = new Date();
    var end_of_week = time.formattedMonthDayString(time.getNearestMondayAfterDate(now))
    var start_of_week = time.formattedMonthDayString(time.getNearestMondayBeforeDate(now));
    var dateString = "Week of "+start_of_week+" - "+ end_of_week;

    return (
      <div className = {styles.BalanceGraphic}>
        <div className = {styles.WeeklyBalanceInfo}>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Spent this Week</p>
            <p className = {styles.info} style = {{color:"#AC9456"}}>{"$ "+spent}</p>
          </div>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Left in Budget</p>
            <p className = {styles.info} style = {{color:"#AC9456"}}>{"$ "+leftInBudgetRounded}</p>
          </div>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Weekly Budget</p>
            <p className = {styles.info}>{"$ "+budget}</p>
          </div>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Days Left this Week</p>
            <p className = {styles.info}>{daysLeft}</p>
          </div>
        </div>
        <div className = {styles.graphicContainer}>
          <p className = {styles.graphicTitle}>{dateString}</p>
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

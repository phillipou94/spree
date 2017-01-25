import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./AccountItem.css";
import time from "../../utils/time.js";

class WeekItem extends Component {

  render() {
    var week = this.props.week;
    var icon = require("../../assets/Calendar.svg");
    var budget = week.budget ? week.budget : 0;
    var amountBelowBudget = new Number(Math.max(0, budget - week.spent)).toFixed(2);

    var endDate = new Date(week.end_date);
    var end_of_week = time.formattedMonthDayString(time.getNearestMondayAfterDate(endDate));

    var startDate = new Date(week.start_date);
    var start_of_week = time.formattedMonthDayString(time.getNearestMondayBeforeDate(startDate));
    var dateString = start_of_week+" - "+ end_of_week;
    return (
      <div className = {styles.AccountItem}>
        <div className = {styles.iconContainer}>
          <img src = {icon} className = {styles.icon}/>
        </div>
        <div className = {styles.info}>
          <p className = {styles.title}>{dateString}</p>
          <p className = {styles.subtitle}>{"Week "+this.props.weekNumber}</p>
        </div>

        <p className = {styles.amount}>{"+ $ "+amountBelowBudget}</p>

      </div>
    )
  }
}

export default withRouter(CSSModules(WeekItem, styles));

import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./AccountItem.css";

class WeekItem extends Component {

  render() {
    var week = this.props.week;
    var icon = require("../../assets/Calendar.svg");
    var budget = this.props.budget ? this.props.budget : 0;
    var amountBelowBudget = Math.max(0, budget - week.spent);
    return (
      <div className = {styles.AccountItem}>
        <div className = {styles.iconContainer}>
          <img src = {icon} className = {styles.icon}/>
        </div>
        <div className = {styles.info}>
          <p className = {styles.title}>Aug 4 - Aug 11</p>
          <p className = {styles.subtitle}>{"Week "+this.props.weekNumber}</p>
        </div>

        <p className = {styles.amount}>{"+ $ "+amountBelowBudget}</p>

      </div>
    )
  }
}

export default withRouter(CSSModules(WeekItem, styles));

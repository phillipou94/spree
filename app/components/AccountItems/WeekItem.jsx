import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./AccountItem.css";

class WeekItem extends Component {

  render() {
    var icon = require("../../assets/Calendar.svg");
    return (
      <div className = {styles.AccountItem}>
        <div className = {styles.iconContainer}>
          <img src = {icon} className = {styles.icon}/>
        </div>
        <div className = {styles.info}>
          <p className = {styles.title}>Aug 4 - Aug 11</p>
          <p className = {styles.subtitle}>Week 1</p>
        </div>

        <p className = {styles.amount}>{"$12.51"}</p>

      </div>
    )
  }
}

export default withRouter(CSSModules(WeekItem, styles));

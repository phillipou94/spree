import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./AccountItem.css";
import time from "../../utils/time.js";

class WeekItem extends Component {

  render() {
    var icon = require("../../assets/Ticket.svg");
    var ticket = this.props.ticket;
    var price = new Number(ticket.price).toFixed(2);
    var date = time.formattedDateString(new Date(ticket.updatedAt));
    return (
      <div className = {styles.AccountItem}>
        <div className = {styles.iconContainer}>
          <img src = {icon} className = {styles.icon}/>
        </div>
        <div className = {styles.info}>
          <p className = {styles.title}>{ticket.title}</p>
          <p className = {styles.subtitle}>{date}</p>
        </div>

        <p className = {styles.amount}>{"$"+price}</p>

      </div>
    )
  }
}

export default withRouter(CSSModules(WeekItem, styles));

import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./AccountItem.css";

import time from "../../utils/time.js";

class TransactionItem extends Component {

  getIconForTransaction(transaction) {
    var category_id = "";
    if (transaction.category_id) {
      category_id = transaction.category_id.substring(0,2);
    }

    switch (category_id) {
        case "12":
            return require("../../assets/CommunityIcon.svg");
        case "13":
            return require("../../assets/FoodAndDrinkIcon.svg");
        case "14":
            return require("../../assets/HealthcareIcon.svg");
        case "17":
            return require("../../assets/RecreationIcon.svg");
        case "18":
            return require("../../assets/ServiceIcon.svg");
        case "19":
            return require("../../assets/ShopsIcon.svg");
        case "20":
            return require("../../assets/TaxIcon.svg");
        case "21":
            return require("../../assets/TransfersIcon.svg");
        case "22":
            return require("../../assets/TravelIcon.svg");
        default:
            return require("../../assets/PiggyBank.svg");
    }
  }


  render() {
    var transaction = this.props.transaction;
    var icon = this.getIconForTransaction(transaction);
    var amount = new Number(transaction.amount).toFixed(2);
    var date = time.formattedDateString(new Date(transaction.date));
    return (
      <div className = {styles.AccountItem}>
        <div className = {styles.iconContainer}>
          <img src = {icon} className = {styles.icon}/>
        </div>
        <div className = {styles.info}>
          <p className = {styles.title}>{transaction.name}</p>
          <p className = {styles.subtitle}>{date}</p>
        </div>

        <p className = {styles.amount}>{"$ "+amount}</p>

      </div>
    )
  }
}

export default withRouter(CSSModules(TransactionItem, styles));

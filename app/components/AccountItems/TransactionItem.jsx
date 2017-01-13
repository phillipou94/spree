import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./AccountItem.css";

class TransactionItem extends Component {

  getIconForTransactionType(type) {
    return require("../../assets/ShoppingCart.svg")
  }

  render() {
    var icon = this.getIconForTransactionType("exchange");
    return (
      <div className = {styles.AccountItem}>
        <div className = {styles.iconContainer}>
          <img src = {icon} className = {styles.icon}/>
        </div>
        <div className = {styles.info}>
          <p className = {styles.title}>Golden Deli</p>
          <p className = {styles.subtitle}>Sept 9, 2017</p>
        </div>

        <p className = {styles.amount}>{"$12.51"}</p>

      </div>
    )
  }
}

export default withRouter(CSSModules(TransactionItem, styles));

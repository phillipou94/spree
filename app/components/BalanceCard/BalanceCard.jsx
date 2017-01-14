import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BalanceCard.css";

class BalanceCard extends Component {
  render() {
    return (
      <div className = {styles.BalanceCard}>
        <p className = {styles.title}>Balance:</p>
        <div>
        <p className = {styles.amount}>$10.01</p>
        <p className = {styles.weeklyAmount}>+(4.91)</p>
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModules(BalanceCard, styles));

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BalanceCard.css";

class BalanceCard extends Component {
  render() {
    var budget = new Number(this.props.budget).toFixed(2);
    var balance = new Number(this.props.balance).toFixed(2);
    var spent = new Number(this.props.spentThisWeek).toFixed(2);
    var potentialGain = new Number(Math.max(0, budget - spent)).toFixed(2);
    return (
      <div className = {styles.BalanceCard}>
        <p className = {styles.title}>Balance:</p>
        <div>
        <p className = {styles.amount}>{"$ "+balance}</p>
        {potentialGain > 0 &&
          <p className = {styles.weeklyAmount}>{"+($ "+potentialGain+")"}</p>
        }
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModules(BalanceCard, styles));

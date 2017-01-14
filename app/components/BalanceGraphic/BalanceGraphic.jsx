import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BalanceGraphic.css";

class BalanceGraphic extends Component {
  render() {
    return (
      <div className = {styles.BalanceGraphic}>
        <div className = {styles.WeeklyBalanceInfo}>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Weekly Budget</p>
            <p className = {styles.info}>$ 300</p>
          </div>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Days Left this Week</p>
            <p className = {styles.info}>1</p>
          </div>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Spent this Week</p>
            <p className = {styles.info}>$ 285.94</p>
          </div>
          <div className = {styles.infoContainer}>
            <p className = {styles.title}>Left in Budget</p>
            <p className = {styles.info}>$ 14.06</p>
          </div>
        </div>
        <div className = {styles.graphicContainer}>
          <p className = {styles.graphicTitle}>Week of Aug 12 - Aug 19</p>
          <div className = {styles.graphic}>
            <div>
              <p className = {styles.amount}>$ 285.94</p>
              <div style = {{width:"50%"}} className = {styles.amountBar}></div>
            </div>
            <div>
              <div style = {{width:"100%"}} className = {styles.totalBar}></div>
              <p className = {styles.total}>$ 300</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModules(BalanceGraphic, styles));

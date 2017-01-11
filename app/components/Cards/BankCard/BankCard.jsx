import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BankCard.css";

class BankCard extends Component {

  render() {
    const { bank } = this.props;
    return (
      <div className = {styles.BankCard} onClick = {this.props.onClick}>
        <img src = {bank.logo_url} className = {styles.logo}/>
        <p className = {styles.name}>{bank.name}</p>
      </div>
    )
  }
}

export default withRouter(CSSModules(BankCard, styles));

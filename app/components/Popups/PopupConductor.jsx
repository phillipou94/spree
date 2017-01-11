import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./PopupConductor.css";

import BankLoginPopup from "./BankLoginPopup/BankLoginPopup.jsx"
import BankQuestionPopup from "./BankQuestionPopup/BankQuestionPopup.jsx"

class PopupConductor extends Component {

  getPopup(type) {
    switch (type) {
       case 'BANK_LOGIN':
         return <BankLoginPopup {...this.props}/>;
       case 'BANK_QUESTION':
         return <BankQuestionPopup {...this.props}/>;
       default:
         return null;
     }
  }

  render() {
    return (
      <div className = {styles.background}>
        <div className = {styles.popup}>
          {this.getPopup(this.props.type)}
        </div>

      </div>
    );
  }
};

export default withRouter(CSSModules(PopupConductor, styles));

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./SetBudgetPopup.css";
import CurrencyInput from 'react-currency-input';

import Button from "../../Button/Button.jsx";

class SetBudgetPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount:"$ 0.00"
    }
  }

  updateInputValue(value) {
    var amount = value;
    amount = amount.replace("$", "");
    amount = amount.replace(" ","");
    console.log(amount);
    this.setState({amount:amount});
  }

  submitClicked() {
    this.props.budgetSubmitted(this.state.amount);
  }



  render() {
    return (
      <div className = {styles.SetBudgetPopup}>

        <h1 className = {styles.title}>Weekly Budget</h1>
        <p>{"What would you like your weekly budget to be?"}</p>
        <CurrencyInput  className = {styles.input}
                        prefix="$ "
                        onChange = {this.updateInputValue.bind(this)}
                        value = {this.state.amount}/>

        <div className = {styles.exitButton} onClick = {this.props.closePressed}>cancel</div>
        <Button title = {"Set Budget"} onClick = {this.submitClicked.bind(this)}/>
      </div>
    );
  }
};

export default withRouter(CSSModules(SetBudgetPopup, styles));

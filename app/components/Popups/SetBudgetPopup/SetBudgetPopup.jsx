import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./SetBudgetPopup.css";
import CurrencyInput from 'react-currency-input';

import Button from "../../Button/Button.jsx";

class SetBudgetPopup extends Component {
  constructor(props) {
    super(props);
    var budget = props.currentBudget;
    var hasBudget = budget && budget > 0;
    var recommendedBudget = "$ "+props.recommendedBudget;
    var amount = hasBudget ? "$ "+new Number(budget).toFixed(2) : recommendedBudget;
    this.state = {
      amount:amount
    }
  }

  updateInputValue(value) {
    var amount = value;
    amount = amount.replace("$", "");
    amount = amount.replace(" ","");
    this.setState({amount:amount});
  }

  submitClicked() {
    var amount = this.state.amount.replace("$", "");
    amount = amount.replace(" ","");
    this.props.budgetSubmitted(amount);
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

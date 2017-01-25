import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BankQuestionPopup.css";

import Button from "../../Button/Button.jsx";

class BankQuestionPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer:""
    }
  }

  updateInputValue(event) {
    var answer = event.target.value;
    this.setState({answer:answer});
  }

  submitClicked() {
    this.props.answerSubmitted(this.state.answer, this.props.bank);
  }



  render() {
    const bank = this.props.bank;
    const errorMessage = this.props.errorMessage;
    return (
      <div className = {styles.BankQuestionPopup}>
        {errorMessage &&
          <div className = {styles.errorMessage}>
            <p className = {styles.errorMessageText}>{errorMessage}</p>
          </div>
        }
        <div className = {styles.exitButton} onClick = {this.props.closePressed}>x</div>
        <img src = {bank.logo_url} className = {styles.logo}/>
        <h1 className = {styles.title}>Security Question</h1>
        <p className = {styles.question}>{this.props.question}</p>
        <input className = {styles.input}
                 name='answer'
                 placeholder={"Answer"}
                 onChange={this.updateInputValue.bind(this)}
        />
        <Button title = {"Submit"}
                onClick = {this.submitClicked.bind(this)}
                loading = {this.props.loading}
                loadingColor = {"white"}/>
      </div>
    );
  }
};

export default withRouter(CSSModules(BankQuestionPopup, styles));

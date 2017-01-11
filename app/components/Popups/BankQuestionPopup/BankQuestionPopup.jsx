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

  render() {
    return (
      <div className = {styles.BankQuestionPopup}>
        <div className = {styles.exitButton} onClick = {this.props.closePressed}>x</div>
        <h1 className = {styles.title}>Security Question</h1>
        <p>{this.props.question}</p>
        <input className = {styles.input}
                 name='answer'
                 placeholder={"Answer"}
                 onChange={this.updateInputValue.bind(this)}
        />
        <Button title = {"Submit"}/>
      </div>
    );
  }
};

export default withRouter(CSSModules(BankQuestionPopup, styles));

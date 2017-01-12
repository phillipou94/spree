import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BankLoginPopup.css";

import Button from "../../Button/Button.jsx";

class BankLoginPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username:"",
      password:""
    }
  }

  updateInputValue(event) {
    var field = event.target.name;
    var value = event.target.value;
    this.setState((prevState) => {
      prevState[field] = value;
      return prevState;
    });
  }

  submitClicked() {
    const username = this.state.username;
    const password = this.state.password;
    var authInfo = {
                    username:username,
                    password: password,
                    type:this.props.bank.type,
                    bank_name:this.props.bank.name,
                    bank_id:this.props.bank._id
                  };
    this.props.bankLoginSubmitted(authInfo);
  }

  render() {
    const bank = this.props.bank;
    return (
      <div className = {styles.BankLoginPopup}>
        <div className = {styles.exitButton} onClick = {this.props.closePressed}>x</div>
        <h1 className = {styles.title}>{bank.name}</h1>
        <img src = {bank.logo_url} className = {styles.logo}/>
        <input className = {styles.input}
                 name='username'
                 placeholder={bank.credentials.username}
                 onChange={this.updateInputValue.bind(this)}
        />
        <input className = {styles.input}
                 name='password'
                 placeholder={bank.credentials.password}
                 type='password'
                 onChange={this.updateInputValue.bind(this)}
        />
        <Button title = {"Submit"} onClick = {this.submitClicked.bind(this)}/>
      </div>
    );
  }
};

export default withRouter(CSSModules(BankLoginPopup, styles));
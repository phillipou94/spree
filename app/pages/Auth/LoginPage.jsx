import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Auth.css";

import Button from "../../components/Button/Button.jsx";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email:"",
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

  login() {
    console.log(this.state);
  }

  render() {
    const logo = require("../../assets/SpreeLogo.svg");
    return (
      <div>
        <div className = {styles.authContainer}>
          <a href ="/"><div className = {styles.titleContainer}>
            <img src = {logo} className = {styles.logo} />
            <h1 className = {styles.header}>Spree</h1>
          </div>
          </a>
          <div className = {styles.inputs}>
            <input className = {styles.input}
                   name='email'
                   placeholder='Email'
                   onChange={this.updateInputValue.bind(this)}
            />
            <input className = {styles.input}
                   name='password'
                   placeholder='Password'
                   type='password'
                   onChange={this.updateInputValue.bind(this)}
            />
            <Button title = {"Sign In"} onClick = {this.login.bind(this)}/>
            <p>Don't have an account? <a href = "/signup"> Sign Up </a> </p>
          </div>
        </div>
      </div>
    );
  }

}

export default withRouter(CSSModules(LoginPage, styles));

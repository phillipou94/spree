import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Auth.css";

import Button from "../../components/Button/Button.jsx";

class SignpPage extends React.Component {
  constructor(props) {
    super(props);
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
            <input className = {styles.input} name='name' placeholder='Name'/>
            <input className = {styles.input} name='email' placeholder='Email'/>
            <input className = {styles.input} name='password' placeholder='Password' type='password'/>
            <Button title = {"Create an Account"}/>
            <p>Already have an account? <a href = "/login"> Log in </a> </p>
          </div>
        </div>
      </div>
    );
  }

}

export default withRouter(CSSModules(SignpPage, styles));

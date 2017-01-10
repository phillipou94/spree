import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import ReactSVG from 'react-svg';
import styles from "./Auth.css";

import Button from "../../components/Button/Button.jsx";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className = {styles.authContainer}>
          <a href ="/"><div className = {styles.titleContainer}>
            <ReactSVG path="../../assets/SpreeLogo.svg"
                      className={styles.logo}
                      evalScript="always"
                      />
            <h1 className = {styles.header}>Spree</h1>
          </div>
          </a>
          <div className = {styles.inputs}>
            <input className = {styles.input} name='email' placeholder='Email'/>
            <input className = {styles.input} name='password' placeholder='Password' type='password'/>
            <Button title = {"Sign In"}/>
            <p>Don't have an account? <a href = "/signup"> Sign Up </a> </p>
          </div>
        </div>
      </div>
    );
  }

}

export default withRouter(CSSModules(LoginPage, styles));

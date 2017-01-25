import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Auth.css";

import Button from "../../components/Button/Button.jsx";
import Error from "../../components/Error/Error.jsx";

import UserServices from "../../services/UserServices.js";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email:"",
      password:"",
      errorMessage:null,
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
    const email = this.state.email;
    const password = this.state.password;
    this.setState({loading:true})
    UserServices.login(email, password).then((res) => {
      var user = res.body.user;
      var path = user.bank_id && user.bank_id.length > 0 ? "" :  "bank";
      this.props.router.push(path);
    }).catch((errorResponse) => {
      var errorMessage = errorResponse.error.message;
      this.setState({errorMessage:errorMessage, loading:false})
    });
  }

  render() {
    const logo = require("../../assets/SpreeLogo.svg");
    return (
      <div>
        {this.state.errorMessage &&
          <Error message ={this.state.errorMessage} />
        }
        <div className = {styles.authContainer}>
          <a href ="/"><div className = {styles.titleContainer}>
            <img src = {logo} className = {styles.logo} />
            <p className = {styles.header}>Spree</p>
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
            <Button title = {"Sign In"}
                    onClick = {this.login.bind(this)}
                    loading = {this.state.loading}
                    loadingColor = {"white"}/>
            <p>Don't have an account? <a href = "/signup"> Sign Up </a> </p>
          </div>
        </div>
      </div>
    );
  }

}

export default withRouter(CSSModules(LoginPage, styles));

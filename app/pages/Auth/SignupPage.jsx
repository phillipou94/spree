import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Auth.css";

import Button from "../../components/Button/Button.jsx";
import Error from "../../components/Error/Error.jsx";

import UserServices from "../../services/UserServices.js";

class SignpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:"",
      email:"",
      password:"",
      errorMessage:null,
      loading:false,
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

  signup(event) {
    event.preventDefault();
    const name = this.state.name;
    const email = this.state.email;
    const password = this.state.password;
    this.setState({loading:true});
    UserServices.signup(name, email, password).then((res) => {
      this.props.router.push("bank");
    }).catch((errorResponse) => {
      var errorMessage = errorResponse.error.message;
      this.setState({errorMessage:errorMessage, loading:false});
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
            <form onSubmit = {this.signup.bind(this)}>
            <input className = {styles.input} name='name' placeholder='Name' onChange={this.updateInputValue.bind(this)}/>
            <input className = {styles.input} name='email' placeholder='Email' onChange={this.updateInputValue.bind(this)}/>
            <input className = {styles.input} name='password' placeholder='Password' type='password' onChange={this.updateInputValue.bind(this)}/>
            <Button title = {"Create an Account"}
                    onClick = {this.signup.bind(this)}
                    loading = {this.state.loading}
                    loadingColor = {"white"}/>
            </form>
            <p>Already have an account? <a href = "/login"> Log in </a> </p>
          </div>
        </div>
      </div>
    );
  }

}

export default withRouter(CSSModules(SignpPage, styles));

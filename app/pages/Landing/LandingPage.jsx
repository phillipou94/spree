import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./LandingPage.css";
import {Element} from 'react-scroll';

import Navbar from '../../components/Navbar/Navbar.jsx';
import Button from "../../components/Button/Button.jsx";



class LandingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  navigateToSignUp() {
    this.props.router.push("signup");
  }

  render() {
    const logo = require("../../assets/SpreeLogo.svg");
    const dollarMonitor = require("../../assets/DollarMonitor.svg");
    const piggyBank = require("../../assets/PiggyBank.svg");
    const shoppingCart = require("../../assets/ShoppingCart.svg");

    return (
      <div>
        <Navbar />
        <div className = {styles.introSection}>
          <img src = {logo} className = {styles.logo} />
          <h1>Never Worry About Spending Again</h1>
          <p>We help you manage your finances so you can spend on the experiences
             you’ve always wanted: <span className = {styles.highlighted}> Guilt Free </span></p>
           <Button title = {"Sign Me Up"} onClick = {this.navigateToSignUp.bind(this)}/>
        </div>
        <div className = {styles.howItWorksSection}>
          <Element name="howToAnchor" />
          <h1>How It Works</h1>
          <div className = {styles.steps}>
            <div className = {styles.stepCard}>
              <img src = {dollarMonitor} className = {styles.stepCardLogo} />
              <h2>1. Set Up Budget</h2>
              <p>Tell us how much money you want to budget this week</p>
            </div>
            <div className = {styles.stepCard}>
              <img src = {piggyBank} className = {styles.stepCardLogo} />

              <h2>2. Earn Credits</h2>
              <p>Every dollar under budget is a dollar you can spend on Spree events</p>
            </div>
            <div className = {styles.stepCard}>
              <img src = {shoppingCart} className = {styles.stepCardLogo} />
              <h2>3. Treat Yourself</h2>
              <p>Use the money you save to buy whatever you like!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CSSModules(LandingPage, styles));

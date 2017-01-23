import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./LandingPage.css";
import {Element} from 'react-scroll';

import TransparentNavbar from '../../components/Navbar/TransparentNavbar.jsx';
import Button from "../../components/Button/Button.jsx";



class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {scrollTop:0};
  }

  componentDidMount() {
    if (this && window) {
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  componentWillUnmount() {
    if(this && window) {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  handleScroll(event) {
    if (this) {
      let scrollTop = event.srcElement.body.scrollTop;
      this.setState({
         scrollTop: scrollTop
      });
    }
  }

  navigateToSignUp() {
    this.props.router.push("signup");
  }

  render() {
    const walletLogo = require("../../assets/Wallet.svg");
    const dollarMonitor = require("../../assets/DollarMonitor.svg");
    const piggyBank = require("../../assets/PiggyBank.svg");
    const shoppingCart = require("../../assets/ShoppingCart.svg");
    var scrollTop = this.state.scrollTop || 0;
    var navbarOpacity = Math.min(1,scrollTop/450);
    var headerImage = "https://static.pexels.com/photos/196652/pexels-photo-196652.jpeg";

    return (
      <div>
        <div className = {styles.header}>
          <TransparentNavbar opacity = {navbarOpacity}/>
          <div className = {styles.headerInfo}>
            <h1>About Us</h1>
            <p>Spree helps you manage your finances so you can spend on
               the experiences you’ve always wanted: Guilt Free</p>
            <Button title = {"Sign Me Up"} onClick = {this.navigateToSignUp.bind(this)}/>
          </div>
          <img src = {headerImage} />
        </div>
        <div className = {styles.introSection}>
          <img src = {walletLogo} className = {styles.logo} />
          <h1>Never Worry About Spending Again</h1>
          <p>Don’t let the guilt of spending money prevent you from having incredible experiences.
            Spree helps you achieve your financial goals so you can achieve your adventurous ones.
          </p>
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

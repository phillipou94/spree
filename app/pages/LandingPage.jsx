import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import ReactSVG from 'react-svg';
import styles from "./LandingPage.css";

import Button from "../components/Button/Button.jsx";

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className = {styles.introSection}>
          <ReactSVG path="../../assets/SpreeLogo.svg"
                    className={styles.logo}
                    evalScript="always"
                    />
          <h1>Never Worry About Spending Again</h1>
          <p>We help you manage your finances so you can spend on the experiences
             you’ve always wanted: <span className = {styles.highlighted}> Guilt Free </span></p>
           <Button title = {"Sign Me Up"} />
        </div>
        <div className = {styles.howItWorksSection}>
          <h1>How It Works</h1>
          <div className = {styles.steps}>
            <div className = {styles.stepCard}>
              <ReactSVG path="../../assets/DollarMonitor.svg"
                        className={styles.stepCardLogo}
                        evalScript="always"
                        />
              <h2>1. Set Up Budget</h2>
              <p>Tell us how much money you want to budget this week</p>
            </div>
            <div className = {styles.stepCard}>
              <ReactSVG path="../../assets/PiggyBank.svg"
                        className={styles.stepCardLogo}
                        evalScript="always"
                        />
              <h2>2. Earn Credits</h2>
              <p>Every dollar under budget is money you can use to spend</p>
            </div>
            <div className = {styles.stepCard}>
              <ReactSVG path="../../assets/ShoppingCart.svg"
                        className={styles.stepCardLogo}
                        evalScript="always"
                        />
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

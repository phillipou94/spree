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
        <div className = {styles.howItWorksSection}></div>
      </div>
    );
  }
}

export default withRouter(CSSModules(LandingPage, styles));

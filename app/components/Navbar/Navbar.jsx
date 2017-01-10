import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import ReactSVG from 'react-svg';
import styles from "./Navbar.css"

class Navbar extends Component {

  render() {
    return (
      <div className = {styles.Navbar}>
        <a href ="/">
          <ReactSVG path="../../assets/SpreeLogo.svg"
                    className={styles.logo}
                    evalScript="always"
                    />
        </a>
        <a href ="/"><h1 className = {styles.header}>Spree</h1></a>
        <div className = {styles.links}>
          <a href ="/"><p>How it Works</p></a>
          <a href ="/signup"><p>Sign Up</p></a>
          <a href ="/login"><p>Login</p></a>
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModules(Navbar, styles));

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Navbar.css"

class Navbar extends Component {

  render() {
    var SpreeLogo = require('../../assets/SpreeLogo.svg');
    return (
      <div className = {styles.Navbar}>
        <a href ="/"><img src ={SpreeLogo}/></a>
        <a href ="/"><h1 className = {styles.header}>Spree</h1></a>
        <div className = {styles.links}>
          <a href ="/"><p>Events</p></a>
          <a href ="/"><p>Wishlist</p></a>
          <a href ="/"><p>Account</p></a>
        </div>
      </div>
    )
  }
}

export default withRouter(CSSModules(Navbar, styles));

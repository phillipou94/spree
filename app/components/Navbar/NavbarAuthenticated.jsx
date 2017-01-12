import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Navbar.css";
import {Link} from 'react-scroll';

class NavbarAuthenticated extends Component {

  render() {
    const logo = require("../../assets/SpreeLogo.svg");
    return (
      <div className = {styles.Navbar}>
        <a href ="/">
          <img src = {logo} className = {styles.logo} />
        </a>
        <a href ="/"><h1 className = {styles.header}>Spree</h1></a>
        {! this.props.hideLinks &&
          <div className = {styles.links}>
            <a href ="/events"><p>Events</p></a>
            <a href ="/wishlist"><p>Wishlist</p></a>
            <a href ="/account"><p>Account</p></a>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(CSSModules(NavbarAuthenticated, styles));

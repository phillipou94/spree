import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Navbar.css";
import {Link} from 'react-scroll';

class NavbarAuthenticated extends Component {

  isActiveLink(link) {
    return this.props.currentPage === link;
  }

  getLinkStyle(link) {
    return {color: this.isActiveLink(link) ? "#313C4B" : "#9199A3"};
  }

  render() {
    const logo = require("../../assets/SpreeLogo.svg");
    var title = this.props.showBalance ? "$ "+this.props.balance+" saved" : "Spree";
    return (
      <div className = {styles.Navbar}>
        <a href ="/">
          <img src = {logo} className = {styles.logo} />
        </a>
        <a href ="/"><h1 className = {styles.header}>{title}</h1></a>
        {! this.props.hideLinks &&
          <div className = {styles.links}>
            <a href ="/" ><p style = {this.getLinkStyle("Events")}>Events</p></a>
            <a href ="/wishlist"><p style = {this.getLinkStyle("WishList")}>Wishlist</p></a>
            <a href ="/account"><p style = {this.getLinkStyle("Account")}>Account</p></a>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(CSSModules(NavbarAuthenticated, styles));

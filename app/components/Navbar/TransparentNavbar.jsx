import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./TransparentNavbar.css";
import {Link} from 'react-scroll';

class NavbarAuthenticated extends Component {

  isActiveLink(link) {
    return this.props.currentPage === link;
  }

  getLinkStyle(link) {
    var opacity = this.props.opacity || 0;
    var color = (opacity < 0.3) ? "white" : "#121212";
    return {textDecoration: this.isActiveLink(link) ? "underline" : "none", color:color};
  }

  render() {
    const logo = require("../../assets/SpreeLogo.svg");
    var opacity = this.props.opacity || 0;
    var background = "rgba(255,255,255,"+opacity+")";
    var color = (opacity < 0.3) ? "white" : "#121212";
    var title = this.props.showBalance ? "$ "+this.props.balance+" saved" : "Spree";
    return (
      <div className = {styles.Navbar} style = {{background:background}}>
        <a href ="/"><p className = {styles.header} style = {{color:color}}>{title}</p></a>
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

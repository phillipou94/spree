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
    return {textDecoration: this.isActiveLink(link) ? "underline" : "none"};
  }

  render() {
    const logo = require("../../assets/SpreeLogo.svg");
    var title = this.props.showBalance ? "$ "+this.props.balance+" saved" : "Spree";
    return (
      <div className = {styles.Navbar} >
        <a href ="/"><p className = {styles.header}>{title}</p></a>
        {! this.props.hideLinks &&
          <div className = {styles.links}>
            <a href ="/" ><p style = {this.getLinkStyle("Events")}>Events</p></a>
            <a href ="/wishlist"><p style = {this.getLinkStyle("Wishlist")}>Wishlist</p></a>
            <a href ="/account"><p style = {this.getLinkStyle("Account")}>Account</p></a>
            {this.props.logout &&
              <button className = {styles.logoutButton}
                      onClick = {this.props.logout}>Logout</button>
            }
          </div>
        }
      </div>
    )
  }
}

export default withRouter(CSSModules(NavbarAuthenticated, styles));

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Navbar.css";
import {Link} from 'react-scroll';

class Navbar extends Component {

  render() {
    const logo = require("../../assets/SpreeLogo.svg");
    return (
      <div className = {styles.Navbar}>
        <a href ="/"><h1 className = {styles.header}>Spree</h1></a>
        {! this.props.hideLinks &&
          <div className = {styles.links}>
            <Link to="howToAnchor"
                  smooth={true}
                  duration={1000}>
                    <a href = "/"><p>How it Works</p></a>
            </Link>
            <a href ="/signup"><p>Sign Up</p></a>
            <a href ="/login"><p>Login</p></a>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(CSSModules(Navbar, styles));

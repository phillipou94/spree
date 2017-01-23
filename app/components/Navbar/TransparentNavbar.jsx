import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./TransparentNavbar.css";
import {Link} from 'react-scroll';

class TransparentNavbar extends Component {

  render() {
    var opacity = this.props.opacity || 0;
    var background = "rgba(255,255,255,"+opacity+")";
    var color = (opacity < 0.3) ? "white" : "#121212";
    return (
      <div className = {styles.Navbar} style = {{background:background}}>
        <a href ="/"><p className = {styles.header} style = {{color:color}}>Spree</p></a>
        {! this.props.hideLinks &&
          <div className = {styles.links}>
            <Link to="howToAnchor"
                  smooth={true}
                  duration={1000}>
                      <a href ="/" ><p style = {{color:color}}>How It Works</p></a>
            </Link>
            <a href ="/signup"><p style = {{color:color}}>Sign Up</p></a>
            <a href ="/login"><p style = {{color:color}}>Login</p></a>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(CSSModules(TransparentNavbar, styles));

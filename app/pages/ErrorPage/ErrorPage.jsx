import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./ErrorPage.css";



class ErrorPage extends React.Component {

  render() {
    return (
      <div className = {styles.ErrorPage}>
        <div className = {styles.textContainer}>
        <h2>Sorry, this page isn't available</h2>
        <p>The link you followed may be broken, or the page may have been removed.</p>
        <h1>404</h1>
        <a href = "/">Take Me Back Home</a>
        </div>
      </div>
    );
  }
}

export default withRouter(CSSModules(ErrorPage, styles));

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import styles from "./style/global.css";

class App extends Component {
	render(){
		console.log("PROPS!!!");
		console.log(this.props.user);
    return (
			<div id = "app" className = {styles.Application}>
        <div className="content">
          {this.props.children}
        </div>
			</div>
    );
  }
};

App.propTypes = {
    children : React.PropTypes.any.isRequired
};

export default withRouter(App);

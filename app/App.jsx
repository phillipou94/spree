import React, { Component } from 'react';
import { withRouter } from 'react-router';

class App extends Component {
	render(){
    return (
			<div id = "app">
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

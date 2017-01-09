import React from 'react';
import { withRouter } from 'react-router';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h1>Landing Page!</h1>
    );
  }
}

export default withRouter(LandingPage);

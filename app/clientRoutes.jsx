import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App.jsx';

import LandingPage from './pages/Landing/LandingPage.jsx';
import SignupPage from './pages/Signup/SignupPage.jsx';

export default(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LandingPage} />
    </Route>
  </Router>
);

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App.jsx';

import BankPage from './pages/Bank/BankPage.jsx';
import LandingPage from './pages/Landing/LandingPage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import SignupPage from './pages/Auth/SignupPage.jsx';


export default(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LandingPage} />
      <Route path="signup" component={SignupPage} />
      <Route path="login" component={LoginPage} />
      <Route path="bank" component={BankPage} />
    </Route>
  </Router>
);

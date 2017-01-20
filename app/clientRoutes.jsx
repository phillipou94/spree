import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from './App.jsx';

import UserServices from "./services/UserServices.js";

import AccountPage from './pages/Account/AccountPage.jsx';
import BankPage from './pages/Bank/BankPage.jsx';
import EventsPage from './pages/Events/EventsPage.jsx';
import LandingPage from './pages/Landing/LandingPage.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import SignupPage from './pages/Auth/SignupPage.jsx';

const authCheck = (nextState, replace, callback) => {
    UserServices.currentUser().then((response) => {
        if (!response.body.authenticated){
            replace('/landing');
        }
        callback();
    }).catch((err) => {
        console.log("Err on authCheck : ", err);
        replace('/landing');
        callback();
    });
};

export default(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={EventsPage} onEnter={authCheck}/>
      <Route path="landing" component={LandingPage} />
      <Route path="signup" component={SignupPage} />
      <Route path="login" component={LoginPage} />
      <Route path="bank" component={BankPage} onEnter={authCheck}/>
      <Route path="account" component={AccountPage} onEnter={authCheck}/>
    </Route>
  </Router>
);

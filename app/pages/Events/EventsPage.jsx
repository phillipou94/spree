import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./EventsPage.css";

import UserServices from "../../services/UserServices.js";

import EventCard from "../../components/Cards/EventCard/EventCard.jsx";
import NavbarAuthenticated from '../../components/Navbar/NavbarAuthenticated.jsx';


class EventsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user:null, balance: 0.00}

  }

  componentWillMount() {
    UserServices.currentUser().then((res) => {
      var user = res.body.user;
      var balance = new Number(res.body.balance).toFixed(2);
      if (user) {
        this.setState({user:user, balance: balance});
      }
    });
  }



  render() {
    return (
      <div>
        <NavbarAuthenticated balance = {this.state.balance}
                             showBalance = {true}
                             currentPage = {"Events"}/>
        <EventCard />
      </div>
    );
  }
}

export default withRouter(CSSModules(EventsPage, styles));

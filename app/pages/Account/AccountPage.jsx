import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./AccountPage.css";
import time from "../../utils/time.js";

import BankServices from "../../services/BankServices.js";

import BankCard from '../../components/Cards/BankCard/BankCard.jsx';
import NavbarAuthenticated from '../../components/Navbar/NavbarAuthenticated.jsx';
import PopupConductor from '../../components/Popups/PopupConductor.jsx';


class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showPopup:false}
  }

  componentWillMount() {
    var now = new Date();
    var start_of_week = time.getNearestMondayBeforeDate(now);
    BankServices.getTransactions(start_of_week, now).then((res) => {
      var transactions = res.body;
      console.log(transactions);
    });
  }

  closePopup() {
    this.setState({showPopup:false});
  }

  render() {
    return (
      <div>
        {this.state.showPopup &&
          <PopupConductor type = {"BUDGET"}
                          bank = {this.state.selectedBank}
                          closePressed = {this.closePopup.bind(this)}
                          />
        }
        <NavbarAuthenticated currentPage = {"Account"}/>

      </div>
    );
  }
}

export default withRouter(CSSModules(AccountPage, styles));

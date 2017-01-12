import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./AccountPage.css";

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
        <NavbarAuthenticated />

      </div>
    );
  }
}

export default withRouter(CSSModules(AccountPage, styles));

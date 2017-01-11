import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BankPage.css";

import BankServices from "../../services/BankServices.js";

import Navbar from '../../components/Navbar/Navbar.jsx';
import Searchbar from '../../components/Searchbar/Searchbar.jsx';


class BankPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    BankServices.all().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  searchInputDidChange(event) {

  }

  render() {
    const infoPaneIcon = require("../../assets/PiggyBankLock.svg");
    return (
      <div>
        <Navbar hideLinks = {true}/>
        <div className = {styles.infoPane}>
          <img src = {infoPaneIcon} className = {styles.infoPaneIcon}/>
          <div className = {styles.QA}>
            <h2>{"Why are you asking for my bank info?"}</h2>
            <p>Spree works by scanning your transactions to see how much you’ve spent this weeek.</p>
          </div>
          <div className = {styles.QA}>
            <h2>{"Are you going to bill my account?"}</h2>
            <p>No. Spree only monitors your transactions to determine how much you’ve spent.</p>
          </div>
        </div>
        <div className = {styles.header}>
          <h1>Select Your Bank</h1>
          <Searchbar placeholder = {"Find your bank"}
                     inputDidChange = {this.searchInputDidChange.bind(this)}/>
        </div>

      </div>
    );
  }
}

export default withRouter(CSSModules(BankPage, styles));

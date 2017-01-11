import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BankPage.css";

import BankServices from "../../services/BankServices.js";

import BankCard from '../../components/Cards/BankCard/BankCard.jsx';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Searchbar from '../../components/Searchbar/Searchbar.jsx';
import PopupConductor from '../../components/Popups/PopupConductor.jsx';


class BankPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchTerm:"", banks:[], showPopup:false};
  }

  componentWillMount() {
    BankServices.all().then((res) => {
      const banks = res.body;
      this.setState({banks:banks});
    }).catch((err) => {
      console.log(err);
    });
  }

  searchInputDidChange(event) {
    this.searchBanks(event.target.value);
  }

  searchBanks(query) {
    var searchTerm = query;
    if (searchTerm && searchTerm.length > 0) {
      BankServices.search(searchTerm).then((res) => {
        const banks = res.body;
        console.log(banks);
        this.setState({banks:banks});
      }).catch((err) => {
        console.log(err);
      });
    } else {
      BankServices.all().then((res) => {
        const banks = res.body;
        this.setState({banks:banks});
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  didClickBank(bank) {
    this.setState({showPopup:true, selectedBank:bank});
  }

  closePopup() {
    this.setState({showPopup:false, selectedBank:null});
  }

  render() {
    const infoPaneIcon = require("../../assets/PiggyBankLock.svg");
    const banks = this.state.banks;
    return (
      <div>
        {this.state.showPopup &&
          <PopupConductor type = {"BANK_LOGIN"}
                          bank = {this.state.selectedBank}
                          closePressed = {this.closePopup.bind(this)}/>
        }
        <Navbar hideLinks = {true}/>
          <div className = {styles.header}>
            <h1>Connect your bank or credit card statement</h1>
            <Searchbar width = {"95%"}
                       placeholder = {"Find your bank"}
                       inputDidChange = {this.searchInputDidChange.bind(this)}
            />
          </div>
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

        <div className = {styles.banksContainer}>
          {banks.map((bank, index) => {
            return (
              <BankCard
                key={bank._id}
                index={index}
                bank={bank}
                onClick = {this.didClickBank.bind(this, bank)}
              />
            );
          })}

        </div>

      </div>
    );
  }
}

export default withRouter(CSSModules(BankPage, styles));

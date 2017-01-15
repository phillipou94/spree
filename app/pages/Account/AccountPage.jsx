import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./AccountPage.css";
import time from "../../utils/time.js";

import BankServices from "../../services/BankServices.js";
import UserServices from "../../services/UserServices.js";
import WeekServices from "../../services/WeekServices.js";

import BankCard from '../../components/Cards/BankCard/BankCard.jsx';
import Dropdown from 'react-dropdown';
import NavbarAuthenticated from '../../components/Navbar/NavbarAuthenticated.jsx';
import PopupConductor from '../../components/Popups/PopupConductor.jsx';
import SetBudgetCard from '../../components/SetBudgetCard/SetBudgetCard.jsx';
import UpdateBankCard from '../../components/UpdateBankCard/UpdateBankCard.jsx';
import BalanceCard from '../../components/BalanceCard/BalanceCard.jsx';
import TicketItem from '../../components/AccountItems/TicketItem.jsx';
import TransactionItem from '../../components/AccountItems/TransactionItem.jsx';
import BalanceGraphic from '../../components/BalanceGraphic/BalanceGraphic.jsx';
import WeekItem from '../../components/AccountItems/WeekItem.jsx';

import Select from 'react-select';

class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showPopup:false,
                  budget:300,
                  spentThisWeek: 289.94,
                  balance:10.04,
                  dropDownOptions: ["Transactions", "Tickets", "Previous Weeks"],
                  selectedOption:"Transactions",
                  user: null,
                  weeks:[],
                  transactions:[],
                  tickets:[]}
  }

  componentWillMount() {
    var now = new Date();
    var start_of_week = time.getNearestMondayBeforeDate(now);
    UserServices.cachedUser().then((res) => {
      this.setState({user:res.body.user});
    });
    BankServices.getTransactions(start_of_week, now).then((res) => {
      var transactions = res.body;
      this.setState({transactions:transactions});
    });
  }

  closePopup() {
    this.setState({showPopup:false});
  }

  didSelectDropdown(event) {
    var option = event.target.value;
    this.setState({selectedOption:option});
    if (option === this.state.dropDownOptions[2]) {
      this.getPreviousWeeks();
    }
  }

  getPreviousWeeks() {
    WeekServices.previousWeeks(this.state.user._id).then((res) => {
      var weeks = res.body;
      this.setState({weeks:weeks});
    });
  }

  subheader() {
    if (this.state.selectedOption === "Tickets") {
      return "2 Tickets";
    } else if (this.state.selectedOption === "Previous Weeks") {
      return "Week 5";
    } else {
      return "Week of Sept 11 - Sept 18";
    }
  }

  transactionItems(transactions) {
    return transactions.map(function(index, transaction){
      return (
        <div key = {index}>
          <TransactionItem transaction = {transaction}/>
        </div>
      );
    });
  }

  ticketItems(tickets) {
    return tickets.map(function(index, ticket){
      return (
        <div key = {index}>
          <TicketItem ticket = {ticket}/>
        </div>
      );
    });
  }

  weekItems(weeks) {
    return weeks.map(function(index, week){
      return (
        <div key = {week._id}>
          <WeekItem weeks = {weeks}/>
        </div>
      );
    });
  }

  render() {
    var title = this.state.user ? this.state.user.name+'s Account' : "Account";
    return (
      <div>
        <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
        {this.state.showPopup &&
          <PopupConductor type = {"BUDGET"}
                          bank = {this.state.selectedBank}
                          closePressed = {this.closePopup.bind(this)}
                          />
        }
        <NavbarAuthenticated currentPage = {"Account"}/>
        <h1 className = {styles.header}>{title}</h1>
        <div className = {styles.AccountCardsContainer}>
          <BalanceCard balance = {this.state.balance}/>
          <SetBudgetCard />
          <UpdateBankCard />
        </div>
        <div className = {styles.AccountGraphicsContainer}>
          <BalanceGraphic budget = {this.state.budget} spentThisWeek = {this.state.spentThisWeek}/>
        </div>

        <div className = {styles.AccountItemsTable}>
          <div className = {styles.tableHeader}>
            <p className = {styles.subheader}>{this.subheader()}</p>
              <div className={styles.dropdown}>
                <select onChange = {this.didSelectDropdown.bind(this)}>
                  {this.state.dropDownOptions.map(function(option) {
                    return <option key = {option} value={option}>{option}</option>
                  })}

                </select>
              </div>

          </div>
          {this.state.selectedOption === this.state.dropDownOptions[0] &&
            this.transactionItems(this.state.transactions)
          }
          {this.state.selectedOption === this.state.dropDownOptions[1] &&
            this.ticketItems(this.state.tickets)
          }
          {this.state.selectedOption === this.state.dropDownOptions[2] &&
            this.weekItems(this.state.weeks)
          }

        </div>


      </div>
    );
  }
}

export default withRouter(CSSModules(AccountPage, styles));

import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BankPage.css";
var Loader = require('halogen/ClipLoader');

import BankServices from "../../services/BankServices.js";
import UserServices from "../../services/UserServices.js";

import BankCard from '../../components/Cards/BankCard/BankCard.jsx';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Searchbar from '../../components/Searchbar/Searchbar.jsx';
import PopupConductor from '../../components/Popups/PopupConductor.jsx';


class BankPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchTerm:"",
                  banks:[],
                  bankImages:[],
                  showPopup:false,
                  popupType : "BANK_LOGIN",
                  question:"",
                  mfa_access_token:"",
                  user:null,
                  errorMessage:null,
                  buttonLoading:false,
                  banksLoading: true};
  }

  componentWillMount() {
    BankServices.all().then((res) => {
      const banks = res.body;
      this.setState({banks:banks, bankImages:banks, banksLoading:false});
    }).catch((err) => {
      this.setState({banks:[],bankImages:[], banksLoading:false});
      console.log(err);
    });
    UserServices.currentUser().then((res) => {
      var user = res.body.user;
      this.setState({user:user});
    }).catch((error) => {
      console.log(error);
    });
  }

  didClickBank(bank) {
    this.setState({showPopup:true, selectedBank:bank});
  }

  closePopup() {
    this.setState({showPopup:false, selectedBank:null, question:"", popupType:"BANK_LOGIN",errorMessage:null});
  }

  bankLoginSubmitted(authInfo) {
    this.setState({buttonLoading:true});
    BankServices.authenticate(authInfo).then((res) => {
      if (res.success) {
        if (res.additionalSteps) {
          var mfa = res.body.mfa;
          var question = "";
          var mfa_access_token = res.body.access_token;
          if (mfa.message) {
            var message = mfa.message;
            question = mfa.message;
          } else if (mfa.length >= 1) {
            question = mfa[0].question;
          }
          this.setState({buttonLoading:false,
                         popupType:"BANK_QUESTION",
                         question:question,
                         mfa_access_token:mfa_access_token});
        } else {
          //success
          this.setState({buttonLoading:false});
          this.props.router.push("/account");
          this.closePopup();
        }
      }
    }).catch((errorResponse) => {
      var errorMessage = errorResponse.error.message.message;
      this.setState({errorMessage:errorMessage, buttonLoading:false,})
    });

  }

  answerSubmitted(answer, bank) {
    this.setState({buttonLoading:true});
    var req = {answer:answer,
               access_token:this.state.mfa_access_token,
               bank_name:bank.name,
               bank_id:bank._id,
               type:bank.type};
    BankServices.answerSecurityQuestion(req).then((res) => {
      if (res.success) {
        if (res.additionalSteps) {
          var mfa = res.body.mfa;
          var question = "";

          if (mfa.message) {
            var message = mfa.message;
            question = mfa.message;
          } else if (mfa.length >= 1) {
            question = mfa[0].question;
          }
          this.setState({popupType:"BANK_QUESTION", question:question, buttonLoading:false,});
        } else {
          //success
          this.setState({buttonLoading:false});
          this.props.router.push("/account");
          this.closePopup();
        }
      }
    }).catch((errorResponse) => {
      var errorMessage = errorResponse.error.message.message;
      this.setState({errorMessage:errorMessage, buttonLoading:false})
    });
  }

  unlinkBank() {
    UserServices.unlinkBankAccount().then((res) => {
      this.setState({user:res.body.user});
    }).catch((error)=> {
      console.log(error);
    });
  }

  currentBankCard(user, bankImages) {
    if (!user || !user.bank_id || !bankImages) {
      return null;
    }
    var demoBankIcon = require("../../assets/DemoBankIcon.svg");
    var banks = bankImages.filter(function(bank) {
      return bank.name === user.bank_name;
    });
    var bankImage = (banks && banks[0] && banks[0].logo_url) ? banks[0].logo_url : demoBankIcon;

    return (
      <div className = {styles.unlinkBankCard}>
        <img src = {bankImage} />
        <button onClick = {this.unlinkBank.bind(this)}>Unlink</button>
        <div className = {styles.textContainer}>
          <p>{user.bank_name}</p>
          <p>Current Bank Account</p>
        </div>
      </div>
    )
  }

  render() {
    const infoPaneIcon = require("../../assets/PiggyBankLock.svg");
    const banks = this.state.banks;
    const bankImages = this.state.bankImages;
    const type = this.state.popupType;
    const skipToPage = "/account";
    var user = this.state.user;
    var headerTitle = user && user.bank_id ? "Update your bank" : "Select your bank"
    return (
      <div>
        {this.state.showPopup &&
          <PopupConductor type = {type}
                          bank = {this.state.selectedBank}
                          closePressed = {this.closePopup.bind(this)}
                          bankLoginSubmitted = {this.bankLoginSubmitted.bind(this)}
                          answerSubmitted = {this.answerSubmitted.bind(this)}
                          question = {this.state.question}
                          errorMessage = {this.state.errorMessage}
                          loading = {this.state.buttonLoading}/>
        }
          <div className = {styles.header}>
            <a href = {skipToPage} className = {styles.skipButton}>skip > </a>
            <h1>{headerTitle}</h1>
            <p>Find your bank below</p>
          </div>
          {this.currentBankCard(user, bankImages)}
          <div className = {styles.divider}></div>

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
        {this.state.banksLoading &&
          <div className = {styles.loaderContainer}>
            <Loader  color={"#AC9456"} size="100px" margin="90px"/>
          </div>
        }
        {!this.state.banksLoading &&
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
      }

      </div>
    );
  }
}

export default withRouter(CSSModules(BankPage, styles));

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./TicketConfirmationPopup.css";
import CurrencyInput from 'react-currency-input';

import Button from "../../Button/Button.jsx";

class TicketConfirmationPopup extends Component {
  constructor(props) {
    super(props);
  }

  priceInputValue(value) {
    console.log(value);
  }

  render() {
    var image = "http://i3.mirror.co.uk/incoming/article3656831.ece/ALTERNATES/s1200/One-Direction.jpg";
    return (
      <div className = {styles.TicketConfirmationPopup}>
        <div className = {styles.header}>
          <div className = {styles.headerInfo}>
            <div className = {styles.headerText}>
              <h1>{"One Direction"}</h1>
              <p>{"Did you buy this ticket?"}</p>
            </div>
          </div>
          <img src = {image} />
        </div>
        <div className = {styles.infoRow}>
          <div className = {styles.info}>
            <p className = {styles.category}>Venue</p>
            <p>{"Staples Center"}</p>
          </div>
          <div className = {styles.info}>
            <p className = {styles.category}>Address</p>
            <p>{"1111 S. Figueroa,  Los Angeles, CA 91770 "}</p>
          </div>
        </div>
        <div className = {styles.infoRow}>
          <div className = {styles.info}>
            <p className = {styles.category}>Date</p>
            <p>{"Wed.Sept 9, 2017"}</p>
          </div>
          <div className = {styles.info}>
            <p className = {styles.category}>Showtime</p>
            <p>{"9:30 PM"}</p>
          </div>
          <div className = {styles.info}>
            <p className = {styles.category}>Price</p>
              <CurrencyInput  className = {styles.priceInput}
                              prefix="$"
                              onChange = {this.priceInputValue.bind(this)}
                              value = {12900}/>
          </div>
        </div>
        <div className = {styles.infoRow}>
          <button className = {styles.yesButton}>Yes, I bought this ticket</button>
          <button className = {styles.noButton}>No, I did not buy this ticket</button>
        </div>
      </div>
    );
  }
};

export default withRouter(CSSModules(TicketConfirmationPopup, styles));

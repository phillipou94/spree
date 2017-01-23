import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./TicketConfirmationPopup.css";
import CurrencyInput from 'react-currency-input';

import TicketServices from "../../../services/TicketServices.js";
import EventServices from "../../../services/EventServices.js";

import time from "../../../utils/time.js";

import Button from "../../Button/Button.jsx";

class TicketConfirmationPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {event:null, ticketPrice:0}
  }

  componentWillMount() {
    var ticket_id = this.props.ticket_id;
    TicketServices.getTicket(ticket_id).then((res) => {
      var ticket = res.body;
      var seatgeek_id = ticket.seatgeek_id;
      EventServices.event(seatgeek_id).then((res) => {
        var event = res.body;
        var ticketPrice = "$ "+new Number(event.low_price).toFixed(2)
        EventServices.images([event]).then((res) => {
          var images = res.body;
          if (images && images.length) {
            event.featured_image = images[0].image;
          }
          this.setState({event:event, ticketPrice:ticketPrice});
        }).catch((err) => {
          this.setState({event:event, ticketPrice:ticketPrice});
        });
      });
    })
  }

  priceInputValueChanged(value) {
    var amount = value;
    amount = amount.replace("$", "");
    amount = amount.replace(" ","");
    this.setState({ticketPrice:amount});
  }

  confirmTicketPurchase() {
    var ticketPrice = this.state.ticketPrice.replace("$", "");
    ticketPrice = ticketPrice.replace(" ","");
    this.props.confirmTicketPurchase(ticketPrice);
  }

  denyTicketPurchase() {
    this.props.denyTicketPurchase();
  }

  render() {
    var image = 'https://static.pexels.com/photos/29021/pexels-photo-29021.jpg';
    var event = this.state.event;
    var eventName = "EVENT NAME";
    var venueName = "VENUE NAME";
    var venueAddress = "VENUE ADDRESS";
    var showTime = "SHOW TIME";
    var eventDate = "EVENT DATE";
    if (event) {
      image = event.featured_image ? event.featured_image : event.performers[0].image;
      eventName = event.title;
      var venue = event.venue;
      venueName = venue.name;
      venueAddress = venue.address + ", "+venue.extended_address;
      var date = new Date(event.date);
      eventDate = time.formattedDateString(date);
      showTime = time.timeString(date);
    }

    return (
      <div className = {styles.TicketConfirmationPopup}>
        <div className = {styles.header}>
          <div className = {styles.headerInfo}>
            <div className = {styles.headerText}>
              <h1>{eventName}</h1>
              <p>{"Did you buy this ticket?"}</p>
            </div>
          </div>
          <img src = {image} />
        </div>
        <div className = {styles.infoRow}>
          <div className = {styles.info}>
            <p className = {styles.category}>Venue</p>
            <p>{venueName}</p>
          </div>
          <div className = {styles.info}>
            <p className = {styles.category}>Address</p>
            <p>{venueAddress}</p>
          </div>
        </div>
        <div className = {styles.infoRow}>
          <div className = {styles.info}>
            <p className = {styles.category}>Date</p>
            <p>{eventDate}</p>
          </div>
          <div className = {styles.info}>
            <p className = {styles.category}>Showtime</p>
            <p>{showTime}</p>
          </div>
          <div className = {styles.info}>
            <p className = {styles.category}>Price</p>
              <CurrencyInput  className = {styles.priceInput}
                              prefix="$"
                              onChange = {this.priceInputValueChanged.bind(this)}
                              value = {this.state.ticketPrice}/>
          </div>
        </div>
        <div className = {styles.infoRow}>
          <button className = {styles.yesButton}
                  onClick = {this.confirmTicketPurchase.bind(this)}>Yes, I bought this ticket</button>
          <button className = {styles.noButton}
                  onClick = {this.denyTicketPurchase.bind(this)}>No, I did not buy this ticket</button>
        </div>
      </div>
    );
  }
};

export default withRouter(CSSModules(TicketConfirmationPopup, styles));

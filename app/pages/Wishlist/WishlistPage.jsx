import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import InfiniteScroll from 'react-infinite-scroller';
import styles from "./WishlistPage.css";

import UserServices from "../../services/UserServices.js";
import EventServices from "../../services/EventServices.js";

import Tooltip from 'rc-tooltip';

import EventCard from "../../components/Cards/EventCard/EventCard.jsx";
import NavbarAuthenticated from '../../components/Navbar/NavbarAuthenticated.jsx';
import Searchbar from '../../components/Searchbar/Searchbar.jsx';
import Switch from '../../components/Switch/Switch.jsx';


class WishlistPage extends Component {
  constructor(props) {
    super(props);
    this.state = {user:null,
                  events:[],
                  balance: 0.00}

  }

  componentWillMount() {
    var that = this;
    UserServices.currentUser().then((res) => {
      var user = res.body.user;
      var balance = new Number(res.body.balance).toFixed(2);
      if (user) {
        this.setState({user:user, balance: balance});
      }
    });
    this.getWishlist();
  }

  getWishlist() {
    EventServices.wishlist().then((res) => {
      var events = res.body;
      this.setState({events:events});
    })
  }

  didClickEvent(event) {
    this.props.router.push("/event/"+event.seatgeek_id);
  }


  render() {
    var events = this.state.events;
    var balance = this.state.balance;
    var isSearching = this.state.searchTerm && this.state.searchTerm.length > 0;
    var self = this;
    var eventCards = events.map(function(event,index) {
      return <EventCard key = {index}
                        event = {event}
                        balance = {balance}
                        onClick = {() => {self.didClickEvent(event);}}/>
    });

    return (
      <div>
      {eventCards.length > 0 &&
      <div className = {styles.events}>
        <InfiniteScroll
            className = {styles.eventsTable}
            pageStart={0}
            loadMore={this.getWishlist.bind(this)}
            hasMore={false}
            loader={<div className="loader">Loading ...</div>}>
            {eventCards}
        </InfiniteScroll>
      </div>
    }

    </div>
    );
  }
}

export default withRouter(CSSModules(WishlistPage, styles));

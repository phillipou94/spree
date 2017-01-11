import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Searchbar.css";

  class Searchbar extends Component {

    onSubmit(event) {
      event.preventDefault();
      this.props.onSubmit();
    }

    render() {
      const icon = require("../../assets/Search.svg");
      var placeholder = this.props.placeholder ? this.props.placeholder : "Search";
      return (
        <div className = {styles.Searchbar}>
          <form onSubmit={this.onSubmit.bind(this)}>
            <img src= {icon} className = {styles.input_img}/>
            <input className = {styles.input}
                   name='searchbar'
                   placeholder={placeholder}
                   onChange={this.props.inputDidChange}

            />
        </form>
        </div>
      )
    }
  }

  export default withRouter(CSSModules(Searchbar, styles));

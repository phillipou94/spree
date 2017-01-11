import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Searchbar.css";

  class Searchbar extends Component {

    onSubmit(event) {
      event.preventDefault();
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }

    render() {
      const icon = require("../../assets/Search.svg");
      const placeholder = this.props.placeholder ? this.props.placeholder : "Search";
      const width = this.props.width ? this.props.width : "100%";
      const style = {width:width};
      return (
        <div className = {styles.Searchbar} style = {style}>
          <form onSubmit={this.onSubmit.bind(this)}>
            <img src= {icon} className = {styles.input_img}/>
            <input className = {styles.input}
                   name='searchbar'
                   placeholder={placeholder}
                   onChange={this.props.inputDidChange}
                   autoComplete={"off"}
            />
        </form>
        </div>
      )
    }
  }

  export default withRouter(CSSModules(Searchbar, styles));

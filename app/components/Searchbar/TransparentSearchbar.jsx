import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./TransparentSearchbar.css";

  class Searchbar extends Component {

    constructor(props) {
      super(props);
      this.state = {searchText:""};
    }

    onChange(event) {
      this.setState({searchText:event.target.value});
      if (this.props.inputDidChange) {
        this.props.inputDidChange(event);
      }
    }

    onSubmit(event) {
      event.preventDefault();
      if (this.props.onSubmit) {
        this.props.onSubmit(this.state.searchText);
      }
    }

    render() {
      const icon = require("../../assets/Search(Black).svg");
      const closeIcon = require("../../assets/CloseIcon.svg");
      const placeholder = this.props.placeholder ? this.props.placeholder : "Search";
      const width = this.props.width ? this.props.width : "100%";
      const style = {width:width};
      return (
        <div className = {styles.Searchbar} style = {style}>
          <form onSubmit={this.onSubmit.bind(this)}>
            <img src= {icon} className = {styles.input_img}/>
            <input className = {styles.input}
                   type = "text"
                   name='searchbar'
                   placeholder={placeholder}
                   onChange={this.onChange.bind(this)}
                   autoComplete={"off"}
            />
          <img src= {closeIcon} className = {styles.closeIcon} onClick = {this.props.exitSearch}/>

        </form>
        </div>
      )
    }
  }

  export default withRouter(CSSModules(Searchbar, styles));

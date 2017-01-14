import React, { Component } from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./Dropdown.css";

class Dropdown extends Component {
  constructor(props) {
    super(props);
    var selected = this.getSelectedFromProps(props);

    this.state = {
        selected: selected
    }
  }
    componentWillReceiveProps(nextProps) {
        var selected = this.getSelectedFromProps(nextProps);
        this.setState({
           selected: selected
        });
    }

    getSelectedFromProps(props) {
      var selected = props.options[0];
      if (props.value === null && props.options.length !== 0) {
          selected = props.options[0];
      } else {
          selected = props.value;
      }
    }


    handleChange(e) {
      this.setState({selected: e.target.value});
    }

    render() {
        var options = this.props.options.map(function(option) {
            return (
                <option key={option} value={option}>
                    {option}
                </option>
            )
        });
        return (
            <select id={this.props.id}
                    className={styles.dropdown}
                    value={this.state.selected}
                    onChange={this.props.onChange}>
                {options}
            </select>
        )
    }


}

export default withRouter(CSSModules(Dropdown, styles));

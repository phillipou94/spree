import React from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./BankPage.css";

import BankServices from "../../services/BankServices.js";

import Navbar from '../../components/Navbar/Navbar.jsx';


class BankPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    BankServices.all().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {

    return (
      <div>
        <Navbar hideLinks = {true}/>
      </div>
    );
  }
}

export default withRouter(CSSModules(BankPage, styles));

/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import _ from "lodash";

import { ENV } from "../../constants/environments";
import Storage from "../../helpers/Storage";


class MockServiceSwitch extends Component {

  constructor(props, context) {
    super(props, context);
    const initialState = _.defaultTo(Storage.get("isMock"), false);
    this.state = {
      isMock: initialState
    };
    axios.defaults.baseURL = initialState ? ENV.mock.apiEndpoint : ENV.development.apiEndpoint;

    this.handleClick = this.handleClick.bind(this);

    this.styles = {
      position: "fixed",
      top: "50%",
      right: "20px",
      width: "20px",
      height: "20px",
      borderRadius: "20px",
      fontSize: "18px",
      border: "2px solid #fff",
      zIndex: 999999999
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isMock !== nextState.isMock;
  }

  handleClick() {
    Storage.set("isMock", !this.state.isMock);
    axios.defaults.baseURL = this.state.isMock ? ENV.development.apiEndpoint : ENV.mock.apiEndpoint;
    this.setState({
      isMock: !this.state.isMock
    });
  }

  // componentWillMount() {}
  // componentDidMount() {}
  // componentWillReceiveProps(nextProps) {}
  // shouldComponentUpdate(nextProps, nextState) {}
  // componentWillUpdate(nextProps, nextState) {}
  // componentDidUpdate(nextProps, nextState) {}
  // componentWillUnmount() {}

  render() {
    return (
      <i
        onClick={this.handleClick}
        className="icon icon-circle cursor-pointer"
        id="btnMock"
        style={_.merge({}, this.styles, {
          color: this.state.isMock ? "green" : "red"
        })} />
    );
  }
}


MockServiceSwitch.propTypes = {

};

export default MockServiceSwitch;

/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import _ from "lodash";
import reactOnclickoutside from "react-onclickoutside";




class Dropdown extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      isOpen: false,
      id: ""
    };
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleClickOutside() {
    this.close();
  }

  close() {
    this.setState({
      isOpen: false
    });
  }

  // componentWillUnmount() {}


  // componentWillMount() {}
  // componentDidMount() {}
  // componentWillReceiveProps(nextProps) {}
  // shouldComponentUpdate(nextProps, nextState) {}
  // componentWillUpdate(nextProps, nextState) {}
  // componentDidUpdate(nextProps, nextState) {}
  // componentWillUnmount() {}

  render() {
    return (
      <div
        // ref={ref => this.dropdown = ref}
        id={this.state.id}
        className={cn("btn-group", this.props.className, {
          open: this.state.isOpen
        })}>
        <button
          type="button"
          className={`btn btn-default btn-block dropdown-toggle ${_.defaultTo(this.props.buttonClassName, "")}`}
          onClick={this.toggle}>
          {this.props.label}
        </button>
        {this.props.children}
      </div>
    );
  }
}


Dropdown.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  label: PropTypes.any.isRequired
};

export default reactOnclickoutside(Dropdown);

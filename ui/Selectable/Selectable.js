/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "../Button/Button";
import _ from "lodash";





class Selectable extends Component {

  constructor(props) {
    super(props);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.callback = this.callback.bind(this);
    this.init = this.init.bind(this);
    this.init(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps);
  }

  init(props) {
    this.state = {
      items: props.items
    };
    // this.callback(props.items);
  }

  handleRadioChange(event, item) {
    const oldState = _.cloneDeep(this.state.items);
    const newItems = _.map(oldState, (stateItem) => {
      const newStateItem = stateItem;
      if (!this.props.multiple) {
        newStateItem.active = false;
      }
      if (stateItem.value === item.value) {
        newStateItem.active = !stateItem.active;
      }
      return stateItem;
    });
    this.setState({
      items: newItems
    });
    this.callback(newItems);
  }

  callback(newItems) {
    const actives = _(newItems)
      .filter(item => item.active)
      .map((item) => item.value)
      .value();
    return this.props.callback(this.props.multiple ? actives : actives.join(""));
  }


  render() {

    const {
      className,
      itemClass,
      theme,
      size,
      tooltipText
    } = this.props;

    return (
      <ul className={`${_.defaultTo(className, "")}`}>
        {!_.isEmpty(this.state.items) &&
          _.map(this.state.items, (item, index) =>
            <li
              key={index}>
              <Button
                value={item.value}
                name={item.name}
                onClick={(event) => this.handleRadioChange(event, item)}
                className={_.defaultTo(itemClass, "")}
                active={item.active}
                type="button"
                disabled={item.disabled}
                tooltip={item.disabled}
                tooltipText={tooltipText}
                size={size}
                theme={theme}>
                {item.label}
              </Button>
            </li>
          )
        }
      </ul>
    );

  }
}

Selectable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.any.isRequired
    })
  ).isRequired,
  className: PropTypes.string,
  callback: PropTypes.func.isRequired,
  value: PropTypes.string,
  itemClass: PropTypes.string,
  theme: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  size: PropTypes.oneOf(["xs", "sm", "lg"]),
  tooltipText: PropTypes.string
};

export default Selectable;

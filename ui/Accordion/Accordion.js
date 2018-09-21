/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import _ from "lodash";
import cn from "classnames";




class Accordion extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);

  }

  // componentWillMount() {}
  // componentDidMount() {}
  componentWillReceiveProps() {
    this.closeAll();
  }
  // shouldComponentUpdate(nextProps, nextState) {}
  // componentWillUpdate(nextProps, nextState) {}
  // componentDidUpdate(nextProps, nextState) {}
  // componentWillUnmount() {}

  closeAll() {
    const elem = ReactDOM.findDOMNode(this);
    _.forEach(elem.querySelectorAll(".panel-heading"), (item) => {
      item.classList.add("collapsed");
      item.nextSibling.classList.remove("in");
    });
  }

  handleClick(event) {
    if (_.has(this.props, "singleMode") && this.props.singleMode) {
      this.closeAll();
    }
    event.target.classList.toggle("collapsed");
    event.target.nextSibling.classList.toggle("in");
  }

  render() {
    const {
      id,
      className,
      itemClassName,
      activeIndex,
      items
    } = this.props;

    return (

      <div
        className={`panel-group ${_.defaultTo(className, "")}`}
        id={id}>
        {
          _.map(items, (item, index) =>
            <div
              key={index}
              className={`panel panel-default ${itemClassName}`}>
              <div
                onClick={this.handleClick}
                className={cn("panel-heading", {
                  "collapsed": !item.active || index !== activeIndex
                })}>
                {item.title}
              </div>
              <div
                className={cn("panel-collapse collapse", {
                  "in": item.active || index === activeIndex
                })}>
                <div
                  className="panel-body">
                  { item.content }
                </div>
              </div>
            </div>
          )
        }

      </div>
    );
  }
}


Accordion.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  activeIndex: PropTypes.number,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.any.isRequired,
      content: PropTypes.any.isRequired,
      active: PropTypes.bool
    })
  ).isRequired,
  singleMode: PropTypes.bool
};

export default Accordion;

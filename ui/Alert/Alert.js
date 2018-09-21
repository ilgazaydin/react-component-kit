/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import ReactDOM from "react-dom";
import _ from "lodash";




export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
  }

  componentDidMount() {
    if (this.props.timer) {
      setTimeout(() => {
        this.handleCloseAlert(this);
      }, this.props.timer);
    }
  }

  handleCloseAlert(e) {
    const elem = ReactDOM.findDOMNode(this);
    elem.remove();
    if (this.props.callbackFn) {
      this.props.callbackFn();
    }
  }

  render() {
    const {
      dismiss,
      callbackFn,
      theme,
      icon,
      title,
      className,
      items,
      timer,
      children
    } = this.props;
    const alertClass = cn(`alert alert-custom alert-${theme} ${_.defaultTo(className, "")} ${dismiss ? "alert-dismissible" : ""}`);

    return (
      <div className={alertClass}>
        <div className="icon-holder">
          {icon &&
            <i className={cn(`icon icon-${icon}`)} />
          }
        </div>
        <div className="alert-content">
          {dismiss &&
            <button
              type="button"
              onClick={this.handleCloseAlert}
              className="close"
              data-dismiss="alert">
              <span aria-hidden="true">&times;</span>
            </button>
          }
          <strong>{title}</strong>
          {Boolean(children) &&
            <p className="xs-m-10">{children}</p>
          }
          {items &&
            <ul>
              {
                _.map(items, ({ message }, index) =>
                  <li key={index}>
                    {items.length > 1 &&
                    <i className="icon icon-circle" />
                  }
                    {message}
                  </li>
                )
              }
            </ul>
          }
        </div>
      </div>
    );
  }
}


Alert.propTypes = {
  dismiss: PropTypes.bool,
  callbackFn: PropTypes.func,
  theme: PropTypes.oneOf([ "success", "info", "warning", "danger" ]).isRequired,
  icon: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  items: PropTypes.array,
  timer: PropTypes.number,
  children: PropTypes.any
};


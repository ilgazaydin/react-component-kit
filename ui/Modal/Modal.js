/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import _ from "lodash";



class Modal extends Component {

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    findDOMNode(this).remove();
    _.invoke(this.props, "closePortal");
    _.invoke(this.props, "onClose");
  }

  // componentWillMount() {}
  // componentDidMount() {}
  // componentWillReceiveProps(nextProps, nextContext) {}
  // shouldComponentUpdate(nextProps, nextState, nextContext) {}
  // componentWillUpdate(nextProps, nextState, nextContext) {}
  // componentDidUpdate(prevProps, prevState, prevContext)
  // componentWillUnmount() {}

  render() {
    const {
      title,
      footer,
      width,
      dismissable,
      children,
      backdrop,
      esc
    } = this.props;
    return (
      <div id="modal">
        <div
          className="modal fade in"
          style={{
            display: "block"
          }}>
          <div className="modal-inner">
            <div className={`modal-dialog modal-${width}`}>
              <div className="modal-content">
                {title &&
                  <div className="modal-header">
                    {
                      _.defaultTo(dismissable, true) &&
                      <button
                        onClick={this.handleClose}
                        type="button"
                        className="close">
                        <i className="icon icon-close" />
                      </button>
                    }
                    {
                      React.createElement(
                        _.defaultTo(title.type, "h3"),
                        _.defaultTo({
                          ...title.props
                        }, {}),
                        _.get(title, ".props.children", title)
                      )
                    }
                  </div>
                }
                <div className="modal-body">
                  {children}
                </div>
                {footer &&
                  React.createElement("div", {
                    className: "modal-footer"
                  }, this.state.footer)
                }
              </div>
            </div>
          </div>
        </div>
        {_.defaultTo(backdrop, true) &&
          <div className="modal-backdrop" />
        }
      </div>
    );
  }
}

Modal.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  children: PropTypes.object,
  backdrop: PropTypes.bool,
  dismissable: PropTypes.bool,
  esc: PropTypes.bool,
  closePortal: PropTypes.func,
  onClose: PropTypes.func
};

export default Modal;


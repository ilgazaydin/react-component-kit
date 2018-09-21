/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import cn from "classnames";

import ToolTip from "../Tooltip/Tooltip.js";



const Button = (props: Object) => {
  const keys = [
    "children",
    "theme",
    "size",
    "loading",
    "active",
    "block",
    "outline",
    "tooltip",
    "tooltipText"
  ];
  const newProps = _.omit(props, keys);
  const {
    children,
    theme,
    size,
    loading,
    outline,
    active,
    block,
    className,
    tooltip,
    tooltipText
  } = props;
  const isOutlined = !_.isUndefined(outline);
  const isClassName = !_.isUndefined(className);
  const btnClass = cn(`btn btn${isOutlined ? "-outline" : ""}-${theme} ${isClassName ? className : ""}`,
    {
      "btn-sm": size === "sm",
      "btn-xs": size === "xs",
      "btn-lg": size === "lg",
      "btn-loading": loading,
      "btn-active": active,
      "btn-block": block
    }
  );
  return (
    <button
      {...newProps}
      className={btnClass}>
      {loading &&
        <span className="icon-loading">
          <i className="icon icon-spinner icon-spin-animation" />
        </span>
      }
      {tooltip ?
        (
          <ToolTip
            placement="top"
            tooltip={tooltipText}>
            {children}
          </ToolTip>
        ) :
        (
          <span
            className="btn-content">{children}</span>
        )
      }
    </button>
  );
};


Button.propTypes = {
  children: PropTypes.any.isRequired,
  theme: PropTypes.string.isRequired,
  size: PropTypes.oneOf([ "xs", "sm", "lg" ]),
  loading: PropTypes.bool,
  outline: PropTypes.bool,
  active: PropTypes.bool,
  block: PropTypes.bool,
  className: PropTypes.string,
  tooltip: PropTypes.bool,
  tooltipText: PropTypes.string
};

export default Button;

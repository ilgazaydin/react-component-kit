/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";



const Tooltip = (props) => {

  const {
    children,
    placement,
    tooltip,
    className
  } = props;

  const tooltipPlacement = placement || "top";

  const tooltipText = _.isArray(children) &&
    _.map(children, (text) => {
      return text;
    }) || children;

  return (
    <span
      data-tooltip={tooltip}
      className={`tooltip-${tooltipPlacement} ${_.defaultTo(className, "")}`} >
      {tooltipText}
    </span>
  );
};


Tooltip.propTypes = {
  children: PropTypes.any,
  placement: PropTypes.string,
  tooltip: PropTypes.string,
  className: PropTypes.string
};

export default Tooltip;

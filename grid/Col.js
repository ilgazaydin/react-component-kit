/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";


const propTypes = {
  xs: PropTypes.oneOfType([ PropTypes.number, PropTypes.bool ]),
  sm: PropTypes.oneOfType([ PropTypes.number, PropTypes.bool ]),
  md: PropTypes.oneOfType([ PropTypes.number, PropTypes.bool ]),
  lg: PropTypes.oneOfType([ PropTypes.number, PropTypes.bool ]),
  xsOffset: PropTypes.number,
  smOffset: PropTypes.number,
  mdOffset: PropTypes.number,
  lgOffset: PropTypes.number,
  reverse: PropTypes.bool,
  className: PropTypes.string,
  tagName: PropTypes.string,
  children: PropTypes.node.isRequired
};

const classMap = {
  xs: "col-xs",
  sm: "col-sm",
  md: "col-md",
  lg: "col-lg",
  xsOffset: "col-xs-offset",
  smOffset: "col-sm-offset",
  mdOffset: "col-md-offset",
  lgOffset: "col-lg-offset"
};


const Col = (props) => {
  let classArray = [];
  _.forOwn(props, (val, key) => {
    if (classMap[key]) {
      classArray = _.concat(classArray, [ props.className ], _.isNumber(props[key]) ? (`${classMap[key]}-${props[key]}`) : classMap[key]);
    }
  });
  classArray = (!props.xs && !props.sm && !props.md && !props.lg) ? _.concat(classArray, [ "col-xs" ]) : classArray;
  classArray = (!props.xs) ? _.concat(classArray, [ "col-xs-12" ]) : classArray;
  classArray = _.uniq(([ ...classArray, props.className ]));

  return React.createElement(props.tagName || "div", {
    ..._.omit(props, [ "tagName", "children", ..._.keys(classMap) ]),
    className: classArray.join(" ")
  }, props.children);
};

Col.propTypes = propTypes;

export default Col;

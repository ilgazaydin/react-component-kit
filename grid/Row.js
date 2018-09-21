/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";


const propTypes = {
  reverse: PropTypes.bool,
  start: PropTypes.oneOf([ "xs", "sm", "md", "lg" ]),
  center: PropTypes.oneOf([ "xs", "sm", "md", "lg" ]),
  end: PropTypes.oneOf([ "xs", "sm", "md", "lg" ]),
  top: PropTypes.oneOf([ "xs", "sm", "md", "lg" ]),
  middle: PropTypes.oneOf([ "xs", "sm", "md", "lg" ]),
  bottom: PropTypes.oneOf([ "xs", "sm", "md", "lg" ]),
  around: PropTypes.oneOf([ "xs", "sm", "md", "lg" ]),
  between: PropTypes.oneOf([ "xs", "sm", "md", "lg" ]),
  first: PropTypes.oneOf([ "xs", "sm", "md", "lg" ]),
  last: PropTypes.oneOf([ "xs", "sm", "md", "lg" ]),
  className: PropTypes.string,
  tagName: PropTypes.string,
  children: PropTypes.node
};

const classMap = [
  "start",
  "center",
  "end",
  "top",
  "middle",
  "bottom",
  "around",
  "between",
  "first",
  "last"
];

const Row = (props) => {
  let classArray = [];
  _.forOwn(props, (val, key) => {
    if (_.includes(classMap, key)) {
      classArray = _.concat(classArray, [ `${key}-${val}` ]);
    }
    classArray = _.concat(classArray, [ "row", props.className ]);
  });
  classArray = _.uniq(classArray);

  return React.createElement(props.tagName || "div", {
    ..._.omit(props, [ "tagName", "children", ...classMap ]),
    className: classArray.join(" ")
  }, props.children);
};

Row.propTypes = propTypes;

export default Row;

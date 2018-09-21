/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";


const Icon = (props: Object) => {
  const {
    name,
    children,
    path,
    className,
    color,
    size,
    style,
    ...otherProps
  } = props;
  return (
    <i
      style={_.extend(
        {},
        style ? style : {},
        size ? {
          fontSize: `${size}px`
        } : {},
        color ? {
          color: `${color}`
        } : {}
      )}
      className={[
        "icon",
        `icon-${name}`,
        _.defaultTo(className, "")
      ].join(" ")}
      {...otherProps}>

      {!_.isUndefined(children) &&
        children
      }

      {!_.isUndefined(path) &&
        _.map(_.range(1, Number(path) + 1), (index) =>
          <span
            key={index}
            className={`path${index}`} />
        )
      }
    </i>
  );
};


Icon.propTypes = {
  children: PropTypes.any,
  name: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  path: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

export default Icon;

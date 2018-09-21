/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";



const Translate = ({
  values,
  content
}) =>
  React.createElement(
    "span",
    {},
    React.createElement(content, values)
  );


Translate.propTypes = {
  content: PropTypes.any.isRequired,
  values: PropTypes.object
};

export default Translate;

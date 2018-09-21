/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";

import _ from "lodash";
import accounting from "accounting";

export const FormatNumber = (value, precision, thousand, decimal) => {

  const resetValue = accounting.formatNumber(value, 2, thousand, decimal);

  const nonDecimal = _.startsWith(
    _.last(
      _.split(resetValue, decimal)),
    "00"
  );

  const validPrecision = nonDecimal ? 0 : precision;

  return (accounting.formatNumber(value, validPrecision, thousand, decimal));
};

export const Num = ({ value, precision }, context) => {
  return (
    <span>
      {
        accounting.formatNumber(value, (precision ? precision : context.country.number.precision), context.country.number.thousand, context.country.number.decimal)
      }
    </span>
  );
};


Num.propTypes = {
  precision: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired
};

Num.contextTypes = {
  country: PropTypes.object.isRequired
};

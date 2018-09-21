/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import { FormatNumber } from "myk/ui";

const Currency = ({
  value = 0
}, {
  country: {
    currency: {
      symbol,
      position,
      isSeparate
    },
    number: {
      decimal,
      thousand,
      precision
    }
  }
  }) => {

  const currencyArray = [
    symbol,
    isSeparate ? " " : "",
    FormatNumber(value, precision, thousand, decimal)
  ];


  return (
    <span>
      {
        position === "left" ? currencyArray.join("") : _.reverse(currencyArray)
      }
    </span>
  );
};


Currency.propTypes = {
  symbol: PropTypes.string,
  position: PropTypes.oneOf([
    "left",
    "right"
  ]),
  isSeparate: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired
};

Currency.contextTypes = {
  country: PropTypes.object.isRequired
};

export default Currency;

/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
/* eslint-disable react/prop-types */
import React from "react";
import moment from "moment";

let msg = {};

try {
  msg = require("./../../language/language.forms").default;
}
catch (err) {
  msg = {
    required: "This field is required",
    maxLength: ({ maxLength }) => <span>Max length is {maxLength}</span>,
    minLength: ({ minLength }) => <span>Min length is {minLength}</span>,
    pattern: "Wrong pattern",
    email: "Invalid e-mail",
    date: "Invalid date",
    number: "Not a number",
    equalsTo: "Fields do not match.",
    string: "Invalid character",
    max: ({ max }) => <span>Max value is {max}</span>,
    min: ({ min }) => <span>Min value is {min}</span>
  };
}


const Validation = {

  required: (value/*: ?string|Array|Boolean*/, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.required;
    // text & textarea & selectbox
    if (_.isUndefined(value)) {
      return errorMessage;
    }
    // selectbox multiple
    else if (_.isArray(value) && !value.length) {
      return errorMessage;
    }
    // checkbox
    else if (_.isBoolean(value) && !value) {
      return errorMessage;
    }
    else {
      return undefined;
    }
  },

  pattern: (value: ?string, pattern: Object, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.pattern;
    return (pattern.test(value) ? undefined : errorMessage);
  },

  min: (value: ?string, min: number, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.min;
    return Number(value) >= Number(min) ? undefined : errorMessage;
  },

  max: (value: ?string, max: number, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.max;
    return Number(value) <= Number(max) ? undefined : errorMessage;
  },

  minLength: (value: ?string, minLength: number, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.minLength;
    return value.toString().length >= Number(minLength) ? undefined : errorMessage;
  },

  maxLength: (value: ?string, maxLength: number, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.maxLength;
    return value.toString().length <= Number(maxLength) ? undefined : errorMessage;
  },

  email: (value: ?string, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.email;
    return (/^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i).test(value) ? undefined : errorMessage;
  },

  number: (value: ?string, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.number;
    return (/^[0-9.,]+$/gi).test(value) ? undefined : errorMessage;
  },

  equalsTo: (value: ?any, value2: ?any, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.equalsTo;
    return value === value2 ? undefined : errorMessage;
  },

  string: (value: ?string, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.string;
    return (/^[a-zA-ZöÖıİüÜğĞçÇşŞ-]+$/).test(value) ? undefined : errorMessage;
  },

  dateValid: (value: ?string, customMsg) => {
    const errorMessage = _.isString(customMsg) ? customMsg : msg.dateValid;
    return checkAndReturnDate(value).valid ? undefined : errorMessage;
  },

  dateRange: (value: ?string, minDate: ?string, maxDate: ?string, customMsg) => {
    const selectedDateObj = checkAndReturnDate(value);
    const errorMessage = _.isString(customMsg) ? customMsg : msg.dateRange;
    const minDateObj = moment(minDate);
    const maxDateObj = moment(maxDate);
    const selectedDate = moment(selectedDateObj.dateObj);
    const isDateRangeValid =
      moment(selectedDate).diff(moment(minDateObj)) >= 0 &&
      moment(maxDateObj).diff(moment(selectedDate)) >= 0;
    return isDateRangeValid ? undefined : errorMessage;
  },

  returnDateObj: (dateStr: ?string) => checkAndReturnDate(dateStr)

};


const checkAndReturnDate = (dateStr: string) => {
  //
  const selectedDateArray = _.split(dateStr, /[\D]+/gi);
  const separatedWithSlash = _.join(selectedDateArray, "/");
  const isValid = (/([0-9]{4}\/([0-1]{1}?)[0-9]{1}\/([0-3]{1}?)[0-9]{1}|([0-3]{1}?)[0-9]{1}\/([0-1]{1}?)[0-9]{1}\/[0-9]{4})/).test(separatedWithSlash);
  const validDate = (/[0-9]{4}\/([0-1]{1}?)[0-9]{1}\/([0-3]{1}?)[0-9]{1}/).test(separatedWithSlash) ? separatedWithSlash : _.join(_.reverse(selectedDateArray), "/");
  const dateObj = new Date(validDate);
  const result = {
    dateObj,
    valid: isValid,
    dateStr: validDate
  };
  return result;
};



export default Validation;

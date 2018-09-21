/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import cn from "classnames";

const InputField = (props: Object) => {
  const { meta, input } = props;
  const natives = _.pick(props, [
    "name",
    "id",
    "className",
    "type",
    "onKeyDown",
    "onKeyPress",
    "onKeyUp",
    "min",
    "max",
    "minLength",
    "maxLength",
    "pattern",
    "required",
    "disabled",
    "readOnly",
    "autoFocus",
    "autoComplete",
    "placeholder",
    "step"
  ]);
  const {
    label,
    formGroupClass,
    className,
    help,
    fieldLoading,
    inputGroups,
    size
  } = props;
  // console.log("inputField natives ", natives);
  // console.log("inputField input ", input);
  // console.log("inputField meta ", meta);

  const formGroupFeedbackClass = cn(formGroupClass, {
    "has-feedback has-error": meta.touched && meta.invalid,
    "has-feedback has-success": meta.touched && meta.valid
  });
  const inputFeedbackClass = cn({
    "input-invalid": meta.touched && meta.invalid,
    "input-valid": meta.touched && meta.valid,
    "field-loading": meta.asyncValidating || fieldLoading,
    "input-group": !_.isEmpty(inputGroups),
    "input-group-left": !_.isEmpty(inputGroups) && _.some(inputGroups, {
      position: "left"
    }),
    "input-group-right": !_.isEmpty(inputGroups) && _.some(inputGroups, {
      position: "right"
    })
  });

  return (
    <div className={`form-group ${formGroupFeedbackClass}`}>
      {label &&
        <label htmlFor={natives.id} >
          {label}
        </label>
      }

      <div className={`field-holder input-holder ${inputFeedbackClass}`}>
        {
          _.map(_.filter(inputGroups, {
            position: "left"
          }), ({ content, type }, index) =>
            <span
              className={cn(`input-group-${type}`, {
                "input-sm": size === "sm",
                "input-lg": size === "lg"
              })} key={index}>
              {content}
            </span>
          )
        }
        <input
          readOnly={meta.submitting}
          {...natives}
          {...input}
          className={cn(`form-control ${_.defaultTo(className, "")}`, {
            "input-sm": size === "sm",
            "input-lg": size === "lg"
          })} />
        {
          _.map(_.filter(inputGroups, {
            position: "right"
          }), ({ content, type }, index) =>
            <span
              className={cn(`input-group-${type}`, {
                "input-sm": size === "sm",
                "input-lg": size === "lg"
              })} key={index}>
              {content}
            </span>
          )
        }
        {(meta.asyncValidating || fieldLoading) &&
          <i className="icon icon-spinner icon-spin-animation" />
        }
      </div>

      {help &&
        <p className="field-desc">
          {help}
        </p>
      }

      {meta.touched &&
        <span className="form-control-feedback ">
          <i
            className={cn("icon", {
              "icon-times": meta.invalid,
              "icon-check": meta.valid
            })} />
        </span>
      }

      {meta.touched && meta.error &&
        <div className="form-messages">
          <p>{meta.error}</p>
        </div>
      }

    </div>
  );
};

InputField.propTypes = {
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  validate: PropTypes.array,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf([ "text", "tel", "number", "date", "month", "color", "date", "datetime", "datetime-local", "email", "month", "number", "range", "search", "tel", "time", "url", "week", "password" ]).isRequired,
  className: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  minLength: PropTypes.string,
  maxLength: PropTypes.string,
  pattern: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoComplete: PropTypes.oneOf([ "on", "off" ]),
  placeholder: PropTypes.string,
  step: PropTypes.string,
  label: PropTypes.string,
  formGroupClass: PropTypes.string,
  help: PropTypes.string,
  fieldLoading: PropTypes.bool,
  inputGroups: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.oneOf([ "left", "right" ]).isRequired,
      type: PropTypes.oneOf([ "addon", "btn" ]).isRequired,
      content: PropTypes.any.isRequired
    }).isRequired,
  ),
  size: PropTypes.oneOf([ "sm", "md", "lg" ])
};

export default InputField;

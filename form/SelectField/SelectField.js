/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import cn from "classnames";


const SelectField = (props: Object) => {
  const { meta, input } = props;
  const natives = _.pick(props, [
    "name",
    "id",
    "className",
    "required",
    "disabled",
    "readOnly",
    "autoFocus",
    "multiple"
  ]);
  const {
    label,
    formGroupClass,
    className,
    options,
    placeholder,
    help,
    fieldLoading,
    inputGroups,
    size
  } = props;
  // console.log("selectField natives ", natives);
  // console.log("selectField input ", input);
  // console.log("selectField meta ", meta);
  // console.log("fieldLoading ", fieldLoading);

  const formGroupFeedbackClass = cn(formGroupClass, {
    "has-feedback has-error": meta.touched && meta.invalid,
    "has-feedback has-success": meta.touched && meta.valid
  });
  const inputFeedbackClass = cn({
    "input-invalid": meta.touched && meta.invalid,
    "input-valid": meta.touched && meta.valid,
    "field-loading": fieldLoading,
    "input-group": !_.isEmpty(inputGroups),
    "input-group-left": !_.isEmpty(inputGroups) && _.some(inputGroups, {
      position: "left"
    }),
    "input-group-right": !_.isEmpty(inputGroups) && _.some(inputGroups, {
      position: "right"
    })
  });

  const optionsArray = () => {
    const isGrouped = _.every(options, "group");
    if (isGrouped) {
      const grouped = _.groupBy(options, "group");
      return _.map(grouped, (groupedArray, key) =>
        <optgroup key={key} label={key}>
          {
            _.map(groupedArray, ({ value, id, description, group, title }, index) =>
              <option
                key={`id${index}`}
                title={title}
                value={value}>
                {description}
              </option>
            )
          }
        </optgroup>
      );
    }
    else {
      return _.map(options, ({ value, id, description, title }, index) =>
        <option
          key={`id${index}`}
          title={title}
          value={value}>
          {description}
        </option>
      );
    }
  };

  return (
    <div className={`form-group has-feedback ${formGroupFeedbackClass}`}>
      {label &&
        <label htmlFor={natives.id} >
          {label}
        </label>
      }

      <div className={`field-holder select-holder ${inputFeedbackClass}`}>
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
        <select
          {...natives}
          {...input}
          disabled={_.isEmpty(optionsArray()) || natives.disabled}
          className={cn(`form-control ${_.defaultTo(className, "")}`, {
            "input-sm": size === "sm",
            "input-lg": size === "lg"
          })}>
          {
            placeholder &&
            <option key="default" value="" disabled>{placeholder}</option>
          }
          {optionsArray()}
        </select>
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

SelectField.propTypes = {
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  validate: PropTypes.array,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      value: PropTypes.any.isRequired,
      description: PropTypes.any.isRequired,
      group: PropTypes.string
    })
  ).isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  formGroupClass: PropTypes.string,
  multiple: PropTypes.oneOf([ true, false ]),
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

export default SelectField;

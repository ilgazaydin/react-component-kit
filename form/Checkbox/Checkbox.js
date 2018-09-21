/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import cn from "classnames";


const Checkbox = (props: Object) => {
  const { meta, input } = props;
  const natives = _.pick(props, [
    "name",
    "id",
    "className",
    "type",
    "required",
    "disabled",
    "readOnly"
  ]);
  const {
    label,
    formGroupClass,
    className
  } = props;
  // console.log("Checkbox natives ", natives);
  // console.log("Checkbox input ", input);
  // console.log("Checkbox meta ", meta);

  const formGroupFeedbackClass = cn(formGroupClass, {
    "has-feedback has-error": meta.touched && meta.invalid,
    "has-feedback has-success": meta.touched && meta.valid
  });
  const inputFeedbackClass = cn(className, {
    "input-invalid": meta.touched && meta.invalid,
    "input-valid": meta.touched && meta.valid
  });

  return (
    <div className={`form-group ${formGroupFeedbackClass}`}>

      <div className="checkbox checkbox-custom">
        <input
          {...natives}
          {...input}
          // checked={input.checked}
          className={`form-control ${inputFeedbackClass}`} />
        <label htmlFor={natives.id} >
          {props.label}
        </label>
      </div>

      {/*meta.touched &&
        <span className="form-control-feedback ">
          {meta.invalid &&
            <i className="icon icon-times" />
          }
          {meta.valid &&
            <i className="icon icon-check" />
          }
        </span>
      */}

      {meta.touched && meta.error &&
        <div className="form-messages">
          <p>{meta.error}</p>
        </div>
      }


    </div>
  );
};

Checkbox.propTypes = {
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  validate: PropTypes.array,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf([ "checkbox" ]).isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  label: PropTypes.any.isRequired,
  formGroupClass: PropTypes.string
};

export default Checkbox;

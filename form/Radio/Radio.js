/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import cn from "classnames";




class Radio extends Component {

  constructor(props) {
    super(props);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.props.input.onChange(nextProps.input.value);
  }

  handleRadioChange(event) {
    this.props.input.onChange(event.target.value);
  }

  render() {
    const { meta, input } = this.props;
    const natives = _.pick(this.props, [
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
      className,
      radiosHolderClass,
      fieldHolderClass,
      items
    } = this.props;

    const formGroupFeedbackClass = cn(formGroupClass, {
      "has-error": meta.touched && meta.invalid,
      "has-success": meta.touched && meta.valid
    });
    const inputFeedbackClass = cn(fieldHolderClass, {
      "input-invalid": meta.touched && meta.invalid,
      "input-valid": meta.touched && meta.valid
    });

    const uniqueId = natives.id ? natives.id : `input-${Math.random()
      .toString(36)
      .slice(2)}`;

    return (

      <div className={`form-group has-feedback ${formGroupFeedbackClass}`}>

        {
          this.props.label &&
          <label>{this.props.label}</label>
        }
        <div className={`field-holder ${inputFeedbackClass}`}>
          <div className={`${_.defaultTo(className, "")}`}>
            <div className={`radios-holder ${radiosHolderClass}`}>
              {
                _.map(items, (item, index) =>
                  <div key={index} className="radio-custom">
                    <input
                      name={item.name}
                      onChange={this.handleRadioChange}
                      value={item.value}
                      checked={item.value === this.props.input.value}
                      id={`${uniqueId}-${item.value}`}
                      type="radio" />
                    <label htmlFor={`${uniqueId}-${item.value}`} >
                      {item.label}
                    </label>
                  </div>
                )
              }
            </div>

          </div>

        </div>
        <input
          {...natives}
          type="text"
          className="hidden visible-off opacity-0"
          style={{
            display: "none !important"
          }}
          onChange={() => { }}
          value={this.props.input.value} />



        {meta.touched &&
          <span className="form-control-feedback ">
            {meta.invalid &&
              <i className="icon icon-times" />
            }
            {meta.valid &&
              <i className="icon icon-check" />
            }
          </span>
        }

        {meta.touched && meta.error &&
          <div className="form-messages">
            <p>{meta.error}</p>
          </div>
        }
      </div>

    );

  }
}

Radio.propTypes = {
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  validate: PropTypes.array,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.any.isRequired
    })
  ).isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  label: PropTypes.any,
  formGroupClass: PropTypes.string,
  fieldHolderClass: PropTypes.string,
  radiosHolderClass: PropTypes.string,
  value: PropTypes.string
};

export default Radio;

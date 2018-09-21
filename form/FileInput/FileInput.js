/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { change } from "redux-form";
import _ from "lodash";
import cn from "classnames";


class FileInput extends Component {

  constructor(props) {
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleClearSelectedFile = this.handleClearSelectedFile.bind(this);
    this.state = {
      selectedFile: ""
    };
  }


  handleFileChange(event) {
    const fileName = event.target.files[0] ? event.target.files[0].name : "";
    this.setState({ selectedFile: fileName });
    this.props.dispatch(change(this.props.formName, this.props.name, event.target.files[0].name));
  }

  handleClearSelectedFile(field) {
    document.getElementById(field).value = "";
    this.setState({ selectedFile: "" });
  }

  render() {
    const { meta, input } = this.props;
    const natives = _.pick(this.props, [
      "name",
      "id",
      "required",
      "disabled",
      "type"
    ]);
    const {
      label,
      btnlabel,
      theme,
      size,
      loading,
      outline,
      className,
      icon,
      formGroupClass,
      formName,
      clear
    } = this.props;

    const isOutlined = !_.isUndefined(outline);
    const isClassName = !_.isUndefined(className);
    const btnClass = cn(`cful btn btn${isOutlined ? "-outline" : ""}-${theme} ${isClassName ? className : ""}`,
      {
        "btn-sm": size === "sm",
        "btn-xs": size === "xs",
        "btn-lg": size === "lg",
        "btn-loading": loading
      }
    );

    const clrClass = cn(`btn btn${isOutlined ? "-outline" : ""}-red`,
      {
        "btn-sm": size === "sm",
        "btn-xs": size === "xs",
        "btn-lg": size === "lg",
        "btn-loading": loading
      }
    );

    const inputFeedbackClass = cn(className, {
      "input-invalid": meta.touched && meta.invalid,
      "input-valid": meta.touched && meta.valid
    });

    const formGroupFeedbackClass = cn(formGroupClass, {
      "has-error": meta.touched && meta.invalid,
      "has-success": meta.touched && meta.valid
    });

    return (
      <div className={`form-group has-feedback ${formGroupFeedbackClass}`}>
        <label
          htmlFor={natives.id}>
          {label}
        </label>
        <div className={`field-holder input-holder input-group input-group-left ${inputFeedbackClass}`}>
          {icon &&
            <span className="input-group-addon">
              <i className="icon icon-file" />
            </span>
          }
          <label
            className={`form-control file-input-text ${inputFeedbackClass}`}
            htmlFor={natives.id}>
            {this.state.selectedFile}
          </label>
          <span className="input-group-btn">
            {clear &&
              <button
                type="button"
                onClick={() => {
                  this.handleClearSelectedFile(natives.id);
                }}
                className={clrClass}>
                CLEAR
              </button>
            }
            <label
              className={btnClass}
              htmlFor={natives.id}>
              {btnlabel}
            </label>
          </span>
        </div>
        <input
          type="file"
          {...natives}
          className="hidden visible-off opacity-0"
          style={{
            display: "none !important"
          }}
          onChange={this.handleFileChange} />

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

FileInput.propTypes = {
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  theme: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.string,
  loading: PropTypes.bool,
  outline: PropTypes.bool,
  formGroupClass: PropTypes.string,
  validate: PropTypes.array,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  btnlabel: PropTypes.string,
  className: PropTypes.string,
  formName: PropTypes.string.isRequired,
  clear: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
};

export default FileInput;

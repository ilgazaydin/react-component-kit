/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Icon from "../Icon/Icon.js";
import Button from "../Button/Button.js";



const Panel = (props, context) => {
  const {
    loading,
    title,
    className,
    headingClassName,
    bodyClassName,
    children,
    goBack
  } = props;


  return (
    <div
      className={cn("myk-panel", {
        "panel-loading": loading,
        className
      })}>
      {!_.isUndefined(title) &&
        <div className={`myk-panel-heading ${headingClassName}`}>
          {goBack &&
            <Button
              className="btn-back"
              theme="active-blue-ocean"
              size="xs"
              onClick={goBack}>
              <Icon name="arrow-left" size="16" />
            </Button>
          }
          <h6>{title}</h6>
        </div>
      }
      <div className={`myk-panel-body ${bodyClassName}`} >
        {children}
      </div>
    </div>
  );
};


Panel.propTypes = {
  loading: PropTypes.bool,
  title: PropTypes.any,
  className: PropTypes.string,
  headingClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  children: PropTypes.any.isRequired,
  goBack: PropTypes.func
};

Panel.contextTypes = {
};



export default Panel;

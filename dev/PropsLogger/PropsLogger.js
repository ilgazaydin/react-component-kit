/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

const PropsLoggerElement = ({ props }) => {
  return (

    <div style={{ position: "absolute" }}>
      <i
        className="icon icon-info"
        style={{
          fontSize: "10px",
          cursor: "pointer",
          color: "#CCC"
        }}
        onClick={(event) => {
          event.target.nextSibling.style.display = event.target.nextSibling.style.display === "flex" ? "none" : "flex";
          event.target.nextSibling.style.direction = "row";
        }} />
      <div
        style={{
          display: "none",
          flexDirection: "row"
        }}>
        {
          _.map(props, (item, index) => (
            <div
              key={index} style={{
                flex: "1 1 auto",
                fontSize: "11px !important"
              }}>
              <pre>{_.findKey(props, item)}:&nbsp;
                <code style={{ fontSize: "11px" }}>
                  {JSON.stringify(item, 4, "  ")}
                </code>
              </pre>
            </div>
          ))
        }
      </div>
    </div>
  );
};

PropsLoggerElement.propTypes = {
  props: PropTypes.array
};

export default PropsLoggerElement;

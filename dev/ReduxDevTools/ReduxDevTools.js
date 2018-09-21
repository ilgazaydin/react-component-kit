/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";
import { createDevTools } from "redux-devtools";
import LogMonitor from "redux-devtools-log-monitor";
import DockMonitor from "redux-devtools-dock-monitor";

export default createDevTools(
  <DockMonitor
    toggleVisibilityKey="ctrl-alt-r"
    changePositionKey="ctrl-alt-q"
    changeMonitorKey="ctrl-alt-m"
    size={0.2}
    isVisible
    defaultIsVisible={false}
    defaultPosition="right">
    <LogMonitor />
  </DockMonitor>
);

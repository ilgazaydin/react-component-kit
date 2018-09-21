import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import _ from "lodash";
/* eslint-disable flowtype/require-return-type */
import { take, call, put, fork, takeEvery } from "redux-saga/effects";
import * as Notifications from "./Notification.actions";

let notificationTitles = {};

try {
  notificationTitles = require("../../language/language.common.js").default.notificationTitles;
}
catch (err) {
  notificationTitles = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
    processing: "Processing"
  };
}


type ObjectType = {
  uid: ?string;
  title: ?string;
  message: ?string | ?Object;
  position: ?'tr' | 'tl' | 'tc' | 'br' | 'bl' | 'bc';
  autoDismiss: ?number;
  dismissible: ?boolean;
  level: ?"success" | "error" | "warning" | "info";
  action: ?Object;
  children: ?any;
  onAdd: ?Function;
  onRemove: ?Function;
};

type NotificationType = ObjectType | string | null;

const notificationOpts = {
  title: "",
  message: "",
  position: "br",
  autoDismiss: 4
  // action: {
  //   label: 'Click me!!',
  //   callback: () => {}
  // },
  // level: "success"
  // uid: 'once-please', // you can specify your own uid if required
  //children: "",
  // onAdd: () => { },
  // onRemove: () => { }
};

const returnNotifObject = (title: any, args: any, obj: any) =>
  _.extend(
    {},
    notificationOpts,
    obj,
    {
      title: <div className="holder">
        <i
          className={cn("icon", {
            "icon-check": obj.level === "success",
            "icon-times": obj.level === "danger",
            "icon-info": obj.level === "info",
            "icon-warning": obj.level === "warning"
          })} />
        <div className="notification-content">
          {title}
        </div>
      </div>
    },
    _.isString(args) ? {
      message: _.defaultTo(args, "")
    } : args
  );

export function* Success(args: NotificationType) {
  yield put(
    Notifications.success(
      returnNotifObject(notificationTitles.success, args, {
        level: "success"
      })
    )
  );
}

export function* Danger(args: NotificationType) {
  yield put(
    Notifications.error(
      returnNotifObject(notificationTitles.error, args, {
        level: "danger"
      })
    )
  );
}

export function* Warning(args: NotificationType) {
  yield put(
    Notifications.warning(
      returnNotifObject(notificationTitles.warning, args, {
        level: "warning"
      })
    )
  );
}

export function* Info(args: NotificationType) {
  yield put(
    Notifications.info(
      returnNotifObject(notificationTitles.info, args, {
        level: "info"
      })
    )
  );
}

export function* Clear() {
  yield put(
    Notifications.clear()
  );
}

export function* Progress(message: NotificationType) {
  yield put(
    Notifications.info(
      returnNotifObject(message, {
        message,
        dismissable: false,
        autoDismiss: 0,
        progress: true,
        title:
  <div>
    <i className="icon icon-spinner icon-spin-animation" />
    <span className="xs-ml-10">{notificationTitles.processing}</span>
  </div>
      }, {
        level: "progress"
      })
    )
  );
}

export default function* sagaWatcher() {
  // yield takeEvery("@@router/LOCATION_CHANGE", Clear);
}

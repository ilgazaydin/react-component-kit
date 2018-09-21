/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React from "react";
import PropTypes from "prop-types";

import _ from "lodash";
import * as actions from "./Notification.actions";

import NotifySystem from "react-notification-system";




class Notifications extends React.Component {
  constructor() {
    super();
  }

  componentWillReceiveProps(nextProps) {
    const { notifications } = nextProps;

    if (notifications.length === 0) {
      return this.system().clearNotifications();
    }

    const notificationIds = _.map(notifications, notification => notification.uid);

    // Get all active notifications from react-notification-system
    /// and remove all where uid is not found in the reducer
    _.forEach((this.system().state.notifications || []), notification => {
      if (_.includes(notificationIds, notification.uid) < 0) {
        this.system().removeNotification(notification.uid);
      }
    });

    _.forEach(notifications, notification => {
      this.system().addNotification({
        ...notification,
        onRemove: () => {
          this.context.store.dispatch(actions.hide(notification.uid));
          _.invoke(notification, "onRemove");
        }
      });
    });

  }

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

  system() {
    return this.refs.notify;
  }

  render() {
    const { notifications, ...rest } = this.props;

    return (
      <NotifySystem ref="notify" {...rest} />
    );
  }
}

Notifications.propTypes = {
  notifications: PropTypes.array
};

Notifications.contextTypes = {
  store: PropTypes.object
};

// Tie actions to Notifications component instance
_.forOwn(actions, (val, key) => {
  Notifications[key] = val;
});


export default Notifications;

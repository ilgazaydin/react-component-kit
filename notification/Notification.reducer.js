import NOTIFICATION from "./Notification.constants";


export default function notificationsReducer(state: Array = [], action: Object = {}) {
  switch (action.type) {


    case NOTIFICATION.SHOW:
      const { ...rest } = action;
      const oldState = action.level === "success" ? _.reject(state, { progress: true }) : state;
      return [
        ...oldState,
        {
          ...rest,
          uid: action.uid
        }
      ];


    case NOTIFICATION.HIDE:
      return _.reject(state, { uid: action.uid });


    case NOTIFICATION.CLEAR:
      return [];

    default:
      return state;
  }
}

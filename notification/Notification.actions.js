import NOTIFICATION from "./Notification.constants";

//Example opts
// {
//   title: 'Hey, it\'s good to see you!',
//   message: 'Now you can see how easy it is to use notifications in React!',
//   position: 'tr',
//   autoDismiss: 0,
//   action: {
//     label: 'Awesome!',
//     callback: function() {
//       console.log('Clicked');
//     }
//   }
// }

export function show(opts: Object = {}, level: string = "success"): Object {
  return {
    type: NOTIFICATION.SHOW,
    ...opts,
    uid: opts.uid || Date.now(),
    level
  };
}

export function success(opts: Object): Object {
  return show(opts, "success");
}

export function error(opts: Object): Object {
  return show(opts, "error");
}

export function warning(opts: Object): Object {
  return show(opts, "warning");
}

export function info(opts: Object): Object {
  return show(opts, "info");
}

export function hide(uid: string | number): Object {
  return {
    type: NOTIFICATION.HIDE,
    uid
  };
}
export function clear(): Object {
  return {
    type: NOTIFICATION.CLEAR
  };
}

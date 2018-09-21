import _ from "lodash";

const replaceUrlParams = (url: string, paramsObject: Object) => {
  if (_.isUndefined(url) || _.isUndefined(paramsObject)) {
    return null;
  }
  _.forOwn(paramsObject, (val: any, key: string) => {
    const reg = new RegExp(`{${key}}`, "g");
    url = url.replace(reg, val);
  });

  return (/\{[a-zA-Z0-9.-_]+\}/gi).test(url) ?
    null :
    url;

};


export default replaceUrlParams;

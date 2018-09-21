const replaceRouteParams = (url: string, paramsObject: Object): string =>
  _.map(url.split("/"), (item: string | number): string | number =>
    _.defaultTo(
      _.get(paramsObject, item.replace(":", "")),
      item
    )
  ).join("/");


export default replaceRouteParams;

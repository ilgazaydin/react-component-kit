const ls = window.localStorage;

const Storage = {

  get: (key: string) => {
    if (!key) {
      throw Error("Missing key");
    }
    const value = ls.getItem(key);
    if (value === undefined) {
      return null;
    }
    const expiryDate = ls.getItem(`${key}_expiryDate`);
    if (expiryDate) {
      const expiryDateObj = new Date(expiryDate);
      const now = new Date();
      const isExpired = now > expiryDateObj;
      if (isExpired) {
        ls.removeItem(key);
        ls.removeItem(`${key}_expiryDate`);
        return null;
      }
    }
    return JSON.parse(ls.getItem(key));
  },

  set: (key: string, value: any, dateOrMinutes: ?number | ?Object) => {
    if (value === undefined || value === undefined) {
      throw Error("Missing key/value");
    }
    ls.setItem(key, JSON.stringify(value));
    if (dateOrMinutes !== undefined) {
      const expiryDate = dateOrMinutes instanceof Date ?
                dateOrMinutes :
                new Date().setMinutes(new Date().getMinutes() + dateOrMinutes);
      ls.setItem(`${key}_expiryDate`, expiryDate);
    }
  },

  remove: (key: string) => {
    ls.removeItem(key);
    ls.removeItem(`${key}_expiryDate`);
  }

};

export default Storage;

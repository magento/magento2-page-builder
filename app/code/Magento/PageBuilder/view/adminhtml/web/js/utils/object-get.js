/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Retrieve a value within an object using a dot notation
   *
   * Original source from https://github.com/NarHakobyan/underscore.get
   *
   * @param {{}} obj
   * @param {string} desc
   * @param value
   * @returns {any}
   */
  function get(obj, desc, value) {
    var arr = desc ? desc.split(".") : [];

    while (arr.length && obj) {
      var comp = arr.shift();
      var match = /(.+)\[([0-9]*)\]/.exec(comp); // handle arrays

      if (match !== null && match.length === 3) {
        var arrayData = {
          arrName: match[1],
          arrIndex: match[2]
        };

        if (obj[arrayData.arrName] !== undefined) {
          obj = obj[arrayData.arrName][arrayData.arrIndex];
        } else {
          obj = undefined;
        }

        continue;
      }

      obj = obj[comp];
    }

    if (typeof value !== "undefined") {
      if (obj === undefined) {
        return value;
      }
    }

    return obj;
  }

  return get;
});
//# sourceMappingURL=object-get.js.map

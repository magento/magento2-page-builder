/*eslint-disable */
/* jscs:disable */
define(["object-path"], function (_objectPath) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Retrieve a value from an object via a path
   *
   * @param {object} object
   * @param {string} path
   * @param {TResult} defaultValue
   * @returns {TResult}
   */
  function get(object, path, defaultValue) {
    return _objectPath.get(object, path, defaultValue);
  }
  /**
   * Set a value within an object via a path
   *
   * @param {object} object
   * @param {string} path
   * @param {TResult} value
   * @returns {TResult | undefined}
   */


  function set(object, path, value) {
    return _objectPath.set(object, path, value);
  }

  return {
    get: get,
    set: set
  };
});
//# sourceMappingURL=object.js.map
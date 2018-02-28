/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Callback that will add a delay between chained Promises
   *
   * @param {number} delay
   * @returns {() => Promise<any>}
   */
  function delayedPromise(delay) {
    return function (value) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          return resolve(value);
        }, delay);
      });
    };
  }

  return delayedPromise;
});
//# sourceMappingURL=delayed-promise.js.map

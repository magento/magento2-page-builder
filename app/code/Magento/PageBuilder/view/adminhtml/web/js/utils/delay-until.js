/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Delay until a condition is met
   *
   * @param {() => void} callback
   * @param {() => boolean} condition
   * @param {number} interval
   */
  function delayUntil(callback, condition, interval) {
    if (interval === void 0) {
      interval = 50;
    }

    var delayInterval = setInterval(function () {
      if (condition()) {
        clearInterval(delayInterval);
        callback();
      }
    }, interval);
  }

  return delayUntil;
});
//# sourceMappingURL=delay-until.js.map
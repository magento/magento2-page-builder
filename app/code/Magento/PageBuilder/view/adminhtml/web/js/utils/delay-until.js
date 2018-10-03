/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

  return _extends(delayUntil, {
    __esModule: true
  });
});
//# sourceMappingURL=delay-until.js.map

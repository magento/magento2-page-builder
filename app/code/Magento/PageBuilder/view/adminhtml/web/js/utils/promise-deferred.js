/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Returns a deferred promise
   *
   * @returns {DeferredInterface}
   * @api
   */
  function deferred() {
    var resolve;
    var reject;
    var promise = new Promise(function (promiseResolve, promiseReject) {
      resolve = promiseResolve;
      reject = promiseReject;
    });
    return {
      resolve: resolve,
      reject: reject,
      promise: promise
    };
  }

  return deferred;
});
//# sourceMappingURL=promise-deferred.js.map
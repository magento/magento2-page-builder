/*eslint-disable */
define(["Magento_PageBuilder/js/loader"], function (_loader) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Create an allowed container generator instance
   *
   * @param {string} path
   * @returns {Promise<AllowedContainersGenerator>}
   */
  function createAllowedContainersGenerator(path) {
    return new Promise(function (resolve) {
      (0, _loader)([path], function (allowedContainer) {
        resolve(new allowedContainer());
      });
    });
  }

  return {
    createAllowedContainersGenerator: createAllowedContainersGenerator
  };
});
//# sourceMappingURL=allowed-containers-factory.js.map

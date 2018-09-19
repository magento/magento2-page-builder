/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Convert percent to decimal
   *
   * @param {string} value
   * @returns {string}
   * @api
   */
  function percentToDecimal(value) {
    return (parseInt(value, 10) / 100).toString();
  }

  return {
    __esModule: true,
    percentToDecimal: percentToDecimal
  };
});
//# sourceMappingURL=number-converter.js.map

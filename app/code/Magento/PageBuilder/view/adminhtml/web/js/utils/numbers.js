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
   */
  function convertPercentToDecimal(value) {
    return (parseInt(value, 10) / 100).toString();
  }

  return {
    convertPercentToDecimal: convertPercentToDecimal
  };
});
//# sourceMappingURL=numbers.js.map

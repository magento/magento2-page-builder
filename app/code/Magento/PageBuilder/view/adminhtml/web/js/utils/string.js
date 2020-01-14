/*eslint-disable */
/* jscs:disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Convert from snake case to camel case
   *
   * @param {string} currentString
   * @returns {string}
   * @api
   */
  function fromSnakeToCamelCase(currentString) {
    var parts = currentString.split(/[_-]/);
    var newString = "";

    for (var i = 1; i < parts.length; i++) {
      newString += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
    }

    return parts[0] + newString;
  }

  return {
    fromSnakeToCamelCase: fromSnakeToCamelCase
  };
});
//# sourceMappingURL=string.js.map
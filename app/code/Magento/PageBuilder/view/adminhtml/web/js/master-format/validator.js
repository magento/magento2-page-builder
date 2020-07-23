/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/config"], function (_config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Validate if content has page builder format by checking for any data-content-type attributes
   *
   * @param {string} content
   * @returns {boolean}
   */
  function validate(content) {
    var stageDocument = new DOMParser().parseFromString(content, "text/html");
    return !!stageDocument.querySelector("[" + _config.getConfig("dataContentTypeAttributeName") + "]");
  }

  return validate;
});
//# sourceMappingURL=validator.js.map
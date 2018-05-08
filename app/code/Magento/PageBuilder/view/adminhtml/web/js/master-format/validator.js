/*eslint-disable */
define(["Magento_PageBuilder/js/config"], function (_config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Validate if content has page builder format
   *
   * @param {string} content
   * @returns {boolean}
   */
  function Validate(content) {
    var stageDocument = document.createElement("div");
    stageDocument.setAttribute(_config.getConfig("dataRoleAttributeName"), "stage");
    stageDocument.innerHTML = content;
    return !!stageDocument.querySelector("[" + _config.getConfig("dataRoleAttributeName") + "=\"row\"]");
  }

  return Validate;
});
//# sourceMappingURL=validator.js.map

/*eslint-disable */
define(["Magento_PageBuilder/js/component/config"], function (_config) {
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
  function formatValidate(content) {
    var stageDocument = document.createElement("div");
    stageDocument.setAttribute(_config.getValueAsString("dataRoleAttributeName"), "stage");
    stageDocument.innerHTML = content;
    return !!stageDocument.querySelector("[" + _config.getValueAsString("dataRoleAttributeName") + "=\"row\"]");
  }

  return formatValidate;
});
//# sourceMappingURL=format-validator.js.map

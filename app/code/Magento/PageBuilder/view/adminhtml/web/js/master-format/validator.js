/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

  return _extends(Validate, {
    __esModule: true
  });
});
//# sourceMappingURL=validator.js.map

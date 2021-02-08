/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/string"], function (_string) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var StylePropertyReader = /*#__PURE__*/function () {
    "use strict";

    function StylePropertyReader() {}

    var _proto = StylePropertyReader.prototype;

    /**
     * Read style property from element
     *
     * @param {HTMLElement} element
     * @param {string} source
     * @returns {string | object}
     */
    _proto.read = function read(element, source) {
      var camelCasedSource = (0, _string.fromSnakeToCamelCase)(source);
      return element.style[camelCasedSource];
    };

    return StylePropertyReader;
  }();

  return StylePropertyReader;
});
//# sourceMappingURL=style-property-reader.js.map
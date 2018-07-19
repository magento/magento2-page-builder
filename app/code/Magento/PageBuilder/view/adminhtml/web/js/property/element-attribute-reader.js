/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var ElementAttributeReader =
  /*#__PURE__*/
  function () {
    function ElementAttributeReader() {}

    var _proto = ElementAttributeReader.prototype;

    /**
     * Read attribute from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    _proto.read = function read(element, source) {
      return element.getAttribute(source);
    };

    return ElementAttributeReader;
  }();

  return ElementAttributeReader;
});
//# sourceMappingURL=element-attribute-reader.js.map

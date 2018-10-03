/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var AttributeReader =
  /*#__PURE__*/
  function () {
    function AttributeReader() {}

    var _proto = AttributeReader.prototype;

    /**
     * Read attribute from element
     *
     * @param {HTMLElement} element
     * @param {string} source
     * @returns {string | object}
     */
    _proto.read = function read(element, source) {
      return element.getAttribute(source);
    };

    return AttributeReader;
  }();

  return _extends(AttributeReader, {
    __esModule: true
  });
});
//# sourceMappingURL=attribute-reader.js.map

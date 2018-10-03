/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["Magento_PageBuilder/js/utils/string"], function (_string) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var StylePropertyReader =
  /*#__PURE__*/
  function () {
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

  return _extends(StylePropertyReader, {
    __esModule: true
  });
});
//# sourceMappingURL=style-property-reader.js.map

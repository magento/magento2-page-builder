/*eslint-disable */
define(["../../../utils/color-converter"], function (_colorConverter) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Divider =
  /*#__PURE__*/
  function () {
    function Divider() {}

    var _proto = Divider.prototype;

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    _proto.read = function read(element) {
      var dividerElement = element.querySelector("hr");
      var response = {
        line_color: dividerElement.style.borderColor ? (0, _colorConverter.toHex)(dividerElement.style.borderColor) : "",
        line_thickness: dividerElement.style.borderWidth.replace("px", ""),
        line_width: dividerElement.style.width
      };
      return Promise.resolve(response);
    };

    return Divider;
  }();

  return Divider;
});
//# sourceMappingURL=divider.js.map

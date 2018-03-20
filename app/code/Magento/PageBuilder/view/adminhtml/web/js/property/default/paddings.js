/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Paddings =
  /*#__PURE__*/
  function () {
    function Paddings() {}

    var _proto = Paddings.prototype;

    /**
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    _proto.read = function read(element) {
      return {
        padding: {
          left: element.style.paddingLeft.replace("px", ""),
          top: element.style.paddingTop.replace("px", ""),
          right: element.style.paddingRight.replace("px", ""),
          bottom: element.style.paddingBottom.replace("px", "")
        }
      };
    };
    /**
     * @param {HTMLElement} element
     * @returns {string | Object}
     */


    _proto.write = function write(name, data) {
      if (data[name].padding === undefined) {
        return {};
      }

      return {
        paddingLeft: data[name].padding.left + "px",
        paddingTop: data[name].padding.top + "px",
        paddingRight: data[name].padding.right + "px",
        paddingBottom: data[name].padding.bottom + "px"
      };
    };

    return Paddings;
  }();

  return Paddings;
});
//# sourceMappingURL=paddings.js.map

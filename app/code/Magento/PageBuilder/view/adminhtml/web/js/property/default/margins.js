/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Margins =
  /*#__PURE__*/
  function () {
    function Margins() {}

    var _proto = Margins.prototype;

    /**
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    _proto.read = function read(element) {
      return {
        margin: {
          left: element.style.marginLeft.replace("px", ""),
          top: element.style.marginTop.replace("px", ""),
          right: element.style.marginRight.replace("px", ""),
          bottom: element.style.marginBottom.replace("px", "")
        }
      };
    };
    /**
     * @param {string} name
     * @param {Object} data
     * @returns {string | Object}
     */


    _proto.write = function write(name, data) {
      if (!data[name] || data[name].margin === undefined) {
        return {};
      }

      return {
        marginLeft: data[name].margin.left + "px",
        marginTop: data[name].margin.top + "px",
        marginRight: data[name].margin.right + "px",
        marginBottom: data[name].margin.bottom + "px"
      };
    };

    return Margins;
  }();

  return Margins;
});
//# sourceMappingURL=margins.js.map

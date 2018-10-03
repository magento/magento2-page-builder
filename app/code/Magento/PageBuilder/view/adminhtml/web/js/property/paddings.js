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
  var Paddings =
  /*#__PURE__*/
  function () {
    function Paddings() {}

    var _proto = Paddings.prototype;

    /**
     * Read paddings from element
     *
     * @param {HTMLElement} element
     * @returns {string | object}
     */
    _proto.read = function read(element) {
      return {
        padding: {
          left: element.style.paddingLeft,
          top: element.style.paddingTop,
          right: element.style.paddingRight,
          bottom: element.style.paddingBottom
        }
      };
    };

    return Paddings;
  }();

  return _extends(Paddings, {
    __esModule: true
  });
});
//# sourceMappingURL=paddings.js.map

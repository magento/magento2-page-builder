/*eslint-disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var Encode =
  /*#__PURE__*/
  function () {
    "use strict";

    function Encode() {}

    var _proto = Encode.prototype;

    /**
     * Convert value to internal format
     *
     * @param {string} value
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      // Convert the encoded string back to HTML without executing
      var html = new DOMParser().parseFromString(value, "text/html");
      return html.body.textContent;
    };
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {Object} data
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      return (0, _object.get)(data, name);
    };

    return Encode;
  }();

  return Encode;
});
//# sourceMappingURL=encode.js.map

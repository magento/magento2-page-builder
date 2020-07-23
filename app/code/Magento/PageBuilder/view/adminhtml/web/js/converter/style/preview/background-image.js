/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  var BackgroundImage =
  /*#__PURE__*/
  function () {
    "use strict";

    function BackgroundImage() {}

    var _proto = BackgroundImage.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return value;
    }
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      var value = (0, _object.get)(data, name);

      if (value && typeof value[0] === "object") {
        return "url(" + value[0].url + ")";
      }

      return "";
    };

    return BackgroundImage;
  }();

  return BackgroundImage;
});
//# sourceMappingURL=background-image.js.map
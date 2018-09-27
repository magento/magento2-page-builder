/*eslint-disable */
define([], function () {
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
    };
    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      var value = data[name];

      if (value && typeof value[0] === "object") {
        return "url(" + value[0].url + ")";
      }

      return "";
    };

    return BackgroundImage;
  }();

  return Object.assign(BackgroundImage, {
    __esModule: true
  });
});
//# sourceMappingURL=background-image.js.map

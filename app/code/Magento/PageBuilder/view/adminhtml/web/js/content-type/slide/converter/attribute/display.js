/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Display =
  /*#__PURE__*/
  function () {
    function Display() {}

    var _proto = Display.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {boolean}
     */
    _proto.fromDom = function fromDom(value) {
      return true;
    };
    /**
     * Hide the slide if the slide is empty on the storefront, fallback to support the ability to hide items
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */


    _proto.toDom = function toDom(name, data) {
      if (data.background_color === "" && data.background_image.length === 0 && (!data.link_url || !data.link_url.default || data.link_url.default === "") && data.content === "" && data.show_button === "never" && data.show_overlay === "never") {
        return "false";
      }

      return "true";
    };

    return Display;
  }();

  return Display;
});
//# sourceMappingURL=display.js.map

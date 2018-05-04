/*eslint-disable */
define(["underscore"], function (_underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @deprecated
   */
  var StyleAttributeFilter =
  /*#__PURE__*/
  function () {
    function StyleAttributeFilter() {
      this.allowedAttributes = ["align_self", "background_color", "background_image", "background_size", "background_attachment", "background_repeat", "background_position", "border", "border_style", "border_width", "border_color", "border_radius", "color", "display", "height", "min_height", "margin_bottom", "margin_left", "margin_right", "margin_top", "mobile_image", "padding_bottom", "padding_left", "padding_right", "padding_top", "text_align", "margins_and_padding", "width"];
    }

    var _proto = StyleAttributeFilter.prototype;

    /**
     * Get allowed attributes
     *
     * @returns {Array<string>}
     */
    _proto.getAllowedAttributes = function getAllowedAttributes() {
      return this.allowedAttributes;
    };
    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */


    _proto.filter = function filter(data) {
      var _this = this;

      var result = {};
      Object.keys(data).map(function (key) {
        if (_underscore.values(_this.allowedAttributes).indexOf(key) > -1) {
          result[key] = data[key];
        }
      });
      return result;
    };

    return StyleAttributeFilter;
  }();

  return StyleAttributeFilter;
});
//# sourceMappingURL=style-attribute-filter.js.map

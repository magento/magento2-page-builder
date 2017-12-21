define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var StyleAttributeFilter =
  /*#__PURE__*/
  function () {
    function StyleAttributeFilter() {
      this.allowedAttributes = ['width', 'height', 'min_height', 'background_color', 'background_image', 'background_size', 'background_attachment', 'background_repeat', 'background_position', 'border_style', 'border_width', 'border_color', 'border_radius', 'margin_top', 'margin_right', 'margin_bottom', 'margin_left', 'padding_top', 'padding_right', 'padding_bottom', 'padding_left', 'display', 'align_self', 'text_align', 'color', 'border', 'margins_and_padding'].reduce(function (acc, next) {
        acc[next] = true;
        return acc;
      }, {});
    }

    var _proto = StyleAttributeFilter.prototype;

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    _proto.filter = function filter(data) {
      var result = {};

      for (var key in data) {
        if (this.allowedAttributes[key]) {
          result[key] = data[key];
        }
      }

      return result;
    };

    return StyleAttributeFilter;
  }();

  return StyleAttributeFilter;
});
//# sourceMappingURL=style-attribute-filter.js.map

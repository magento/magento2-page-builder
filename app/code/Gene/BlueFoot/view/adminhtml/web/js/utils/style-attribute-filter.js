define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var StyleAttributeFilter =
  /*#__PURE__*/
  function () {
    function StyleAttributeFilter() {}

    var _proto = StyleAttributeFilter.prototype;

    /**
     * Filter allowed style properties from object
     *
     * @param data
     * @returns {object}
     */
    _proto.filter = function filter(data) {
      var styleAttributes = ['width', 'height', 'min_height', 'background_color', 'background_image', 'background_size', 'background_attachment', 'background_repeat', 'background_position', 'border_style', 'border_width', 'border_color', 'border_radius', 'margin_top', 'margin_right', 'margin_bottom', 'margin_left', 'padding_top', 'padding_right', 'padding_bottom', 'padding_left'];
      var result = {};
      Object.keys(data).map(function (key) {
        if (Object.values(styleAttributes).indexOf(key) > -1) {
          result[key] = data[key];
        }
      }.bind(this));
      return result;
    };

    return StyleAttributeFilter;
  }();

  return StyleAttributeFilter;
});
define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeFilter =
  /*#__PURE__*/
  function () {
    function AttributeFilter() {
<<<<<<< HEAD
      this.allowAttributes = ['name', 'appearance', 'id', 'src', 'button_text', 'label_text', 'placeholder', 'title', 'identifier', 'view_mode', 'sku', 'position', 'category_id', 'product_count', 'show_out_of_stock', 'autoplay', 'autoplay_speed', 'fade', 'is_infinite', 'show_arrows', 'show_dots', 'advanced_settings', 'has_overlay_background'];
=======
      this.allowedAttributes = ['name', 'appearance', 'id', 'src', 'button_text', 'label_text', 'placeholder', 'title', 'identifier', 'view_mode', 'sku', 'position', 'category_id', 'product_count', 'show_out_of_stock', 'autoplay', 'autoplay_speed', 'fade', 'is_infinite', 'show_arrows', 'show_dots', 'advanced_settings', 'has_overlay_background', 'enable_parallax', 'parallax_speed'].reduce(function (acc, next) {
        acc[next] = true;
        return acc;
      }, {});
>>>>>>> MAGETWO-66349-row
    }

    var _proto = AttributeFilter.prototype;

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

    return AttributeFilter;
  }();

  return AttributeFilter;
});
//# sourceMappingURL=attribute-filter.js.map

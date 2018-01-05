define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  'use strict';
  /*eslint-disable */


  var AttributeFilter =
  /*#__PURE__*/
  function () {
    function AttributeFilter() {
      this.allowAttributes = ['name', 'appearance', 'id', 'src', 'button_text', 'label_text', 'placeholder', 'title', 'identifier', 'view_mode', 'sku', 'position', 'category_id', 'product_count', 'show_out_of_stock', 'autoplay', 'autoplay_speed', 'fade', 'is_infinite', 'show_arrows', 'show_dots', 'advanced_settings', 'has_overlay_background', 'enable_parallax', 'parallax_speed'];
    }

    var _proto = AttributeFilter.prototype;

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    _proto.filter = function filter(data) {
      var _this = this;

      var attributes = {};
      Object.keys(data).map(function (key) {
        if (_this.allowAttributes.includes(key)) {
          attributes[key] = data[key];
        }
      });
      return attributes;
    };

    return AttributeFilter;
  }();

  return AttributeFilter;
});
//# sourceMappingURL=attribute-filter.js.map

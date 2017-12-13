define(["../../utils/data-object"], function (_dataObject) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeFilter =
  /*#__PURE__*/
  function () {
    function AttributeFilter() {
<<<<<<< HEAD
      this.allowedAttributes = (0, _dataObject.toDataObject)(['name', 'appearance', 'id', 'src', 'button_text', 'label_text', 'placeholder', 'title', 'identifier', 'view_mode', 'sku', 'position', 'category_id', 'product_count', 'show_out_of_stock', 'autoplay', 'autoplay_speed', 'fade', 'is_infinite', 'show_arrows', 'show_dots', 'advanced_settings', 'has_overlay_background']);
=======
      this.allowAttributes = ['name', 'appearance', 'id', 'src', 'button_text', 'label_text', 'placeholder', 'title', 'identifier', 'view_mode', 'sku', 'position', 'category', 'product_count', 'show_out_of_stock', 'autoplay', 'autoplay_speed', 'fade', 'is_infinite', 'show_arrows', 'show_dots', 'advanced_settings', 'has_overlay_background'];
>>>>>>> master
    }

    var _proto = AttributeFilter.prototype;

    /**
     * Filter allowed attributes from object
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    _proto.filter = function filter(data) {
      return (0, _dataObject.filterAttributes)(data, this.allowedAttributes);
    };

    return AttributeFilter;
  }();

  return AttributeFilter;
});
//# sourceMappingURL=attribute-filter.js.map

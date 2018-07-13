/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @deprecated
   */
  var AttributeMapper =
  /*#__PURE__*/
  function () {
    function AttributeMapper() {
      this.attributeNameMapping = {
        appearance: "data-appearance",
        element: "data-element",
        autoplay: "data-autoplay",
        autoplay_speed: "data-autoplay-speed",
        border: "data-border",
        button_text: "data-button-text",
        button_type: "data-button-type",
        category_id: "data-category-id",
        enable_parallax: "data-enable-parallax",
        fade: "data-fade",
        has_overlay_background: "data-has-overlay-background",
        id: "id",
        identifier: "data-identifier",
        is_infinite: "data-is-infinite",
        label_text: "data-label-text",
        name: "data-role",
        parallax_speed: "data-speed",
        placeholder: "data-placeholder",
        product_count: "data-product-count",
        show_arrows: "data-show-arrows",
        show_button: "data-show-button",
        show_dots: "data-show-dots",
        show_out_of_stock: "data-show-out-of-stock",
        show_overlay: "data-show_overlay",
        sku: "data-sku",
        src: "src",
        title: "data-title",
        view_mode: "data-view-mode"
      };
    }

    var _proto = AttributeMapper.prototype;

    /**
     * Map attribute keys to DOM key names and normalize values
     *
     * @param {DataObject} data
     * @returns {DataObject}
     */
    _proto.toDom = function toDom(data) {
      var _this = this;

      var result = {};
      Object.keys(data).map(function (key) {
        var value = data[key];

        if (key in _this.attributeNameMapping) {
          key = _this.attributeNameMapping[key];
        }

        result[key.replace("_", "-")] = value;
      });
      return result;
    };
    /**
     * Convert attributes from the DOM into the data store
     *
     * @param {} data
     * @returns {}
     */


    _proto.fromDom = function fromDom(data) {
      var _this2 = this;

      // Flip the object key / values
      var attributeMapping = Object.keys(this.attributeNameMapping).reduce(function (obj, key) {
        obj[_this2.attributeNameMapping[key]] = key;
        return obj;
      }, {});
      var result = {};
      Object.keys(data).map(function (key) {
        if (key in attributeMapping) {
          result[attributeMapping[key]] = data[key];
        }
      });
      return result;
    };

    return AttributeMapper;
  }();

  return AttributeMapper;
});
//# sourceMappingURL=attribute-mapper.js.map

define([], function () {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var AttributeMapper =
  /*#__PURE__*/
  function () {
    function AttributeMapper() {
      this.attributeNameMapping = {
        name: 'data-role',
        appearance: 'data-appearance',
        identifier: 'data-identifier',
        button_text: 'data-button-text',
        label_text: 'data-label-text',
        placeholder: 'data-placeholder',
        title: 'data-title',
        view_mode: 'data-view-mode',
        sku: 'data-sku',
        category: 'category',
        product_count: 'data-product-count',
        show_out_of_stock: 'data-show-out-of-stock',
        autoplay: 'data-autoplay',
        autoplay_speed: 'data-autoplay-speed',
        fade: 'data-fade',
        is_infinite: 'data-is-infinite',
        show_arrows: 'data-show-arrows',
        show_dots: 'data-show-dots',
        advanced_settings: 'data-advanced-settings',
        has_overlay_background: 'data-has-overlay-background'
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

        if (key === 'position') {
          var _value$split = value.split(','),
              lat = _value$split[0],
              lng = _value$split[1],
              zoom = _value$split[2];

          key = 'src';
          value = 'https://www.google.com/maps/embed/v1/place?q=' + lat + ',' + lng + '&zoom=' + zoom + '&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw';
        }

        result[key.replace('_', '-')] = value;
      });

      if (result.position && result.src) {
        result.src = result.position;
        delete result.position;
      }

      return result;
    };
    /**
     * Convert attributes from the DOM into the data store
     * @param {} data
     * @returns {}
     */


    _proto.fromDom = function fromDom(data) {
      var _this2 = this;

      // Flip the object key / values
      var attributeMapping = Object.keys(this.attributeNameMapping).reduce(function (obj, key) {
        obj[_this2.attributeNameMapping[key]] = key;
        return obj;
      }, {}),
          result = {};
      Object.keys(data).map(function (key) {
        if (key in _this2.attributeNameMapping) {
          key = _this2.attributeNameMapping[key];
        }

        result[key] = data[key];
      });
      return result;
    };

    return AttributeMapper;
  }();

  return AttributeMapper;
});
//# sourceMappingURL=attribute-mapper.js.map

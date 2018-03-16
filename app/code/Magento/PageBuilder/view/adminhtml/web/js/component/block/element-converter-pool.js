/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ElementConverterPool =
  /*#__PURE__*/
  function () {
    function ElementConverterPool(styleConverters, styleConvertersPreview, attributeConverters) {
      this.styleConverters = void 0;
      this.styleConvertersPreview = void 0;
      this.attributeConverters = void 0;
      this.styleConverters = styleConverters;
      this.styleConvertersPreview = styleConvertersPreview;
      this.attributeConverters = attributeConverters;
    }

    var _proto = ElementConverterPool.prototype;

    _proto.getStyleConverters = function getStyleConverters(area) {
      if ("preview" === area) {
        return this.styleConvertersPreview;
      }

      return this.styleConverters;
    };

    _proto.getAttributeConverters = function getAttributeConverters() {
      return this.attributeConverters;
    };

    return ElementConverterPool;
  }();

  return ElementConverterPool;
});
//# sourceMappingURL=element-converter-pool.js.map

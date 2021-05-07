/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var EmptyMobileImage = /*#__PURE__*/function () {
    "use strict";

    function EmptyMobileImage() {}

    var _proto = EmptyMobileImage.prototype;

    /**
     * Process data after it's read and converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {object} config
     * @returns {object}
     */
    _proto.fromDom = function fromDom(data, config) {
      var desktopImage = (0, _object.get)(data, config.desktop_image_variable);
      var mobileImage = (0, _object.get)(data, config.mobile_image_variable);

      if (mobileImage && desktopImage && mobileImage[0] !== undefined && desktopImage[0] !== undefined && mobileImage[0].url === desktopImage[0].url) {
        delete data[config.mobile_image_variable];
      }

      return data;
    }
    /**
     * Process data before it's converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {object} config
     * @returns {object}
     */
    ;

    _proto.toDom = function toDom(data, config) {
      var mobileImage = (0, _object.get)(data, config.mobile_image_variable);

      if (mobileImage === undefined || mobileImage[0] === undefined) {
        (0, _object.set)(data, config.mobile_image_variable, (0, _object.get)(data, config.desktop_image_variable));
      }

      return data;
    };

    return EmptyMobileImage;
  }();

  return EmptyMobileImage;
});
//# sourceMappingURL=empty-mobile-image.js.map
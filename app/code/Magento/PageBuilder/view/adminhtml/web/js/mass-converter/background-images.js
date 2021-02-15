/*eslint-disable */
/* jscs:disable */
define(["underscore", "Magento_PageBuilder/js/utils/image", "Magento_PageBuilder/js/utils/object"], function (_underscore, _image, _object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var BackgroundImages = /*#__PURE__*/function () {
    "use strict";

    function BackgroundImages() {}

    var _proto = BackgroundImages.prototype;

    /**
     * Process data after it's read and converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    _proto.fromDom = function fromDom(data, config) {
      var directive = (0, _object.get)(data, config.attribute_name);

      if (directive) {
        var images = JSON.parse(directive.replace(/\\(.)/mg, "$1")) || {};

        if (!_underscore.isUndefined(images.desktop_image)) {
          (0, _object.set)(data, config.desktop_image_variable, (0, _image.decodeUrl)(images.desktop_image));
        }

        if (!_underscore.isUndefined(images.mobile_image)) {
          (0, _object.set)(data, config.mobile_image_variable, (0, _image.decodeUrl)(images.mobile_image));
        }

        delete data[config.attribute_name];
      }

      return data;
    }
    /**
     * Process data before it's converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    ;

    _proto.toDom = function toDom(data, config) {
      var desktopImage = (0, _object.get)(data, config.desktop_image_variable);
      var mobileImage = (0, _object.get)(data, config.mobile_image_variable);
      var directiveData = {};

      if (!_underscore.isUndefined(desktopImage) && desktopImage && !_underscore.isUndefined(desktopImage[0])) {
        directiveData.desktop_image = (0, _image.urlToDirective)(desktopImage[0].url);
      }

      if (!_underscore.isUndefined(mobileImage) && mobileImage && !_underscore.isUndefined(mobileImage[0])) {
        directiveData.mobile_image = (0, _image.urlToDirective)(mobileImage[0].url);
      } // Add the directive data, ensuring we escape double quotes


      (0, _object.set)(data, config.attribute_name, JSON.stringify(directiveData).replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0"));
      return data;
    };

    return BackgroundImages;
  }();

  return BackgroundImages;
});
//# sourceMappingURL=background-images.js.map
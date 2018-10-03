/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["Magento_PageBuilder/js/utils/image"], function (_image) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var BackgroundImages =
  /*#__PURE__*/
  function () {
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
      var directive = data[config.attribute_name];

      if (directive) {
        var images = JSON.parse(directive.replace(/\\(.)/mg, "$1")) || {};

        if (typeof images.desktop_image !== "undefined") {
          data[config.desktop_image_variable] = (0, _image.decodeUrl)(images.desktop_image);
        }

        if (typeof images.mobile_image !== "undefined") {
          data[config.mobile_image_variable] = (0, _image.decodeUrl)(images.mobile_image);
        }

        delete data[config.attribute_name];
      }

      return data;
    };
    /**
     * Process data before it's converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */


    _proto.toDom = function toDom(data, config) {
      var directiveData = {};

      if (typeof data[config.desktop_image_variable] !== "undefined" && data[config.desktop_image_variable] && typeof data[config.desktop_image_variable][0] !== "undefined") {
        directiveData.desktop_image = (0, _image.urlToDirective)(data[config.desktop_image_variable][0].url);
      }

      if (typeof data[config.mobile_image_variable] !== "undefined" && data[config.mobile_image_variable] && typeof data[config.mobile_image_variable][0] !== "undefined") {
        directiveData.mobile_image = (0, _image.urlToDirective)(data[config.mobile_image_variable][0].url);
      } // Add the directive data, ensuring we escape double quotes


      data[config.attribute_name] = JSON.stringify(directiveData).replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
      return data;
    };

    return BackgroundImages;
  }();

  return _extends(BackgroundImages, {
    __esModule: true
  });
});
//# sourceMappingURL=background-images.js.map

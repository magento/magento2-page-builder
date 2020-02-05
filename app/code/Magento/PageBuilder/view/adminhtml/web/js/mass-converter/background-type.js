/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var BackgroundType =
  /*#__PURE__*/
  function () {
    "use strict";

    function BackgroundType() {}

    var _proto = BackgroundType.prototype;

    /**
     * Process data after it's read and converted by element converters
     *
     * @param {ConverterDataInterface} data
     * @param {ConverterConfigInterface} config
     * @returns {object}
     */
    _proto.fromDom = function fromDom(data, config) {
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
      var backgroundType = (0, _object.get)(data, config.attribute_name);

      if (backgroundType === 'video') {
        (0, _object.set)(data, "background_image", []);
        (0, _object.set)(data, "mobile_image", []);
      } else if (backgroundType === 'image') {
        (0, _object.set)(data, "video_source", "");
        (0, _object.set)(data, "video_fallback_image", []);
        (0, _object.set)(data, "video_overlay_color", "");
      }

      return data;
    };

    return BackgroundType;
  }();

  return BackgroundType;
});
//# sourceMappingURL=background-type.js.map
/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright 2026 Adobe
   * All Rights Reserved.
   */
  var VideoBackgroundSetting = /*#__PURE__*/function () {
    "use strict";

    function VideoBackgroundSetting() {}

    var _proto = VideoBackgroundSetting.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string}
     */
    _proto.fromDom = function fromDom(value) {
      return value === null || value === undefined ? "true" : value;
    }
    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string | boolean}
     */
    ;

    _proto.toDom = function toDom(name, data) {
      if ((0, _object.get)(data, "background_type") !== "video") {
        return false;
      }

      var value = (0, _object.get)(data, name);

      if (value === null || value === undefined) {
        return false;
      }

      return value.toString();
    };

    return VideoBackgroundSetting;
  }();

  return VideoBackgroundSetting;
});
//# sourceMappingURL=video-background-setting.js.map
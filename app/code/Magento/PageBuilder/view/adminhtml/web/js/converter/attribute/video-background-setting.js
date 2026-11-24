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
      return value === null || value === undefined ? VideoBackgroundSetting.DEFAULT : value;
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
      var value = (0, _object.get)(data, name);

      if (value === null || value === undefined || value === "") {
        return false;
      }

      var setting = value.toString();

      if (setting === VideoBackgroundSetting.DEFAULT && (0, _object.get)(data, "background_type") !== "video") {
        return false;
      }

      return setting;
    };

    return VideoBackgroundSetting;
  }();

  VideoBackgroundSetting.DEFAULT = "true";
  return VideoBackgroundSetting;
});
//# sourceMappingURL=video-background-setting.js.map
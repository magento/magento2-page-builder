/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object", "Magento_PageBuilder/js/converter/attribute/src"], function (_object, _src) {
  /**
   * Copyright 2026 Adobe
   * All Rights Reserved.
   */
  var VideoFallbackSrc = /*#__PURE__*/function () {
    "use strict";

    function VideoFallbackSrc() {
      this.src = new _src();
    }

    var _proto = VideoFallbackSrc.prototype;

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    _proto.fromDom = function fromDom(value) {
      return this.src.fromDom(value);
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

      return this.src.toDom(name, data);
    };

    return VideoFallbackSrc;
  }();

  return VideoFallbackSrc;
});
//# sourceMappingURL=video-fallback-src.js.map
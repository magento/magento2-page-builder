/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ContentBuilder =
  /*#__PURE__*/
  function () {
    function ContentBuilder() {
      this.elementDataConverter = void 0;
      this.dataConverter = void 0;
      this.contentType = void 0;
    }

    var _proto = ContentBuilder.prototype;

    _proto.setElementDataConverter = function setElementDataConverter(converter) {
      this.elementDataConverter = converter;
    };

    _proto.setDataConverter = function setDataConverter(converter) {
      this.dataConverter = converter;
    };

    _proto.setContentType = function setContentType(contentType) {
      contentType = contentType;
    };

    return ContentBuilder;
  }();

  return ContentBuilder;
});
//# sourceMappingURL=content-builde.js.map

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
      this.classInstance = void 0;
    }

    var _proto = ContentBuilder.prototype;

    _proto.setElementDataConverter = function setElementDataConverter(converter) {
      this.elementDataConverter = converter;
      return this;
    };

    _proto.setDataConverter = function setDataConverter(converter) {
      this.dataConverter = converter;
      return this;
    };

    _proto.setContentType = function setContentType(contentType) {
      this.contentType = contentType;
      return this;
    };

    _proto.setClassInstance = function setClassInstance(classInstance) {
      this.classInstance = classInstance;
      return this;
    };

    _proto.build = function build() {
      return new this.classInstance(this.contentType, this.elementDataConverter, this.dataConverter);
    };

    return ContentBuilder;
  }();

  return ContentBuilder;
});
//# sourceMappingURL=content-builder.js.map

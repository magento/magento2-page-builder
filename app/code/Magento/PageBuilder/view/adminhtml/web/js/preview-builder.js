/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var PreviewBuilder =
  /*#__PURE__*/
  function () {
    function PreviewBuilder() {
      this.elementDataConverter = void 0;
      this.dataConverter = void 0;
      this.contentType = void 0;
      this.config = void 0;
      this.classInstance = void 0;
    }

    var _proto = PreviewBuilder.prototype;

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

    _proto.setConfig = function setConfig(config) {
      this.config = config;
      return this;
    };

    _proto.setClassInstance = function setClassInstance(classInstance) {
      this.classInstance = classInstance;
      return this;
    };

    _proto.build = function build() {
      return new this.classInstance(this.contentType, this.config, this.elementDataConverter, this.dataConverter);
    };

    return PreviewBuilder;
  }();

  return PreviewBuilder;
});
//# sourceMappingURL=preview-builder.js.map

/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Resolve converter
   *
   * @param {DataMappingStyleInterface} config
   * @return string
   */
  function resolve(config) {
    return config.preview_converter ? config.preview_converter : config.converter;
  }

  return _extends(resolve, {
    __esModule: true
  });
});
//# sourceMappingURL=preview-converter-resolver.js.map

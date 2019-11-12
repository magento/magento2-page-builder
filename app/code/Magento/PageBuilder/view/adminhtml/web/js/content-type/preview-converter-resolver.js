/*eslint-disable */
/* jscs:disable */
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

  return resolve;
});
//# sourceMappingURL=preview-converter-resolver.js.map
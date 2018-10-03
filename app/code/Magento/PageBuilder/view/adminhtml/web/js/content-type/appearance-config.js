/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["Magento_PageBuilder/js/config"], function (_config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Get config for appearance
   *
   * @param {string} contentType
   * @param {string} appearance
   * @returns {ContentTypeConfigAppearanceInterface}
   * @api
   */
  function getAppearanceConfig(contentType, appearance) {
    var contentTypeConfig = _config.getContentTypeConfig(contentType);

    var config;

    if (contentTypeConfig.appearances !== undefined) {
      if (!appearance) {
        for (var key in contentTypeConfig.appearances) {
          if (!!contentTypeConfig.appearances[key].default) {
            appearance = key;
            break;
          }
        }
      }

      if (appearance) {
        config = contentTypeConfig.appearances[appearance];
      }
    }

    return config;
  }

  return _extends(getAppearanceConfig, {
    __esModule: true
  });
});
//# sourceMappingURL=appearance-config.js.map

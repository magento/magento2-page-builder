/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

define(["underscore"], function (_underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Config =
  /*#__PURE__*/
  function () {
    function Config() {}

    /**
     * Set the initial config
     *
     * @param config
     */
    Config.setConfig = function setConfig(config) {
      Config.config = _underscore.extend(Config.config, config);
    };
    /**
     * Retrieve the init config
     *
     * @param {string} key
     * @returns {T}
     */


    Config.getConfig = function getConfig(key) {
      if (key) {
        if (typeof Config.config[key] !== "undefined") {
          return Config.config[key];
        }

        return null;
      }

      return Config.config;
    };
    /**
     * Retrieve a content type from the configuration
     *
     * @param {string} contentType
     * @returns {any}
     */


    Config.getContentTypeConfig = function getContentTypeConfig(contentType) {
      if (typeof Config.getConfig("content_types")[contentType] !== "undefined") {
        return Config.getConfig("content_types")[contentType];
      }

      return null;
    };

    return Config;
  }();

  Config.config = {
    dataRoleAttributeName: "data-role"
  };
  return _extends(Config, {
    __esModule: true
  });
});
//# sourceMappingURL=config.js.map

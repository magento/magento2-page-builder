/*eslint-disable */
define([], function () {
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
      Config.initConfig = config;
    };
    /**
     * Retrieve the init config
     *
     * @param key
     * @returns {any}
     */


    Config.getConfig = function getConfig(key) {
      if (key) {
        if (typeof Config.initConfig[key] !== "undefined") {
          return Config.initConfig[key];
        }

        return null;
      }

      return Config.initConfig;
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
    /**
     * Get a specific value from the configuration based on a key
     *
     * @param key
     * @returns {any}
     */


    Config.getValue = function getValue(key) {
      if (typeof Config.config[key] !== "undefined") {
        return Config.config[key];
      }

      if (Config.getConfig(key)) {
        return Config.getConfig(key);
      }

      return null;
    };
    /**
     * Retrieve a value as a string
     *
     * @param key
     * @returns {String}
     */


    Config.getValueAsString = function getValueAsString(key) {
      return String(Config.getValue(key));
    };

    return Config;
  }();

  Config.initConfig = void 0;
  Config.config = {
    dataRoleAttributeName: "data-role"
  };
  return Config;
});
//# sourceMappingURL=config.js.map

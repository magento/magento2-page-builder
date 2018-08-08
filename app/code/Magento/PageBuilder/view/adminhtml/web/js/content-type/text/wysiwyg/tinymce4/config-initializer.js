/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ConfigInitializer =
  /*#__PURE__*/
  function () {
    function ConfigInitializer() {}

    var _proto = ConfigInitializer.prototype;

    /**
     * Initialize the config
     *
     * @param {String} contentTypeId
     * @param {Object} config
     */
    _proto.initializeConfig = function initializeConfig(contentTypeId, config) {
      if (config.additional.mode === "inline") {
        config.adapter.settings.fixed_toolbar_container = "#" + contentTypeId + " " + config.adapter.settings.fixed_toolbar_container;
      }
    };

    return ConfigInitializer;
  }();

  return ConfigInitializer;
});
//# sourceMappingURL=config-initializer.js.map

/*eslint-disable */
define([], function () {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var ConfigModifier =
  /*#__PURE__*/
  function () {
    function ConfigModifier() {}

    var _proto = ConfigModifier.prototype;

    /**
     * Initialize the config
     *
     * @param {String} contentTypeId
     * @param {Object} config
     */
    _proto.modify = function modify(contentTypeId, config) {
      if (config.adapter_config.mode === "inline") {
        config.adapter.settings.fixed_toolbar_container = "#" + contentTypeId + " " + config.adapter.settings.fixed_toolbar_container;
      }
    };

    return ConfigModifier;
  }();

  return Object.assign(ConfigModifier, {
    __esModule: true
  });
});
//# sourceMappingURL=config-modifier.js.map

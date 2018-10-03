/*eslint-disable */
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

  return _extends(ConfigModifier, {
    __esModule: true
  });
});
//# sourceMappingURL=config-modifier.js.map

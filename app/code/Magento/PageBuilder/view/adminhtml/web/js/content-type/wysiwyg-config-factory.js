/*eslint-disable */
define(["jquery", "underscore"], function (_jquery, _underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * @api
   */
  function createFromConfig(wysiwygConfig) {
    var _this = this;

    var clonedWysiwygConfig = _jquery.extend(true, {}, wysiwygConfig);

    if (clonedWysiwygConfig.encapsulateSelectorConfigKeys) {
      _underscore.each(clonedWysiwygConfig.encapsulateSelectorConfigKeys, function (isEnabled, configKey) {
        var configValue = clonedWysiwygConfig.wysiwygConfigData.settings[configKey];

        if (!isEnabled) {
          return;
        }

        clonedWysiwygConfig.wysiwygConfigData.settings[configKey] = "#" + _this.parent.id + (configValue ? " " + configValue : "");
      });
    }

    return clonedWysiwygConfig;
  }

  return createFromConfig;
});
//# sourceMappingURL=wysiwyg-config-factory.js.map

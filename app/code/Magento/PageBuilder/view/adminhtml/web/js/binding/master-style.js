/*eslint-disable */
/* jscs:disable */
define(["knockout", "mageUtils", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/content-type/style-registry"], function (_knockout, _mageUtils, _underscore, _config, _styleRegistry) {
  "use strict";

  _knockout = _interopRequireDefault(_knockout);
  _mageUtils = _interopRequireDefault(_mageUtils);
  _underscore = _interopRequireDefault(_underscore);
  _config = _interopRequireDefault(_config);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var bodyId = _config.default.getConfig("bodyId");

  var getStyles = function getStyles(styleObject) {
    var styles = {};

    _knockout.default.utils.objectForEach(styleObject, function (styleName, styleValue) {
      styleValue = _knockout.default.utils.unwrapObservable(styleValue);

      if (styleValue === null || styleValue === undefined || styleValue === false) {
        // Empty string removes the value, whereas null/undefined have no effect
        styleValue = "";
      }

      if (styleValue) {
        styles[styleName] = styleValue;
      }
    });

    return styles;
  };

  _knockout.default.bindingHandlers.style = {
    update: function update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var value = _knockout.default.utils.unwrapObservable(valueAccessor() || {});

      var viewportKeys = _underscore.default.keys(_config.default.getConfig("viewports"));

      var commonStyles = getStyles(_underscore.default.omit(value, viewportKeys));
      var viewportStyles = {};

      _underscore.default.each(viewportKeys, function (name) {
        viewportStyles[name] = _underscore.default.extend(getStyles(value[name]), commonStyles);
      });

      if (_underscore.default.findKey(viewportStyles, function (styles) {
        return !_underscore.default.isEmpty(styles);
      })) {
        var id = _mageUtils.default.uniqueid();

        var selector = "#" + bodyId + " [" + _styleRegistry.pbStyleAttribute + "=\"" + id + "\"]";

        _underscore.default.each(viewportKeys, function (name) {
          var registry = (0, _styleRegistry.getStyleRegistry)(name + bindingContext.$root.id);
          registry.setStyles(selector, viewportStyles[name]);
        });

        element.setAttribute(_styleRegistry.pbStyleAttribute, id);
      }
    }
  };
});
//# sourceMappingURL=master-style.js.map
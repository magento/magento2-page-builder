/*eslint-disable */
/* jscs:disable */
define(["knockout", "mageUtils", "underscore", "Magento_PageBuilder/js/content-type/style-registry"], function (_knockout, _mageUtils, _underscore, _styleRegistry) {
  "use strict";

  _knockout = _interopRequireDefault(_knockout);
  _mageUtils = _interopRequireDefault(_mageUtils);
  _underscore = _interopRequireDefault(_underscore);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  _knockout.default.bindingHandlers.style = {
    update: function update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var value = _knockout.default.utils.unwrapObservable(valueAccessor() || {});

      var styles = {};

      _knockout.default.utils.objectForEach(value, function (styleName, styleValue) {
        styleValue = _knockout.default.utils.unwrapObservable(styleValue);

        if (styleValue === null || styleValue === undefined || styleValue === false) {
          // Empty string removes the value, whereas null/undefined have no effect
          styleValue = "";
        }

        if (styleValue) {
          styles[styleName] = styleValue;
        }
      });

      if (!_underscore.default.isEmpty(styles)) {
        var id = _mageUtils.default.uniqueid();

        var selector = "[" + _styleRegistry.pbStyleAttribute + "=\"" + id + "\"]";
        var registry = (0, _styleRegistry.getStyleRegistry)(bindingContext.$root.id);
        registry.setStyles(selector, styles);
        element.setAttribute(_styleRegistry.pbStyleAttribute, id);
      }
    }
  };
});
//# sourceMappingURL=master-style.js.map
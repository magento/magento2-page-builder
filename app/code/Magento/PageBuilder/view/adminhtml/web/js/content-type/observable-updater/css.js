/*eslint-disable */
/* jscs:disable */
define(["Magento_PageBuilder/js/utils/object"], function (_object) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Generate Knockout compatible bindings for the elements css binding
   *
   * @param elementName
   * @param config
   * @param data
   * @param converterResolver
   * @param converterPool
   * @param previousData
   */
  function generate(elementName, config, data, converterResolver, converterPool, previousData) {
    var css = (0, _object.get)(data, config.css.var);
    var newClasses = {};

    if (css && css.length > 0) {
      css.toString().split(" ").map(function (value) {
        return newClasses[value] = true;
      });
    }

    for (var _i = 0, _Object$keys = Object.keys(previousData); _i < _Object$keys.length; _i++) {
      var className = _Object$keys[_i];

      if (!(className in newClasses)) {
        newClasses[className] = false;
      }
    }

    return newClasses;
  }

  return generate;
});
//# sourceMappingURL=css.js.map